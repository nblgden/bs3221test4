import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddWarden from './components/AddWarden'
import WardenList from './components/WardenList'

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
  const [showWardens, setShowWardens] = useState(false);
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
      console.log('Fetched wardens data:', res.data);
      setWardens(res.data);
    } catch (err) {
      console.error('Error fetching wardens:', err);
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
      console.log('Attempting to delete warden with ID:', id);
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log('Delete response:', response.status);
      await fetchWardens();
    } catch (err) {
      console.error('Error deleting warden:', err.response?.status, err.response?.data || err.message);
      // Optionally show an error message to the user
      alert('Failed to delete warden. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Fire Warden Location Tracker
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setShowWardens(!showWardens)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showWardens ? 'Hide Wardens' : 'View All Wardens'}
            </button>
          </div>
          
          {showWardens && (
            <div className="mb-6">
              <WardenList wardens={wardens} onDelete={handleDelete} />
            </div>
          )}
          
          <AddWarden />
        </div>
      </main>
    </div>
  );
} 