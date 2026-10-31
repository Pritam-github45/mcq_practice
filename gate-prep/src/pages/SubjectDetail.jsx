import { useParams, Link } from 'react-router-dom';
import { subjects } from '../data/mockData';
import { ChevronLeft, Play, CheckCircle, BookOpen, Target, ChevronRight } from 'lucide-react';

const difficultyColor = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const difficultyClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <h2>Subject not found</h2>
      <Link to="/subjects" style={{ color: 'var(--purple-light)' }}>← Back to subjects</Link>
    </div>
  );

  const totalAttempted = subject.chapters.reduce((a, c) => a + c.attempted, 0);
  const completion = Math.round((totalAttempted / subject.totalQuestions) * 100);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link to="/subjects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Subjects</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>{subject.name}</span>
      </div>

      {/* Subject Header */}
      <div style={{
        background: 'var(--navy-card)', borderRadius: '20px',
        border: `1px solid ${subject.color}44`, padding: '32px',
        marginBottom: '28px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative bg */}
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: `${subject.color}12`,
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: `${subject.color}22`, border: `1px solid ${subject.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: '700', color: subject.color,
              }}>
                {subject.icon}
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{subject.name}</h1>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subject.chapters.length} chapters • {subject.totalQuestions} questions</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { label: 'Accuracy', value: `${subject.accuracy}%`, color: subject.accuracy >= 75 ? '#10b981' : '#f59e0b' },
                { label: 'Attempted', value: `${totalAttempted}/${subject.totalQuestions}` },
                { label: 'Completion', value: `${completion}%` },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: stat.color || 'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to={`/quiz?subject=${subject.id}`}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={16} /> Practice All Chapters
              </button>
            </Link>
            <Link to="/pyq">
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <BookOpen size={16} /> PYQ Practice
              </button>
            </Link>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div className="progress-bar" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}bb)` }} />
          </div>
        </div>
      </div>

      {/* Chapters */}
      <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Chapters</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {subject.chapters.map((chapter, idx) => {
          const chapterCompletion = chapter.attempted > 0 ? Math.round((chapter.attempted / chapter.questions) * 100) : 0;

          return (
            <div
              key={chapter.id}
              style={{
                background: 'var(--navy-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '20px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = subject.color; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  {/* Chapter number */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: chapter.attempted === chapter.questions ? `${subject.color}20` : 'var(--glass)',
                    border: `1px solid ${chapter.attempted === chapter.questions ? subject.color : 'var(--border)'}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    color: chapter.attempted === chapter.questions ? subject.color : 'var(--text-muted)',
                  }}>
                    {chapter.attempted === chapter.questions ? <CheckCircle size={16} /> : `${idx + 1}`}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {chapter.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className={`badge ${difficultyClass[chapter.difficulty]}`}>{chapter.difficulty}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{chapter.questions} questions</span>
                      {chapter.attempted > 0 && (
                        <span style={{ fontSize: '12px', color: difficultyColor[chapter.difficulty] }}>
                          {chapter.accuracy}% accuracy
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{chapter.attempted}/{chapter.questions}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: subject.color }}>{chapterCompletion}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: '4px' }}>
                      <div className="progress-fill" style={{ width: `${chapterCompletion}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}bb)` }} />
                    </div>
                  </div>

                  <Link to={`/quiz?subject=${subject.id}&chapter=${chapter.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Play size={13} />
                      {chapter.attempted > 0 ? 'Continue' : 'Start'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
