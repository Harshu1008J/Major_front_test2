import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera, AlertCircle, Sparkles, Building2, ShieldCheck, ShieldAlert, Key, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface QRScannerProps {
  onScanSuccess: (decodedText: string, tierOverride?: number) => void;
  onScanError?: (error: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError }) => {
  const { getAllPatients, user } = useAuth();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const scannerInstanceRef = useRef<Html5QrcodeScanner | null>(null);

  const registeredPatients = getAllPatients();
  const activePatientForSim = registeredPatients[0] || null;

  useEffect(() => {
    const scannerId = 'medqr-reader';
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    try {
      const scanner = new Html5QrcodeScanner(scannerId, config, false);
      scannerInstanceRef.current = scanner;

      scanner.render(
        (decodedText) => {
          scanner.clear().catch(console.error);
          setScannerActive(false);
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          if (onScanError && errorMessage.includes('NotFoundException')) {
            onScanError(errorMessage);
          }
        }
      );
      setScannerActive(true);
    } catch (err: any) {
      console.warn('Scanner initialization note:', err);
      setCameraError('Camera access not detected or permission denied. You can use physical camera feeds or registered patient test triggers below.');
    }

    return () => {
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.clear().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '580px', margin: '0 auto', width: '100%' }}>
      <Card padding="md">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', background: 'var(--color-teal-bg)', borderRadius: '50%', color: 'var(--color-teal)', marginBottom: '8px' }}>
            <Camera size={24} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
            Scan MedQR+ Code
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Point your camera at a patient's physical badge or mobile screen
          </p>
        </div>

        {/* html5-qrcode mount point */}
        <div
          id="medqr-reader"
          ref={scannerContainerRef}
          style={{
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--color-border-mid)',
            minHeight: '260px',
            background: 'var(--color-bg)',
          }}
        />

        {cameraError && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-info-bg)',
              border: '1px solid #BEE3F8',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: '#2B6CB0',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{cameraError}</span>
          </div>
        )}
      </Card>

      {/* Dynamic Registered Patient Test Simulator */}
      {registeredPatients.length > 0 && (
        <Card padding="md" style={{ border: '1.5px solid var(--color-teal)', background: '#F8FCFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--color-teal)" />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>
                Test Evaluation on Registered Patients
              </h4>
            </div>
            <Badge variant="teal" size="sm">{registeredPatients.length} Registered</Badge>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
            Test 3-tier access control logic on real patient accounts in the system:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {registeredPatients.slice(0, 3).map(p => (
              <div
                key={p.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-navy)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {p.id}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onScanSuccess(p.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-teal)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Scan Badge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
