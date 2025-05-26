// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import BudgetCalculator from './BudgetCalculator'
import ProtectedDocs from './CodeFlowchart/ProtectedDocs'

function App() {
  console.log("App rendering, routes should be set up");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BudgetCalculator />} />
        <Route path="/flow" element={<ProtectedDocs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App