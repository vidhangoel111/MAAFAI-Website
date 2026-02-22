import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { adminApi, contentApi } from '../api/api';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // pending | students | batches | gallery | content
  const [pending, setPending] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [batchName, setBatchName] = useState('');
  const [assignStudentId, setAssignStudentId] = useState('');
  const [assignBatchId, setAssignBatchId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [aboutUs, setAboutUs] = useState('');
  const [batchDetails, setBatchDetails] = useState('');
  const [awards, setAwards] = useState('');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setMessage('');
    try {
      const [pRes, sRes, bRes, cRes] = await Promise.all([
        adminApi.getPendingRequests(token),
        adminApi.getStudents(token),
        adminApi.getBatches(token),
        contentApi.getContent().catch(() => ({ content: {} }))
      ]);
      setPending(pRes.students || []);
      setStudents(sRes.students || []);
      setBatches(bRes.batches || []);
      const c = cRes?.content || {};
      setAboutUs(c.aboutUs || '');
      setBatchDetails(c.batchDetails || '');
      setAwards(c.awards || '');
    } catch (err) {
      setMessage(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleApprove = async (studentId) => {
    setMessage('');
    try {
      await adminApi.approveStudent(token, studentId);
      setMessage('Student approved');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (studentId) => {
    setMessage('');
    try {
      await adminApi.rejectStudent(token, studentId);
      setMessage('Student rejected');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to reject');
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!batchName.trim()) {
      setMessage('Batch name is required');
      return;
    }
    try {
      await adminApi.createBatch(token, batchName.trim());
      setMessage('Batch created');
      setBatchName('');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to create batch');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Delete this student?')) return;
    setMessage('');
    try {
      await adminApi.deleteStudent(token, studentId);
      setMessage('Student deleted');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to delete');
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!confirm('Delete this batch? Students in this batch will be unassigned.')) return;
    setMessage('');
    const id = Number(batchId);
    try {
      await adminApi.deleteBatch(token, id);
      setMessage('Batch deleted');
      await loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to delete batch');
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setMessage('Select an image file');
      return;
    }
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      await adminApi.uploadImage(token, formData);
      setMessage('Image uploaded. It will appear in the gallery on the homepage.');
      setUploadFile(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.message || 'Upload failed');
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await adminApi.updateContent(token, { aboutUs, batchDetails, awards });
      setMessage('Page content updated. Changes will appear on the homepage.');
    } catch (err) {
      setMessage(err.message || 'Failed to update content');
    }
  };

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!assignStudentId || !assignBatchId) {
      setMessage('Select student and batch');
      return;
    }
    try {
      await adminApi.assignStudent(token, Number(assignStudentId), Number(assignBatchId));
      setMessage('Student assigned');
      setAssignStudentId('');
      setAssignBatchId('');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to assign');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.tabs}>
          <button
            className={activeTab === 'pending' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
          </button>
          <button
            className={activeTab === 'students' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('students')}
          >
            Students List
          </button>
          <button
            className={activeTab === 'batches' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('batches')}
          >
            Batch Management
          </button>
          <button
            className={activeTab === 'gallery' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery Upload
          </button>
          <button
            className={activeTab === 'content' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('content')}
          >
            Page Content
          </button>
        </div>

        {loading && <p className={styles.loading}>Loading...</p>}

        {activeTab === 'pending' && !loading && (
          <section className={styles.section}>
            <h2>Pending Student Requests</h2>
            {pending.length === 0 ? (
              <p className={styles.empty}>No pending requests</p>
            ) : (
              <ul className={styles.list}>
                {pending.map(s => (
                  <li key={s.id} className={styles.listItem}>
                    <span>{s.name} ({s.email})</span>
                    <div>
                      <button className={styles.approveBtn} onClick={() => handleApprove(s.id)}>
                        Approve
                      </button>
                      <button className={styles.rejectBtn} onClick={() => handleReject(s.id)}>
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'students' && !loading && (
          <section className={styles.section}>
            <h2>All Students</h2>
            {students.length === 0 ? (
              <p className={styles.empty}>No students yet</p>
            ) : (
              <ul className={styles.list}>
                {students.map(s => (
                  <li key={s.id} className={styles.listItem}>
                    <span>{s.name} – {s.email} | Batch: {s.batchName || '–'} | {s.feeStatus}</span>
                    <button className={styles.rejectBtn} onClick={() => handleDeleteStudent(s.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'batches' && !loading && (
          <section className={styles.section}>
            <h2>Create Batch</h2>
            <form onSubmit={handleCreateBatch} className={styles.form}>
              <input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Batch name"
                className={styles.input}
              />
              <button type="submit" className={styles.primaryBtn}>Create Batch</button>
            </form>

            <h3>Assign Student to Batch</h3>
            <form onSubmit={handleAssignStudent} className={styles.form}>
              <select
                value={assignStudentId}
                onChange={(e) => setAssignStudentId(e.target.value)}
                className={styles.select}
              >
                <option value="">Select student</option>
                {students.filter(s => s.status === 'approved').map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
              <select
                value={assignBatchId}
                onChange={(e) => setAssignBatchId(e.target.value)}
                className={styles.select}
              >
                <option value="">Select batch</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button type="submit" className={styles.primaryBtn}>Assign</button>
            </form>

            <h3>Batches</h3>
            {batches.length === 0 ? (
              <p className={styles.empty}>No batches yet</p>
            ) : (
              <ul className={styles.list}>
                {batches.map(b => (
                  <li key={b.id} className={styles.listItem}>
                    <span>{b.name} – Coach: {b.coachName || '–'}</span>
                    <button className={styles.rejectBtn} onClick={() => handleDeleteBatch(b.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'content' && !loading && (
          <section className={styles.section}>
            <h2>Edit Homepage Content</h2>
            <p className={styles.helper}>Update About Us, Batch Details, and Awards. Changes appear on the homepage.</p>
            <form onSubmit={handleUpdateContent} className={styles.contentForm}>
              <label>About Us</label>
              <textarea
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                placeholder="About the academy..."
                className={styles.textarea}
                rows={4}
              />
              <label>Batch Details</label>
              <textarea
                value={batchDetails}
                onChange={(e) => setBatchDetails(e.target.value)}
                placeholder="Batch information. Use new lines or bullets for each batch."
                className={styles.textarea}
                rows={5}
              />
              <label>Awards</label>
              <textarea
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                placeholder="Awards and achievements..."
                className={styles.textarea}
                rows={4}
              />
              <button type="submit" className={styles.primaryBtn}>Update Content</button>
            </form>
          </section>
        )}

        {activeTab === 'gallery' && !loading && (
          <section className={styles.section}>
            <h2>Upload Training Images</h2>
            <p className={styles.helper}>Upload images to appear in the Training Gallery on the website.</p>
            <form onSubmit={handleUploadImage} className={styles.form}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
              <button type="submit" className={styles.primaryBtn} disabled={!uploadFile}>
                Upload Image
              </button>
            </form>
          </section>
        )}

        <div className={styles.footer}>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
