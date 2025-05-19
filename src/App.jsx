import React, { useEffect, useState } from 'react';
import axios from 'axios';

const locations = [
  "Alwyn Hall", "Beech Glade", "Bowers Building", "Burma Road Student Village",
  "Centre for Sport", "Chapel", "The Cottage", "Fred Wheeler Building",
  "Herbert Jarman Building", "Holm Lodge", "Kenneth Kettle Building",
  "King Alfred Centre", "Martial Rose Library", "Masters Lodge", "Medecroft",
  "Medecroft Annexe", "Paul Chamberlain Building", "Queen's Road Student Village",
  "St Alphege", "St Edburga", "St Elizabeth's Hall", "St Grimbald's Court",
  "St James' Hall", "St Swithun's Lodge", "The Stripe", "Business School",
  "Tom Atkinson Building", "West Downs Centre", "West Downs Student Village",
  "Winton Building", "Students' Union"
];

const API_URL = '/api/wardens';

export default function App() {
  const [wardens, setWardens] = useState([]);
  const [form, setForm] = useState({
    staff_number: '',
    first_name: '',
    last_name: '',
    location: locations[0],
  });

  useEffect(() => {
    fetchWardens();
  }, []);

  async function fetchWardens() {
    try {
      const res = await axios.get(API_URL);
      setWardens(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({ ...form, staff_number: '', first_name: '', last_name: '' });
      fetchWardens();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchWardens();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fire Warden Location Tracker</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
        <input
          type="text"
          placeholder="Staff Number"
          value={form.staff_number}
          onChange={(e) => setForm({ ...form, staff_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <select
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Staff No.</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wardens.map((w) => (
            <tr key={w.id}>
              <td className="border p-2">{w.first_name} {w.last_name}</td>
              <td className="border p-2">{w.staff_number}</td>
              <td className="border p-2">{w.location}</td>
              <td className="border p-2">{new Date(w.timestamp).toLocaleString()}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(w.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 