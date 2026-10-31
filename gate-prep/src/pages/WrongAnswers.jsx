import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronDown, ChevronUp, Play, Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleQuestions, subjects } from '../data/mockData';

function WrongAnswerCard({ question, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const subject = subjects.find(s => s.id === question.subject);

  return (
    <div style={{ background: 'var(--navy-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
      <div style={{ padding: '16px 20px', display: 'flex', gap: '12px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge badge-hard">Incorrect</span>
            {subject && <span className="badge badge-cyan">{subject.shortName}</span>}
            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {question.question.slice(0, 120)}{question.question.length > 120 ? '...' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
            title="Remove from wrong answers"
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
                fontSize: '13px', display: 'flex', gap: '8px',
              }}>
                <span style={{ fontWeight: '700', color: isCorrect ? '#10b981' : 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{opt}</span>
                {isCorrect && <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: '600', fontSize: '11px' }}>✓ Correct Answer</span>}
              </div>
            );
          })}
          {question.type === 'NAT' && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1.5px solid #10b981', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Correct Answer: </span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', fontFamily: 'JetBrains Mono' }}>{question.correctAnswer}</span>
            </div>
          )}
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', marginTop: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#06b6d4', marginBottom: '6px' }}>💡 Why was this wrong?</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{question.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrongAnswers() {
  const { wrongAnswers, addWrongAnswer } = useApp();
  const [removed, setRemoved] = useState([]);

  const wrongQs = sampleQuestions.filter(q => wrongAnswers.includes(q.id) && !removed.includes(q.id));

  const handleRemove = (id) => {
    setRemoved(prev => [...prev, id]);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <AlertCircle size={24} color="#ef4444" />
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Wrong Answer Notebook</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Review questions you answered incorrectly and learn from mistakes
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Mistakes', value: wrongQs.length, color: '#ef4444' },
          { label: 'Subjects Affected', value: [...new Set(wrongQs.map(q => q.subject))].length, color: '#f59e0b' },
          { label: 'Hard Questions', value: wrongQs.filter(q => q.difficulty === 'Hard').length, color: '#7c3aed' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {wrongQs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--navy-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>All Clear!</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            No wrong answers recorded yet. Start practicing to track your mistakes.
          </p>
          <Link to="/quiz"><button className="btn-primary">Start Practicing</button></Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {wrongQs.length} questions to review
            </div>
            <Link to="/quiz">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <RotateCcw size={14} /> Retry These Questions
              </button>
            </Link>
          </div>
          {wrongQs.map(q => (
            <WrongAnswerCard key={q.id} question={q} onRemove={() => handleRemove(q.id)} />
          ))}
        </>
      )}
    </div>
  );
}
