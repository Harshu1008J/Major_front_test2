import React from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, ScanLine } from 'lucide-react';
import { ScanResultTier, AccessTier } from '../components/features/ScanResultTier';
import { Button } from '../components/ui/Button';

export const ScanResult: React.FC = () => {
  const { tier } = useParams<{ tier: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTier: AccessTier = tier === '1' ? 1 : tier === '2' ? 2 : 3;
  const patientId = searchParams.get('id') || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-navy)',
                  color: 'var(--color-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--color-navy)' }}>
                MedQR<span style={{ color: 'var(--color-teal)' }}>+</span> Scan Result
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<ScanLine size={14} />}
            onClick={() => navigate('/dashboard/scanner')}
          >
            Scan Another
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '24px 16px 60px' }}>
        <ScanResultTier tier={currentTier} patientId={patientId} />
      </main>
    </div>
  );
};
