import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Clock,
  ShieldAlert,
  FileBadge,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  LogOut,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HospitalPendingVerification: React.FC = () => {
  const { user, logout, getAllHospitalAccounts } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isRejected = user?.status === 'rejected';

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Re-read hospital from storage
      const hospitals = getAllHospitalAccounts();
      const current = hospitals.find(h => h.id === user?.id);
      setIsRefreshing(false);
      if (current && current.verified) {
        window.location.reload();
      }
    }, 600);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 15%, #162447 0%, #0D1B3E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Icon & Status */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 119, 6, 0.15)',
              border: `2px solid ${isRejected ? '#EF4444' : '#F59E0B'}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            {isRejected ? <ShieldAlert size={32} color="#EF4444" /> : <Clock size={32} color="#F59E0B" />}
          </div>

          <Badge variant={isRejected ? 'brick' : 'warning'} size="md">
            {isRejected ? 'Application Rejected' : 'Verification In Progress'}
          </Badge>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              marginTop: '12px',
            }}
          >
            {isRejected ? 'Hospital Registration Not Approved' : 'Hospital Verification Pending'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '6px', lineHeight: 1.5 }}>
            {isRejected
              ? 'Your healthcare provider registration could not be verified against the state medical registry.'
              : "Your hospital registration is pending administrative medical verification. You'll be notified once approved and granted Tier 2 cryptographic scanning privileges."}
          </p>
        </div>

        {/* Submitted Application Summary Card */}
        <Card padding="lg" style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Submitted Provider Credentials
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text-muted)', background: 'var(--color-surface-alt)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              ID: {user?.hospitalId || user?.id}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Hospital / Clinic Name
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginTop: '2px', fontSize: '14px' }}>
                {user?.hospitalName || user?.name}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Medical License / Reg No.
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginTop: '2px', fontFamily: 'monospace', fontSize: '14px' }}>
                {user?.licenseNumber || 'PENDING SUBMISSION'}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Contact Person
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {user?.contactPersonName || user?.name}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Contact Email
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {user?.email}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Contact Phone
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {user?.phone}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Submission Date
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {user?.registeredAt}
              </div>
            </div>

            {user?.address && (
              <div style={{ gridColumn: '1 / -1', padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Registered Physical Address
                </div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {user.address}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
            <Button
              variant="teal"
              size="md"
              loading={isRefreshing}
              icon={<RefreshCw size={16} />}
              onClick={handleRefreshStatus}
              style={{ flex: 1 }}
            >
              Check Approval Status
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<LogOut size={16} />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Demo / Admin Shortcut Card */}
        <Card
          padding="md"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--color-teal-light)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '13.5px' }}>
                  Testing the Verification Flow?
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Open the Admin Verification Panel to approve this hospital account with 1 click.
                </div>
              </div>
            </div>

            <Button
              variant="teal"
              size="sm"
              iconRight={<ArrowRight size={14} />}
              onClick={() => navigate('/admin')}
            >
              Open Admin Panel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
