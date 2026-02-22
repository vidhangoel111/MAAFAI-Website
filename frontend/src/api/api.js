const API_BASE = '/api';

function request(path, options = {}) {
  const url = path.startsWith('/') ? `${API_BASE}${path}` : path;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }).then(async (res) => {
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      if (text.trim().startsWith('<')) {
        throw new Error('Server unavailable. Please ensure the backend is running (npm start in backend folder).');
      }
      throw new Error('Invalid server response');
    }
    if (!res.ok) {
      throw new Error(typeof data === 'object' && data.message ? data.message : 'Request failed');
    }
    return data;
  });
}

export const studentApi = {
  registerRequest: (name, email, password) =>
    request('/student/register-request', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email, password) =>
    request('/student/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
};

export const adminApi = {
  login: (email, password) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  getPendingRequests: (token) =>
    request('/admin/pending-requests', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  approveStudent: (token, studentId) =>
    request('/admin/approve-student', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId })
    }),

  rejectStudent: (token, studentId) =>
    request('/admin/reject-student', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId })
    }),

  getStudents: (token) =>
    request('/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getBatches: (token) =>
    request('/admin/batches', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  createBatch: (token, name, coachId) =>
    request('/admin/create-batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, coachId })
    }),

  deleteBatch: (token, batchId) =>
    request('/admin/delete-batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ batchId })
    }),

  deleteStudent: (token, studentId) =>
    request('/admin/delete-student', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId })
    }),

  assignStudent: (token, studentId, batchId) =>
    request('/admin/assign-student', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, batchId })
    }),

  uploadImage: (token, formData) =>
    fetch('/api/upload-image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }).then(async (res) => {
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data;
    }),

  getImages: () => request('/images'),

  updateContent: (token, content) =>
    request('/admin/update-content', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(content)
    })
};

export const galleryApi = {
  getImages: () => request('/images')
};

export const contentApi = {
  getContent: () => request('/content')
};
