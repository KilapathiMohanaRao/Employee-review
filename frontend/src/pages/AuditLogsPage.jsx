import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../services/api';
import { Clock, Shield, Search } from '../components/common/Icons';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await auditLogApi.getRecent();
      if (res.data) setLogs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.entityName?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q) ||
      l.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Compliance &amp; Governance Audit Trail
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Immutable chronological logging of all assessment submissions, cycle transitions, and access events.
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: '380px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Filter audit logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.2rem' }}
        />
        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={16} />
        </span>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Details</th>
              <th>User</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                </td>
                <td>
                  <span className="badge badge-primary">{log.action}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{log.entityName}</td>
                <td>#{log.entityId || '—'}</td>
                <td style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>{log.details}</td>
                <td style={{ fontWeight: 600 }}>{log.username || 'System'}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
