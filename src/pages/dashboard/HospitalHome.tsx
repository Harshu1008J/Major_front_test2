import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ScanLine,
  Users,
  Clock,
  ShieldCheck,
  FileText,
  Bot,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const HospitalHome: React.FC = () => {
  const { user, getPatientById, recordHospitalScan } = useAuth();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const hospitalName = user?.hospitalName || user?.name || 'Healthcare Facility';
  const hospitalId = user?.hospitalId || user?.id || 'HOSP-ID';
  const department = user?.department || 'Clinical Department';
  const licenseNumber = user?.licenseNumber || 'PENDING LICENSE';

  const patientsAccessed = user?.patientsAccessed || [];
  const scanLogs = user?.scanLogs || [];

  const totalScans = scanLogs.length;
  const tier2DirectScans = scanLogs.filter(s => s.accessTier === 2).length;
  const tier3PublicScans = scanLogs.filter(s => s.accessTier === 3).length;
  const tier1OtpScans = scanLogs.filter(s => s.accessTier === 1).length;

  const handlePatientLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleanId = searchId.trim();
    if (!cleanId) return;

    const patient = getPatientById(cleanId);
    if (!patient) {
      setSearchError(`No patient found matching ID "${cleanId}". Please check the ID or scan the patient QR code.`);
      return;
    }

    const isIssuing =
      (user?.hospitalId && patient.issuingHospital === user.hospitalId) ||
      (user?.hospitalName && patient.issuingHospitalName === user.hospitalName) ||
      (user?.id === patient.issuingHospital);

    const tier = isIssuing ? 2 : 3;
    recordHospitalScan(patient.id, tier, isIssuing ? `Direct Issuing Hospital Lookup (${hospitalName})` : `External Facility Search (${hospitalName})`);
    navigate(`/scan-result/${tier}?id=${patient.id}`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hospital Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #162447 60%, #1F3A6E 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(42, 157, 143, 0.3)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Badge variant="teal" size="sm" icon={<Building2 size={12} />}>
                Verified Healthcare Provider
              </Badge>
              <Badge variant="neutral" size="sm">
                ID: {hospitalId}
              </Badge>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }}>
              {hospitalName}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px', maxWidth: '560px' }}>
              {department} • Authorized clinician terminal with cryptographic 3-Tier evaluation engine.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="teal"
              size="lg"
              icon={<ScanLine size={18} />}
              onClick={() => navigate('/dashboard/scanner')}
            >
              Scan Patient QR
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Users size={18} />}
              onClick={() => navigate('/dashboard/patients')}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Patients Accessed ({patientsAccessed.length})
            </Button>
          </div>
        </div>

        {/* Facility Details Strip */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: '24px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Medical License: </span>
            <strong style={{ color: '#FFFFFF' }}>{licenseNumber}</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Issuing Authority Status: </span>
            <strong style={{ color: 'var(--color-teal-light)' }}>
              Active Cryptographic Node
            </strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Terminal Encryption: </span>
            <strong style={{ color: 'var(--color-teal-light)' }}>Hardware HSM 256-Bit</strong>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Scans Performed
            </span>
            <div style={{ padding: '8px', background: 'var(--color-navy-light)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
            {totalScans}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Across all clinical encounters
          </div>
        </Card>

        <Card padding="md" style={{ borderLeft: '4px solid var(--color-teal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Direct Tier 2 Accesses
            </span>
            <div style={{ padding: '8px', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', borderRadius: 'var(--radius-sm)' }}>
              <Unlock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-teal-dim)', fontFamily: 'var(--font-display)' }}>
            {tier2DirectScans}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-teal-dim)', marginTop: '4px', fontWeight: 500 }}>
            Instant issuing authority unlocks
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tier 3 Limited Triage
            </span>
            <div style={{ padding: '8px', background: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-sm)' }}>
              <Lock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400E', fontFamily: 'var(--font-display)' }}>
            {tier3PublicScans}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Emergency curated view
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Unique Patients
            </span>
            <div style={{ padding: '8px', background: 'var(--color-info-bg)', color: 'var(--color-info)', borderRadius: 'var(--radius-sm)' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
            {patientsAccessed.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Active patient registries
          </div>
        </Card>
      </div>

      {/* Primary Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Quick QR Scanner Launcher */}
        <Card padding="lg" style={{ background: 'linear-gradient(135deg, #F8FCFB 0%, #FFFFFF 100%)', border: '1.5px solid var(--color-teal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-teal-bg)', color: 'var(--color-teal)' }}>
              <ScanLine size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--color-navy)' }}>
                Hardware QR Scanner
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Point camera at patient badge for instant authorization
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
            Scanning badges issued by your facility immediately decrypts all medical records, diagnostics, and prescriptions via Tier 2 without requiring OTP approval.
          </p>
          <Button
            variant="teal"
            size="md"
            fullWidth
            icon={<ScanLine size={16} />}
            onClick={() => navigate('/dashboard/scanner')}
          >
            Launch Camera Scanner
          </Button>
        </Card>

        {/* Quick Patient ID Lookup */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-navy-light)', color: '#FFFFFF' }}>
              <Search size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--color-navy)' }}>
                Direct Patient ID Lookup
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Manual query by registered MedQR+ identifier
              </p>
            </div>
          </div>

          <form onSubmit={handlePatientLookup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchId}
                onChange={e => { setSearchId(e.target.value); setSearchError(null); }}
                placeholder="Enter patient MedQR ID (e.g. MQR-XXXXX)"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            {searchError && (
              <div style={{ fontSize: '12px', color: 'var(--color-brick)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{searchError}</span>
              </div>
            )}

            <Button type="submit" variant="secondary" size="md" fullWidth icon={<Search size={16} />}>
              Evaluate Permissions
            </Button>
          </form>
        </Card>
      </div>

      {/* Recent Patients Scanned Table */}
      <Card padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
              Recent Patient Scans &amp; Authorizations
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Latest access events verified by this terminal
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconRight={<ArrowRight size={14} />}
            onClick={() => navigate('/dashboard/patients')}
          >
            View All Patients ({patientsAccessed.length})
          </Button>
        </div>

        {patientsAccessed.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 12px' }}>Patient Name</th>
                  <th style={{ padding: '10px 12px' }}>Patient ID</th>
                  <th style={{ padding: '10px 12px' }}>Access Tier</th>
                  <th style={{ padding: '10px 12px' }}>Timestamp</th>
                  <th style={{ padding: '10px 12px' }}>Department / Reason</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {patientsAccessed.slice(0, 5).map(record => (
                  <tr
                    key={record.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-alt)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--color-navy)' }}>
                      {record.patientName}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {record.patientId}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Badge
                        variant={record.accessTier === 2 ? 'teal' : record.accessTier === 1 ? 'navy' : 'neutral'}
                        size="sm"
                        icon={record.accessTier === 2 ? <ShieldCheck size={12} /> : record.accessTier === 1 ? <Unlock size={12} /> : <Lock size={12} />}
                      >
                        Tier {record.accessTier}: {record.accessTier === 2 ? 'Issuing Authority' : record.accessTier === 1 ? 'OTP Approved' : 'Public Subset'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '12.5px' }}>
                      {record.timestamp}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '12.5px' }}>
                      {record.reason || 'Clinical Consultation'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Button
                        variant="teal"
                        size="sm"
                        icon={<ExternalLink size={13} />}
                        onClick={() => navigate(`/scan-result/${record.accessTier}?id=${record.patientId}`)}
                      >
                        Open Record
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>
            <ScanLine size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>No Patients Accessed Yet</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Use the Universal Scanner to scan a patient badge or query their identifier.
            </p>
            <Button
              variant="teal"
              size="sm"
              icon={<ScanLine size={14} />}
              onClick={() => navigate('/dashboard/scanner')}
              style={{ marginTop: '14px' }}
            >
              Start First Scan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
