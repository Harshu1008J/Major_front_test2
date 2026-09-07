import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  FileBadge,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { HospitalAccount, HospitalVerificationStatus } from '../types/patient';

export const AdminVerification: React.FC = () => {
  const { getAllHospitalAccounts, verifyHospitalAccount, user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const hospitals: HospitalAccount[] = getAllHospitalAccounts();

  const pendingCount = hospitals.filter(h => h.status === 'pending' || !h.verified).length;
  const verifiedCount = hospitals.filter(h => h.verified && h.status === 'verified').length;
  const rejectedCount = hospitals.filter(h => h.status === 'rejected').length;

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch =
      h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'pending' && (!h.verified && h.status !== 'rejected')) ||
      (filterTab === 'verified' && h.verified && h.status === 'verified') ||
      (filterTab === 'rejected' && h.status === 'rejected');

    return matchesSearch && matchesFilter;
  });

  const handleApprove = (hospital: HospitalAccount) => {
    verifyHospitalAccount(hospital.id, true, 'verified');
    setActionSuccessMessage(`Successfully verified "${hospital.hospitalName}" (${hospital.licenseNumber}). Tier 2 permissions granted.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = (hospital: HospitalAccount) => {
    verifyHospitalAccount(hospital.id, false, 'rejected');
    setActionSuccessMessage(`Application for "${hospital.hospitalName}" has been rejected.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRevoke = (hospital: HospitalAccount) => {
    verifyHospitalAccount(hospital.id, false, 'pending');
    setActionSuccessMessage(`Revoked verification for "${hospital.hospitalName}". Status reset to pending.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Header */}
      <header
        style={{
          background: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-teal)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px' }}>
                MedQR<span style={{ color: 'var(--color-teal-light)' }}>+</span> Admin Verification Console
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                State Medical Registry &amp; Provider Access Management
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/login')}
              style={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.1)' }}
            >
              Back to Login
            </Button>
            <Button
              variant="teal"
              size="sm"
              icon={<Building2 size={16} />}
              onClick={() => navigate('/dashboard')}
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 60px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Success alert message */}
        {actionSuccessMessage && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-teal-bg)',
              border: '1px solid var(--color-teal)',
              color: 'var(--color-teal-dim)',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 200ms ease',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Card padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Total Hospital Registrations
              </span>
              <Building2 size={18} color="var(--color-navy)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
              {hospitals.length}
            </div>
          </Card>

          <Card padding="md" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#B45309', textTransform: 'uppercase' }}>
                Pending Review
              </span>
              <Clock size={18} color="#F59E0B" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#B45309', fontFamily: 'var(--font-display)' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '12px', color: '#92400E', marginTop: '2px' }}>
              Requires medical license verification
            </div>
          </Card>

          <Card padding="md" style={{ borderLeft: '4px solid var(--color-teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-teal-dim)', textTransform: 'uppercase' }}>
                Verified Providers (Active Tier 2)
              </span>
              <ShieldCheck size={18} color="var(--color-teal)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-teal-dim)', fontFamily: 'var(--font-display)' }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-teal-dim)', marginTop: '2px' }}>
              Authorized cryptographic issuing nodes
            </div>
          </Card>

          <Card padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Rejected Applications
              </span>
              <XCircle size={18} color="var(--color-brick)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
              {rejectedCount}
            </div>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <Card padding="md">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, license no (e.g. DL-MED), contact person, or ID..."
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
                Status:
              </span>
              {[
                { id: 'all', label: `All (${hospitals.length})` },
                { id: 'pending', label: `Pending Review (${pendingCount})` },
                { id: 'verified', label: `Verified (${verifiedCount})` },
                { id: 'rejected', label: `Rejected (${rejectedCount})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: filterTab === tab.id ? '1px solid var(--color-navy)' : '1px solid var(--color-border)',
                    background: filterTab === tab.id ? 'var(--color-navy)' : '#FFFFFF',
                    color: filterTab === tab.id ? '#FFFFFF' : 'var(--color-text-muted)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Hospital Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map(hospital => {
              const isPending = !hospital.verified && hospital.status !== 'rejected';
              const isVerified = hospital.verified && hospital.status === 'verified';
              const isRejected = hospital.status === 'rejected';

              return (
                <Card
                  key={hospital.id}
                  padding="lg"
                  style={{
                    borderLeft: isVerified
                      ? '5px solid var(--color-teal)'
                      : isPending
                        ? '5px solid #F59E0B'
                        : '5px solid #EF4444',
                    background: isPending ? '#FFFDF7' : '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    {/* Left Details */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
                          {hospital.hospitalName}
                        </h3>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text-muted)', background: 'var(--color-surface-alt)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          {hospital.id}
                        </span>
                        <Badge
                          variant={isVerified ? 'teal' : isPending ? 'warning' : 'brick'}
                          size="sm"
                          icon={isVerified ? <CheckCircle2 size={12} /> : isPending ? <Clock size={12} /> : <XCircle size={12} />}
                        >
                          {isVerified ? 'Verified Provider' : isPending ? 'Pending Verification' : 'Rejected'}
                        </Badge>
                      </div>

                      {/* Submitted Fields Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '12px', fontSize: '12.5px' }}>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>License Number: </span>
                          <strong style={{ fontFamily: 'monospace', color: 'var(--color-navy)' }}>{hospital.licenseNumber}</strong>
                        </div>

                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Contact Person: </span>
                          <strong>{hospital.contactPersonName}</strong>
                        </div>

                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Email: </span>
                          <a href={`mailto:${hospital.email}`} style={{ color: 'var(--color-teal)', textDecoration: 'underline' }}>
                            {hospital.email}
                          </a>
                        </div>

                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Phone: </span>
                          <strong>{hospital.phone}</strong>
                        </div>

                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Application Date: </span>
                          <span>{hospital.registeredAt}</span>
                        </div>

                        {hospital.verifiedAt && (
                          <div>
                            <span style={{ color: 'var(--color-text-muted)' }}>Verified On: </span>
                            <span style={{ color: 'var(--color-teal-dim)', fontWeight: 600 }}>{hospital.verifiedAt}</span>
                          </div>
                        )}
                      </div>

                      {hospital.address && (
                        <div style={{ fontSize: '12.5px', marginTop: '8px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                          <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-text-muted)' }} />
                          <span>{hospital.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                      {isPending && (
                        <>
                          <Button
                            variant="teal"
                            size="md"
                            icon={<CheckCircle2 size={16} />}
                            onClick={() => handleApprove(hospital)}
                          >
                            Approve &amp; Verify
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<XCircle size={14} />}
                            onClick={() => handleReject(hospital)}
                          >
                            Reject Application
                          </Button>
                        </>
                      )}

                      {isVerified && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<XCircle size={14} />}
                          onClick={() => handleRevoke(hospital)}
                        >
                          Revoke Verification
                        </Button>
                      )}

                      {isRejected && (
                        <Button
                          variant="teal"
                          size="sm"
                          icon={<CheckCircle2 size={14} />}
                          onClick={() => handleApprove(hospital)}
                        >
                          Re-approve &amp; Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Building2 size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
                No Hospital Applications Match Filters
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Try adjusting your search query or status filter.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
