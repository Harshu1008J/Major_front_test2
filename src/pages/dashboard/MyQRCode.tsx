import React from 'react';
import { QRCodeDisplay } from '../../components/features/QRCodeDisplay';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Lock, Building2, Key, Info, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyQRCode: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const hasBlood = !!user.blood;
  const hasEmergencyContact = !!user.emergency?.phone;
  const hasHospital = !!user.issuingHospitalName;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
          My MedQR+ Digital Health Pass
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          This single dynamic QR code protects your health records with our 3-tier privacy model
        </p>
      </div>

      {/* Profile completion notice */}
      {(!hasBlood || !hasEmergencyContact) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 18px',
            background: 'var(--color-warning-bg)',
            border: '1px solid #F6E05E',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <AlertCircle size={18} color="#D69E2E" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>
              Complete your profile to maximise QR effectiveness
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '3px', lineHeight: 1.5 }}>
              {!hasBlood && 'Blood group is missing — emergency responders won\'t see it in Tier 3. '}
              {!hasEmergencyContact && 'Emergency contact phone is missing — first responders need this. '}
              <button
                onClick={() => navigate('/dashboard/profile')}
                style={{ color: 'var(--color-teal)', fontWeight: 700, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12.5px' }}
              >
                Complete Profile →
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: QR Display Component */}
        <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <QRCodeDisplay
            patientId={user.id}
            patientName={user.name}
            bloodGroup={user.blood || 'Not Set'}
            emergencyContact={user.emergency?.phone || 'Not Set'}
            size={220}
          />
        </Card>

        {/* Right: How This QR Protects Your Privacy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card padding="md">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--color-teal)" />
              How Your 3-Tier Security Works
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tier 1 Box */}
              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', borderLeft: '3px solid var(--color-teal)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={14} color="var(--color-teal)" /> Tier 1: Patient-Approved OTP
                  </span>
                  <Badge variant="teal" size="sm">Full Decryption</Badge>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  When any external physician scans your QR, they must request an OTP sent to your phone. Only after you provide it do they see full medical records.
                </p>
              </div>

              {/* Tier 2 Box */}
              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', borderLeft: '3px solid var(--color-navy)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="var(--color-navy)" /> Tier 2: Issuing Hospital Scan
                  </span>
                  <Badge variant="navy" size="sm">Auto Verified</Badge>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {hasHospital
                    ? `${user.issuingHospitalName} is recognized instantly by our cryptographic node registry, giving your primary care team seamless access.`
                    : 'Set your primary care hospital in your Profile to enable automatic hospital-tier recognition.'
                  }
                </p>
              </div>

              {/* Tier 3 Box */}
              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', borderLeft: '3px solid var(--color-brick)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={14} color="var(--color-brick)" /> Tier 3: Public Responder Scan
                  </span>
                  <Badge variant="brick" size="sm">Emergency Vitals Only</Badge>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {hasBlood
                    ? `Any unknown smartphone scanner sees ONLY your blood group (${user.blood}), critical allergies, and emergency contact. All prescriptions remain locked.`
                    : 'Any unknown scanner sees only your critical allergies and emergency contact. Add your blood group in Profile so it shows in emergencies.'
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* Quick FAQ / Security Note */}
          <Card padding="md" style={{ background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Info size={18} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Wallet &amp; Physical Print Friendly
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  You can print this QR code or keep it in your phone gallery. Even if someone finds your physical badge, your sensitive clinical records are completely secure.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
