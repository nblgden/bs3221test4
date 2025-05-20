import React from 'react';
import EditWardenModal from './EditWardenModal';

export default function WardenList({ wardens, onDelete }) {
  const [editingWarden, setEditingWarden] = useState(null);
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleEdit = (warden) => {
    setEditingWarden(warden);
  };

  const handleSave = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/wardens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update warden');
      }
    } catch (error) {
      console.error('Error updating warden:', error);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Current Wardens</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all wardens and their locations</p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {wardens.map((warden) => (
            <li key={warden.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {warden.first_name} {warden.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Staff Number: {warden.staff_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: {warden.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    Logged in: {formatTimestamp(warden.timestamp)}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(warden)}
                    className="font-medium text-blue-600 hover:text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      console.log('Deleting ID:', warden.id);
                      onDelete(warden.id);
                    }}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
