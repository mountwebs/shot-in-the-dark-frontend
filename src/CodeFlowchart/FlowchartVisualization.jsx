// src/CodeFlowchart/FlowchartVisualization.jsx
import React from 'react';

// Component for displaying SVG flowcharts
const FlowchartVisualization = ({ type, onNodeClick }) => {
  // Render different flowcharts based on type
  switch (type) {
    case 'main':
      return <MainFlowchart onNodeClick={onNodeClick} />;
    case 'film':
      return <FilmFlowchart onNodeClick={onNodeClick} />;
    case 'car':
      return <CarFlowchart onNodeClick={onNodeClick} />;
    case 'stills':
      return <StillsFlowchart onNodeClick={onNodeClick} />;
    case 'crew':
      return <CrewFlowchart onNodeClick={onNodeClick} />;
    case 'vehicles':
      return <VehiclesFlowchart onNodeClick={onNodeClick} />;
    case 'data':
      return <DataFlowchart onNodeClick={onNodeClick} />;
    case 'equipment':
      return <EquipmentFlowchart onNodeClick={onNodeClick} />;
    default:
      return <MainFlowchart onNodeClick={onNodeClick} />;
  }
};

// Main system flowchart
const MainFlowchart = ({ onNodeClick }) => (
  <div className="overflow-auto p-4 bg-[#fbfaf8] rounded-xl border border-[#eeebe7]">
    <svg width="900" height="700" className="mx-auto">
      {/* Start node */}
      <circle cx="450" cy="40" r="30" fill="#47403a" />
      <text x="450" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* User Input */}
      <rect x="350" y="100" width="200" height="60" rx="5" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="450" y="135" textAnchor="middle" fill="#47403a" fontSize="14">User Input Collection</text>
      <line x1="450" y1="70" x2="450" y2="100" stroke="#47403a" strokeWidth="2" />
      
      {/* Form validation */}
      <rect x="350" y="190" width="200" height="60" rx="5" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="450" y="225" textAnchor="middle" fill="#47403a" fontSize="14">Form Validation</text>
      <line x1="450" y1="160" x2="450" y2="190" stroke="#47403a" strokeWidth="2" />
      
      {/* Decision Diamond */}
      <polygon points="450,280 500,330 450,380 400,330" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="450" y="335" textAnchor="middle" fill="#47403a" fontSize="12">Valid?</text>
      <line x1="450" y1="250" x2="450" y2="280" stroke="#47403a" strokeWidth="2" />
      
      {/* No - Error message */}
      <rect x="580" y="300" width="150" height="60" rx="5" fill="#ffe5e5" stroke="#d8564a" strokeWidth="2" />
      <text x="655" y="335" textAnchor="middle" fill="#d8564a" fontSize="12">Error Message</text>
      <line x1="500" y1="330" x2="580" y2="330" stroke="#d8564a" strokeWidth="2" />
      
      {/* Yes - Data Transformation */}
      <rect x="350" y="410" width="200" height="60" rx="5" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('data')} />
      <text x="450" y="445" textAnchor="middle" fill="#47403a" fontSize="14">Data Transformation</text>
      <text x="450" y="460" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
      <line x1="450" y1="380" x2="450" y2="410" stroke="#47403a" strokeWidth="2" />
      
      {/* Determine Production Type */}
      <rect x="350" y="500" width="200" height="60" rx="5" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="450" y="535" textAnchor="middle" fill="#47403a" fontSize="14">Determine Production Type</text>
      <line x1="450" y1="470" x2="450" y2="500" stroke="#47403a" strokeWidth="2" />
      
      {/* Production Type Decision */}
      <polygon points="450,590 520,640 450,690 380,640" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="450" y="645" textAnchor="middle" fill="#47403a" fontSize="12">Type?</text>
      <line x1="450" y1="560" x2="450" y2="590" stroke="#47403a" strokeWidth="2" />
      
      {/* Film Branch */}
      <rect x="150" y="610" width="180" height="60" rx="5" fill="#e6f7ff" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('film')} />
      <text x="240" y="645" textAnchor="middle" fill="#47403a" fontSize="14">Film Calculation</text>
      <text x="240" y="660" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
      <line x1="380" y1="640" x2="330" y2="640" stroke="#47403a" strokeWidth="2" />
      
      {/* Car Branch */}
      <rect x="570" y="610" width="180" height="60" rx="5" fill="#fff8e6" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('car')} />
      <text x="660" y="645" textAnchor="middle" fill="#47403a" fontSize="14">Car Calculation</text>
      <text x="660" y="660" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
      <line x1="520" y1="640" x2="570" y2="640" stroke="#47403a" strokeWidth="2" />
      
      {/* Stills Branch */}
      <rect x="360" y="720" width="180" height="60" rx="5" fill="#e6ffe6" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('stills')} />
      <text x="450" y="755" textAnchor="middle" fill="#47403a" fontSize="14">Stills Calculation</text>
      <text x="450" y="770" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
      <line x1="450" y1="690" x2="450" y2="720" stroke="#47403a" strokeWidth="2" />
      
      {/* Additional clickable areas */}
      <rect x="150" y="500" width="180" height="60" rx="5" fill="#f0f7ff" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('crew')} />
      <text x="240" y="535" textAnchor="middle" fill="#47403a" fontSize="14">Crew Selection</text>
      <text x="240" y="550" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
      
      <rect x="570" y="500" width="180" height="60" rx="5" fill="#f0f7ff" stroke="#47403a" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('vehicles')} />
      <text x="660" y="535" textAnchor="middle" fill="#47403a" fontSize="14">Vehicles & Transport</text>
      <text x="660" y="550" textAnchor="middle" fill="#47403a" fontSize="10">(Click for details)</text>
    </svg>
  </div>
);

