import React, { useState } from 'react';

export default function EditWardenModal({ warden, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: warden.first_name,
    last_name: warden.last_name,
    staff_number: warden.staff_number,
    location: warden.location,
    status: warden.status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(warden.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Warden</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="staff_number" className="block text-sm font-medium text-gray-700">
              Staff Number
            </label>
            <input
              type="text"
              id="staff_number"
              name="staff_number"
              value={formData.staff_number}
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
              <option value="">Select a location</option>
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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
