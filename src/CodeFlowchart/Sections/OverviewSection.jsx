// src/CodeFlowchart/sections/OverviewSection.jsx
import React from 'react';

const OverviewSection = ({ documentationData }) => {
  // Use documentationData to generate dynamic content
  const lastUpdated = documentationData?.lastUpdated ? 
    new Date(documentationData.lastUpdated).toLocaleString() : 
    'Never';
    
  const flowPaths = documentationData?.flowPaths || [];
  const productionTypes = documentationData?.productionTypes || {};
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">System Overview</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-2/3">
          <p className="mb-4">
            This flowchart visualizes how information moves through our budget calculator,
            showing the decision points and paths that create the final budget.
          </p>

          <p className="mb-3">
            The diagram shows the key stages: checking user input, organizing data,
            deciding which type of production to use, and building the budget with
            all required elements.
          </p>

          <div className="bg-[#fbfaf8] p-4 rounded-xl">
            <p className="text-sm text-[#6f655c]">
              Last updated: {lastUpdated}
            </p>
            {flowPaths.length > 0 && (
              <p className="text-sm text-[#6f655c]">
                Based on data from {flowPaths.length} calculation steps.
              </p>
            )}
          </div>
        </div>
        
        <div className="md:w-1/3 bg-[#fbfaf8] p-4 rounded-xl self-start">
          <h3 className="font-bold mb-2">Good to know</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="block font-medium">Shows what has happened</span>
              <span className="text-[#6f655c]">This only displays budget calculations that have been run before</span>
            </li>
            <li>
              <span className="block font-medium">Temporary memory</span>
              <span className="text-[#6f655c]">Information is stored in your browser and disappears if you clear browsing data</span>
            </li>
            <li>
              <span className="block font-medium">Selected details only</span>
              <span className="text-[#6f655c]">Not every step of the calculation is shown</span>
            </li>
            <li>
              <span className="block font-medium">Updates with use</span>
              <span className="text-[#6f655c]">The diagram refreshes each time someone runs a budget calculation</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Enhanced Visual Flowchart */}
      <div className="border border-[#eeebe7] rounded-xl p-6 bg-[#fbfaf8] mb-6">
        <h3 className="font-bold mb-4 text-center">Budget Calculation Flow</h3>
        <div className="overflow-auto">
          <svg width="800" height="600" className="mx-auto">
            {/* Start node */}
            <circle cx="400" cy="50" r="25" fill="#47403a" />
            <text x="400" y="55" textAnchor="middle" fill="white" fontSize="14">Start</text>
            
            {/* User Input */}
            <rect x="300" y="100" width="200" height="60" rx="8" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="135" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">User Input Collection</text>
            <line x1="400" y1="75" x2="400" y2="100" stroke="#47403a" strokeWidth="2" />
            
            {/* Validation */}
            <rect x="300" y="190" width="200" height="60" rx="8" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="225" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">Form Validation</text>
            <line x1="400" y1="160" x2="400" y2="190" stroke="#47403a" strokeWidth="2" />
            
            {/* Decision Diamond */}
            <polygon points="400,280 450,330 400,380 350,330" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="335" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">Valid?</text>
            <line x1="400" y1="250" x2="400" y2="280" stroke="#47403a" strokeWidth="2" />
            
            {/* No - Error message */}
            <rect x="500" y="300" width="150" height="60" rx="8" fill="#ffe5e5" stroke="#d8564a" strokeWidth="2" />
            <text x="575" y="335" textAnchor="middle" fill="#d8564a" fontSize="14" fontWeight="bold">Error Message</text>
            <line x1="450" y1="330" x2="500" y2="330" stroke="#d8564a" strokeWidth="2" />
            
            {/* Data Transformation */}
            <rect x="300" y="410" width="200" height="60" rx="8" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
            <text x="400" y="445" textAnchor="middle" fill="#1e88e5" fontSize="14" fontWeight="bold">Data Transformation</text>
            <line x1="400" y1="380" x2="400" y2="410" stroke="#47403a" strokeWidth="2" />
            
            {/* Production Type */}
            <rect x="300" y="500" width="200" height="60" rx="8" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
            <text x="400" y="535" textAnchor="middle" fill="#1e88e5" fontSize="14" fontWeight="bold">Determine Production Type</text>
            <line x1="400" y1="470" x2="400" y2="500" stroke="#47403a" strokeWidth="2" />
            
            {/* Production Type Decision */}
            <polygon points="400,590 475,650 400,710 325,650" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="655" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">Type?</text>
            <line x1="400" y1="560" x2="400" y2="590" stroke="#47403a" strokeWidth="2" />
            
            {/* Film Branch */}
            <rect x="100" y="620" width="180" height="60" rx="8" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
            <text x="190" y="655" textAnchor="middle" fill="#1e88e5" fontSize="14" fontWeight="bold">Film Calculation</text>
            <line x1="325" y1="650" x2="280" y2="650" stroke="#47403a" strokeWidth="2" />
            
            {/* Car Branch */}
            <rect x="520" y="620" width="180" height="60" rx="8" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
            <text x="610" y="655" textAnchor="middle" fill="#ed6c02" fontSize="14" fontWeight="bold">Car Calculation</text>
            <line x1="475" y1="650" x2="520" y2="650" stroke="#47403a" strokeWidth="2" />
            
            {/* Stills Branch */}
            <rect x="310" y="730" width="180" height="60" rx="8" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
            <text x="400" y="765" textAnchor="middle" fill="#2e7d32" fontSize="14" fontWeight="bold">Stills Calculation</text>
            <line x1="400" y1="710" x2="400" y2="730" stroke="#47403a" strokeWidth="2" />
          </svg>
        </div>
      </div>
      
      {/* Dynamic Production Type Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(productionTypes).map(([type, data], index) => (
          <div 
            key={type}
            className={`border-t-4 ${getBorderColorForType(type)} bg-[#fbfaf8] p-4 rounded-xl`}
          >
            <h4 className="font-bold mb-2">{capitalizeFirstLetter(type)}</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Function:</strong> {data.calculationFunction}</li>
              <li><strong>Budget:</strong> {formatNumber(data.budget)} NOK</li>
              <li><strong>Days:</strong> {data.days}</li>
              {data.outsideOslo && <li><strong>Location:</strong> Outside Oslo</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
const getBorderColorForType = (type) => {
  switch(type) {
    case 'film': return 'border-blue-500';
    case 'car': return 'border-amber-500';
    case 'stills': return 'border-green-500';
    case 'fashion': return 'border-purple-500';
    case 'documentary': return 'border-cyan-500';
    case 'commercial': return 'border-indigo-500';
    default: return 'border-gray-500';
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default OverviewSection;