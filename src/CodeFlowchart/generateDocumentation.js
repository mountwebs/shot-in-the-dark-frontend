// src/CodeFlowchart/generateDocumentation.js
// Utility to generate documentation data from code execution

// Storage for documentation data
let documentationData = {
    lastUpdated: null,
    flowPaths: [], // Will store execution paths
    functionCalls: {}, // Will store function calls with args
    productionTypes: {}, // Information about each production type
    crewSelections: {}, // Track crew selection decisions
    vehicleSelections: {}, // Track vehicle selection decisions
    budgetBreakdown: {} // Track where budget is allocated
  };
  
  // Reset documentation data at the start of a new calculation
  export const resetDocumentation = () => {
    documentationData = {
      lastUpdated: new Date().toISOString(),
      flowPaths: [],
      functionCalls: {},
      productionTypes: {},
      crewSelections: {},
      vehicleSelections: {},
      budgetBreakdown: {}
    };
  };
  
  // Track a function call in the execution path
  export const trackFunctionCall = (functionName, args, result) => {
    // Add to flow path
    documentationData.flowPaths.push({
      function: functionName,
      timestamp: new Date().toISOString(),
      args: JSON.parse(JSON.stringify(args)), // Create safe copy
      resultSummary: summarizeResult(result)
    });
    
    // Store function call details
    if (!documentationData.functionCalls[functionName]) {
      documentationData.functionCalls[functionName] = [];
    }
    
    documentationData.functionCalls[functionName].push({
      timestamp: new Date().toISOString(),
      args: JSON.parse(JSON.stringify(args)),
      resultSummary: summarizeResult(result)
    });
    
    // Special tracking for specific functions
    if (functionName === 'calculateFilmBudget' || 
        functionName === 'calculateStillsBudget') {
      trackProductionType(functionName, args);
    }
    
    if (functionName === 'addFilmCrew' || 
        functionName === 'addStillsCrew') {
      trackCrewSelection(functionName, args, result);
    }
    
    if (functionName === 'calculateTransportNeeds') {
      trackVehicleSelection(args, result);
    }
  };
  
  // Track production type details
  const trackProductionType = (calculationFunction, args) => {
    const productionType = args.productionType || 
      (args.keywords ? args.keywords.find(k => 
        ['film', 'car', 'stills', 'fashion', 'documentary', 'commercial'].includes(k)
      ) : 'unknown');
    
    documentationData.productionTypes[productionType] = {
      calculationFunction,
      budget: args.budget,
      days: args.days || (args.daysInOslo + args.daysOutOfOslo) || 1,
      outsideOslo: args.daysOutOfOslo > 0,
      timestamp: new Date().toISOString()
    };
  };
  
  // Track crew selection details
  const trackCrewSelection = (crewFunction, args, result) => {
    const productionType = args.productionType || 'unknown';
    
    if (!documentationData.crewSelections[productionType]) {
      documentationData.crewSelections[productionType] = {
        crewMembers: [],
        skippedCrewMembers: []
      };
    }
    
    // Extract crew members added and reasons for skipping
    // This assumes result or args contain information about crew decisions
    // You'll need to adapt this based on your actual code structure
    if (result && Array.isArray(result)) {
      documentationData.crewSelections[productionType].crewMembers = 
        result.filter(item => item.group === 'crew')
             .map(crew => ({
                title: crew.title,
                days: crew.quantity,
                total: crew.total
             }));
    }
  };
  
  // Track vehicle selection details
  const trackVehicleSelection = (args, result) => {
    // Extract productionType from args
    const productionType = args.productionType || 'unknown';
    
    // Store vehicle details if available in result
    if (result && Array.isArray(result)) {
      documentationData.vehicleSelections[productionType] = result.map(vehicle => ({
        title: vehicle.title,
        days: vehicle.quantity,
        total: vehicle.total
      }));
    }
  };
  
  // Helper to create a safe summary of a result object
  const summarizeResult = (result) => {
    if (!result) return null;
    
    try {
      if (Array.isArray(result)) {
        return `Array with ${result.length} items`;
      }
      
      if (typeof result === 'object') {
        const summary = {};
        // Extract safe properties
        if (result.totalPriceGross !== undefined) summary.totalPriceGross = result.totalPriceGross;
        if (result.totalPriceNet !== undefined) summary.totalPriceNet = result.totalPriceNet;
        if (result.productionType) summary.productionType = result.productionType;
        if (result.budgetLines) summary.budgetLinesCount = result.budgetLines.length;
        
        return summary;
      }
      
      return String(result);
    } catch (e) {
      return 'Unable to summarize result';
    }
  };
  
  // Get the current documentation data
  export const getDocumentationData = () => {
    return JSON.parse(JSON.stringify(documentationData));
  };
  
  // Save documentation data to localStorage for persistence
  export const saveDocumentationData = () => {
    try {
      localStorage.setItem('budgetDocumentation', JSON.stringify(documentationData));
      console.log('Documentation data saved to localStorage');
      return true;
    } catch (e) {
      console.error('Failed to save documentation data:', e);
      return false;
    }
  };
  
  // Load documentation data from localStorage
  export const loadDocumentationData = () => {
    try {
      const savedData = localStorage.getItem('budgetDocumentation');
      if (savedData) {
        documentationData = JSON.parse(savedData);
        console.log('Documentation data loaded from localStorage');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to load documentation data:', e);
      return false;
    }
  };
  
  // Initialize by trying to load saved data
  loadDocumentationData();