// src/CodeFlowchart/ProtectedDocs.jsx
import React, { useState, useEffect } from 'react';
import BudgetDocs from './BudgetDocs';

const ProtectedDocs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simple password check
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'Tangen') {
      setIsAuthenticated(true);
      sessionStorage.setItem('docsAuthenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  // Check for existing authentication
  useEffect(() => {
    if (sessionStorage.getItem('docsAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // If authenticated, show documentation
  if (isAuthenticated) {
    return <BudgetDocs />;
  }

  // Otherwise, show login screen
  return (
    <div className="bg-[#f8f7f5] min-h-screen min-w-[320px] flex flex-col">
      {/* Logo at the top - same as main page */}
      <div className="pt-3 sm:pt-6 pb-2 sm:pb-4">
        <div className="flex justify-center">
          <div className="h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center">
            {/* Fix image path - need to check exact location in your project */}
            <div className="text-lg font-semibold">Line.Calc</div>
          </div>
        </div>
      </div>
      
      {/* Centered login form */}
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-center text-[#2d2a26] mb-6">
            Budget Flow Documentation
          </h2>
          
          <p className="text-[#6f655c] text-center mb-6">
            This area contains internal documentation for the budget calculation system.
            Please enter the password to continue.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92]"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#47403a] hover:bg-[#35302b] text-white py-4 rounded-xl transition-colors"
            >
              Access Documentation
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer with text instead of logo */}
      <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex justify-center">
        <div className="text-sm text-[#6f655c]">
          Line.Production
        </div>
      </div>
    </div>
  );
};

export default ProtectedDocs;