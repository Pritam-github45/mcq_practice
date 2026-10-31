import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [bookmarks, setBookmarks] = useState(['q2', 'q6']);
  const [wrongAnswers, setWrongAnswers] = useState(['q1', 'q3']);
  const [quizHistory, setQuizHistory] = useState([]);
  const [notes, setNotes] = useState([
    {
      id: 'n1', title: 'CPU Scheduling Formulas', subject: 'OS',
      content: 'Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = First CPU allocation - Arrival Time',
      createdAt: '2024-10-28', color: '#7c3aed',
    },
    {
      id: 'n2', title: 'Normalization Quick Reference', subject: 'DBMS',
      content: '1NF: Atomic values, no repeating groups\n2NF: 1NF + No partial dependency\n3NF: 2NF + No transitive dependency\nBCNF: For all X→Y, X must be superkey',
      createdAt: '2024-10-25', color: '#0891b2',
    },
    {
      id: 'n3', title: 'Big-O Complexities', subject: 'Algorithms',
      content: 'Binary Search: O(log n)\nBubble Sort: O(n²)\nMerge Sort: O(n log n)\nQuick Sort: O(n²) worst\nHeap Sort: O(n log n)',
      createdAt: '2024-10-20', color: '#059669',
    },
  ]);

  useEffect(() => {
    document.body.className = darkMode ? '' : 'light-mode';
  }, [darkMode]);

  const toggleBookmark = (questionId) => {
    setBookmarks(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const addWrongAnswer = (questionId) => {
    setWrongAnswers(prev =>
      prev.includes(questionId) ? prev : [...prev, questionId]
    );
  };

  const addNote = (note) => {
    setNotes(prev => [...prev, { ...note, id: `n${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const addQuizResult = (result) => {
    setQuizHistory(prev => [result, ...prev]);
  };

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
      user, setUser,
      isLoggedIn, login, logout,
      bookmarks, toggleBookmark,
      wrongAnswers, addWrongAnswer,
      notes, addNote, deleteNote,
      quizHistory, addQuizResult,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
