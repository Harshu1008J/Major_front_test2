import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Shield, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface QRCodeDisplayProps {
  patientId: string;
  patientName: string;
  bloodGroup: string;
  emergencyContact: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  patientId,
  patientName,
  bloodGroup,
  emergencyContact,
  size = 220,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // Encode structured payload that can be parsed by the scanner
  const qrData = JSON.stringify({
    app: 'MedQR+',
    version: '1.0',
    patientId,
    name: patientName,
    bloodGroup,
    emergencyContact,
    scanUrl: `${window.location.origin}/scan-result/3?id=${patientId}`,
  });

  const handleDownload = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `MedQR_${patientId}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MedQR+ Digital Health Pass - ${patientName}`,
          text: `Scan to access verified medical tier info for ${patientName} (${patientId})`,
          url: `${window.location.origin}/scan-result/3?id=${patientId}`,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/scan-result/3?id=${patientId}`);
      alert('Secure QR Scan link copied to clipboard!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div
        ref={qrRef}
        style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          maxWidth: '320px',
          width: '100%',
        }}
      >
        {/* Security badge at top */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Badge variant="teal" size="sm" icon={<Shield size={12} />}>
            Verified 3-Tier Security
          </Badge>
        </div>

        <div
          style={{
            padding: '12px',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #EDF2F7',
          }}
        >
          <QRCodeSVG
            value={qrData}
            size={size}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232A9D8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center', width: '100%' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-navy)' }}>
            {patientName}
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              color: 'var(--color-teal-dim)',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            {patientId}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '10px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>Blood: <strong style={{ color: 'var(--color-brick)' }}>{bloodGroup}</strong></span>
            <span>•</span>
            <span>Emergency: <strong>{emergencyContact}</strong></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="secondary" size="md" icon={<Download size={16} />} onClick={handleDownload}>
          Download QR
        </Button>
        <Button variant="teal" size="md" icon={<Share2 size={16} />} onClick={handleShare}>
          Share Pass
        </Button>
      </div>
    </div>
  );
};
