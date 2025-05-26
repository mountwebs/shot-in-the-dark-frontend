// Simple password protection component
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import BudgetDocs from './BudgetDocs';

// Set your password here
const DOCS_PASSWORD = 'line-calc-docs';

export default function ProtectedDocs() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Check if previously authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('docsAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle password submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === DOCS_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('docsAuthenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };
  
  // If authenticated, show documentation
  if (isAuthenticated) {
    return <BudgetDocs />;
  }
  
  // Otherwise, show login screen
  return (
    <div className="bg-[#f8f7f5] min-h-screen flex flex-col">
      <div className="pt-6 pb-4 flex justify-center">
        <div className="h-16 w-16 flex items-center justify-center">
          <img src="/src/assets/Logo calc.png" alt="Line.Calc Logo" className="h-8" />
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#f1f0ee] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#47403a]" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-[#2d2a26] mb-6">
            Budget Flow Documentation
          </h2>
          
          <p className="text-[#6f655c] text-center mb-6">
            This area contains internal documentation.
            Please enter the password to continue.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-4 pr-12 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26]"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6f655c]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#47403a] hover:bg-[#35302b] text-white py-4 rounded-xl"
            >
              Access Documentation
            </button>
          </form>
        </div>
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="w-16 mb-4">
          <a href="https://www.line.productions/" target="_blank" rel="noopener noreferrer">
            <img src="/src/assets/Logo 3.png" alt="Line.Production Logo" className="w-full" />
          </a>
        </div>
      </div>
    </div>
  );
}