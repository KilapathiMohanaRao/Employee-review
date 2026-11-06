import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/feedback')) {
        console.warn(`Authentication rejected (HTTP ${status}). Redirecting to login.`);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    const errObj = new Error(serverMessage);
    errObj.response = error.response;
    errObj.data = error.response?.data;
    errObj.status = status;
    return Promise.reject(errObj);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const employeeApi = {
  getAll: () => api.get('/employees'),
  search: (params) => api.get('/employees/search', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getDirectReports: (id) => api.get(`/employees/${id}/direct-reports`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const departmentApi = {
  getDepartments: () => api.get('/departments'),
  createDepartment: (data) => api.post('/departments', data),
  getDesignations: () => api.get('/designations'),
  createDesignation: (data) => api.post('/designations', data),
};

export const competencyApi = {
  getAll: () => api.get('/competencies'),
  getById: (id) => api.get(`/competencies/${id}`),
  create: (data) => api.post('/competencies', data),
  update: (id, data) => api.put(`/competencies/${id}`, data),
  addBehaviour: (id, data) => api.post(`/competencies/${id}/behaviours`, data),
};

export const cycleApi = {
  getAll: () => api.get('/assessment-cycles'),
  getById: (id) => api.get(`/assessment-cycles/${id}`),
  create: (data) => api.post('/assessment-cycles', data),
  launch: (id) => api.post(`/assessment-cycles/${id}/launch`),
  close: (id) => api.post(`/assessment-cycles/${id}/close`),
  publish: (id) => api.post(`/assessment-cycles/${id}/publish`),
};

export const assessmentApi = {
  getMyAssignments: (reviewerEmployeeId) =>
    api.get('/assessments/my-assignments', { params: { reviewerEmployeeId } }),
  getByRelationship: (relationshipId) =>
    api.get(`/assessments/relationship/${relationshipId}`),
  saveDraft: (id, data) => api.post(`/assessments/${id}/draft`, data),
  submit: (id, data) => api.post(`/assessments/${id}/submit`, data),
  reopen: (id) => api.post(`/assessments/${id}/reopen`),
  assignReviewer: (assignmentId, data) =>
    api.post(`/assessments/assignments/${assignmentId}/reviewers`, data),
};

export const reportApi = {
  getEmployee360: (employeeId, cycleId) =>
    api.get(`/reports/employee/${employeeId}`, { params: { cycleId } }),
  getTopStrengths: (assignmentId) =>
    api.get(`/reports/assignment/${assignmentId}/strengths`),
  getTopDevelopmentAreas: (assignmentId) =>
    api.get(`/reports/assignment/${assignmentId}/development-areas`),
  getBlindSpots: (assignmentId) =>
    api.get(`/reports/assignment/${assignmentId}/blind-spots`),
  getHiddenStrengths: (assignmentId) =>
    api.get(`/reports/assignment/${assignmentId}/hidden-strengths`),
};

export const analyticsApi = {
  getDashboardMetrics: () => api.get('/analytics/dashboard'),
  getRadarData: (employeeId, cycleId) =>
    api.get(`/analytics/radar/${employeeId}`, { params: { cycleId } }),
  getHeatmap: () => api.get('/analytics/heatmap'),
  getTalentMatrix: () => api.get('/analytics/talent-matrix'),
  getScoreboard: (employeeId) => api.get(`/analytics/scoreboard/${employeeId}`),
};

export const idpApi = {
  getMyPlans: (employeeId) => api.get('/development-plans', { params: { employeeId } }),
  getEmployeePlans: (employeeId) => api.get(`/development-plans/employee/${employeeId}`),
  getTeamPlans: (managerId) => api.get(`/development-plans/team/${managerId}`),
  getById: (id) => api.get(`/development-plans/${id}`),
  create: (data) => api.post('/development-plans', data),
  addCheckin: (id, data) => api.post(`/development-plans/${id}/checkins`, data),
};

export const notificationApi = {
  getAll: (userId) => api.get('/notifications', { params: { userId } }),
  getUnreadCount: (userId) => api.get('/notifications/unread-count', { params: { userId } }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put('/notifications/read-all', { params: { userId } }),
};

export const auditLogApi = {
  getRecent: () => api.get('/audit-logs'),
  getPaged: (params) => api.get('/audit-logs/paged', { params }),
};

export const reviewApi = {
  getFormData: (evaluateeId) => api.get('/reviews/form-data', { params: { evaluateeId } }),
  submit: (data) => api.post('/reviews/submit', data),
};

export const adminReviewApi = {
  getAll: (params) => api.get('/admin/reviews', { params }),
  getSummary: () => api.get('/admin/reviews/summary'),
  getById: (id) => api.get(`/admin/reviews/${id}`),
  generateLink: (data) => api.post('/admin/reviews/generate-link', data),
};

// --- ADMIN 360 REVIEW AND FEEDBACK MANAGEMENT SYSTEM APIs ---

export const feedbackApi = {
  getForm: (token) => api.get('/feedback/form', { params: { token } }),
  submit: (data) => api.post('/feedback/submit', data),
};

export const adminFeedbackApi = {
  getDashboard: () => api.get('/admin/feedback/dashboard'),
  getCampaign: () => api.get('/admin/feedback/campaign'),
  updateCampaign: (data) => api.put('/admin/feedback/campaign', data),
  getQuestions: () => api.get('/admin/feedback/questions'),
  addQuestion: (data) => api.post('/admin/feedback/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/feedback/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/feedback/questions/${id}`),
  getInvitations: (params) => api.get('/admin/feedback/invitations', { params }),
  sendInvitation: (data) => api.post('/admin/feedback/invitations', data),
  sendBulkInvitations: (data) => api.post('/admin/feedback/invitations/bulk', data),
  resendInvitation: (id) => api.post(`/admin/feedback/invitations/${id}/resend`),
  retryInvitation: (id) => api.post(`/admin/feedback/invitations/${id}/retry`),
  deleteInvitation: (id) => api.delete(`/admin/feedback/invitations/${id}`),
  getSubmissions: (params) => api.get('/admin/feedback/submissions', { params }),
  getSubmissionById: (id) => api.get(`/admin/feedback/submissions/${id}`),
  getAnalytics: () => api.get('/admin/feedback/analytics'),
  exportCsvUrl: '/api/admin/feedback/export/csv',
  getEmailLogs: () => api.get('/admin/feedback/email/logs'),
  getSmtpConfig: () => api.get('/admin/feedback/email/config'),
  saveSmtpConfig: (data) => api.post('/admin/feedback/email/config', data),
  sendTestEmail: (email) => api.post('/admin/feedback/email/test', { email }),
  resetDemoData: () => api.post('/admin/feedback/reset-demo-data'),
};

export default api;
