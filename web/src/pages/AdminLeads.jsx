import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    source: '',
  });

  const token = localStorage.getItem('token') || '';

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/crm/leads`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.items || []);
      } else {
        setError(data.message || 'Failed to load leads');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/crm/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: '', contactEmail: '', contactPhone: '', source: '' });
        fetchLeads();
      } else {
        setError(data.message || 'Failed to create lead');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  const updateStage = async (id, stage) => {
    try {
      const res = await fetch(`${API_URL}/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>CRM Leads</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'grid', gap: 8, maxWidth: 400 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="contactEmail"
          placeholder="Email"
          value={form.contactEmail}
          onChange={handleChange}
        />
        <input
          name="contactPhone"
          placeholder="Phone"
          value={form.contactPhone}
          onChange={handleChange}
        />
        <input
          name="source"
          placeholder="Source (optional)"
          value={form.source}
          onChange={handleChange}
        />
        <button type="submit">Add Lead</button>
      </form>

      {loading && <p>Loading leads...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Stage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.contactEmail}</td>
              <td>{lead.contactPhone}</td>
              <td>{lead.stage}</td>
              <td>
                <select
                  value={lead.stage}
                  onChange={(e) => updateStage(lead.id, e.target.value)}
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="ADMITTED">ADMITTED</option>
                  <option value="LOST">LOST</option>
                </select>
              </td>
            </tr>
          ))}
          {leads.length === 0 && !loading && (
            <tr>
              <td colSpan="5">No leads yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
