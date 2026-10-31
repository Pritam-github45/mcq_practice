import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '', confirm: '', targetYear: '2025' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newUser = {
      id: `u_${Date.now()}`, name: form.name, email: form.email,
      avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      college: form.college || 'Not specified', targetYear: parseInt(form.targetYear),
      joinedDate: new Date().toISOString().split('T')[0],
      streak: 0, totalStudyHours: 0, rank: 9999,
    };
    login(newUser);
    navigate('/dashboard');
  };

  const features = ['2000+ Previous Year Questions', 'Chapter-wise Quiz System', 'Full Mock Tests', 'Detailed Analytics', 'Wrong Answer Notebook'];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
        borderRight: '1px solid var(--border)', padding: '40px',
      }}
        className="hidden md:flex"
      >
        <div style={{ textAlign: 'center', maxWidth: '340px' }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '20px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(124,58,237,0.4)',
          }}>
            <GraduationCap size={36} color="white" />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>GATE Prep Pro</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7', fontSize: '15px' }}>
            India's most comprehensive GATE CSE preparation platform. Join thousands of students cracking GATE.
          </p>
          <div style={{ textAlign: 'left' }}>
            {features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Start your GATE preparation journey today</p>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', field: 'name', icon: User, placeholder: 'Rahul Sharma', type: 'text' },
              { label: 'Email Address', field: 'email', icon: Mail, placeholder: 'you@email.com', type: 'email' },
              { label: 'College / Institute (optional)', field: 'college', icon: GraduationCap, placeholder: 'IIT Delhi', type: 'text' },
            ].map(({ label, field, icon: Icon, placeholder, type }) => (
              <div key={field} style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={type}
                    className="input-field"
                    style={{ paddingLeft: '38px', borderColor: errors[field] ? '#ef4444' : undefined }}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
                {errors[field] && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors[field]}</div>}
              </div>
            ))}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target GATE Year</label>
              <select className="input-field" value={form.targetYear} onChange={e => setForm({ ...form, targetYear: e.target.value })}>
                <option>2025</option><option>2026</option><option>2027</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  style={{ paddingLeft: '38px', paddingRight: '40px', borderColor: errors.password ? '#ef4444' : undefined }}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.password}</div>}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '38px', borderColor: errors.confirm ? '#ef4444' : undefined }}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                />
              </div>
              {errors.confirm && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{errors.confirm}</div>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} className="animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--purple-light)', fontWeight: '600', textDecoration: 'none' }}>
              Sign In <ArrowRight size={12} style={{ display: 'inline' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
