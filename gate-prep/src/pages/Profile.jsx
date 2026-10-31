import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { subjects } from '../data/mockData';
import {
  User, Mail, GraduationCap, Calendar, Target, Edit3, Save, X,
  Zap, Clock, Award, BookOpen, TrendingUp, CheckCircle,
} from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  const totalAttempted = subjects.reduce((a, s) => a + s.attempted, 0);
  const overallAccuracy = Math.round(subjects.reduce((a, s) => a + (s.accuracy * s.attempted), 0) / totalAttempted);

  const handleSave = () => {
    setUser(form);
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div style={{
        background: 'var(--navy-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '32px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))' }} />

        <div style={{ position: 'relative' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: '800', color: 'white',
              border: '4px solid var(--navy-card)', flexShrink: 0,
            }}>
              {user?.avatar || 'U'}
            </div>
            <div style={{ paddingBottom: '4px' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{user?.college}</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <span className="badge badge-purple">GATE {user?.targetYear}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f59e0b' }}>
                  <Zap size={12} /> {user?.streak} Day Streak
                </span>
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setEditing(!editing)}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-end' }}
            >
              <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Full Name', field: 'name', icon: User },
                { label: 'Email', field: 'email', icon: Mail, type: 'email' },
                { label: 'College / Institute', field: 'college', icon: GraduationCap },
                { label: 'Target GATE Year', field: 'targetYear', icon: Target, type: 'number' },
              ].map(({ label, field, icon: Icon, type }) => (
                <div key={field}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={type || 'text'}
                      className="input-field"
                      style={{ paddingLeft: '36px' }}
                      value={form[field] || ''}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="btn-secondary" onClick={() => { setEditing(false); setForm({ ...user }); }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Email', value: user?.email, icon: Mail },
                { label: 'College', value: user?.college, icon: GraduationCap },
                { label: 'Target Year', value: `GATE ${user?.targetYear}`, icon: Target },
                { label: 'Member Since', value: new Date(user?.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), icon: Calendar },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
                  <item.icon size={16} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Performance Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { icon: CheckCircle, label: 'Questions Solved', value: totalAttempted.toLocaleString(), color: '#10b981' },
            { icon: Target, label: 'Overall Accuracy', value: `${overallAccuracy}%`, color: '#7c3aed' },
            { icon: Clock, label: 'Study Hours', value: user?.totalStudyHours, color: '#06b6d4' },
            { icon: Zap, label: 'Current Streak', value: `${user?.streak} days`, color: '#f59e0b' },
            { icon: Award, label: 'GATE Rank Est.', value: `#${user?.rank?.toLocaleString()}`, color: '#ef4444' },
            { icon: BookOpen, label: 'Subjects Covered', value: `${subjects.filter(s => s.attempted > 0).length}/${subjects.length}`, color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '16px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Mastery */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Subject Mastery</h3>
        {subjects.map(s => {
          const completion = Math.round((s.attempted / s.totalQuestions) * 100);
          return (
            <div key={s.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: s.color, fontWeight: '700' }}>{s.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.shortName}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{completion}% complete</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: s.accuracy >= 75 ? '#10b981' : s.accuracy >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {s.accuracy}% acc
                  </span>
                </div>
              </div>
              <div className="progress-bar" style={{ height: '6px' }}>
                <div className="progress-fill" style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}bb)` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
