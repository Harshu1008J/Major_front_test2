import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  Download,
  Filter,
  Building2,
  ExternalLink,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { HospitalAccessRecord } from '../../types/patient';

export const AccessLog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const scanLogs: HospitalAccessRecord[] = user?.scanLogs || [];

  const filteredLogs = scanLogs.filter(log => {
    const matchesSearch =
      log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.department && log.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'all' || String(log.accessTier) === tierFilter;

    return matchesSearch && matchesTier;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(scanLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medqr-access-audit-log-${user?.hospitalId || 'hospital'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--color-navy-light)', color: '#FFFFFF' }}>
              <Clock size={22} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
              Scan History &amp; Access Logs
            </h2>
            <Badge variant="teal" size="sm" icon={<ShieldCheck size={12} />}>
              Immutable Audit Trail
            </Badge>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Chronological log of cryptographic scanning activity and access evaluations performed by {user?.hospitalName || user?.name}.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={<Download size={16} />}
          onClick={handleExportLogs}
          disabled={scanLogs.length === 0}
        >
          Export Audit Log (.JSON)
        </Button>
      </div>

      {/* Filter and Search */}
      <Card padding="md">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by patient name, ID, or action..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13.5px',
                outline: 'none',
                background: 'var(--color-surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '4px' }}>
              Filter Tier:
            </span>
            {[
              { id: 'all', label: 'All Logged Events' },
              { id: '2', label: 'Tier 2 (Issuing Authority)' },
              { id: '1', label: 'Tier 1 (OTP Unlocked)' },
              { id: '3', label: 'Tier 3 (Public Subset)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTierFilter(tab.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: tierFilter === tab.id ? '1px solid var(--color-navy)' : '1px solid var(--color-border)',
                  background: tierFilter === tab.id ? 'var(--color-navy)' : '#FFFFFF',
                  color: tierFilter === tab.id ? '#FFFFFF' : 'var(--color-text-muted)',
                  transition: 'all 150ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        {filteredLogs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-alt)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Patient ID</th>
                  <th style={{ padding: '12px 16px' }}>Patient Name</th>
                  <th style={{ padding: '12px 16px' }}>Access Tier</th>
                  <th style={{ padding: '12px 16px' }}>Authentication Method &amp; Reason</th>
                  <th style={{ padding: '12px 16px' }}>Terminal Department</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const isTier2 = log.accessTier === 2;
                  const isTier1 = log.accessTier === 1;

                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-alt)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        {log.timestamp}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--color-navy)', fontWeight: 600 }}>
                        {log.patientId}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-navy)' }}>
                        {log.patientName}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge
                          variant={isTier2 ? 'teal' : isTier1 ? 'navy' : 'neutral'}
                          size="sm"
                          icon={isTier2 ? <ShieldCheck size={12} /> : isTier1 ? <Unlock size={12} /> : <Lock size={12} />}
                        >
                          Tier {log.accessTier} ({isTier2 ? 'Issuing Direct' : isTier1 ? 'OTP Approved' : 'Public Subset'})
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                        <div style={{ fontWeight: 500 }}>{log.reason || 'QR Code Hardware Scan'}</div>
                        {log.notes && (
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {log.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                        {log.department || 'Clinical Terminal'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<ExternalLink size={13} />}
                          onClick={() => navigate(`/scan-result/${log.accessTier}?id=${log.patientId}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <FileCheck size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
              No Logged Scanning Events
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Scanning activity and access evaluations will be recorded in this chronological audit log.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