// Film budget flowchart
const FilmFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Film Budget Calculation Flow</h3>
    <svg width="650" height="800" className="mx-auto">
      {/* Start node */}
      <circle cx="325" cy="40" r="20" fill="#47403a" />
      <text x="325" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* Function flow */}
      <rect x="225" y="80" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="325" y="110" textAnchor="middle" fill="#1e88e5">addAccountingCosts</text>
      <line x1="325" y1="60" x2="325" y2="80" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="150" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="325" y="180" textAnchor="middle" fill="#1e88e5">addFixedCosts</text>
      <line x1="325" y1="130" x2="325" y2="150" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="220" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="325" y="250" textAnchor="middle" fill="#1e88e5">addLocationCosts</text>
      <line x1="325" y1="200" x2="325" y2="220" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="290" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="325" y="320" textAnchor="middle" fill="#1e88e5">addSpecialEquipment</text>
      <line x1="325" y1="270" x2="325" y2="290" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="360" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('equipment')} />
      <text x="325" y="390" textAnchor="middle" fill="#1e88e5">addFilmEquipment</text>
      <text x="325" y="405" textAnchor="middle" fill="#1e88e5" fontSize="10">(Click for details)</text>
      <line x1="325" y1="340" x2="325" y2="360" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="430" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('crew')} />
      <text x="325" y="460" textAnchor="middle" fill="#1e88e5">addFilmCrew</text>
      <text x="325" y="475" textAnchor="middle" fill="#1e88e5" fontSize="10">(Click for details)</text>
      <line x1="325" y1="410" x2="325" y2="430" stroke="#47403a" strokeWidth="2" />
      
      {/* Decision */}
      <polygon points="325,510 375,560 325,610 275,560" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="565" textAnchor="middle" fill="#47403a" fontSize="12">film+stills?</text>
      <line x1="325" y1="480" x2="325" y2="510" stroke="#47403a" strokeWidth="2" />
      
      {/* Yes branch */}
      <rect x="425" y="535" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="525" y="565" textAnchor="middle" fill="#1e88e5">addSupplementaryStillsCosts</text>
      <line x1="375" y1="560" x2="425" y2="560" stroke="#47403a" strokeWidth="2" />
      
      {/* Continue flow */}
      <rect x="225" y="630" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('vehicles')} />
      <text x="325" y="660" textAnchor="middle" fill="#1e88e5">calculateAdditionalItems</text>
      <text x="325" y="675" textAnchor="middle" fill="#1e88e5" fontSize="10">(Click for details)</text>
      <line x1="325" y1="610" x2="325" y2="630" stroke="#47403a" strokeWidth="2" />
      <line x1="525" y1="585" x2="525" y2="610" stroke="#47403a" strokeWidth="2" />
      <line x1="525" y1="610" x2="325" y2="610" stroke="#47403a" strokeWidth="2" />
      
      {/* Final steps */}
      <rect x="225" y="700" width="200" height="50" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="325" y="730" textAnchor="middle" fill="#1e88e5">Add Markup and Donation</text>
      <line x1="325" y1="680" x2="325" y2="700" stroke="#47403a" strokeWidth="2" />
      
      {/* End node */}
      <circle cx="325" cy="780" r="20" fill="#47403a" />
      <text x="325" y="785" textAnchor="middle" fill="white" fontSize="12">End</text>
      <line x1="325" y1="750" x2="325" y2="760" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

