import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area,
} from 'recharts';
import {
  Target, Zap, Clock, CheckCircle, XCircle, TrendingUp,
  BookOpen, Award, ArrowRight, Calendar, Star, ChevronRight,
  Play, BarChart2, Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subjects, weeklyProgress, subjectPerformance, recentActivity, mockTests } from '../data/mockData';

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="stat-card animate-fade-in">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${color}22`, border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: trend >= 0 ? '#10b981' : '#ef4444' }}>
          <TrendingUp size={12} style={{ transform: trend < 0 ? 'scaleY(-1)' : 'none' }} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{value}</div>
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</div>
    {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: '600' }}>
            {p.name}: {p.value}{p.name === 'accuracy' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useApp();
  const [progressAnimated, setProgressAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProgressAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const totalQuestions = subjects.reduce((acc, s) => acc + s.totalQuestions, 0);
  const totalAttempted = subjects.reduce((acc, s) => acc + s.attempted, 0);
  const overallAccuracy = Math.round(subjects.reduce((acc, s) => acc + (s.accuracy * s.attempted), 0) / totalAttempted);
  const completionPct = Math.round((totalAttempted / totalQuestions) * 100);

  const weakSubjects = [...subjects].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const strongSubjects = [...subjects].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>👋</span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span>
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Continue your GATE CSE preparation • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        {/* Streak banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px',
          background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '999px', padding: '6px 16px',
        }}>
          <Flame size={16} color="#f59e0b" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>
            {user?.streak} Day Streak! Keep it up!
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Target} label="Overall Accuracy" value={`${overallAccuracy}%`} sub={`${totalAttempted} questions attempted`} color="#7c3aed" trend={4} />
        <StatCard icon={CheckCircle} label="Questions Solved" value={totalAttempted.toLocaleString()} sub={`Out of ${totalQuestions.toLocaleString()} total`} color="#10b981" trend={12} />
        <StatCard icon={Clock} label="Study Hours" value={user?.totalStudyHours} sub="Total hours logged" color="#06b6d4" trend={8} />
        <StatCard icon={Award} label="GATE Rank Est." value={`#${user?.rank?.toLocaleString()}`} sub="Based on mock tests" color="#f59e0b" trend={-3} />
        <StatCard icon={Zap} label="Streak" value={`${user?.streak} Days`} sub="Don't break it!" color="#ef4444" />
      </div>

      {/* Overall Progress Bar */}
      <div style={{
        background: 'var(--navy-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '20px 24px', marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>Overall Preparation Progress</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {totalAttempted} of {totalQuestions} questions completed across all subjects
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800' }} className="gradient-text">{completionPct}%</div>
        </div>
        <div className="progress-bar" style={{ height: '10px' }}>
          <div
            className="progress-fill"
            style={{ width: progressAnimated ? `${completionPct}%` : '0%' }}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Weekly Activity */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>Weekly Activity</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Questions solved this week</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="qGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="questions" stroke="#7c3aed" strokeWidth={2} fill="url(#qGrad)" name="questions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Performance Radar */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>Subject Accuracy Radar</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Performance across all subjects</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={subjectPerformance.slice(0, 7)}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Accuracy Bar Chart */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>Subject-Wise Accuracy</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Compare your accuracy across all subjects</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={subjectPerformance} barSize={28}>
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="accuracy" name="accuracy" fill="#7c3aed" radius={[6, 6, 0, 0]}
              label={{ position: 'top', fill: 'var(--text-muted)', fontSize: 11, formatter: (v) => `${v}%` }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section: Weak/Strong + Recent + Mock Tests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Weak Chapters */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <XCircle size={16} color="#ef4444" />
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Focus Areas</div>
          </div>
          {weakSubjects.map((s) => (
            <Link key={s.id} to={`/subjects/${s.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{s.shortName}</span>
                  <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>{s.accuracy}%</span>
                </div>
                <div className="progress-bar" style={{ height: '5px' }}>
                  <div style={{ width: `${s.accuracy}%`, height: '100%', borderRadius: '999px', background: '#ef4444' }} />
                </div>
              </div>
            </Link>
          ))}
          <Link to="/subjects" style={{ fontSize: '13px', color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            Practice now <ArrowRight size={12} />
          </Link>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={16} color="#06b6d4" />
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Recent Activity</div>
          </div>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {a.type === 'quiz' ? `${a.subject} - ${a.chapter}` :
                    a.type === 'pyq' ? `PYQ ${a.year}` :
                      a.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {a.score}/{a.total} • {a.time}
                </div>
              </div>
              <div style={{
                fontSize: '12px', fontWeight: '700',
                color: (a.score / a.total) >= 0.8 ? '#10b981' : (a.score / a.total) >= 0.6 ? '#f59e0b' : '#ef4444',
              }}>
                {Math.round((a.score / a.total) * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Mocks */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={16} color="#f59e0b" />
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Upcoming Tests</div>
          </div>
          {mockTests.filter(m => m.status !== 'completed').slice(0, 3).map((m) => (
            <Link key={m.id} to="/mock-tests" style={{ textDecoration: 'none' }}>
              <div style={{
                marginBottom: '12px', padding: '12px', borderRadius: '10px',
                background: 'var(--glass)', border: '1px solid var(--border)', cursor: 'pointer',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{m.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.totalQuestions}Q • {m.duration}min</div>
                  <span className={`badge ${m.status === 'upcoming' ? 'badge-medium' : 'badge-easy'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {m.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <Link to="/mock-tests" style={{ fontSize: '13px', color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all tests <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Continue Learning */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>Continue Learning</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pick up where you left off</div>
          </div>
          <Link to="/subjects" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '7px 16px' }}>View All</button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {subjects.filter(s => s.attempted > 0 && s.attempted < s.totalQuestions).slice(0, 4).map((s) => (
            <Link key={s.id} to={`/subjects/${s.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '16px', borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--glass)', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', color: s.color, fontWeight: '700',
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.shortName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.attempted}/{s.totalQuestions} solved</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round((s.attempted / s.totalQuestions) * 100)}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.round((s.attempted / s.totalQuestions) * 100)}% complete</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: s.color }}>{s.accuracy}% acc</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
