import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '../../components/features/QRScanner';
import { ShieldCheck, Info, Building2, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { user, getPatientById, recordHospitalScan } = useAuth();
  const [scanError, setScanError] = useState<string | null>(null);

  const isHospital = user?.role === 'hospital';

  const handleScanSuccess = (decodedText: string, tierOverride?: number) => {
    setScanError(null);
    let patientId: string | null = null;

    try {
      if (decodedText.startsWith('{')) {
        const parsed = JSON.parse(decodedText);
        if (parsed.patientId) patientId = parsed.patientId;
        else if (parsed.id) patientId = parsed.id;
      } else if (decodedText.includes('MQR-')) {
        const match = decodedText.match(/MQR-[A-Za-z0-9-]+/);
        patientId = match ? match[0] : decodedText.trim();
      } else {
        patientId = decodedText.trim();
      }
    } catch {
      patientId = decodedText.trim();
    }

    if (!patientId) {
      setScanError('Unable to read a valid patient identifier from the scanned code.');
      return;
    }

    const patient = getPatientById(patientId);

    // If tierOverride is explicitly passed from simulator, use it
    let targetTier: 1 | 2 | 3 = 3;

    if (tierOverride) {
      targetTier = tierOverride as 1 | 2 | 3;
    } else if (isHospital && patient) {
      // Role-based logic:
      // If the logged-in hospital account matches the patient's issuingHospital
      const isIssuingHospital =
        (user?.hospitalId && patient.issuingHospital === user.hospitalId) ||
        (user?.hospitalName && patient.issuingHospitalName === user.hospitalName) ||
        (user?.id === patient.issuingHospital);

      if (isIssuingHospital) {
        targetTier = 2; // Direct Tier 2 Access
      } else {
        targetTier = 3; // External hospital -> Tier 3 restricted
      }
    } else {
      targetTier = 3; // Patient / Bystander default
    }

    // Automatically log scan event if hospital
    if (isHospital && patient) {
      const reason =
        targetTier === 2
          ? `Direct Issuing Hospital Decryption (${user?.hospitalName || 'Issuing Authority'})`
          : targetTier === 1
            ? 'Patient OTP Emergency Authorization'
            : `External Clinical Facility Scan (${user?.hospitalName || 'External Facility'})`;
      recordHospitalScan(patientId, targetTier, reason);
    }

    navigate(`/scan-result/${targetTier}?id=${patientId}`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
              {isHospital ? 'Clinical QR Scanner' : 'Universal QR Scanner'}
            </h2>
            {isHospital && (
              <Badge variant="teal" size="sm" icon={<Building2 size={12} />}>
                Hospital Terminal
              </Badge>
            )}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            {isHospital
              ? `Authenticated as ${user?.hospitalName || user?.name}. Point camera at a MedQR+ patient badge to evaluate cryptographic issuing permissions.`
              : 'Point your camera at any patient badge to evaluate permissions and decrypt emergency health records.'}
          </p>
        </div>

        <Badge variant="teal" size="md" icon={<ShieldCheck size={14} />}>
          Hardware Camera Active
        </Badge>
      </div>

      {scanError && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{scanError}</span>
        </div>
      )}

      {/* Hospital Role Banner */}
      {isHospital && (
        <Card
          padding="sm"
          style={{
            background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.1) 0%, rgba(13, 27, 62, 0.05) 100%)',
            border: '1.5px solid var(--color-teal)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>
                Active Clinical Provider: {user?.hospitalName || user?.name} ({user?.hospitalId || user?.id})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                When scanning badges issued by this hospital, full medical records unlock automatically via Tier 2 (no OTP). Other facilities access Tier 3 emergency info.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* QR Scanner Component */}
      <QRScanner onScanSuccess={handleScanSuccess} />

      {/* Instructions Note */}
      <Card padding="md" style={{ background: '#F8FAFC' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Info size={20} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>
              How MedQR+ Resolves Permissions
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              The camera decodes the cryptographic payload inside the QR badge. If scanned from an authenticated terminal registered as the patient's <strong>issuing hospital</strong>, Tier 2 is granted automatically. Third-party hospitals or public responders are restricted to Tier 3 emergency vitals unless approved via patient OTP.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
