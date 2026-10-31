import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Play, Trash2, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleQuestions, subjects } from '../data/mockData';

function BookmarkCard({ question, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const subject = subjects.find(s => s.id === question.subject);

  return (
    <div style={{ background: 'var(--navy-card)', border: '1px solid #f59e0b44', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
      <div style={{ padding: '16px 20px', display: 'flex', gap: '12px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge badge-purple">{question.type}</span>
            {subject && <span className="badge badge-cyan">{subject.shortName}</span>}
            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
            {question.year && <span className="badge badge-purple">GATE {question.year}</span>}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {question.question.slice(0, 120)}{question.question.length > 120 ? '...' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', padding: '4px' }}
            title="Remove bookmark"
          >
            <Trash2 size={15} />
          </button>
          {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-primary)', marginTop: '16px', marginBottom: '16px', whiteSpace: 'pre-line' }}>
            {question.question}
          </p>
          {question.type !== 'NAT' && question.options.map((opt, idx) => {
            const isCorrect = Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(idx)
              : question.correctAnswer === idx;
            return (
              <div key={idx} style={{
                padding: '10px 14px', borderRadius: '10px', marginBottom: '8px',
                border: `1.5px solid ${isCorrect ? '#10b981' : 'var(--border)'}`,
                background: isCorrect ? 'rgba(16,185,129,0.1)' : 'var(--glass)',
                fontSize: '13px', color: 'var(--text-primary)',
                display: 'flex', gap: '8px',
              }}>
                <span style={{ fontWeight: '700', color: isCorrect ? '#10b981' : 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
                {isCorrect && <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: '600', fontSize: '11px' }}>✓ Correct</span>}
              </div>
            );
          })}
          {question.type === 'NAT' && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1.5px solid #10b981', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Answer: </span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', fontFamily: 'JetBrains Mono' }}>{question.correctAnswer}</span>
            </div>
          )}
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', marginTop: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#06b6d4', marginBottom: '6px' }}>💡 Explanation</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{question.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useApp();
  const [filterSubject, setFilterSubject] = useState('');

  const bookmarkedQs = sampleQuestions
    .filter(q => bookmarks.includes(q.id))
    .filter(q => !filterSubject || q.subject === filterSubject);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Bookmarks</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {bookmarks.length} saved question{bookmarks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--navy-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔖</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No Bookmarks Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save important questions while practicing to review later</p>
          <Link to="/pyq"><button className="btn-primary">Browse PYQ Questions</button></Link>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="input-field"
              style={{ maxWidth: '220px', padding: '8px 12px' }}
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
            </select>
            {filterSubject && (
              <button className="btn-secondary" onClick={() => setFilterSubject('')} style={{ fontSize: '12px', padding: '7px 14px' }}>
                Clear Filter
              </button>
            )}
          </div>

          {/* Practice bookmarks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Showing {bookmarkedQs.length} question{bookmarkedQs.length !== 1 ? 's' : ''}
            </div>
            <Link to="/quiz">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Play size={14} /> Practice Bookmarked
              </button>
            </Link>
          </div>

          {bookmarkedQs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No bookmarks match the selected filter
            </div>
          ) : (
            bookmarkedQs.map(q => (
              <BookmarkCard key={q.id} question={q} onRemove={() => toggleBookmark(q.id)} />
            ))
          )}
        </>
      )}
    </div>
  );
}
