import { useState } from 'react';

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

export default function AddWarden() {
  const [formData, setFormData] = useState({
    name: '',
    location: locations[0], // Set default to first location
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/wardens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save warden');
      }

      const data = await response.json();
      console.log('Warden saved:', data);
      
      // Clear form
      setFormData({
        name: '',
        location: locations[0], // Reset to first location
        status: 'active'
      });

      // You might want to trigger a refresh of the wardens list here
    } catch (error) {
      console.error('Error saving warden:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Warden</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Warden
        </button>
      </form>
    </div>
  );
} 