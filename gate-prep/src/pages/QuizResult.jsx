import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, MinusCircle, Clock, RotateCcw, Home, ChevronDown, ChevronUp, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { toggleBookmark } from '../context/AppContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const fmtTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

function QuestionReview({ question, userAnswer, index }) {
  const [expanded, setExpanded] = useState(false);
  const { bookmarks, toggleBookmark } = useApp();
  const isBookmarked = bookmarks.includes(question.id);

  const isCorrect = () => {
    if (question.type === 'MCQ') return userAnswer === question.correctAnswer;
    if (question.type === 'NAT') return userAnswer !== undefined && Math.abs(userAnswer - question.correctAnswer) < 0.01;
    if (question.type === 'MSQ') {
      if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer)) return false;
      return userAnswer.length === question.correctAnswer.length && userAnswer.every(a => question.correctAnswer.includes(a));
    }
    return false;
  };

  const correct = isCorrect();
  const unattempted = userAnswer === undefined || userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0);

  const statusColor = unattempted ? '#94a3b8' : correct ? '#10b981' : '#ef4444';
  const StatusIcon = unattempted ? MinusCircle : correct ? CheckCircle : XCircle;

  const getOptionLabel = (idx) => String.fromCharCode(65 + idx);

  return (
    <div style={{
      background: 'var(--navy-card)', border: `1px solid ${statusColor}44`,
      borderRadius: '14px', overflow: 'hidden', marginBottom: '12px',
    }}>
      {/* Question header */}
      <div
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <StatusIcon size={18} color={statusColor} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Q{index + 1}. {question.question.slice(0, 100)}{question.question.length > 100 ? '...' : ''}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: statusColor, fontWeight: '600' }}>
                {unattempted ? 'Not Attempted' : correct ? `+${question.marks} marks` : `-${question.negativeMarks || 0} marks`}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{question.type} • {question.difficulty}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={e => { e.stopPropagation(); toggleBookmark(question.id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', display: 'flex' }}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: '16px' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '16px', whiteSpace: 'pre-line' }}>
              {question.question}
            </p>

            {/* Options review */}
            {question.type !== 'NAT' && question.options.map((opt, idx) => {
              const isUserAnswer = question.type === 'MSQ'
                ? Array.isArray(userAnswer) && userAnswer.includes(idx)
                : userAnswer === idx;
              const isCorrectAnswer = question.type === 'MSQ'
                ? Array.isArray(question.correctAnswer) && question.correctAnswer.includes(idx)
                : question.correctAnswer === idx;

              let bgColor = 'var(--glass)';
              let borderColor = 'var(--border)';
              let label = '';

              if (isCorrectAnswer) { bgColor = 'rgba(16,185,129,0.1)'; borderColor = '#10b981'; label = '✓ Correct'; }
              if (isUserAnswer && !isCorrectAnswer) { bgColor = 'rgba(239,68,68,0.1)'; borderColor = '#ef4444'; label = '✗ Your answer'; }
              if (isUserAnswer && isCorrectAnswer) { bgColor = 'rgba(16,185,129,0.15)'; borderColor = '#10b981'; label = '✓ Your correct answer'; }

              return (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${borderColor}`, background: bgColor, marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: isCorrectAnswer ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }}>{getOptionLabel(idx)}.</span>
                  <span style={{ fontSize: '13px', flex: 1, color: 'var(--text-primary)' }}>{opt}</span>
                  {label && <span style={{ fontSize: '11px', fontWeight: '600', color: isCorrectAnswer ? '#10b981' : '#ef4444', flexShrink: 0 }}>{label}</span>}
                </div>
              );
            })}

            {/* NAT result */}
            {question.type === 'NAT' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px 20px', borderRadius: '10px', border: `1.5px solid ${correct ? '#10b981' : '#ef4444'}`, background: correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Your Answer</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: correct ? '#10b981' : '#ef4444', fontFamily: 'JetBrains Mono' }}>
                    {unattempted ? 'Not Answered' : userAnswer}
                  </div>
                </div>
                <div style={{ padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #10b981', background: 'rgba(16,185,129,0.1)', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Correct Answer</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', fontFamily: 'JetBrains Mono' }}>{question.correctAnswer}</div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#06b6d4', marginBottom: '8px' }}>💡 Explanation</div>
              <div style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{question.explanation}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  if (!state?.result) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤔</div>
        <h2 style={{ marginBottom: '16px' }}>No result found</h2>
        <Link to="/quiz"><button className="btn-primary">Start a Quiz</button></Link>
      </div>
    );
  }

  const { result } = state;
  const { correct, incorrect, unattempted, totalMarks, maxMarks, timeTaken, questions, answers } = result;
  const accuracy = questions.length > 0 ? Math.round((correct / (correct + incorrect || 1)) * 100) : 0;
  const scorePercent = Math.round((totalMarks / maxMarks) * 100);

  const pieData = [
    { name: 'Correct', value: correct, color: '#10b981' },
    { name: 'Incorrect', value: incorrect, color: '#ef4444' },
    { name: 'Unattempted', value: unattempted, color: '#64748b' },
  ];

  const grade = scorePercent >= 80 ? { label: 'Excellent', color: '#10b981', emoji: '🏆' }
    : scorePercent >= 65 ? { label: 'Good', color: '#06b6d4', emoji: '✅' }
      : scorePercent >= 50 ? { label: 'Average', color: '#f59e0b', emoji: '📈' }
        : { label: 'Needs Work', color: '#ef4444', emoji: '💪' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Result Header */}
      <div style={{
        background: 'var(--navy-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '36px', marginBottom: '24px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '56px', marginBottom: '8px' }}>{grade.emoji}</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>{grade.label}!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Quiz completed successfully</p>

          {/* Score Circle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={65} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: grade.color }}>{scorePercent}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Score</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Marks Obtained', value: `${totalMarks.toFixed(1)} / ${maxMarks}`, color: grade.color },
                { label: 'Accuracy', value: `${accuracy}%`, color: '#06b6d4' },
                { label: 'Correct', value: correct, color: '#10b981' },
                { label: 'Incorrect', value: incorrect, color: '#ef4444' },
                { label: 'Unattempted', value: unattempted, color: '#64748b' },
                { label: 'Time Taken', value: fmtTime(timeTaken), color: 'var(--text-primary)' },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '14px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            {pieData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                {item.name}: <strong style={{ color: item.color }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => navigate('/quiz')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={16} /> Retry Quiz
        </button>
        <Link to="/dashboard">
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} /> Dashboard
          </button>
        </Link>
        <Link to="/analytics">
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} /> View Analytics
          </button>
        </Link>
      </div>

      {/* Detailed Review */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Detailed Question Review</h2>
          <button className="btn-secondary" onClick={() => setShowAllQuestions(!showAllQuestions)} style={{ fontSize: '12px', padding: '7px 14px' }}>
            {showAllQuestions ? 'Show Less' : 'Show All Questions'}
          </button>
        </div>

        {questions.slice(0, showAllQuestions ? questions.length : 5).map((q, idx) => (
          <QuestionReview key={q.id} question={q} userAnswer={answers[q.id]} index={idx} />
        ))}

        {!showAllQuestions && questions.length > 5 && (
          <button
            className="btn-secondary"
            onClick={() => setShowAllQuestions(true)}
            style={{ width: '100%', padding: '12px' }}
          >
            Show {questions.length - 5} more questions
          </button>
        )}
      </div>
    </div>
  );
}
