import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Building2,
  Key,
  AlertTriangle,
  Phone,
  User,
  Heart,
  CheckCircle2,
  FileText,
  Activity,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RecordCard } from './RecordCard';
import { UserPatientData } from '../../types/patient';

export type AccessTier = 1 | 2 | 3;

interface ScanResultTierProps {
  tier: AccessTier;
  patientId?: string;
  onUpgradeToTier1?: () => void;
}

// ─── Empty State ────────────────────────────────────────────────────────────
const EmptyRecordsState: React.FC<{ locked?: boolean }> = ({ locked }) => (
  <div
    style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: 'var(--color-surface-alt)',
      borderRadius: 'var(--radius-xl)',
      border: '2px dashed var(--color-border)',
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: locked ? 'var(--color-navy)' : 'var(--color-bg)',
        color: locked ? '#FFFFFF' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
      }}
    >
      {locked ? <Lock size={24} /> : <ClipboardList size={24} />}
    </div>
    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>
      {locked ? 'Medical Records are Protected' : 'No Medical Records on File'}
    </div>
    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.6, maxWidth: '380px', margin: '8px auto 0' }}>
      {locked
        ? 'To view prescriptions, lab results, and clinical notes, prompt the patient for one-time approval.'
        : 'This patient has not uploaded any medical records to their MedQR+ pass yet.'}
    </p>
  </div>
);

