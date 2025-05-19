import React from 'react';
import AddWarden from './components/AddWarden';
import WardenList from './components/WardenList';

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
          <AddWarden />
          <WardenList />
        </div>
      </main>
    </div>
  );
} 