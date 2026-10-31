import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Flag, Clock, AlertTriangle,
  CheckCircle, Circle, BookmarkPlus, Send, X,
} from 'lucide-react';
import { subjects, sampleQuestions } from '../data/mockData';
import { useApp } from '../context/AppContext';

const QUESTION_STATUS = { UNATTEMPTED: 'unattempted', ANSWERED: 'answered', MARKED: 'marked', MARKED_ANSWERED: 'marked_answered' };

// Quiz Configuration Screen
function QuizConfig({ onStart }) {
  const [searchParams] = useSearchParams();
  const preSubject = searchParams.get('subject') || '';
  const preChapter = searchParams.get('chapter') || '';

  const [config, setConfig] = useState({
    subject: preSubject,
    chapter: preChapter,
    difficulty: 'All',
    count: 10,
    type: 'All',
  });

  const selectedSubject = subjects.find(s => s.id === config.subject);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Configure Quiz</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Set up your practice session</p>
      </div>

      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
        {/* Subject */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Subject
          </label>
          <select
            className="input-field"
            value={config.subject}
            onChange={e => setConfig({ ...config, subject: e.target.value, chapter: '' })}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Chapter */}
        {selectedSubject && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Chapter
            </label>
            <select
              className="input-field"
              value={config.chapter}
              onChange={e => setConfig({ ...config, chapter: e.target.value })}
            >
              <option value="">All Chapters</option>
              {selectedSubject.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {/* Difficulty */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Difficulty
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setConfig({ ...config, difficulty: d })}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: '600', fontSize: '13px',
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: config.difficulty === d ? 'var(--purple)' : 'var(--border)',
                  background: config.difficulty === d ? 'rgba(124,58,237,0.1)' : 'var(--glass)',
                  color: config.difficulty === d ? 'var(--purple-light)' : 'var(--text-secondary)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Number of Questions
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[5, 10, 20, 30].map(n => (
              <button
                key={n}
                onClick={() => setConfig({ ...config, count: n })}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: '700', fontSize: '15px',
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: config.count === n ? 'var(--purple)' : 'var(--border)',
                  background: config.count === n ? 'rgba(124,58,237,0.1)' : 'var(--glass)',
                  color: config.count === n ? 'var(--purple-light)' : 'var(--text-secondary)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Question Type
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'MCQ', 'MSQ', 'NAT'].map(t => (
              <button
                key={t}
                onClick={() => setConfig({ ...config, type: t })}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: '600', fontSize: '13px',
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: config.type === t ? 'var(--purple)' : 'var(--border)',
                  background: config.type === t ? 'rgba(124,58,237,0.1)' : 'var(--glass)',
                  color: config.type === t ? 'var(--purple-light)' : 'var(--text-secondary)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }} onClick={() => onStart(config)}>
          Start Quiz →
        </button>
      </div>
    </div>
  );
}

// Timer Component
function Timer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(interval); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining < 120;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
      borderRadius: '10px', border: `1.5px solid ${isUrgent ? '#ef4444' : 'var(--border)'}`,
      background: isUrgent ? 'rgba(239,68,68,0.1)' : 'var(--glass)',
      color: isUrgent ? '#ef4444' : 'var(--text-primary)',
      animation: isUrgent && remaining < 30 ? 'pulse-glow 1s infinite' : 'none',
    }}>
      <Clock size={16} color={isUrgent ? '#ef4444' : 'var(--text-secondary)'} />
      <span style={{ fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', fontSize: '16px' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

// Main Quiz Component
function QuizSession({ questions, config, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [statuses, setStatuses] = useState({});
  const [natInput, setNatInput] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const navigate = useNavigate();
  const { addWrongAnswer, addQuizResult } = useApp();

  const currentQ = questions[currentIdx];

  useEffect(() => {
    const existing = answers[currentQ?.id];
    setNatInput(currentQ?.type === 'NAT' && existing !== undefined ? String(existing) : '');
  }, [currentIdx, currentQ?.id]);

  const selectAnswer = useCallback((qId, value, type) => {
    setAnswers(prev => {
      if (type === 'MSQ') {
        const existing = prev[qId] || [];
        const updated = existing.includes(value) ? existing.filter(v => v !== value) : [...existing, value];
        return { ...prev, [qId]: updated };
      }
      return { ...prev, [qId]: value };
    });
    setStatuses(prev => ({
      ...prev,
      [qId]: prev[qId] === QUESTION_STATUS.MARKED ? QUESTION_STATUS.MARKED_ANSWERED : QUESTION_STATUS.ANSWERED,
    }));
  }, []);

  const toggleMark = () => {
    const qId = currentQ.id;
    setStatuses(prev => {
      const current = prev[qId] || QUESTION_STATUS.UNATTEMPTED;
      const hasAnswer = answers[qId] !== undefined;
      if (current === QUESTION_STATUS.MARKED || current === QUESTION_STATUS.MARKED_ANSWERED) {
        return { ...prev, [qId]: hasAnswer ? QUESTION_STATUS.ANSWERED : QUESTION_STATUS.UNATTEMPTED };
      }
      return { ...prev, [qId]: hasAnswer ? QUESTION_STATUS.MARKED_ANSWERED : QUESTION_STATUS.MARKED };
    });
  };

  const handleNATSubmit = () => {
    if (natInput !== '') {
      selectAnswer(currentQ.id, parseFloat(natInput), 'NAT');
    }
  };

  const submitQuiz = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    let correct = 0, incorrect = 0, unattempted = 0;
    let totalMarks = 0, negativeMarks = 0;

    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0)) {
        unattempted++;
        return;
      }
      let isCorrect = false;
      if (q.type === 'MCQ' || q.type === 'NAT') {
        isCorrect = ans === q.correctAnswer || (q.type === 'NAT' && Math.abs(ans - q.correctAnswer) < 0.01);
      } else if (q.type === 'MSQ') {
        isCorrect = Array.isArray(ans) && Array.isArray(q.correctAnswer) &&
          ans.length === q.correctAnswer.length && ans.every(a => q.correctAnswer.includes(a));
      }

      if (isCorrect) { correct++; totalMarks += q.marks; }
      else { incorrect++; negativeMarks += (q.negativeMarks || 0); if (q.type === 'MCQ') addWrongAnswer(q.id); }
    });

    const result = {
      id: `quiz_${Date.now()}`,
      config,
      questions,
      answers,
      correct, incorrect, unattempted,
      totalMarks: Math.max(0, totalMarks - negativeMarks),
      maxMarks: questions.reduce((a, q) => a + q.marks, 0),
      timeTaken,
      date: new Date().toISOString(),
    };

    addQuizResult(result);
    navigate('/quiz-result', { state: { result } });
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(statuses).filter(s => s === QUESTION_STATUS.MARKED || s === QUESTION_STATUS.MARKED_ANSWERED).length;

  return (
    <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Main Quiz Area */}
      <div style={{ flex: 1 }}>
        {/* Quiz Header */}
        <div style={{
          background: 'var(--navy-card)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {questions.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentQ.type} • {currentQ.difficulty} • {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
              {currentQ.negativeMarks > 0 && ` • -${currentQ.negativeMarks} negative`}
            </div>
          </div>
          <Timer seconds={config.count * 120} onExpire={submitQuiz} />
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: '16px', height: '4px' }}>
          <div className="progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', marginBottom: '16px' }}>
          {/* Type badge */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className={`badge badge-${currentQ.difficulty.toLowerCase()}`}>{currentQ.difficulty}</span>
            <span className="badge badge-cyan">{currentQ.type}</span>
            {currentQ.year && <span className="badge badge-purple">GATE {currentQ.year}</span>}
          </div>

          <div style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '24px', whiteSpace: 'pre-line' }}>
            {currentQ.question}
          </div>

          {/* MCQ Options */}
          {currentQ.type === 'MCQ' && currentQ.options.map((opt, idx) => (
            <div
              key={idx}
              className={`quiz-option ${answers[currentQ.id] === idx ? 'selected' : ''}`}
              onClick={() => selectAnswer(currentQ.id, idx, 'MCQ')}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${answers[currentQ.id] === idx ? 'var(--purple)' : 'var(--border)'}`,
                background: answers[currentQ.id] === idx ? 'var(--purple)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: answers[currentQ.id] === idx ? 'white' : 'var(--text-muted)',
                fontSize: '13px', fontWeight: '700', transition: 'all 0.2s',
              }}>
                {answers[currentQ.id] === idx ? <CheckCircle size={14} /> : String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{opt}</span>
            </div>
          ))}

          {/* MSQ Options */}
          {currentQ.type === 'MSQ' && (
            <>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                ℹ️ Select all correct options
              </div>
              {currentQ.options.map((opt, idx) => {
                const selected = (answers[currentQ.id] || []).includes(idx);
                return (
                  <div
                    key={idx}
                    className={`quiz-option ${selected ? 'selected' : ''}`}
                    onClick={() => selectAnswer(currentQ.id, idx, 'MSQ')}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '5px', flexShrink: 0,
                      border: `2px solid ${selected ? 'var(--purple)' : 'var(--border)'}`,
                      background: selected ? 'var(--purple)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                    }}>
                      {selected && <CheckCircle size={12} color="white" />}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{opt}</span>
                  </div>
                );
              })}
            </>
          )}

          {/* NAT Input */}
          {currentQ.type === 'NAT' && (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                ℹ️ Enter your numerical answer (up to 2 decimal places)
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Enter numerical answer..."
                  value={natInput}
                  onChange={e => setNatInput(e.target.value)}
                  style={{ maxWidth: '240px', fontFamily: 'JetBrains Mono, monospace', fontSize: '16px' }}
                  onKeyDown={e => e.key === 'Enter' && handleNATSubmit()}
                />
                <button className="btn-primary" onClick={handleNATSubmit} style={{ whiteSpace: 'nowrap' }}>
                  Confirm Answer
                </button>
                {answers[currentQ.id] !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '13px' }}>
                    <CheckCircle size={14} /> Answered: {answers[currentQ.id]}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: currentIdx === 0 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <button
            onClick={toggleMark}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
              borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              border: '1.5px solid',
              borderColor: statuses[currentQ.id]?.includes('marked') ? '#f59e0b' : 'var(--border)',
              background: statuses[currentQ.id]?.includes('marked') ? 'rgba(245,158,11,0.1)' : 'var(--glass)',
              color: statuses[currentQ.id]?.includes('marked') ? '#f59e0b' : 'var(--text-secondary)',
            }}
          >
            <Flag size={14} /> Mark for Review
          </button>

          {currentIdx === questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setShowSubmitModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={16} /> Submit Quiz
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Sidebar */}
      <div style={{ width: '240px', flexShrink: 0 }}>
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', position: 'sticky', top: '20px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>Question Palette</div>

          {/* Legend */}
          {[
            { label: 'Current', color: 'var(--purple)', bg: 'rgba(124,58,237,0.2)' },
            { label: 'Answered', color: '#10b981', bg: 'rgba(16,185,129,0.2)' },
            { label: 'Marked', color: '#f59e0b', bg: 'rgba(245,158,11,0.2)' },
            { label: 'Not visited', color: 'var(--text-muted)', bg: 'var(--glass)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: item.bg, border: `1.5px solid ${item.color}` }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {questions.map((q, idx) => {
              const status = statuses[q.id] || QUESTION_STATUS.UNATTEMPTED;
              const isAnswered = answers[q.id] !== undefined;
              const isMarked = status === QUESTION_STATUS.MARKED || status === QUESTION_STATUS.MARKED_ANSWERED;
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  className={`q-palette-btn ${isCurrent ? 'current' : isMarked && isAnswered ? 'marked-answered' : isMarked ? 'marked' : isAnswered ? 'answered' : ''}`}
                  onClick={() => setCurrentIdx(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />

          {/* Summary */}
          <div style={{ fontSize: '12px' }}>
            {[
              { label: 'Answered', value: answeredCount, color: '#10b981' },
              { label: 'Unanswered', value: questions.length - answeredCount, color: 'var(--text-muted)' },
              { label: 'Marked', value: markedCount, color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                <span style={{ fontWeight: '700', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <button
            className="btn-danger"
            onClick={() => setShowSubmitModal(true)}
            style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Send size={14} /> Submit
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Submit Quiz?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
                {questions.length - answeredCount > 0 && ` ${questions.length - answeredCount} questions are unattempted.`}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Answered', value: answeredCount, color: '#10b981' },
                { label: 'Unattempted', value: questions.length - answeredCount, color: '#f59e0b' },
                { label: 'Marked', value: markedCount, color: 'var(--purple-light)' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setShowSubmitModal(false)} style={{ flex: 1 }}>
                Continue Quiz
              </button>
              <button className="btn-primary" onClick={submitQuiz} style={{ flex: 1 }}>
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const [quizConfig, setQuizConfig] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleStart = (config) => {
    // Filter and generate questions
    let filtered = [...sampleQuestions];
    if (config.subject) filtered = filtered.filter(q => q.subject === config.subject);
    if (config.chapter) filtered = filtered.filter(q => q.chapter === config.chapter);
    if (config.difficulty !== 'All') filtered = filtered.filter(q => q.difficulty === config.difficulty);
    if (config.type !== 'All') filtered = filtered.filter(q => q.type === config.type);

    // Shuffle and pick
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, config.count);

    // If not enough real questions, repeat/pad
    while (selected.length < config.count && sampleQuestions.length > 0) {
      const extra = sampleQuestions[selected.length % sampleQuestions.length];
      selected.push({ ...extra, id: `${extra.id}_${selected.length}` });
    }

    setQuestions(selected);
    setQuizConfig(config);
  };

  if (!quizConfig) {
    return <QuizConfig onStart={handleStart} />;
  }

  return <QuizSession questions={questions} config={quizConfig} />;
}