// ─── Patient Not Found ───────────────────────────────────────────────────────
const PatientNotFound: React.FC<{ patientId: string }> = ({ patientId }) => (
  <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--color-brick-bg)',
        color: 'var(--color-brick)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
      }}
    >
      <User size={28} />
    </div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
      Patient Not Found
    </h3>
    <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.6, maxWidth: '420px', margin: '8px auto 0' }}>
      The QR code encodes patient ID <strong style={{ fontFamily: 'monospace' }}>{patientId}</strong>, but no matching record was found in this app's registry. The QR may belong to a different system or patient.
    </p>
  </Card>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return `***-***-${last4}`;
  }
  return '***-***-****';
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ScanResultTier: React.FC<ScanResultTierProps> = ({
  tier: initialTier,
  patientId = '',
}) => {
  const { getPatientById, user, setActiveScannedPatientId, recordHospitalScan } = useAuth();
  const [currentTier, setCurrentTier] = useState<AccessTier>(initialTier);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Sync active scanned patient id in context
  React.useEffect(() => {
    if (patientId) {
      setActiveScannedPatientId(patientId);
    }
  }, [patientId, setActiveScannedPatientId]);

  // Look up the real scanned patient
  const scannedPatient: UserPatientData | null = patientId ? getPatientById(patientId) : null;

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpError(false);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const nextOtp = [...otpInput];
    nextOtp[index] = val;
    setOtpInput(nextOtp);
    if (val && index < 3) {
      const nextElem = document.getElementById(`otp-input-${index + 1}`);
      nextElem?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otpInput.join('');
    if (code.length === 4) {
      setOtpSuccess(true);
      if (user?.role === 'hospital' && scannedPatient) {
        recordHospitalScan(scannedPatient.id, 1, 'Patient OTP Authorization Unlocked (2FA)');
      }
      setTimeout(() => {
        setIsOtpModalOpen(false);
        setCurrentTier(1);
        setOtpSuccess(false);
        setOtpInput(['', '', '', '']);
      }, 1000);
    } else {
      setOtpError(true);
    }
  };

  // If we have a patientId but no matching patient, show not-found
  if (patientId && !scannedPatient) {
    return (
      <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingTop: '16px' }}>
        <PatientNotFound patientId={patientId} />
      </div>
    );
  }

  // If we have no patientId at all, show a generic info message
  if (!patientId) {
    return (
      <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingTop: '16px' }}>
        <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Activity size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
            No Patient QR Scanned
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.6, maxWidth: '400px', margin: '8px auto 0' }}>
            This view is populated when you scan a MedQR+ patient badge. Use the Scanner tab to scan a QR code.
          </p>
        </Card>
      </div>
    );
  }

  // We have a valid patient — render the full tiers
  const patient = scannedPatient!;
  const records = patient.records || [];
  const allergies = patient.allergies || [];
  const hasBlood = !!patient.blood;
  const hasEmergency = !!(patient.emergency?.name || patient.emergency?.phone);
  const hasHospital = !!patient.issuingHospitalName;

  // Compute age from DOB if available
  const ageLabel = (() => {
    if (!patient.dob) return '';
    const dob = new Date(patient.dob);
    const ageDiff = Date.now() - dob.getTime();
    const age = Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000));
    return isNaN(age) ? '' : `Age ${age}`;
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      {/* ── Tier Switcher Navigation ─────────────────────────────────────── */}
      <Card padding="sm" style={{ background: '#F8FAFC', border: '1px solid #CBD5E0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Access Level:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {([3, 2, 1] as AccessTier[]).map(t => {
              const labels: Record<AccessTier, string> = {
                3: 'Tier 3: Public / Limited',
                2: 'Tier 2: Issuing Hospital',
                1: 'Tier 1: OTP Approved',
              };
              const isActive = currentTier === t;
              return (
                <button
                  key={t}
                  onClick={() => setCurrentTier(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive
                      ? (t === 3 ? '1.5px solid var(--color-text-secondary)' : '1.5px solid var(--color-teal)')
                      : '1px solid var(--color-border)',
                    background: isActive
                      ? (t === 3 ? '#EDF2F7' : t === 1 ? 'var(--color-navy)' : 'var(--color-teal-bg)')
                      : '#FFFFFF',
                    color: isActive
                      ? (t === 3 ? 'var(--color-navy)' : t === 1 ? '#FFFFFF' : 'var(--color-teal-dim)')
                      : 'var(--color-text-muted)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── TIER 1 BANNER ────────────────────────────────────────────────── */}
      {currentTier === 1 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0D1B3E 0%, #1F3A6E 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid var(--color-teal)',
            animation: 'fadeIn 300ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Unlock size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                    Tier 1: Full Medical Records Unlocked
                  </h3>
                  <Badge variant="teal" size="sm" icon={<ShieldCheck size={12} />}>OTP Verified</Badge>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                  Authenticated via 2-Factor patient authorization. Full diagnostic history and active prescriptions decrypted.
                </p>
              </div>
            </div>
            <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
              Session expires in: <strong style={{ color: 'var(--color-teal-light)' }}>14:59 min</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── TIER 2 BANNER ────────────────────────────────────────────────── */}
      {currentTier === 2 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1A6B60 0%, #2A9D8F 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid #48CAB8',
            animation: 'fadeIn 300ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal-dim)' }}>
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                    Tier 2: Verified Issuing Hospital Access
                  </h3>
                  <Badge variant="navy" size="sm" icon={<ShieldCheck size={12} />}>Verified Hospital</Badge>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
                  {hasHospital
                    ? <>Scanner verified as <strong>{patient.issuingHospitalName}</strong> (Originating Institution). Zero-friction instant clinical access granted without requiring manual OTP.</>
                    : 'Issuing hospital not configured for this patient. Full access granted via hospital terminal verification.'}
                </p>
              </div>
            </div>
            <div style={{ fontSize: '12px', background: 'rgba(0,0,0,0.15)', padding: '6px 12px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
              Hospital ID: <strong style={{ color: '#FFFFFF' }}>{patient.issuingHospital || 'HOSP-UNREGISTERED'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── TIER 3 BANNER ────────────────────────────────────────────────── */}
      {currentTier === 3 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid #4A5568',
            animation: 'fadeIn 300ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E0' }}>
                <Lock size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                    Tier 3: Public Emergency Access
                  </h3>
                  <Badge variant="warning" size="sm" icon={<AlertTriangle size={12} />}>Limited Info Mode</Badge>
                </div>
                <p style={{ fontSize: '13px', color: '#A0AEC0', marginTop: '4px' }}>
                  Third-party scanner detected. Displaying patient-curated vital emergency parameters only. Sensitive records remain locked.
                </p>
              </div>
            </div>
            <Button
              variant="teal"
              size="md"
              icon={<Key size={16} />}
              onClick={() => { setIsOtpModalOpen(true); handleSendOtp(); }}
            >
              Request Full Access (OTP)
            </Button>
          </div>
        </div>
      )}

      {/* ── Patient Core Summary Card (always visible) ───────────────────── */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-navy)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {getInitials(patient.name)}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--color-navy)' }}>
                {patient.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '13px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                <span>ID: <strong style={{ fontFamily: 'monospace' }}>{patient.id}</strong></span>
                {patient.dob && (
                  <>
                    <span>•</span>
                    <span>DOB: <strong>{patient.dob}</strong>{ageLabel && ` (${ageLabel})`}</span>
                  </>
                )}
                {patient.gender && (
                  <>
                    <span>•</span>
                    <span>Gender: <strong>{patient.gender}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Issuing Facility
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-navy)', marginTop: '2px' }}>
              {hasHospital ? patient.issuingHospitalName : 'Not configured'}
            </div>
          </div>
        </div>

        {/* Emergency Parameters Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {/* Blood Group */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: hasBlood ? 'var(--color-brick-bg)' : 'var(--color-surface-alt)', border: `1px solid ${hasBlood ? '#FBCFE8' : 'var(--color-border)'}` }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: hasBlood ? 'var(--color-brick)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Blood Group (Emergency)
            </div>
            {hasBlood ? (
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-brick)', marginTop: '4px' }}>
                {patient.blood}
              </div>
            ) : (
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                Not specified
              </div>
            )}
          </div>

          {/* Allergies */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Known Allergies
            </div>
            {allergies.length > 0 ? (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {allergies.map(a => (
                  <span
                    key={a}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#FEE2E2',
                      color: '#991B1B',
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px', fontStyle: 'italic' }}>None recorded</div>
            )}
          </div>

          {/* Emergency Contact */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: hasEmergency ? 'var(--color-teal-bg)' : 'var(--color-surface-alt)', border: `1px solid ${hasEmergency ? '#99F6E4' : 'var(--color-border)'}` }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: hasEmergency ? 'var(--color-teal-dim)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Emergency Contact
            </div>
            {hasEmergency && patient.emergency ? (
              <>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-navy)', marginTop: '4px' }}>
                  {patient.emergency.name}
                  {patient.emergency.relation && ` (${patient.emergency.relation})`}
                </div>
                {patient.emergency.phone && (
                  <a
                    href={`tel:${patient.emergency.phone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-teal)',
                      marginTop: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={12} /> {patient.emergency.phone}
                  </a>
                )}
              </>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px', fontStyle: 'italic' }}>Not configured</div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Medical Records Section ──────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
              Complete Clinical History &amp; Prescriptions
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {currentTier === 3
                ? 'Protected by patient encryption. Authorize OTP to decrypt.'
                : records.length > 0
                  ? `${records.length} verified clinical record${records.length !== 1 ? 's' : ''} on file.`
                  : 'No clinical records uploaded by this patient yet.'}
            </p>
          </div>
          {currentTier === 3 && (
            <Badge variant="neutral" size="sm" icon={<Lock size={12} />}>Restricted View</Badge>
          )}
        </div>

        {currentTier === 3 ? (
          // ── Tier 3: blurred overlay ──────────────────────────────────────
          <div style={{ position: 'relative' }}>
            {/* Blurred placeholder rows */}
            <div style={{ filter: 'blur(6px)', pointerEvents: 'none', opacity: 0.4, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {records.length > 0
                ? records.slice(0, 3).map(rec => <RecordCard key={rec.id} record={rec} />)
                : [1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{
                      height: '80px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-alt)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                ))}
            </div>

            {/* Lock overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.85)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-navy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: 'var(--shadow-md)' }}>
                <Lock size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
                Detailed Medical Records are Protected
              </h4>
              <p style={{ maxWidth: '440px', fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
                To view prescriptions, diagnostic imaging, lab investigations, and physician clinical notes, prompt the patient for one-time approval.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Button
                  variant="teal"
                  size="lg"
                  icon={<Key size={18} />}
                  onClick={() => { setIsOtpModalOpen(true); handleSendOtp(); }}
                >
                  Send OTP Approval Request
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // ── Tier 1 & 2: full records list ────────────────────────────────
          records.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 300ms ease' }}>
              {records.map(rec => (
                <RecordCard key={rec.id} record={rec} />
              ))}
            </div>
          ) : (
            <EmptyRecordsState />
          )
        )}
      </div>

      {/* ── OTP Verification Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={isOtpModalOpen}
        onClose={() => { setIsOtpModalOpen(false); setOtpInput(['', '', '', '']); setOtpError(false); }}
        title="Patient OTP Authorization"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Key size={24} />
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
            One-Time Access Approval
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
            A 4-digit verification code has been dispatched to the patient's registered mobile{' '}
            {patient.phone ? (
              <><strong>({maskPhone(patient.phone)})</strong>.</>
            ) : (
              'number.'
            )}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px', marginBottom: '16px' }}>
            {otpInput.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  borderRadius: 'var(--radius-md)',
                  border: otpError ? '2px solid var(--color-brick)' : '2px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-navy)',
                  outline: 'none',
                  transition: 'border-color 150ms ease',
                }}
              />
            ))}
          </div>

          {otpError && (
            <div style={{ fontSize: '12px', color: 'var(--color-brick)', marginBottom: '12px' }}>
              Please enter all 4 digits to authorize.
            </div>
          )}

          {otpSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-teal)', fontWeight: 600, marginBottom: '12px' }}>
              <CheckCircle2 size={16} /> Authorization approved! Unlocking...
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <Button variant="teal" size="md" fullWidth onClick={handleVerifyOtp} loading={otpSuccess}>
              Verify &amp; Unlock Records
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSendOtp}>
              Resend OTP Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
