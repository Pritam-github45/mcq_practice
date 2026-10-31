import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, TrendingUp, CheckCircle } from 'lucide-react';
import { subjects } from '../data/mockData';

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAll = subjects.reduce((a, s) => a + s.totalQuestions, 0);
  const attemptedAll = subjects.reduce((a, s) => a + s.attempted, 0);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>All Subjects</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {subjects.length} subjects • {attemptedAll.toLocaleString()} of {totalAll.toLocaleString()} questions attempted
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="input-field"
          style={{ paddingLeft: '38px' }}
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subject Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((subject) => {
          const completion = Math.round((subject.attempted / subject.totalQuestions) * 100);
          return (
            <Link key={subject.id} to={`/subjects/${subject.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{ padding: '24px', cursor: 'pointer', background: 'var(--navy-card)' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '14px',
                      background: `${subject.color}20`, border: `1px solid ${subject.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', fontWeight: '700', color: subject.color,
                    }}>
                      {subject.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {subject.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {subject.chapters.length} chapters
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {subject.attempted} / {subject.totalQuestions} questions
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: subject.color }}>
                      {completion}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}bb)` }} />
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: subject.accuracy >= 75 ? '#10b981' : subject.accuracy >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {subject.accuracy}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Accuracy</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {subject.totalQuestions}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Questions</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {subject.chapters.length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chapters</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
