import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, FileText, Play, Trophy, CheckCircle, Lock, BarChart2,
  Zap, Calendar, BookOpen, ChevronRight,
} from 'lucide-react';
import { mockTests } from '../data/mockData';

const statusColors = { upcoming: '#f59e0b', available: '#10b981', completed: '#7c3aed' };
const statusBadge = { upcoming: 'badge-medium', available: 'badge-easy', completed: 'badge-purple' };
const statusIcon = { upcoming: Calendar, available: Play, completed: CheckCircle };

function TestCard({ test, onStart }) {
  const StatusIcon = statusIcon[test.status];

  return (
    <div style={{
      background: 'var(--navy-card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '24px', transition: 'all 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = statusColors[test.status]; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span className={`badge ${statusBadge[test.status]}`} style={{ marginBottom: '8px', display: 'inline-flex' }}>
            <StatusIcon size={12} style={{ marginRight: '4px' }} />
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </span>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{test.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {test.type} • Scheduled: {new Date(test.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        {test.status === 'completed' && test.bestScore !== null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>
              {test.bestScore}/{test.totalMarks}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Best Score</div>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { icon: FileText, label: 'Questions', value: test.totalQuestions },
          { icon: Clock, label: 'Duration', value: `${test.duration} min` },
          { icon: Trophy, label: 'Total Marks', value: test.totalMarks },
        ].map(item => (
          <div key={item.label} style={{ padding: '10px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <item.icon size={14} color="var(--text-muted)" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{item.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Sections</div>
        {test.sections.map((sec, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '8px', background: 'var(--glass)', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sec.name}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{sec.questions}Q • {sec.marks}M</span>
          </div>
        ))}
      </div>

      {/* Attempts */}
      {test.attempts > 0 && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Attempted {test.attempts} time{test.attempts > 1 ? 's' : ''}
        </div>
      )}

      {/* Action */}
      <button
        className={test.status === 'available' || test.status === 'completed' ? 'btn-primary' : 'btn-secondary'}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        onClick={() => onStart(test)}
        disabled={test.status === 'upcoming'}
      >
        {test.status === 'upcoming' ? (
          <><Lock size={14} /> Starts {new Date(test.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
        ) : test.status === 'completed' ? (
          <><BarChart2 size={14} /> View Results & Retake</>
        ) : (
          <><Play size={14} /> Start Test</>
        )}
      </button>
    </div>
  );
}

export default function MockTests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = mockTests.filter(t =>
    activeTab === 'all' || t.status === activeTab || (activeTab === 'full' && t.type === 'Full Length') || (activeTab === 'sectional' && t.type === 'Sectional')
  );

  const handleStart = (test) => {
    if (test.status === 'upcoming') return;
    navigate(`/quiz?mock=${test.id}`, { state: { mockTest: test } });
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Mock Tests</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Practice with full-length GATE mock tests and sectional tests
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Tests', value: mockTests.length, color: '#7c3aed', icon: FileText },
          { label: 'Completed', value: mockTests.filter(t => t.status === 'completed').length, color: '#10b981', icon: CheckCircle },
          { label: 'Available', value: mockTests.filter(t => t.status === 'available').length, color: '#06b6d4', icon: Play },
          { label: 'Best Score', value: '41/55', color: '#f59e0b', icon: Trophy },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Tests' },
          { key: 'available', label: 'Available' },
          { key: 'full', label: 'Full Length' },
          { key: 'sectional', label: 'Sectional' },
          { key: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', border: '1.5px solid',
              borderColor: activeTab === tab.key ? 'var(--purple)' : 'var(--border)',
              background: activeTab === tab.key ? 'rgba(124,58,237,0.15)' : 'var(--glass)',
              color: activeTab === tab.key ? 'var(--purple-light)' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map(test => (
          <TestCard key={test.id} test={test} onStart={handleStart} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <p>No tests found for this filter</p>
        </div>
      )}
    </div>
  );
}
