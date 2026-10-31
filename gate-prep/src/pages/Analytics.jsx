import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { TrendingUp, Target, CheckCircle, Clock, BookOpen, Award } from 'lucide-react';
import { subjects, weeklyProgress, monthlyProgress, subjectPerformance } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#7c3aed', fontSize: '13px', fontWeight: '600' }}>
            {p.name}: {p.value}{p.name?.includes('accuracy') || p.name === 'Accuracy' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const weakChapters = subjects.flatMap(s =>
    s.chapters.filter(c => c.attempted > 0 && c.accuracy < 70).map(c => ({
      ...c, subjectName: s.shortName, subjectColor: s.color,
    }))
  ).sort((a, b) => a.accuracy - b.accuracy).slice(0, 6);

  const strongChapters = subjects.flatMap(s =>
    s.chapters.filter(c => c.attempted > 0 && c.accuracy >= 80).map(c => ({
      ...c, subjectName: s.shortName, subjectColor: s.color,
    }))
  ).sort((a, b) => b.accuracy - a.accuracy).slice(0, 6);

  const totalAttempted = subjects.reduce((a, s) => a + s.attempted, 0);
  const totalQuestions = subjects.reduce((a, s) => a + s.totalQuestions, 0);
  const overallAccuracy = Math.round(subjects.reduce((a, s) => a + (s.accuracy * s.attempted), 0) / totalAttempted);

  const subjectData = subjects.map(s => ({
    name: s.shortName,
    accuracy: s.accuracy,
    completion: Math.round((s.attempted / s.totalQuestions) * 100),
    attempted: s.attempted,
  }));

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Performance Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Track your preparation progress and identify areas for improvement
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: Target, label: 'Overall Accuracy', value: `${overallAccuracy}%`, color: '#7c3aed', sub: 'Across all subjects' },
          { icon: CheckCircle, label: 'Questions Solved', value: totalAttempted.toLocaleString(), color: '#10b981', sub: `of ${totalQuestions.toLocaleString()} total` },
          { icon: TrendingUp, label: 'Improvement', value: '+11%', color: '#06b6d4', sub: 'Last 30 days' },
          { icon: Clock, label: 'Avg Time/Question', value: '2.4 min', color: '#f59e0b', sub: 'All time average' },
          { icon: Award, label: 'Mock Test Avg', value: '74%', color: '#ef4444', sub: 'From 3 attempts' },
          { icon: BookOpen, label: 'Subjects Covered', value: `${subjects.filter(s => s.attempted > 0).length}/${subjects.length}`, color: '#8b5cf6', sub: 'With practice' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: m.color, marginBottom: '4px' }}>{m.value}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{m.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Monthly Progress */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Monthly Progress</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Questions solved & mock score trend</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyProgress}>
              <defs>
                <linearGradient id="qGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="questions" stroke="#7c3aed" strokeWidth={2} fill="url(#qGrad2)" name="questions" />
              <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} fill="url(#scoreGrad)" name="score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Accuracy */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Weekly Accuracy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily accuracy for this week</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Accuracy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Comparison */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>Subject-Wise Performance</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Accuracy vs completion percentage</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectData} barSize={20}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="accuracy" name="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completion" name="completion" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7c3aed' }} />Accuracy %
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06b6d4' }} />Completion %
          </div>
        </div>
      </div>

      {/* Weak & Strong */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Weak Chapters */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: '#ef4444' }}>🔴 Weak Areas</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Chapters needing improvement (accuracy &lt; 70%)</div>
          {weakChapters.map(ch => (
            <div key={ch.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{ch.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{ch.subjectName}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>{ch.accuracy}%</span>
              </div>
              <div className="progress-bar" style={{ height: '5px' }}>
                <div style={{ width: `${ch.accuracy}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Strong Chapters */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: '#10b981' }}>🟢 Strong Areas</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Your best performing chapters (accuracy ≥ 80%)</div>
          {strongChapters.map(ch => (
            <div key={ch.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{ch.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{ch.subjectName}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{ch.accuracy}%</span>
              </div>
              <div className="progress-bar" style={{ height: '5px' }}>
                <div style={{ width: `${ch.accuracy}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Table */}
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Subject Performance Table</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Subject', 'Attempted', 'Total', 'Completion', 'Accuracy', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => {
                const completion = Math.round((s.attempted / s.totalQuestions) * 100);
                const status = completion >= 80 ? '🟢 On Track' : completion >= 40 ? '🟡 In Progress' : '🔴 Needs Attention';
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.shortName}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.attempted}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.totalQuestions}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px', height: '5px' }}>
                          <div style={{ width: `${completion}%`, height: '100%', borderRadius: '999px', background: s.color }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{completion}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: s.accuracy >= 75 ? '#10b981' : s.accuracy >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {s.accuracy}%
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