// Car budget flowchart (simplified for space)
const CarFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Car Budget Specific Elements</h3>
    <svg width="650" height="350" className="mx-auto">
      {/* Car Specific Crew */}
      <rect x="50" y="50" width="250" height="120" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="175" y="80" textAnchor="middle" fill="#ed6c02" fontWeight="bold">Car-Specific Crew</text>
      <text x="175" y="110" textAnchor="middle" fill="#ed6c02" fontSize="14">• Car Technician (Essential)</text>
      <text x="175" y="130" textAnchor="middle" fill="#ed6c02" fontSize="14">• Car Rigging Specialist</text>
      <text x="175" y="150" textAnchor="middle" fill="#ed6c02" fontSize="14">• Different prep day calculations</text>
      
      {/* Car Specific Transport */}
      <rect x="350" y="50" width="250" height="120" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="475" y="80" textAnchor="middle" fill="#ed6c02" fontWeight="bold">Car-Specific Transport</text>
      <text x="475" y="110" textAnchor="middle" fill="#ed6c02" fontSize="14">• Main Production Van (days+1)</text>
      <text x="475" y="130" textAnchor="middle" fill="#ed6c02" fontSize="14">• More vehicles for equipment</text>
      <text x="475" y="150" textAnchor="middle" fill="#ed6c02" fontSize="14">• Specialized transport needs</text>
      
      {/* Car Specific Equipment */}
      <rect x="50" y="200" width="250" height="120" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="175" y="230" textAnchor="middle" fill="#ed6c02" fontWeight="bold">Car-Specific Equipment</text>
      <text x="175" y="260" textAnchor="middle" fill="#ed6c02" fontSize="14">• Car rigging equipment</text>
      <text x="175" y="280" textAnchor="middle" fill="#ed6c02" fontSize="14">• Higher-end camera packages</text>
      <text x="175" y="300" textAnchor="middle" fill="#ed6c02" fontSize="14">• More grip and lighting</text>
      
      {/* Car Specific Logistics */}
      <rect x="350" y="200" width="250" height="120" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="475" y="230" textAnchor="middle" fill="#ed6c02" fontWeight="bold">Car-Specific Logistics</text>
      <text x="475" y="260" textAnchor="middle" fill="#ed6c02" fontSize="14">• Road closure logistics</text>
      <text x="475" y="280" textAnchor="middle" fill="#ed6c02" fontSize="14">• Location permits for roads</text>
      <text x="475" y="300" textAnchor="middle" fill="#ed6c02" fontSize="14">• Higher production contingency</text>
    </svg>
  </div>
);

// Stills budget flowchart (simplified)
const StillsFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Stills Budget Calculation Flow</h3>
    <svg width="650" height="400" className="mx-auto">
      {/* Start node */}
      <circle cx="325" cy="40" r="20" fill="#47403a" />
      <text x="325" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* Function flow */}
      <rect x="225" y="80" width="200" height="50" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
      <text x="325" y="110" textAnchor="middle" fill="#2e7d32">addFixedCosts</text>
      <line x1="325" y1="60" x2="325" y2="80" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="150" width="200" height="50" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
      <text x="325" y="180" textAnchor="middle" fill="#2e7d32">addLocationCosts</text>
      <line x1="325" y1="130" x2="325" y2="150" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="220" width="200" height="50" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
      <text x="325" y="250" textAnchor="middle" fill="#2e7d32">addSpecialEquipment</text>
      <line x1="325" y1="200" x2="325" y2="220" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="290" width="200" height="50" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
      <text x="325" y="320" textAnchor="middle" fill="#2e7d32">addStillsEquipment</text>
      <line x1="325" y1="270" x2="325" y2="290" stroke="#47403a" strokeWidth="2" />
      
      <rect x="225" y="360" width="200" height="50" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" 
        className="cursor-pointer" onClick={() => onNodeClick('crew')} />
      <text x="325" y="390" textAnchor="middle" fill="#2e7d32">addStillsCrew</text>
      <line x1="325" y1="340" x2="325" y2="360" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

