import { useState } from 'react';
import { Shield, BookOpen, Users, FileText, Plus, Pencil, Trash2, BarChart2, Database, CheckCircle } from 'lucide-react';
import { subjects, sampleQuestions } from '../data/mockData';

const tabs = [
  { key: 'overview', label: 'Overview', icon: BarChart2 },
  { key: 'questions', label: 'Questions', icon: FileText },
  { key: 'subjects', label: 'Subjects', icon: BookOpen },
  { key: 'users', label: 'Users', icon: Users },
];

const mockUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', college: 'IIT Delhi', joined: '2024-08-15', solved: 1942, accuracy: 76 },
  { id: 2, name: 'Priya Singh', email: 'priya@email.com', college: 'NIT Trichy', joined: '2024-09-01', solved: 1340, accuracy: 82 },
  { id: 3, name: 'Arjun Kumar', email: 'arjun@email.com', college: 'BITS Pilani', joined: '2024-07-20', solved: 2100, accuracy: 79 },
  { id: 4, name: 'Sneha Patel', email: 'sneha@email.com', college: 'IIT Bombay', joined: '2024-10-05', solved: 890, accuracy: 85 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQ, setNewQ] = useState({ question: '', type: 'MCQ', difficulty: 'Medium', subject: '', marks: 1, options: ['', '', '', ''], correctAnswer: 0 });
  const [questions, setQuestions] = useState([...sampleQuestions]);
  const [saved, setSaved] = useState(false);

  const handleAddQuestion = () => {
    if (!newQ.question || !newQ.subject) return;
    const q = { ...newQ, id: `q${Date.now()}`, year: new Date().getFullYear(), negativeMarks: newQ.marks === 2 ? 0.67 : 0.33, bookmarked: false, attempted: false, userAnswer: null, explanation: 'Admin added question - explanation pending.' };
    setQuestions(prev => [q, ...prev]);
    setShowAddQuestion(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setNewQ({ question: '', type: 'MCQ', difficulty: 'Medium', subject: '', marks: 1, options: ['', '', '', ''], correctAnswer: 0 });
  };

  const handleDelete = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
        border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px',
        padding: '24px 28px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} color="#8b5cf6" />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Manage questions, subjects, mock tests, and users</p>
        </div>
        {saved && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
            <CheckCircle size={16} /> Saved!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px',
              borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1.5px solid',
              borderColor: activeTab === tab.key ? 'var(--purple)' : 'var(--border)',
              background: activeTab === tab.key ? 'rgba(124,58,237,0.15)' : 'var(--glass)',
              color: activeTab === tab.key ? 'var(--purple-light)' : 'var(--text-secondary)',
            }}
          >
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Questions', value: questions.length, color: '#7c3aed', icon: FileText },
              { label: 'Total Subjects', value: subjects.length, color: '#10b981', icon: BookOpen },
              { label: 'Total Users', value: mockUsers.length, color: '#06b6d4', icon: Users },
              { label: 'Total Chapters', value: subjects.reduce((a, s) => a + s.chapters.length, 0), color: '#f59e0b', icon: Database },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Subject summary table */}
          <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Subject Overview</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Subject', 'Chapters', 'Questions', 'Avg Accuracy'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: s.color }}>{s.icon}</span> {s.shortName}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.chapters.length}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.totalQuestions}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: s.accuracy >= 75 ? '#10b981' : s.accuracy >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {s.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions Management */}
      {activeTab === 'questions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: '700' }}>Question Bank ({questions.length} questions)</div>
            <button className="btn-primary" onClick={() => setShowAddQuestion(!showAddQuestion)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Question
            </button>
          </div>

          {/* Add Question Form */}
          {showAddQuestion && (
            <div style={{ background: 'var(--navy-card)', border: '1px solid var(--purple)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Add New Question</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Subject</label>
                  <select className="input-field" style={{ padding: '8px 12px' }} value={newQ.subject} onChange={e => setNewQ({ ...newQ, subject: e.target.value })}>
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Type</label>
                  <select className="input-field" style={{ padding: '8px 12px' }} value={newQ.type} onChange={e => setNewQ({ ...newQ, type: e.target.value })}>
                    <option>MCQ</option><option>MSQ</option><option>NAT</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Difficulty</label>
                  <select className="input-field" style={{ padding: '8px 12px' }} value={newQ.difficulty} onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Question Statement</label>
                <textarea
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                  placeholder="Enter the question..."
                  value={newQ.question}
                  onChange={e => setNewQ({ ...newQ, question: e.target.value })}
                />
              </div>
              {newQ.type !== 'NAT' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Options (click radio to set correct)</label>
                  {newQ.options.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <input type="radio" name="correct" checked={newQ.correctAnswer === idx} onChange={() => setNewQ({ ...newQ, correctAnswer: idx })} style={{ flexShrink: 0, accentColor: '#7c3aed' }} />
                      <input
                        className="input-field"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={e => {
                          const opts = [...newQ.options]; opts[idx] = e.target.value;
                          setNewQ({ ...newQ, options: opts });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {newQ.type === 'NAT' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Correct Answer (numerical)</label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ maxWidth: '200px' }}
                    value={typeof newQ.correctAnswer === 'number' && !newQ.options.length ? newQ.correctAnswer : ''}
                    onChange={e => setNewQ({ ...newQ, correctAnswer: parseFloat(e.target.value) })}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={handleAddQuestion}>Save Question</button>
                <button className="btn-secondary" onClick={() => setShowAddQuestion(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Questions Table */}
          <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass)' }}>
                  {['#', 'Question', 'Type', 'Subject', 'Difficulty', 'Marks', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.slice(0, 15).map((q, idx) => {
                  const subject = subjects.find(s => s.id === q.subject);
                  return (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-primary)', maxWidth: '280px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q.question.slice(0, 60)}{q.question.length > 60 ? '...' : ''}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}><span className="badge badge-cyan">{q.type}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{subject?.shortName || '—'}</td>
                      <td style={{ padding: '12px' }}><span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700' }}>{q.marks}M</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(q.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {questions.length > 15 && (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                Showing 15 of {questions.length} questions
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subjects tab */}
      {activeTab === 'subjects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: '700' }}>Subjects ({subjects.length})</div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Subject
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {subjects.map(s => (
              <div key={s.id} style={{ background: 'var(--navy-card)', border: `1px solid ${s.color}33`, borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: s.color, fontWeight: '700' }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{s.shortName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.chapters.length} chapters • {s.totalQuestions} questions</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}><Pencil size={14} /></button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', padding: '4px' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Registered Users ({mockUsers.length})</div>
          <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass)' }}>
                  {['Name', 'Email', 'College', 'Joined', 'Questions Solved', 'Accuracy', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.college}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{u.solved.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: u.accuracy >= 75 ? '#10b981' : '#f59e0b' }}>{u.accuracy}%</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}><Pencil size={14} /></button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', padding: '4px' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
