import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email / ID and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #162447 0%, #0D1B3E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-teal)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Shield size={28} color="#FFFFFF" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }}>
            MedQR<span style={{ color: 'var(--color-teal-light)' }}>+</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
            Sign in to access your secure health pass or hospital terminal
          </p>
        </div>

        {/* Card */}
        <Card padding="lg" style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sign In to Account
            </span>
            <Badge variant="teal" size="sm" icon={<ShieldCheck size={12} />}>
              256-Bit Encrypted
            </Badge>
          </div>

          {errorMessage && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Email Address, Patient ID, or Facility License
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com or MQR-XXXXX"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={e => {
                    e.preventDefault();
                    alert('Password reset instructions will be sent to your registered email address.');
                  }}
                  style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 600 }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="lg"
              fullWidth
              loading={loading}
              iconRight={<ArrowRight size={16} />}
              style={{ marginTop: '8px' }}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              New to MedQR+?{' '}
              <Link to="/register" style={{ color: 'var(--color-teal)', fontWeight: 700 }}>
                Sign up as Patient or Hospital
              </Link>
            </div>
            <div style={{ fontSize: '12px' }}>
              <Link to="/admin" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
                🛡️ Admin Verification Console
              </Link>
            </div>
          </div>
        </Card>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ← Return to MedQR+ Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
