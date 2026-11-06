import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeApi, departmentApi } from '../services/api';
import { Users, Plus, Search, Mail, Phone, ChevronRight } from '../components/common/Icons';

export const EmployeesPage = () => {
  const { hasRole } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [newEmp, setNewEmp] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    designationId: '',
    managerId: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const isSuperOrHr = hasRole('SUPER_ADMIN') || hasRole('HR_ADMIN');

  useEffect(() => {
    loadEmployees();
    departmentApi.getDepartments().then((res) => {
      if (res.data) setDepartments(res.data);
    });
    departmentApi.getDesignations().then((res) => {
      if (res.data) setDesignations(res.data);
    });
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeApi.getAll();
      if (res.data) setEmployees(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await employeeApi.create({
        ...newEmp,
        departmentId: newEmp.departmentId ? Number(newEmp.departmentId) : null,
        designationId: newEmp.designationId ? Number(newEmp.designationId) : null,
        managerId: newEmp.managerId ? Number(newEmp.managerId) : null,
      });
      setModalOpen(false);
      loadEmployees();
    } catch (err) {
      alert(err.message || 'Error creating employee');
    }
  };

  const filtered = employees.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employeeCode?.toLowerCase().includes(q) ||
      e.departmentName?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Employee Talent Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Corporate hierarchy, departmental rosters, and reporting relationships across the enterprise.
          </p>
        </div>

        {isSuperOrHr && (
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Onboard New Employee
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '380px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, email, code or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.2rem' }}
        />
        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={16} />
        </span>
      </div>

      {/* Employee Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Code</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {emp.firstName?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{emp.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{emp.employeeCode}</td>
                <td>{emp.departmentName || '—'}</td>
                <td>{emp.designationTitle || '—'}</td>
                <td>{emp.managerName || 'None (Executive)'}</td>
                <td>
                  <span className={`badge ${emp.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{emp.joiningDate || '2024-01-15'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onboard Employee Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Onboard Employee Profile
            </h2>
            <form onSubmit={handleCreateEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newEmp.firstName}
                    onChange={(e) => setNewEmp({ ...newEmp, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newEmp.lastName}
                    onChange={(e) => setNewEmp({ ...newEmp, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Employee Code</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. EMP-008"
                    value={newEmp.employeeCode}
                    onChange={(e) => setNewEmp({ ...newEmp, employeeCode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={newEmp.departmentId}
                    onChange={(e) => setNewEmp({ ...newEmp, departmentId: e.target.value })}
                  >
                    <option value="">Select department...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select
                    className="form-select"
                    value={newEmp.designationId}
                    onChange={(e) => setNewEmp({ ...newEmp, designationId: e.target.value })}
                  >
                    <option value="">Select designation...</option>
                    {designations.map((desig) => (
                      <option key={desig.id} value={desig.id}>{desig.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reporting Manager</label>
                <select
                  className="form-select"
                  value={newEmp.managerId}
                  onChange={(e) => setNewEmp({ ...newEmp, managerId: e.target.value })}
                >
                  <option value="">Select reporting manager...</option>
                  {employees.map((m) => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.designationTitle || 'Lead'})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
