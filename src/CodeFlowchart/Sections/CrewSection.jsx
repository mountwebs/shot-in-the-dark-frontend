// src/CodeFlowchart/sections/CrewSection.jsx
import React from 'react';

const CrewSection = ({ documentationData }) => {
  const crewSelections = documentationData?.crewSelections || {};
  
  // Get all crew members across all production types
  const allCrew = Object.values(crewSelections).flatMap(
    selection => selection.crewMembers || []
  );
  
  // Get unique crew roles
  const uniqueRoles = [...new Set(allCrew.map(crew => crew.title))];
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Crew Selection Process</h2>
      
      <p className="mb-6">
        Crew selection is based on production type, with each type having a specific priority list.
        The system checks several factors to determine which crew members to include.
      </p>
      
      {/* Visualization of crew selection flow */}
      <div className="border border-[#eeebe7] rounded-xl p-6 bg-[#fbfaf8] mb-6">
        <h3 className="font-bold mb-4 text-center">Crew Selection Flow</h3>
        <div className="overflow-auto">
          <svg width="800" height="500" className="mx-auto">
            {/* Start */}
            <circle cx="400" cy="50" r="25" fill="#47403a" />
            <text x="400" y="55" textAnchor="middle" fill="white" fontSize="14">Start</text>
            
            {/* Get crew list */}
            <rect x="300" y="100" width="200" height="60" rx="8" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="135" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">getCrewForProductionType()</text>
            <line x1="400" y1="75" x2="400" y2="100" stroke="#47403a" strokeWidth="2" />
            
            {/* Loop */}
            <rect x="300" y="190" width="200" height="60" rx="8" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="225" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">For each crew member</text>
            <line x1="400" y1="160" x2="400" y2="190" stroke="#47403a" strokeWidth="2" />
            
            {/* Skip check */}
            <polygon points="400,280 450,330 400,380 350,330" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="335" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">Skip?</text>
            <line x1="400" y1="250" x2="400" y2="280" stroke="#47403a" strokeWidth="2" />
            
            {/* Yes - Continue */}
            <text x="500" y="335" textAnchor="middle" fill="#47403a" fontSize="12">Yes</text>
            <line x1="450" y1="330" x2="600" y2="330" stroke="#47403a" strokeWidth="2" />
            <line x1="600" y1="330" x2="600" y2="225" stroke="#47403a" strokeWidth="2" />
            <line x1="600" y1="225" x2="500" y2="225" stroke="#47403a" strokeWidth="2" />
            
            {/* No - Calculate days */}
            <text x="350" y="430" textAnchor="middle" fill="#47403a" fontSize="12">No</text>
            <rect x="300" y="410" width="200" height="60" rx="8" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
            <text x="400" y="435" textAnchor="middle" fill="#47403a" fontSize="14" fontWeight="bold">Calculate work days</text>
            <text x="400" y="455" textAnchor="middle" fill="#47403a" fontSize="12">calculateCrewWorkDays()</text>
            <line x1="400" y1="380" x2="400" y2="410" stroke="#47403a" strokeWidth="2" />
            
            {/* Skip Reasons */}
            <rect x="50" y="280" width="250" height="160" rx="8" fill="#f0f7ff" stroke="#0277bd" strokeWidth="2" />
            <text x="175" y="300" textAnchor="middle" fill="#0277bd" fontSize="14" fontWeight="bold">Reasons to Skip:</text>
            <text x="175" y="325" textAnchor="middle" fill="#0277bd" fontSize="12">• Role requires camera but no camera selected</text>
            <text x="175" y="350" textAnchor="middle" fill="#0277bd" fontSize="12">• Role requires lights but no lights selected</text>
            <text x="175" y="375" textAnchor="middle" fill="#0277bd" fontSize="12">• Stills-specific role for film production</text>
            <text x="175" y="400" textAnchor="middle" fill="#0277bd" fontSize="12">• Car-specific role for non-car production</text>
            <text x="175" y="425" textAnchor="middle" fill="#0277bd" fontSize="12">• Not affordable with remaining budget</text>
            <line x1="300" y1="330" x2="350" y2="330" stroke="#0277bd" strokeWidth="2" dasharray="5,5" />
          </svg>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold mb-3">Line Producer Days Calculation</h3>
        <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8]">
          <pre className="text-sm whitespace-pre">
{`calculateLineProducerDays(data, productionType)
    │
    ▼
Start with minimum 3 prep days
    │
    ▼
Add 1 day per shooting day
    │
    ▼
Add days outside Oslo (travel days)
    │
    ▼
┌────────────────┐
│ Production     │
│ Type?          │
└────────────────┘
    │
    ├──► Car/Commercial: Add 2 days
    │
    ├──► Film: Add 3 days
    │
    ├──► Fashion: Add 2 days
    │
    ▼
┌────────────────┐
│ Is Fixer?      │
└────────────────┘
    │   │
    │   └──► Reduce to 80% of days (min 3)
    │
    ▼
Return total Line Producer days`}
          </pre>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Show actual crew data from last run if available */}
        {Object.entries(crewSelections).length > 0 ? (
          Object.entries(crewSelections).map(([productionType, data]) => (
            <div 
              key={productionType}
              className={`bg-[#fbfaf8] p-4 rounded-xl border-l-4 ${getBorderColorForType(productionType)}`}
            >
              <h3 className="font-bold mb-2 pl-2">{capitalizeFirstLetter(productionType)} Crew</h3>
              <div className="text-sm">
                {data.crewMembers && data.crewMembers.length > 0 ? (
                  <>
                    <ul className="list-disc pl-5 mb-2">
                      {data.crewMembers.map((crew, index) => (
                        <li key={index}>
                          <strong>{crew.title}</strong>: {crew.days} days
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No crew data available yet</p>
                )}
              </div>
            </div>
          ))
        ) : (
          // Default static content if no documentation data
          <>
            <div className="bg-[#fbfaf8] p-4 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-bold mb-2 pl-2">Film Crew</h3>
              <div className="text-sm">
                <p className="font-bold mb-1">Essential:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Line Producer</li>
                  <li>Production Assistant</li>
                  <li>1st Assistant Director</li>
                </ul>
                <p className="font-bold mb-1">High Priority:</p>
                <ul className="list-disc pl-5">
                  <li>Gaffer</li>
                  <li>Focus Puller</li>
                  <li>On-Set Sound</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#fbfaf8] p-4 rounded-xl border-l-4 border-amber-500">
              <h3 className="font-bold mb-2 pl-2">Car Crew</h3>
              <div className="text-sm">
                <p className="font-bold mb-1">Essential:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Line Producer</li>
                  <li>Car Technician</li>
                  <li>1st Assistant Director</li>
                </ul>
                <p className="font-bold mb-1">High Priority:</p>
                <ul className="list-disc pl-5">
                  <li>Gaffer</li>
                  <li>Focus Puller</li>
                  <li>Car Rigging Specialist</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#fbfaf8] p-4 rounded-xl border-l-4 border-green-500">
              <h3 className="font-bold mb-2 pl-2">Stills Crew</h3>
              <div className="text-sm">
                <p className="font-bold mb-1">Essential:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Line Producer</li>
                  <li>Digital Tech</li>
                </ul>
                <p className="font-bold mb-1">High Priority:</p>
                <ul className="list-disc pl-5">
                  <li>Photo Assistant</li>
                  <li>Location Manager</li>
                  <li>Production Assistant</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Add unique roles across all production types */}
      {uniqueRoles.length > 0 && (
        <div className="mt-6 p-4 bg-[#fbfaf8] rounded-xl">
          <h3 className="font-bold mb-3">All Available Crew Roles</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueRoles.map(role => (
              <span 
                key={role}
                className="px-3 py-1 bg-[#f1f0ee] rounded-full text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
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

export default CrewSection;