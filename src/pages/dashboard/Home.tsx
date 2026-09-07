import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  QrCode,
  FileText,
  Bot,
  MapPin,
  ScanLine,
  Activity,
  Heart,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Plus,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { HospitalHome } from './HospitalHome';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'hospital') {
    return <HospitalHome />;
  }

  const recordCount = user?.records?.length || 0;
  const allergyCount = user?.allergies?.length || 0;
  const medCount = user?.currentMedications?.length || 0;
  const bloodGroup = user?.blood || null;
  const nextAppt = user?.nextAppointment || null;

  const quickActions = [
    {
      title: 'My Profile',
      desc: user?.blood || user?.emergency?.name
        ? 'Update vitals, allergies & emergency contacts'
        : 'Complete your health vitals & emergency contacts',
      path: '/dashboard/profile',
      icon: User,
      color: 'var(--color-navy)',
      bg: 'var(--color-bg)',
      badge: user?.blood ? 'Configured' : 'Setup Needed',
    },
    {
      title: 'My QR Code',
      desc: 'View, download & share your encrypted 3-tier pass',
      path: '/dashboard/qr',
      icon: QrCode,
      color: 'var(--color-teal)',
      bg: 'var(--color-teal-bg)',
      badge: 'Active Pass',
    },
    {
      title: 'My Medical Records',
      desc: recordCount > 0
        ? `${recordCount} prescription${recordCount === 1 ? '' : 's'} & diagnostic file${recordCount === 1 ? '' : 's'} stored`
        : 'Vault is empty — tap + Add to upload records',
      path: '/dashboard/records',
      icon: FileText,
      color: 'var(--color-info)',
      bg: 'var(--color-info-bg)',
      badge: recordCount > 0 ? `${recordCount} Files` : 'Empty Vault',
    },
    {
      title: 'AI Health Assistant',
      desc: 'Ask questions, summarize reports & get lifestyle advice',
      path: '/dashboard/ai',
      icon: Bot,
      color: '#6B46C1',
      bg: '#FAF5FF',
      badge: 'AI Powered',
    },
    {
      title: 'Healthcare Support Map',
      desc: 'Nearby hospitals, 24/7 pharmacies & emergency centers',
      path: '/dashboard/map',
      icon: MapPin,
      color: '#D69E2E',
      bg: 'var(--color-warning-bg)',
      badge: 'Live Proximity',
    },
    {
      title: 'Universal QR Scanner',
      desc: 'Scan patient badges or simulate permission tiers',
      path: '/dashboard/scanner',
      icon: ScanLine,
      color: 'var(--color-navy-light)',
      bg: 'var(--color-surface-alt)',
      badge: 'Scanner Ready',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Patient Welcome Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #162447 50%, #1F3A6E 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <Badge variant="teal" size="sm" icon={<ShieldCheck size={12} />}>
                Verified Patient Identity
              </Badge>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                ID: {user?.id || 'MQR-PASS'}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Patient'}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', maxWidth: '580px', marginTop: '6px', lineHeight: 1.5 }}>
              Your MedQR+ pass is active and securely locked under 3-tier encryption.
              {user?.issuingHospitalName ? ` Linked with ${user.issuingHospitalName}.` : ''}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="teal"
              size="md"
              icon={<QrCode size={16} />}
              onClick={() => navigate('/dashboard/qr')}
            >
              Show My QR Pass
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<ScanLine size={16} />}
              onClick={() => navigate('/dashboard/scanner')}
            >
              Open Scanner
            </Button>
          </div>
        </div>
      </div>

      {/* Vitals & Quick Metric Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Blood Group */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Blood Group
            </span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-brick-bg)', color: 'var(--color-brick)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={16} />
            </div>
          </div>
          <div style={{ fontSize: bloodGroup ? '26px' : '18px', fontWeight: 800, color: bloodGroup ? 'var(--color-brick)' : 'var(--color-text-muted)', marginTop: '8px' }}>
            {bloodGroup || 'Not Specified'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {bloodGroup ? (
              'Emergency Tier-3 Visible'
            ) : (
              <button
                onClick={() => navigate('/dashboard/profile')}
                style={{ color: 'var(--color-teal)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
              >
                + Set in Profile
              </button>
            )}
          </div>
        </Card>

        {/* Known Allergies */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Known Allergies
            </span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: allergyCount > 0 ? 'var(--color-warning-bg)' : 'var(--color-bg)', color: allergyCount > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: allergyCount > 0 ? 'var(--color-navy)' : 'var(--color-text-muted)', marginTop: '8px' }}>
            {allergyCount > 0 ? `${allergyCount} Flagged` : '0 Flagged'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {allergyCount > 0 ? (
              user?.allergies?.join(', ')
            ) : (
              <button
                onClick={() => navigate('/dashboard/profile')}
                style={{ color: 'var(--color-teal)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
              >
                + Add in Profile
              </button>
            )}
          </div>
        </Card>

        {/* Upcoming Appointment */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Upcoming Visit
            </span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: nextAppt ? 'var(--color-teal-bg)' : 'var(--color-bg)', color: nextAppt ? 'var(--color-teal)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} />
            </div>
          </div>
          <div style={{ fontSize: nextAppt ? '20px' : '16px', fontWeight: 800, color: nextAppt ? 'var(--color-navy)' : 'var(--color-text-muted)', marginTop: '8px' }}>
            {nextAppt || 'None Scheduled'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {nextAppt ? 'Clinical checkup' : 'No upcoming appointments'}
          </div>
        </Card>

        {/* Active Prescriptions */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Medications
            </span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: medCount > 0 ? 'var(--color-info-bg)' : 'var(--color-bg)', color: medCount > 0 ? 'var(--color-info)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: medCount > 0 ? 'var(--color-navy)' : 'var(--color-text-muted)', marginTop: '8px' }}>
            {medCount > 0 ? `${medCount} Active Rx` : '0 Active Rx'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {medCount > 0 ? (
              user?.currentMedications?.join(', ')
            ) : (
              <button
                onClick={() => navigate('/dashboard/profile')}
                style={{ color: 'var(--color-teal)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
              >
                + Add in Profile
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
            Patient Management Tools
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Single unified patient portal
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                padding="md"
                hoverable
                onClick={() => navigate(action.path)}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: action.bg,
                      color: action.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <Badge variant="neutral" size="sm">
                    {action.badge}
                  </Badge>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginTop: '16px' }}>
                  {action.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {action.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-teal)', fontSize: '13px', fontWeight: 600, marginTop: '14px' }}>
                  Open {action.title} <ArrowUpRight size={14} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
            Recent Activity & Health Audit Log
          </h4>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Real-time access tracking
          </span>
        </div>

        {user?.activityLogs && user.activityLogs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user.activityLogs.map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: log.color || 'var(--color-teal)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>
                      {log.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {log.subtitle}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {log.date}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-text-muted)' }}>
            <Clock size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <div style={{ fontSize: '13px', fontWeight: 600 }}>No activity logged yet</div>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              As you add medical records or your QR pass is scanned, audit records will appear here.
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
