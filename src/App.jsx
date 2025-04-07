import React, { useState } from 'react';
import EnrollFace from './components/EnrollFace';
import VerifyFace from './components/VerifyFace';

function App() {
  const [mode, setMode] = useState('enroll');
  const userId = 'alice'; // example userId, replace or make dynamic

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">FaceID React Starter</h1>
      <div className="space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${mode === 'enroll' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('enroll')}
        >Enroll</button>
        <button
          className={`px-4 py-2 rounded ${mode === 'verify' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('verify')}
        >Verify</button>
      </div>
      {mode === 'enroll'
        ? <EnrollFace userId={userId} />
        : <VerifyFace userId={userId} />
      }
    </div>
  );
}

export default App;