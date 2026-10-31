import { useState } from 'react';
import { Search, Filter, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { sampleQuestions, subjects, gateYears } from '../data/mockData';
import { useApp } from '../context/AppContext';

const difficultyClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

function QuestionCard({ question, isExpanded, onToggle, isBookmarked, onBookmark }) {
  const subject = subjects.find(s => s.id === question.subject);

  return (
    <div style={{
      background: 'var(--navy-card)', border: '1px solid var(--border)',
      borderRadius: '14px', overflow: 'hidden', marginBottom: '12px',
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }} onClick={onToggle}>
        {/* Year badge */}
        <div style={{
          padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
          background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)',
          border: '1px solid rgba(124,58,237,0.3)', flexShrink: 0,
        }}>
          GATE {question.year}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.6' }}>
            {question.question.slice(0, 120)}{question.question.length > 120 ? '...' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${difficultyClass[question.difficulty]}`}>{question.difficulty}</span>
            <span className="badge badge-cyan">{question.type}</span>
            {subject && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subject.shortName}</span>}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{question.marks}M | -{question.negativeMarks}M</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onBookmark(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', display: 'flex', padding: '4px' }}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
          {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: '16px' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '16px', whiteSpace: 'pre-line' }}>
              {question.question}
            </p>

            {/* Options */}
            {question.type !== 'NAT' && question.options.map((opt, idx) => {
              const isCorrect = question.type === 'MSQ'
                ? Array.isArray(question.correctAnswer) && question.correctAnswer.includes(idx)
                : question.correctAnswer === idx;

              return (
                <div key={idx} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '10px 14px', borderRadius: '10px', marginBottom: '8px',
                  border: `1.5px solid ${isCorrect ? '#10b981' : 'var(--border)'}`,
                  background: isCorrect ? 'rgba(16,185,129,0.1)' : 'var(--glass)',
                }}>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: isCorrect ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span style={{ fontSize: '13px', flex: 1, color: 'var(--text-primary)' }}>{opt}</span>
                  {isCorrect && <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', flexShrink: 0 }}>✓ Correct</span>}
                </div>
              );
            })}

            {question.type === 'NAT' && (
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1.5px solid #10b981', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Correct Answer</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', fontFamily: 'JetBrains Mono' }}>{question.correctAnswer}</div>
              </div>
            )}

            {/* Explanation */}
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#06b6d4', marginBottom: '8px' }}>💡 Explanation</div>
              <div style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{question.explanation}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PYQ() {
  const { bookmarks, toggleBookmark } = useApp();
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({ year: '', subject: '', difficulty: '', type: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = sampleQuestions.filter(q => {
    if (filters.year && q.year !== parseInt(filters.year)) return false;
    if (filters.subject && q.subject !== filters.subject) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (filters.type && q.type !== filters.type) return false;
    if (filters.search && !q.question.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Previous Year Questions</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Practice GATE previous year questions with detailed explanations
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-field"
              style={{ paddingLeft: '38px' }}
              placeholder="Search questions..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button
            className="btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Filter size={14} /> Filters {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showFilters && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px',
            padding: '16px', borderRadius: '12px', background: 'var(--navy-card)', border: '1px solid var(--border)',
          }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Year</label>
              <select className="input-field" style={{ padding: '8px 12px' }} value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}>
                <option value="">All Years</option>
                {gateYears.map(y => <option key={y} value={y}>GATE {y}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Subject</label>
              <select className="input-field" style={{ padding: '8px 12px' }} value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })}>
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Difficulty</label>
              <select className="input-field" style={{ padding: '8px 12px' }} value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
                <option value="">All Levels</option>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Type</label>
              <select className="input-field" style={{ padding: '8px 12px' }} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Types</option>
                <option>MCQ</option><option>MSQ</option><option>NAT</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setFilters({ year: '', subject: '', difficulty: '', type: '', search: '' })} style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> questions
      </div>

      {/* Question list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p>No questions found matching your filters</p>
        </div>
      ) : filtered.map(q => (
        <QuestionCard
          key={q.id}
          question={q}
          isExpanded={expandedId === q.id}
          onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
          isBookmarked={bookmarks.includes(q.id)}
          onBookmark={() => toggleBookmark(q.id)}
        />
      ))}
    </div>
  );
}