// Vehicle selection flowchart
const VehiclesFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Vehicle Selection Flowchart</h3>
    <svg width="650" height="550" className="mx-auto">
      {/* Start */}
      <circle cx="325" cy="40" r="20" fill="#47403a" />
      <text x="325" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* Fixer check */}
      <polygon points="325,90 375,140 325,190 275,140" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="145" textAnchor="middle" fill="#47403a" fontSize="12">isFixer?</text>
      <line x1="325" y1="60" x2="325" y2="90" stroke="#47403a" strokeWidth="2" />
      
      {/* Yes - Fixer Car only */}
      <rect x="425" y="115" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="525" y="145" textAnchor="middle" fill="#ed6c02">Add Fixer Production Car</text>
      <line x1="375" y1="140" x2="425" y2="140" stroke="#47403a" strokeWidth="2" />
      
      {/* Early return for fixer */}
      <rect x="425" y="185" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="525" y="215" textAnchor="middle" fill="#ed6c02">Return Early (Skip Rest)</text>
      <line x1="525" y1="165" x2="525" y2="185" stroke="#47403a" strokeWidth="2" />
      
      {/* Car production check */}
      <polygon points="325,230 375,280 325,330 275,280" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="270" textAnchor="middle" fill="#47403a" fontSize="12">Car Production?</text>
      <text x="325" y="290" textAnchor="middle" fill="#47403a" fontSize="10">productionType === 'car'</text>
      <line x1="325" y1="190" x2="325" y2="230" stroke="#47403a" strokeWidth="2" />
      
      {/* Yes - Add main van */}
      <rect x="425" y="255" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="525" y="285" textAnchor="middle" fill="#ed6c02">Add Main Production Van</text>
      <line x1="375" y1="280" x2="425" y2="280" stroke="#47403a" strokeWidth="2" />
      
      {/* Standard vehicle */}
      <rect x="225" y="350" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="325" y="380" textAnchor="middle" fill="#ed6c02">Add Production Vehicle</text>
      <line x1="325" y1="330" x2="325" y2="350" stroke="#47403a" strokeWidth="2" />
      <line x1="525" y1="305" x2="525" y2="330" stroke="#47403a" strokeWidth="2" />
      <line x1="525" y1="330" x2="325" y2="330" stroke="#47403a" strokeWidth="2" />
      
      {/* Crew checks */}
      <rect x="225" y="420" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="325" y="450" textAnchor="middle" fill="#ed6c02">Check Crew for Specialized Vehicles</text>
      <line x1="325" y1="400" x2="325" y2="420" stroke="#47403a" strokeWidth="2" />
      
      {/* Return */}
      <rect x="225" y="490" width="200" height="50" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="325" y="520" textAnchor="middle" fill="#ed6c02">Return Transport Lines</text>
      <line x1="325" y1="470" x2="325" y2="490" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

// Crew selection flowchart 
const CrewFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Crew Selection Flow</h3>
    <svg width="650" height="500" className="mx-auto">
      {/* Start node */}
      <circle cx="325" cy="40" r="20" fill="#47403a" />
      <text x="325" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* Get crew list */}
      <rect x="225" y="80" width="200" height="50" rx="5" fill="#f0f7ff" stroke="#0277bd" strokeWidth="2" />
      <text x="325" y="110" textAnchor="middle" fill="#0277bd">getCrewForProductionType()</text>
      <line x1="325" y1="60" x2="325" y2="80" stroke="#47403a" strokeWidth="2" />
      
      {/* Loop through crew */}
      <rect x="225" y="150" width="200" height="50" rx="5" fill="#f0f7ff" stroke="#0277bd" strokeWidth="2" />
      <text x="325" y="180" textAnchor="middle" fill="#0277bd">For each crewMember</text>
      <line x1="325" y1="130" x2="325" y2="150" stroke="#47403a" strokeWidth="2" />
      
      {/* Skip check */}
      <polygon points="325,220 375,270 325,320 275,270" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="275" textAnchor="middle" fill="#47403a" fontSize="12">Skip Crew?</text>
      <line x1="325" y1="200" x2="325" y2="220" stroke="#47403a" strokeWidth="2" />
      
      {/* Calculate days */}
      <rect x="225" y="340" width="200" height="50" rx="5" fill="#f0f7ff" stroke="#0277bd" strokeWidth="2" />
      <text x="325" y="370" textAnchor="middle" fill="#0277bd">calculateCrewWorkDays()</text>
      <line x1="325" y1="320" x2="325" y2="340" stroke="#47403a" strokeWidth="2" />
      
      {/* Add to budget */}
      <rect x="225" y="410" width="200" height="50" rx="5" fill="#f0f7ff" stroke="#0277bd" strokeWidth="2" />
      <text x="325" y="440" textAnchor="middle" fill="#0277bd">Add crew to budgetLines</text>
      <line x1="325" y1="390" x2="325" y2="410" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

