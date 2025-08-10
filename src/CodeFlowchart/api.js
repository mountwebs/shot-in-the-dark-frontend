// src/CodeFlowchart/api.js
export async function fetchFlowchartData() {
    try {
      // This URL should point to your backend
      // Adjust if your backend is on a different domain or port
      const response = await fetch('http://localhost:3000/api/flowchart-data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching flowchart data:', error);
      throw error; // Re-throw to let calling code handle it
    }
  } 