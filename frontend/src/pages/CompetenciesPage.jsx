import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { competencyApi } from '../services/api';
import { Shield, Plus, CheckCircle, ChevronDown, ChevronRight, Search } from '../components/common/Icons';

export const CompetenciesPage = () => {
  const { hasRole } = useAuth();
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newComp, setNewComp] = useState({
    name: '',
    code: '',
    description: '',
    category: 'LEADERSHIP',
    sortOrder: 12,
  });

  const isSuperOrHr = hasRole('SUPER_ADMIN') || hasRole('HR_ADMIN');

  useEffect(() => {
    loadCompetencies();
  }, []);

  const loadCompetencies = async () => {
    setLoading(true);
    try {
      const res = await competencyApi.getAll();
      if (res.data) setCompetencies(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetency = async (e) => {
    e.preventDefault();
    try {
      await competencyApi.create(newComp);
      setCreateModalOpen(false);
      loadCompetencies();
    } catch (err) {
      alert(err.message || 'Error creating competency');
    }
  };

  const filtered = competencies.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Configurable Competency Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            The 11 core workbook competencies and measurable behavioural indicators driving 360-degree talent assessments.
          </p>
        </div>

        {isSuperOrHr && (
          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add New Competency
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'LEADERSHIP', 'CORE', 'BEHAVIOURAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={16} />
          </span>
        </div>
      </div>

      {/* Competencies Accordion Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((c, idx) => {
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(37,99,235,0.03)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem'
                  }}>
                    {idx + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {c.name}
                      </h3>
                      <span className="badge badge-primary">{c.category}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {c.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {c.behaviours?.length || 1} {c.behaviours?.length === 1 ? 'Behavioural Indicator' : 'Behavioural Indicators'}
                  </span>
                  {isExpanded ? <ChevronDown size={18} color="var(--primary)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded Behaviour List */}
              {isExpanded && (
                <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Measurable Behavioural Indicators
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {c.behaviours?.map((b, bIdx) => (
                      <div
                        key={b.id || bIdx}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                          #{bIdx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            {b.title}
                          </div>
                          {b.description && (
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                              {b.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Competency Modal */}
      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Add New Organizational Competency
            </h2>
            <form onSubmit={handleCreateCompetency}>
              <div className="form-group">
                <label className="form-label">Competency Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. AI-Assisted Engineering"
                  value={newComp.name}
                  onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Code</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. AI_ENG"
                    value={newComp.code}
                    onChange={(e) => setNewComp({ ...newComp, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newComp.category}
                    onChange={(e) => setNewComp({ ...newComp, category: e.target.value })}
                  >
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="CORE">Core</option>
                    <option value="BEHAVIOURAL">Behavioural</option>
                    <option value="FUNCTIONAL">Functional</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  placeholder="Briefly describe the expected capability and standard..."
                  value={newComp.description}
                  onChange={(e) => setNewComp({ ...newComp, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
