import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  ScanLine,
  Filter,
  ShieldCheck,
  Lock,
  Unlock,
  Calendar,
  Phone,
  FileText,
  ExternalLink,
  Building2,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { HospitalAccessRecord } from '../../types/patient';

export const PatientsAccessed: React.FC = () => {
  const { user, getPatientById } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const patientsAccessed: HospitalAccessRecord[] = user?.patientsAccessed || [];

  const filteredPatients = patientsAccessed.filter(p => {
    const matchesSearch =
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.department && p.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'all' || String(p.accessTier) === tierFilter;

    return matchesSearch && matchesTier;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--color-teal-bg)', color: 'var(--color-teal)' }}>
              <Users size={22} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
              Patients Accessed
            </h2>
            <Badge variant="teal" size="sm">
              {patientsAccessed.length} Record{patientsAccessed.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            List of all patient records scanned and authorized by this hospital facility ({user?.hospitalName || user?.name}).
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          icon={<ScanLine size={16} />}
          onClick={() => navigate('/dashboard/scanner')}
        >
          Scan New Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card padding="md">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, MedQR ID, or department..."
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

          {/* Tier Buttons Filter */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '4px' }}>
              Filter Tier:
            </span>
            {[
              { id: 'all', label: 'All Tiers' },
              { id: '2', label: 'Tier 2 (Issuing Authority)' },
              { id: '1', label: 'Tier 1 (OTP Verified)' },
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
                  border: tierFilter === tab.id ? '1px solid var(--color-teal)' : '1px solid var(--color-border)',
                  background: tierFilter === tab.id ? 'var(--color-teal-bg)' : '#FFFFFF',
                  color: tierFilter === tab.id ? 'var(--color-teal-dim)' : 'var(--color-text-muted)',
                  transition: 'all 150ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Patient Cards / Table List */}
      {filteredPatients.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPatients.map(record => {
            const patientData = getPatientById(record.patientId);
            const blood = record.bloodGroup || patientData?.blood || 'N/A';
            const allergies = record.allergies || patientData?.allergies || [];
            const isTier2 = record.accessTier === 2;
            const isTier1 = record.accessTier === 1;

            return (
              <Card
                key={record.id}
                padding="md"
                style={{
                  borderLeft: isTier2
                    ? '4px solid var(--color-teal)'
                    : isTier1
                      ? '4px solid var(--color-navy)'
                      : '4px solid #D69E2E',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 'var(--radius-md)',
                        background: isTier2
                          ? 'var(--color-teal-bg)'
                          : isTier1
                            ? 'var(--color-navy-light)'
                            : '#FEF3C7',
                        color: isTier2
                          ? 'var(--color-teal)'
                          : isTier1
                            ? '#FFFFFF'
                            : '#92400E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px',
                        flexShrink: 0,
                      }}
                    >
                      {record.patientName.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--color-navy)' }}>
                          {record.patientName}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace', background: 'var(--color-surface-alt)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          {record.patientId}
                        </span>
                        <Badge
                          variant={isTier2 ? 'teal' : isTier1 ? 'navy' : 'neutral'}
                          size="sm"
                          icon={isTier2 ? <ShieldCheck size={12} /> : isTier1 ? <Unlock size={12} /> : <Lock size={12} />}
                        >
                          Tier {record.accessTier}: {isTier2 ? 'Issuing Authority Direct' : isTier1 ? 'Patient OTP Unlocked' : 'Public Emergency Subset'}
                        </Badge>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <strong>Blood Group:</strong> {blood}
                        </div>
                        {allergies.length > 0 && (
                          <div>
                            <strong>Allergies:</strong>{' '}
                            <span style={{ color: 'var(--color-brick)' }}>{allergies.slice(0, 2).join(', ')}{allergies.length > 2 ? ` +${allergies.length - 2}` : ''}</span>
                          </div>
                        )}
                        <div>
                          <strong>Last Accessed:</strong> {record.timestamp}
                        </div>
                        {record.department && (
                          <div>
                            <strong>Dept:</strong> {record.department}
                          </div>
                        )}
                      </div>

                      {record.notes && (
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                          {record.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Button
                      variant={isTier2 ? 'teal' : 'secondary'}
                      size="sm"
                      icon={<ExternalLink size={14} />}
                      onClick={() => navigate(`/scan-result/${record.accessTier}?id=${record.patientId}`)}
                    >
                      {isTier2 || isTier1 ? 'Open Full Medical Records' : 'View Emergency Subset'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Users size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
            No Matching Patients Found
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '6px', maxWidth: '400px', margin: '6px auto 16px' }}>
            {searchQuery || tierFilter !== 'all'
              ? 'Try changing your search keywords or resetting tier filters.'
              : 'Patients will appear in this registry once scanned via the hardware scanner.'}
          </p>
          {(searchQuery || tierFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSearchQuery(''); setTierFilter('all'); }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
