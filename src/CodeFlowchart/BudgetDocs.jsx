// src/CodeFlowchart/BudgetDocs.jsx
// Documentation that dynamically updates based on code execution
import React, { useState, useEffect } from 'react';
import { loadDocumentationData } from './generateDocumentation';
import OverviewSection from './sections/OverviewSection';
import CrewSection from './sections/CrewSection';
// Import other sections as needed

const BudgetDocs = () => {
  // State for navigation and documentation data
  const [activeSection, setActiveSection] = useState('overview');
  const [docData, setDocData] = useState(null);
  
  // Load documentation data on component mount
  useEffect(() => {
    // Try to load documentation data
    const storedData = localStorage.getItem('budgetDocumentation');
    if (storedData) {
      try {
        setDocData(JSON.parse(storedData));
        console.log('Loaded documentation data from localStorage');
      } catch (e) {
        console.error('Error parsing stored documentation data:', e);
      }
    } else {
      console.log('No documentation data found in localStorage');
    }
  }, []);
  
  // Sections configuration
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'production', label: 'Production Types' },
    { id: 'crew', label: 'Crew Selection' },
    { id: 'equipment', label: 'Equipment & Vehicles' },
    { id: 'data', label: 'Data Flow' }
  ];
  
  return (
    <div className="bg-[#f8f7f5] min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Line.calc - flowchart </h1>
            {docData?.lastUpdated && (
              <p className="text-sm text-[#6f655c]">
                Last updated: {new Date(docData.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          {/* Fixed button with better contrast */}
          <a 
  href="/" 
  className="px-4 py-2 bg-[#f8f7f5] text-[#47403a] border border-[#eeebe7] rounded-lg hover:bg-[#eeebe7] transition-colors font-medium"
>
  Return to Calculator
</a>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
  {sections.map(section => (
    <button
      key={section.id}
      onClick={() => setActiveSection(section.id)}
      className={`px-4 py-2 rounded-lg ${
        activeSection === section.id 
          ? 'bg-[#47403a] text-white' 
          : 'bg-[#f8f7f5] hover:bg-[#f1f0ee] text-[#2d2a26]'
      }`}
    >
      {section.label}
    </button>
  ))}
</div>
        
        {/* Dynamic or static content based on available data */}
        {!docData && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-xl">
            <p className="text-amber-700">
              No documentation data available yet. Documentation will be generated automatically when the budget calculation runs.
            </p>
          </div>
        )}
        
        {/* Render the appropriate section */}
        {activeSection === 'overview' && <OverviewSection documentationData={docData} />}
        {activeSection === 'crew' && <CrewSection documentationData={docData} />}
        {/* Add other sections as you implement them */}
        {activeSection === 'production' && <ProductionSection documentationData={docData} />}
        {activeSection === 'equipment' && <EquipmentSection documentationData={docData} />}
        {activeSection === 'data' && <DataSection documentationData={docData} />}
      </div>
    </div>
  );
};

// Placeholder components for other sections - replace with actual components
const ProductionSection = ({ documentationData }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Production Types</h2>
    <p>This section will show details about different production types.</p>
    {documentationData ? (
      <pre className="bg-[#fbfaf8] p-4 rounded-xl mt-4">
        {JSON.stringify(documentationData.productionTypes, null, 2)}
      </pre>
    ) : (
      <p className="italic text-[#6f655c]">No production data available yet.</p>
    )}
  </div>
);

const EquipmentSection = ({ documentationData }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Equipment & Vehicles</h2>
    <p>This section will show details about equipment and vehicle selection.</p>
    {documentationData?.vehicleSelections && Object.keys(documentationData.vehicleSelections).length > 0 ? (
      <pre className="bg-[#fbfaf8] p-4 rounded-xl mt-4">
        {JSON.stringify(documentationData.vehicleSelections, null, 2)}
      </pre>
    ) : (
      <p className="italic text-[#6f655c]">No equipment or vehicle data available yet.</p>
    )}
  </div>
);

const DataSection = ({ documentationData }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Data Transformation</h2>
    
    <div className="p-4 bg-[#fbfaf8] rounded-xl mb-6">
      <p>
        There is an important data transformation between frontend and backend.
        The field names are swapped, which can be confusing when reading the code.
      </p>
    </div>
    
    <div className="border border-[#eeebe7] rounded-xl p-6 bg-[#fbfaf8] mb-6">
      <h3 className="font-bold mb-3">Data Transformation Flow</h3>
      <pre className="text-sm whitespace-pre">
{`Frontend Data
    │
    ▼
┌───────────────────┐
│ keywords          │ ───► Production types & service requirements
│ equipment         │ ───► Special equipment (Drone, etc.)
└───────────────────┘
    │
    ▼
Data Transformation in app.js
    │
    ▼
┌───────────────────┐
│ data.specials =   │
│ data.equipment    │ ───► Special equipment becomes "specials"
└───────────────────┘
    │
    ▼
┌───────────────────┐
│ data.equipment =  │
│ data.keywords     │ ───► Production types become "equipment"
└───────────────────┘
    │
    ▼
Backend Processing`}
      </pre>
    </div>
    
    <div className="bg-[#fbfaf8] rounded-xl overflow-hidden mb-6">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f1f0ee]">
            <th className="px-4 py-2 text-left">Frontend Field</th>
            <th className="px-4 py-2 text-left">Backend Field</th>
            <th className="px-4 py-2 text-left">Content Example</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[#eeebe7]">
            <td className="px-4 py-2"><code>keywords</code></td>
            <td className="px-4 py-2"><code>equipment</code></td>
            <td className="px-4 py-2">["film", "full-crew", "tech-equipment"]</td>
          </tr>
          <tr className="border-t border-[#eeebe7]">
            <td className="px-4 py-2"><code>equipment</code></td>
            <td className="px-4 py-2"><code>specials</code></td>
            <td className="px-4 py-2">[{"{type: 'Drone', days: 1}"}, {"{type: 'Road block', days: 2}"}]</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default BudgetDocs;