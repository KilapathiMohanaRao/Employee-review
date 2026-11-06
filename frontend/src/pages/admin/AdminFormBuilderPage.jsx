import React, { useState, useEffect } from 'react';
import { adminFeedbackApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Star,
  Shield,
  X,
} from '../../components/common/Icons';

export const AdminFormBuilderPage = () => {
  const { user } = useAuth();
  const adminName = user?.fullName || 'Mohan Kilaparthi';
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [notification, setNotification] = useState('');

  // Form input state for adding/editing question
  const [categoryName, setCategoryName] = useState('Leadership Skills');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('RATING');
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [sortOrder, setSortOrder] = useState(1);

  const defaultCategories = [
    'Leadership Skills',
    'Communication Skills',
    'Technical Knowledge',
    'Problem-Solving Skills',
    'Team Collaboration',
    'Decision-Making Skills',
    'Professional Behaviour',
    'Overall Performance',
    'Strategic Impact',
    'Coaching & Mentorship',
  ];

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await adminFeedbackApi.getQuestions();
      if (res && res.data) {
        setQuestions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setCategoryName('Leadership Skills');
    setQuestionText('');
    setQuestionType('RATING');
    setMinRating(1);
    setMaxRating(5);
    setSortOrder(questions.length + 1);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setCategoryName(q.categoryName);
    setQuestionText(q.questionText);
    setQuestionType(q.questionType || 'RATING');
    setMinRating(q.minRating || 1);
    setMaxRating(q.maxRating || 5);
    setSortOrder(q.sortOrder || 1);
    setShowAddModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const payload = {
      categoryName: categoryName.trim(),
      questionText: questionText.trim(),
      questionType,
      minRating: Number(minRating),
      maxRating: Number(maxRating),
      sortOrder: Number(sortOrder),
      required: true,
    };

    try {
      if (editingQuestion) {
        await adminFeedbackApi.updateQuestion(editingQuestion.id, payload);
        setNotification('Question updated successfully!');
      } else {
        await adminFeedbackApi.addQuestion(payload);
        setNotification('New question added to feedback form!');
      }
      setShowAddModal(false);
      loadQuestions();
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to save question.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to remove this feedback question?')) return;
    try {
      await adminFeedbackApi.deleteQuestion(id);
      setNotification('Question removed from active form.');
      loadQuestions();
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to delete question.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        className="glastic-header-banner"
        style={{
          padding: '2rem',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Form Builder
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Configuring Questions Evaluating: <strong>{adminName} (Admin)</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Create &amp; Customize Feedback Form
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            Configure the 360-degree questions and rating criteria that all invited reviewers (managers, peers, direct reports, HR) will answer about you.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Eye size={16} />
            <span>Preview Form as Reviewer</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
            }}
          >
            <Plus size={16} />
            <span>Add Feedback Question</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Questions List Card */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Active Feedback Questions ({questions.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              All questions evaluate the Admin across standard leadership and operational capabilities.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
            <div>Loading questions...</div>
          </div>
        ) : questions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No questions defined. Click "Add Feedback Question" to begin.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.15rem 1.25rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {q.categoryName}
                      </span>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>
                        Scale: {q.minRating}–{q.maxRating} ★
                      </span>
                    </div>
                    <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {q.questionText}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.775rem', padding: '0.4rem 0.65rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    title="Remove question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Add / Edit Question Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.25rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              borderRadius: '16px',
              border: '1.5px solid var(--primary)',
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {editingQuestion ? 'Edit Feedback Question' : 'Add New Feedback Question'}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Competency / Category:
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-select"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Question / Evaluation Statement (Evaluating {adminName}):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Communicates strategic engineering decisions transparently and aligns cross-functional priorities effectively."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Rating Scale:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="1 (Poor) to 5 (Role Model)"
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.8rem', background: 'var(--bg-tertiary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Display Sort Order:
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontWeight: 800 }}>
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Form Preview Modal */}
      {showPreviewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.25rem',
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '2px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  Reviewer Form Live Preview
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  360° Review &amp; Feedback on {adminName} (Admin)
                </h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, idx) => (
                <div key={q.id} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    #{idx + 1} · {q.categoryName}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {q.questionText}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: s === 4 ? 'var(--primary)' : 'var(--bg-card)', color: s === 4 ? '#fff' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800 }}>
                        {s} ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowPreviewModal(false)} className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