// Data transformation flowchart
const DataFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-6 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Data Transformation Flow</h3>
    <svg width="650" height="400" className="mx-auto">
      {/* Frontend Data */}
      <rect x="50" y="50" width="250" height="100" rx="5" fill="#e6f7ff" stroke="#1e88e5" strokeWidth="2" />
      <text x="175" y="80" textAnchor="middle" fill="#1e88e5" fontWeight="bold">Frontend Data</text>
      <text x="175" y="110" textAnchor="middle" fill="#1e88e5" fontSize="14">keywords: Production types, service level</text>
      <text x="175" y="130" textAnchor="middle" fill="#1e88e5" fontSize="14">equipment: Special equipment (Drone)</text>
      
      {/* Transformation */}
      <rect x="200" y="180" width="250" height="100" rx="5" fill="#fff8e6" stroke="#ed6c02" strokeWidth="2" />
      <text x="325" y="210" textAnchor="middle" fill="#ed6c02" fontWeight="bold">Data Transformation</text>
      <text x="325" y="240" textAnchor="middle" fill="#ed6c02" fontSize="14">data.specials = data.equipment</text>
      <text x="325" y="260" textAnchor="middle" fill="#ed6c02" fontSize="14">data.equipment = data.keywords</text>
      
      {/* Backend Data */}
      <rect x="350" y="310" width="250" height="100" rx="5" fill="#e6ffe6" stroke="#2e7d32" strokeWidth="2" />
      <text x="475" y="340" textAnchor="middle" fill="#2e7d32" fontWeight="bold">Backend Data</text>
      <text x="475" y="370" textAnchor="middle" fill="#2e7d32" fontSize="14">equipment: CONTAINS KEYWORDS!</text>
      <text x="475" y="390" textAnchor="middle" fill="#2e7d32" fontSize="14">specials: CONTAINS EQUIPMENT!</text>
      
      {/* Arrows */}
      <line x1="175" y1="150" x2="250" y2="180" stroke="#47403a" strokeWidth="2" />
      <line x1="325" y1="280" x2="400" y2="310" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

// Equipment selection flowchart
const EquipmentFlowchart = ({ onNodeClick }) => (
  <div className="border border-[#eeebe7] rounded-xl p-4 bg-[#fbfaf8] mb-6">
    <h3 className="font-bold mb-4 text-center">Equipment Selection Flow</h3>
    <svg width="650" height="400" className="mx-auto">
      {/* Start node */}
      <circle cx="325" cy="40" r="20" fill="#47403a" />
      <text x="325" y="45" textAnchor="middle" fill="white" fontSize="12">Start</text>
      
      {/* Get equipment list */}
      <rect x="200" y="80" width="250" height="50" rx="5" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
      <text x="325" y="110" textAnchor="middle" fill="#1976d2">getEquipmentForProductionType()</text>
      <line x1="325" y1="60" x2="325" y2="80" stroke="#47403a" strokeWidth="2" />
      
      {/* Check for camera */}
      <polygon points="325,150 375,200 325,250 275,200" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="205" textAnchor="middle" fill="#47403a" fontSize="12">Needs Camera?</text>
      <line x1="325" y1="130" x2="325" y2="150" stroke="#47403a" strokeWidth="2" />
      
      {/* Yes path for Camera */}
      <rect x="425" y="175" width="175" height="50" rx="5" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
      <text x="512" y="205" textAnchor="middle" fill="#1976d2">Add Camera Package</text>
      <line x1="375" y1="200" x2="425" y2="200" stroke="#47403a" strokeWidth="2" />
      
      {/* Check for lights */}
      <polygon points="325,270 375,320 325,370 275,320" fill="#f8f7f5" stroke="#47403a" strokeWidth="2" />
      <text x="325" y="325" textAnchor="middle" fill="#47403a" fontSize="12">Needs Lights?</text>
      <line x1="325" y1="250" x2="325" y2="270" stroke="#47403a" strokeWidth="2" />
      
      {/* Yes path for Lights */}
      <rect x="425" y="295" width="175" height="50" rx="5" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
      <text x="512" y="325" textAnchor="middle" fill="#1976d2">Add Lighting Package</text>
      <line x1="375" y1="320" x2="425" y2="320" stroke="#47403a" strokeWidth="2" />
    </svg>
  </div>
);

export default FlowchartVisualization;