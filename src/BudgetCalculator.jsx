import React, { useState, useEffect, useRef } from 'react';
import { Mail, Check, Upload, Brain, ArrowRight } from 'lucide-react';
import Logo from './assets/Logo 3.png';
import LogoCalc from './assets/Logo calc.png';

// Import images directly
import Work1 from './assets/Bilder/Work 1.png';
import Work2 from './assets/Bilder/Work 2.png';
import Work3 from './assets/Bilder/Work 3.png';
import Work4 from './assets/Bilder/Work 4.png';
import Work5 from './assets/Bilder/Work 5.png';

// Import heuristic analysis
import { analyzeBrief } from './utils/heuristicAnalysis.js';

// Import currency utilities
import { formatCurrency, EXCHANGE_RATES } from './currency-utils';

// Create an array of all images
const images = [Work1, Work2, Work3, Work4, Work5];

// Smart Intake Component (TEXT-ONLY)
const SmartIntake = ({ onApply, onContinue, initialText = "", onTextChange }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");

  // keep local state in sync with parent
  useEffect(() => {
    setText(initialText || "");
  }, [initialText]);

  // Auto-apply (samme mapping som du har i dag)
  const autoApply = (result) => {
    const s = result.suggestions || {};
    const keywords = [];

    if (s.productionType) keywords.push(s.productionType);
    if (s.crewType === 'fullCrew') keywords.push('full-crew');
    else if (s.crewType === 'fixer') keywords.push('fixer');
    if (s.includeCreatives) keywords.push('creatives');
    if (s.includeScout) keywords.push('scout');

    const techEquipmentTypes = ['drone','steadicam','jib','underwater','specialized','roadblock','lowloader'];
    const hasTechEquipment = Array.isArray(s.equipment) && s.equipment.some(item => techEquipmentTypes.includes(item.type));
    if (hasTechEquipment) keywords.push('tech-equipment');

    const mappedEquipment = [];
    (s.equipment || []).forEach(item => {
      if (item.type === 'drone') {
        mappedEquipment.push({ type: 'Drone', days: Math.max(1, item.days) });
      } else if (item.type === 'roadblock') {
        mappedEquipment.push({ type: 'Road block', days: Math.max(1, item.days) });
      } else if (item.type === 'lowloader') {
        mappedEquipment.push({ type: 'Lowloader', days: Math.max(1, item.days) });
      }
    });

    onApply({
      keywords,
      equipment: mappedEquipment,
      daysInOslo: s.daysInOslo ?? 0,
      daysOutOfOslo: s.daysOutOfOslo ?? 0,
      locations: s.locations ?? 1,
      budgetNOK: s.budgetNOK ?? 0,
    });
  };

  async function handleSuggest() {
    setLoading(true);
    setError("");
    setResp(null);

    try {
      const textContent = (text || "").trim();
      if (textContent.length < 40) {
        throw new Error("Please paste at least 40 characters of project details.");
      }

      const result = analyzeBrief(textContent);
      setResp(result);

      if ((result.confidence ?? 0) >= 0.75) {
        setTimeout(() => { autoApply(result); }, 100);
      }
    } catch (e) {
      setError(e.message || "Failed to analyze text.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row items-center gap-12">
{/* LEFT TEXT */}
<div className="w-full lg:w-1/2 text-center sm:text-left max-w-[650px] mx-auto">
  <p className="text-sm font-medium text-[#6f655c] uppercase mb-3">
    Optional AI-assisted prefill
  </p>

  <h2 className="text-3xl sm:text-4xl font-bold text-[#2d2a26] leading-tight mb-6">
    Prompt Assistant
  </h2>

  <p className="text-[#2d2a26] text-base sm:text-lg leading-relaxed mb-8">
  The prompt suggests production inputs, but it’s when you submit your brief — together with your edited inputs — that it becomes a structured prompt for our backend. There, we combine model output with hard-coded cost rules and local expertise. The result is precise and explainable, not solely model-driven.
  </p>

  <div className="grid grid-cols-1 gap-6 text-[#2d2a26] mb-8">
    <div className="flex items-center justify-center sm:justify-start">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center mr-3 sm:mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
        <Brain className="h-5 w-5 text-[#6f655c]" />
      </div>
      <div className="text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-[#2d2a26] mb-1">Step 1. Heuristic Frontend</h3>
        <p className="text-sm text-[#6f655c]">
          The brief can help as a starting point for you inputs but whatever changes you amke will overright this. You don't need to go back to ajust the text.
        </p>
      </div>
    </div>

    <div className="flex items-center justify-center sm:justify-start">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center mr-3 sm:mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
        <span className="text-lg sm:text-xl">⚡</span>
      </div>
      <div className="text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-[#2d2a26] mb-1">Step 2. Backend Budget Engine</h3>
        <p className="text-sm text-[#6f655c]">
          Regardless of the changes you do in the inputs, the brief will be use AI to ajust the final budget to make it more precise. 
        </p>
      </div>
    </div>
  </div>
</div>

        {/* RIGHT INPUT (TEXT ONLY) */}
        <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#eeebe7]">
          <div className="space-y-6">
            {/* Text input */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-[#6f655c] mb-2 block">
                  Paste project details
                </span>
                <textarea
  value={text}
  onChange={(e) => {
    const v = e.target.value;
    setText(v);
    onTextChange?.(v); // notify parent if provided
  }}
  rows={8}
  placeholder="Synopsis, schedule, locations, special requirements…"
  className="w-full bg-[#fbfaf8] rounded-xl p-4 border border-[#eeebe7] text-[#2d2a26] placeholder-[#a39b92] resize-none"
/>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSuggest}
                disabled={loading || text.trim().length < 40}
                className="w-full flex justify-center items-center gap-2 bg-[#47403a] text-white py-3 px-6 rounded-xl hover:bg-[#35302b] transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Analyze & suggest
                  </>
                )}
              </button>

              <button
  onClick={() => onContinue?.(text)}
  className="w-full flex justify-center items-center gap-2 bg-[#f8f7f5] text-[#2d2a26] py-3 px-6 rounded-XL hover:bg-[#f1f0ee] transition-colors"
>
  Continue
  <ArrowRight className="h-4 w-4" />
</button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Results / Preview */}
            {resp && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-green-800">
                    {resp.confidence >= 0.75
                      ? 'Analysis Complete - Applying suggestions...'
                      : 'Analysis Complete - Review suggestions'}
                  </h3>
                </div>
                <div className="text-sm text-green-700">
                  <p>✓ Production type: {resp.suggestions?.productionType || "–"}</p>
                  <p>✓ Crew: {resp.suggestions?.crewType === 'fullCrew' ? 'Full crew' : 'Fixer'}</p>
                  <p>✓ Days: {resp.suggestions?.daysInOslo ?? 0} in Oslo, {resp.suggestions?.daysOutOfOslo ?? 0} outside</p>
                  <p>✓ Budget estimate: {resp.suggestions?.budgetNOK?.toLocaleString("no-NO")} NOK</p>
                  <p className="text-xs mt-1 italic">Confidence: {Math.round((resp.confidence ?? 0) * 100)}%</p>
                </div>

                {resp.confidence < 0.75 && (
                  <button
                    onClick={() => autoApply(resp)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Apply suggestions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip component
const Tooltip = ({ content, children, delay = 1000 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });

    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {showTooltip && content && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: '250px',
            wordWrap: 'break-word'
          }}
        >
          <div className="relative">
            {content}
            <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const BudgetCalculator = () => {
  // Get a random image on component mount
  const [randomImage, setRandomImage] = useState('');
  const [smartText, setSmartText] = useState('');
  
  useEffect(() => {
    // Select a random image from the imported images
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setRandomImage(images[randomIndex]);
    }
  }, []);

  // State variables - starting with 0 values
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState(0); // This is now in display currency
  const [daysInOslo, setDaysInOslo] = useState(0);
  const [daysOutOfOslo, setDaysOutOfOslo] = useState(0);
  const [locations, setLocations] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [currency, setCurrency] = useState('NOK');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  // Keyword descriptions
  const keywordDescriptions = {
    film: "Filming: Shooting moving images, the classic way. If both stills and film are selected, the stills part will politely scale down.",
    stills: "Stills: A different crew with a love for tripods. Generally lower cost, but can scale up if needed. May involve more travel—because the light is always better somewhere else.",
    documentary: "Documentary: Smaller team, flexible setup. Often an add-on to a film shoot—and yes, someone will inevitably suggest 'handheld for authenticity.'",
    commercial: "Commercial: Higher demands on crew and lighting. Everything looks clean and intentional.",
    car: "Car shoot: Road blocks, more logistics, and shiny clients who will never be cold.",
    fashion: "Fashion: Styling, makeup, and perfectly curated locations. We have a studio, but let's be honest—it's mostly for coffee breaks.",
    plates: "Plates: Drive-by or pass-by shots for VFX, usually with a light crew.",
    music: "Music video: Often an add-on to film. Creative demands, unpredictable hours, and the occasional 'can we set this on fire?' request.",
    fixer: "Fixer: Local facilitation only—not a full crew. Think 'your friendly guide who knows a guy.'",
    "full-crew": "Full service: Complete crew, production, and logistics.",
    "tech-equipment": "Camera, lighting, grip packages, and technicians.",
    creatives: "Adds on a DOP and for bigger productions, a director. Works well for remote shoots or if you just want us to make some magic.",
    scout: "Location scouting: Locations move and change, so even with a big database it's worth getting out there.",
    postproduction: "Post-production: Editing, grading, and sound—where we fix it in post.",
    "local-talent": "Local talent: Casting of performers and extras—the friendly faces that make scenes feel genuine.",
    "remote-shoot": "Remote filming: Extra technical setup so you can direct from your sofa, coffee in hand."
  };

  // Constants and options
  const productionTypes = [
    { id: 'film', label: 'Film' },
    { id: 'stills', label: 'Stills' },
    { id: 'documentary', label: 'Documentary' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'car', label: 'Car' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'plates', label: 'Plates' },
    { id: 'music', label: 'Music Video' }
  ];

  const serviceRequirements = [
    { id: 'fixer', label: 'Fixer' },
    { id: 'full-crew', label: 'Full Crew' },
    { id: 'tech-equipment', label: 'Shooting Equipment' },
    { id: 'creatives', label: 'Creatives' },
    { id: 'scout', label: 'Scout' },
    { id: 'postproduction', label: 'Post-prod' },
    { id: 'local-talent', label: 'Casting' },
    { id: 'remote-shoot', label: 'Remote Shoot' }
  ];

  const equipmentOptions = ['Drone', 'Road block', 'Lowloader'];

  // Updated currencySettings - keeping the original structure but using EXCHANGE_RATES for conversion
  const currencySettings = {
    NOK: {
      symbol: 'NOK',
      rate: EXCHANGE_RATES.NOK,
      min: 0,
      max: 2500000,
      step: 10000
    },
    EUR: {
      symbol: '€',
      rate: EXCHANGE_RATES.EUR,
      min: 0,
      max: 212500,  // 2,500,000 NOK * 0.085
      step: 850
    },
    USD: {
      symbol: 'USD',
      rate: EXCHANGE_RATES.USD,
      min: 0,
      max: 225000,
      step: 900
    },
    GBP: {
      symbol: '£',
      rate: EXCHANGE_RATES.GBP,
      min: 0,
      max: 175000,
      step: 700
    },
    CNY: {
      symbol: '¥',
      rate: EXCHANGE_RATES.CNY,
      min: 0,
      max: 1625000, // 2,500,000 NOK * 0.65
      step: 6500
    }
  };

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const { savedEmail, savedCompanyName, savedTitle } = JSON.parse(savedUserData);
      if (savedEmail) setEmail(savedEmail);
      if (savedCompanyName) setCompanyName(savedCompanyName);
      if (savedTitle) setTitle(savedTitle);
    }
  }, []);

  // Save user data to localStorage when they change
  useEffect(() => {
    if (email || companyName || title) {
      localStorage.setItem('userData', JSON.stringify({
        savedEmail: email,
        savedCompanyName: companyName,
        savedTitle: title
      }));
    }
  }, [email, companyName, title]);

  // Calculate recommended budget with specialized adjustments
  const calculateRecommendedBudget = () => {
    // Get minimum budget in current currency
    const min = minimumBudget;
    
    // Return 0 if minimum is 0
    if (min === 0) return 0;
    
    // Start with base recommended (60% above minimum)
    let recommendationMultiplier = 1.6;
    
    // Production type multipliers with cumulative effects
    if (keywords.includes('film')) {
      recommendationMultiplier += 0.25;
    }
    
    if (keywords.includes('car')) {
      recommendationMultiplier += 0.30;
    }
    
    // Special multiplier if BOTH car AND film are selected
    if (keywords.includes('car') && keywords.includes('film')) {
      recommendationMultiplier += 0.15;
    }
    
    // Full crew adjustments based on location
    if (keywords.includes('full-crew')) {
      recommendationMultiplier += 0.25;
      
      // Additional premium for full crew outside Oslo
      if (daysOutOfOslo > 0) {
        recommendationMultiplier += 0.15;
      }
    }
    
    // Technical equipment premium
    if (keywords.includes('tech-equipment')) {
      recommendationMultiplier += 0.15;
    }
    
    // Remote shoot premium
    if (keywords.includes('remote-shoot')) {
      recommendationMultiplier += 0.20;
    }

    if (keywords.includes('postproduction')) {
      recommendationMultiplier += 0.20; // Add 20% to the recommendation multiplier
    }
    
    // Special equipment premium
    const specialEquipmentCount = equipment.length;
    if (specialEquipmentCount > 0) {
      recommendationMultiplier += 0.1 * specialEquipmentCount;
    }
    
    // Additional % for extra locations beyond the first
    if (locations > 1) {
      recommendationMultiplier += 0.1 * (locations - 1);
    }
    
    // Additional % for extra days (beyond the first day)
    if (totalDays > 1) {
      recommendationMultiplier += 0.15 * (totalDays - 1);
    }
    
    // Calculate recommended budget in display currency
    return Math.round(min * recommendationMultiplier);
  };

  // Mark field as touched
  const markFieldAsTouched = (field) => {
    if (touchedFields.submit) {
      setTouchedFields(prev => ({ ...prev, [field]: true }));
    }
  };

  // Format number with spaces
  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Format currency for display using our utility
  const formatCurrencyDisplay = (value, currencyCode) => {
    if (!value && value !== 0) return '';
    return formatCurrency(value, currencyCode);
  };

  // Calculate minimum budget in current currency
  const calculateMinimumBudget = () => {
    const totalDays = daysInOslo + daysOutOfOslo;
    
    // If no days are selected, return 0 budget
    if (totalDays === 0) return 0;
    
    // If locations are 0, use 1 instead for calculations
    const effectiveLocations = locations > 0 ? locations : 1;
    
    let dailyRate = 40000; // Base rate in NOK

    // Apply production type modifiers
    if (keywords.includes('film')) {
      dailyRate = 120000;
    } else if (keywords.includes('car')) {
      dailyRate = 120000;
    } else if (keywords.includes('commercial') || keywords.includes('fashion')) {
      dailyRate = 80000;
    }

    // Additional production types
    if (keywords.includes('stills')) dailyRate += 5000;
    if (keywords.includes('plates')) dailyRate += 8000;
    
    // Calculate base budget for first day
    let minBudget = dailyRate;
    
    // Add costs for additional days (with 10% reduction for each day)
    if (totalDays > 1) {
      for (let day = 2; day <= totalDays; day++) {
        const dayRate = dailyRate * 0.9;
        minBudget += dayRate;
      }
    }

    // Location factor
    const locationFactor = 1 + (0.1 * (effectiveLocations - 1));
    minBudget = minBudget * locationFactor;

    // Service requirements
    if (keywords.includes('local-talent')) minBudget += 50000;
    if (keywords.includes('permits')) minBudget += 10000;
    if (keywords.includes('remote-shoot')) minBudget += 75000;

    // Full crew adjustments
    if (keywords.includes('full-crew')) {
      if (keywords.includes('stills') || keywords.includes('documentary') || keywords.includes('music')) {
        if (daysOutOfOslo > 0) {
          minBudget = Math.max(minBudget, 160000);
        } else {
          minBudget = Math.max(minBudget, 120000);
        }
      } else {
        if (daysOutOfOslo > 0) {
          minBudget = Math.max(minBudget, 300000);
        } else {
          minBudget = Math.max(minBudget, 200000);
        }
      }
    }

    // Technical equipment adjustment
    if (keywords.includes('tech-equipment')) {
      if (keywords.includes('stills') || keywords.includes('documentary') || keywords.includes('music')) {
        minBudget += 10000;
      } else {
        minBudget += 25000;
      }
    }

    // Car shoots
    if (keywords.includes('car')) {
      minBudget += 45000;
    }

    // Add special equipment
    equipment.forEach(item => {
      const cost = item.type === 'Drone' ? 30000 :
        item.type === 'Road block' ? 40000 : 25000;
      minBudget += cost * item.days;
    });
    
    // Apply discounts
    if (keywords.includes('documentary')) {
      minBudget = minBudget * 0.8;
    } else if (keywords.includes('music')) {
      minBudget = minBudget * 0.9;
    }

    if (keywords.includes('postproduction')) {
      minBudget = minBudget * 1.1; // Increase by 10%
    }

    // Calculate in NOK first
    const minBudgetNOK = Math.round(minBudget);
    
    // Then convert to the selected currency
    if (currency === 'NOK') {
      return minBudgetNOK;
    } else {
      return Math.round(minBudgetNOK * EXCHANGE_RATES[currency]);
    }
  };

  // Calculate maximum budget using our currency utilities
  const calculateMaximumBudget = () => {
    const min = minimumBudget;
    
    // If minimum is 0, use a default max value in the current currency
    if (min === 0) {
      return currency === 'NOK' ? 100000 : 
             Math.round(100000 * EXCHANGE_RATES[currency]);
    }
    
    // Use an exponential decay function for the multiplier
    const baseMultiplier = 5;
    const minMultiplier = 2;
    const decayFactor = 1000000;
    
    // If not NOK, we need to convert min to NOK for calculation
    const minInNOK = currency === 'NOK' ? min : Math.round(min / EXCHANGE_RATES[currency]);
    
    // Calculate multiplier using exponential decay
    const multiplier = minMultiplier + (baseMultiplier - minMultiplier) * 
                      Math.exp(-minInNOK / decayFactor);
    
  // Calculate max in NOK
  let maxInNOK = minInNOK * multiplier;
  
  // NEW: Add 30% to maximum budget if post-production is selected
  if (keywords.includes('postproduction')) {
    maxInNOK = maxInNOK * 1.3; // Increase by 30%
  }
  
  // Convert to display currency if needed
  return currency === 'NOK' ? Math.round(maxInNOK) : 
         Math.round(maxInNOK * EXCHANGE_RATES[currency]);
};

  // Handle smooth step transition
  const handleStepChange = (newStep) => {
    if (newStep !== step) {
      setSlideDirection(newStep > step ? 'right' : 'left');
      setTimeout(() => {
        setStep(newStep);
        setSlideDirection(null);
      }, 200);
    }
  };

  // Handle applying smart intake suggestions
  const handleSmartIntakeApply = (suggestions) => {
    setKeywords(suggestions.keywords);
    setEquipment(suggestions.equipment);
    setDaysInOslo(suggestions.daysInOslo);
    setDaysOutOfOslo(suggestions.daysOutOfOslo);
    setLocations(suggestions.locations);
    
    // Set budget if provided (convert from NOK if needed)
    if (suggestions.budgetNOK > 0) {
      if (currency === 'NOK') {
        setBudget(suggestions.budgetNOK);
      } else {
        setBudget(Math.round(suggestions.budgetNOK * EXCHANGE_RATES[currency]));
      }
    }
    
    // Move to budget step
    handleStepChange(3);
  };

  // Handle continuing from smart intake
  const handleSmartIntakeContinue = () => {
    handleStepChange(3);
  };

  // Validate form in real time
  const validateFields = () => {
    if (!touchedFields.submit) return true;
    
    const newErrors = {};
    
    if (!title) {
      newErrors.title = true;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = true;
    }
    
    if (totalDays < 1) {
      newErrors.days = true;
    }
    
    if (locations < 1 || (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2)) {
      newErrors.locations = true;
    }
    
    if (budget < minimumBudget && minimumBudget > 0) {
      newErrors.budget = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate the entire form for submission
  const validateForm = () => {
    setTouchedFields({
      title: true,
      email: true,
      days: true,
      locations: true,
      budget: true,
      submit: true
    });
    
    const newErrors = {};

    if (!title) newErrors.title = true;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = true;
    
    if (totalDays < 1) {
      newErrors.days = true;
    }
    
    if (locations < 1 || (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2)) {
      newErrors.locations = true;
    }
    
    if (budget < minimumBudget && minimumBudget > 0) {
      newErrors.budget = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate total days and budget per day
  const totalDays = daysInOslo + daysOutOfOslo;
  const budgetPerDay = totalDays > 0 ? Math.round(budget / totalDays) : 0;
  
  // Calculate min, max, and recommended budget values
  const minimumBudget = calculateMinimumBudget();
  const maximumBudget = calculateMaximumBudget();
  const recommendedBudget = calculateRecommendedBudget();

  // Toggle keyword with special handling for fixer + full-crew
  const toggleKeyword = (keywordId) => {
    let newKeywords = [...keywords];
    
    // Handle fixer and full-crew mutual exclusivity
    if (keywordId === 'full-crew' && !keywords.includes(keywordId) && keywords.includes('fixer')) {
      newKeywords = newKeywords.filter(id => id !== 'fixer');
    }
    
    if (keywordId === 'fixer' && !keywords.includes(keywordId) && keywords.includes('full-crew')) {
      newKeywords = newKeywords.filter(id => id !== 'full-crew');
    }
    
    // Toggle the requested keyword
    if (keywords.includes(keywordId)) {
      newKeywords = newKeywords.filter(id => id !== keywordId);
    } else {
      newKeywords.push(keywordId);
    }
    
    setKeywords(newKeywords);
    
    // Update budget recommendation if needed
    if (totalDays > 0 && budget === 0) {
      setTimeout(() => {
        const newRecommendedBudget = calculateRecommendedBudget();
        setBudget(newRecommendedBudget);
      }, 0);
    }
  };

  // Toggle equipment
  const toggleEquipment = (equipType) => {
    let newEquipment;
    if (equipment.some(item => item.type === equipType)) {
      newEquipment = equipment.filter(item => item.type !== equipType);
    } else {
      newEquipment = [...equipment, { type: equipType, days: totalDays > 0 ? 1 : 0 }];
    }
    
    setEquipment(newEquipment);
    
    // Update budget recommendation if needed
    if (totalDays > 0 && budget === 0) {
      setTimeout(() => {
        const newRecommendedBudget = calculateRecommendedBudget();
        setBudget(newRecommendedBudget);
      }, 0);
    }
  };

  // Change equipment days
  const changeEquipmentDays = (equipType, change) => {
    const newEquipment = equipment.map(item => {
      if (item.type === equipType) {
        return {
          ...item,
          days: Math.max(1, Math.min(totalDays > 0 ? totalDays : 1, item.days + change))
        };
      }
      return item;
    });
    
    setEquipment(newEquipment);
    
    // Update budget recommendation if needed
    if (totalDays > 0 && budget === 0) {
      setTimeout(() => {
        const newRecommendedBudget = calculateRecommendedBudget();
        setBudget(newRecommendedBudget);
      }, 0);
    }
  };

  // Handle budget input change
  const handleBudgetInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const newBudget = value === '' ? 0 : Number(value);
    
    // Update display budget
    setBudget(newBudget);
  };

  // Handle slider change
  const handleBudgetSliderChange = (e) => {
    const newBudget = Number(e.target.value);
    
    // Update display budget
    setBudget(newBudget);
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const oldCurrency = currency;
    
    // Skip if same currency
    if (newCurrency === oldCurrency) return;
    
    console.log(`Currency change: ${oldCurrency} to ${newCurrency}`);
    
    // First update the currency
    setCurrency(newCurrency);
    
    // Then update the display budget based on rates
    if (budget > 0) {
      let newBudgetValue;
      
      // Convert budget using exchange rates
      if (oldCurrency === 'NOK') {
        // From NOK to foreign currency
        newBudgetValue = Math.round(budget * EXCHANGE_RATES[newCurrency]);
      } else if (newCurrency === 'NOK') {
        // From foreign currency to NOK
        newBudgetValue = Math.round(budget / EXCHANGE_RATES[oldCurrency]);
      } else {
        // From one foreign currency to another
        const valueInNOK = Math.round(budget / EXCHANGE_RATES[oldCurrency]);
        newBudgetValue = Math.round(valueInNOK * EXCHANGE_RATES[newCurrency]);
      }
      
      console.log(`Converting budget: ${budget} ${oldCurrency} → ${newBudgetValue} ${newCurrency}`);
      
      setBudget(newBudgetValue);
    }
  };

  // Handle form submission - MODIFIED to convert to NOK before sending
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Calculate NOK budget value
    let budgetInNOK = budget;
    if (currency !== 'NOK') {
      // Use the rate from our currency settings to convert to NOK
      budgetInNOK = Math.round(budget / EXCHANGE_RATES[currency]);
      console.log(`Converting ${budget} ${currency} to ${budgetInNOK} NOK for backend processing`);
    }

    const formData = {
      title,
      companyName,
      email,
      budget: budgetInNOK,
      currency,
      daysInOslo,
      daysOutOfOslo,
      locations,
      keywords,
      equipment,
      ...(smartText?.trim() ? { brief: smartText.trim() } : {}),
    };

    console.log("Submitting form data:", formData);
    console.log("Original budget:", budget, currency);
    console.log("Budget in NOK:", budgetInNOK);

    try {
      console.log(JSON.stringify(formData))
      const response = await fetch('https://stiangk.dev/api/shot-in-the-dark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        console.error("Server error:", await response.text());
        throw new Error('Failed to submit form');
      }

      setIsSubmitting(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setErrors({ submit: 'Failed to submit the form. Please try again later.' });
    }
  };

  // Run validation whenever relevant fields change but only after first submit
  useEffect(() => {
    if (touchedFields.submit) {
      validateFields();
    }
  }, [title, email, daysInOslo, daysOutOfOslo, locations, budget, currency, keywords, equipment]);

  // Effect to update locations when both in/out of Oslo selected
  useEffect(() => {
    if (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2) {
      setLocations(2);
    }
    
    // Update budget when days change
    if (totalDays > 0 && budget === 0) {
      const newRecommendedBudget = calculateRecommendedBudget();
      setBudget(newRecommendedBudget);
    }
  }, [daysInOslo, daysOutOfOslo]);

  // Effect to update budget validation when minimum changes
  useEffect(() => {
    if (touchedFields.submit && budget < minimumBudget && minimumBudget > 0) {
      setErrors(prev => ({...prev, budget: true}));
    } else if (touchedFields.submit && errors.budget && budget >= minimumBudget) {
      const newErrors = {...errors};
      delete newErrors.budget;
      setErrors(newErrors);
    }
  }, [minimumBudget, budget]);

  // Success message
  if (success) {
    return (
      <div className="budget-calculator bg-[#f8f7f5] min-h-screen min-w-[320px] flex flex-col">
        {/* Logo at the top */}
        <div className="pt-6 sm:pt-10 pb-2 sm:pb-4">
          <div className="flex justify-center">
            <div className="h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center">
              <img src={LogoCalc} alt="Line.Calc Logo" className="h-6 sm:h-8" />
            </div>
          </div>
        </div>
        
        {/* Success content */}
        <div className="flex-grow flex items-center justify-center px-6" style={{ marginTop: '-70px' }}>
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-md w-full mx-auto">
            <div className="w-16 h-16 bg-[#f1f0ee] text-[#47403a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-[#2d2a26]">Estimate Sent!</h2>
            <p className="text-[#47403a] mb-6 max-w-md mx-auto px-4">
              We've sent your project estimate to <span className="font-semibold">{email}</span>.
              Please check your inbox.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setBudget(0);
                setKeywords([]);
                setEquipment([]);
                setDaysInOslo(0);
                setDaysOutOfOslo(0);
                setLocations(0);
                setStep(1);
                // We keep title, companyName and email as requested
                setErrors({});
                setTouchedFields({});
              }}
              className="px-6 py-3 bg-[#47403a] text-white rounded-xl hover:bg-[#35302b] transition-colors"
            >
              Create Another Estimate
            </button>
          </div>
        </div>
        
        {/* Logo at the bottom */}
        <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex justify-center">
          <div className="w-12 sm:w-16 mb-2 sm:mb-4">
            <a href="https://www.line.productions/" target="_blank" rel="noopener noreferrer">
              <img src={Logo} alt="Line.Production Logo" className="w-full" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-calculator bg-[#f8f7f5] min-h-screen min-w-[320px] flex flex-col pb-28">
      <style jsx>{`
        .slide-container {
          transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        
        .slide-left {
          transform: translateX(-3%);
          opacity: 0;
        }
        
        .slide-right {
          transform: translateX(3%);
          opacity: 0;
        }
        
        /* Custom slider thumb styling */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 1px solid #47403a;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        input[type=range]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 1px solid #47403a;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        /* Remove default focus styles */
        input[type=range]:focus {
          outline: none;
        }
      `}</style>
      
      {/* Logo at the top */}
      <header className="shrink-0 py-3 sm:py-4">
  <div className="flex justify-center">
    <div className="h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center">
      <img src={LogoCalc} alt="Line.Calc Logo" className="h-6 sm:h-8" />
    </div>
  </div>
</header>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-6">
  <div className="max-w-6xl w-full mx-auto">
          <div className={`slide-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
            {/* STEP 1 – INTRO SLIDE */}
            {step === 1 && (
              <div className="flex flex-col">
                {/* INTRO SECTION */}
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* LEFT TEXT - Center on mobile */}
                  <div className="w-full lg:w-1/2 text-center sm:text-left max-w-[650px] mx-auto">
                    <p className="text-sm font-medium text-[#6f655c] uppercase mb-3">
                      A free budgeting service for service productions
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#2d2a26] leading-tight mb-6">
                      How to get your budget
                    </h2>
                    <p className="text-[#2d2a26] text-base sm:text-lg leading-relaxed mb-8">
                      Write productions notes on the next slide, and clear inputs on the third. We will instantly generate a reliable
                      budget estimate based on industry-standard costs, our expertise as well as some voluntary AI. The draft will be
                      sent directly to your email — and ours — for further review.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#2d2a26] mb-8">
                      <div className="flex items-center justify-center sm:justify-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center mr-3 sm:mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
                          <span className="text-lg sm:text-xl">📩</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#2d2a26]">Get the budget to your inbox.</h3>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center mr-3 sm:mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
                          <span className="text-lg sm:text-xl">🌍</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#2d2a26]">Understand your own production.</h3>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT IMAGE - Show on all devices */}
                  <div className="lg:w-[45%] w-full rounded-2xl overflow-hidden shadow-md mt-2 sm:mt-0">
                    {randomImage ? (
                      <img
                        src={randomImage}
                        alt="Production imagery"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-[400px] bg-[#f1f0ee] flex items-center justify-center">
                        <span className="text-[#6f655c]">Loading image...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 - SMART INTAKE */}
            {step === 2 && (
              <SmartIntake
  onApply={handleSmartIntakeApply}
  onContinue={(t) => { setSmartText(t); handleStepChange(3); }}
  initialText={smartText}
  onTextChange={setSmartText}
/>
  
)}



            {/* STEP 3 - CALCULATOR */}
            {step === 3 && (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 px-1">
                {/* Left side - Basic info */}
                <div className="w-full lg:w-5/12 space-y-4 flex flex-col justify-center">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92] ${errors.title ? 'ring-2 ring-red-400' : ''}`}
                      placeholder="Give your project a title"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92]"
                        placeholder="Company name"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92] ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                        placeholder="Your email (required)"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="relative">
                        <input
                          type="text"
                          value={budget === 0 ? '' : formatNumber(budget)}
                          onChange={handleBudgetInputChange}
                          className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] text-left placeholder-[#a39b92] ${errors.budget ? 'ring-2 ring-red-400' : ''}`}
                          placeholder="Add details to calculate"
                        />
                        <div className="absolute inset-y-0 right-0 flex">
                          <select
                            value={currency}
                            onChange={handleCurrencyChange}
                            className="h-full bg-[#fbfaf8] border-0 border-l border-[#eeebe7] rounded-r-xl appearance-none px-3 text-[#6f655c]"
                          >
                            <option value="NOK">NOK</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="CNY">CNY</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Budget slider */}
                      {budget > 0 && minimumBudget > 0 && (
                        <div className="mt-4 px-1">
                          <input
                            type="range"
                            min={minimumBudget}
                            max={maximumBudget}
                            value={budget}
                            onChange={handleBudgetSliderChange}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ 
                              background: `linear-gradient(to right, 
                                rgba(255, 149, 0, 0.7) 0%, 
                                rgba(255, 183, 77, 0.7) ${Math.min(100, (recommendedBudget - minimumBudget) / (maximumBudget - minimumBudget) * 100) * 0.5}%, 
                                rgba(66, 133, 244, 0.7) 100%)`,
                              WebkitAppearance: 'none'
                            }}
                          />
                          
                          {/* Min and max values */}
                          <div className="flex justify-between text-xs text-[#6f655c] mt-2">
                            <span>{formatCurrencyDisplay(minimumBudget, currency)}</span>
                            <span>{formatCurrencyDisplay(maximumBudget, currency)}</span>
                          </div>
                          
                          {/* Explanation text */}
                          <div className="mt-2 text-xs text-[#6f655c] italic">
                            <p>Costs vary based on crew size, talent, and specific needs. Position your budget where appropriate for your project.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Keywords section */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Production Type */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#6f655c] text-left">Production Type</label>
                        <div className="flex flex-wrap gap-2">
                          {productionTypes.map(type => (
                            <Tooltip key={type.id} content={keywordDescriptions[type.id]}>
                              <button
                                type="button"
                                className={`px-3 py-2 text-sm rounded-xl transition-colors ${keywords.includes(type.id)
                                  ? 'bg-[#47403a] text-white'
                                  : 'bg-[#f8f7f5] text-[#2d2a26] hover:bg-[#f1f0ee]'
                                  }`}
                                onClick={() => toggleKeyword(type.id)}
                              >
                                {type.label}
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      </div>

                      {/* Service Requirements */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#6f655c] text-left">Service Requirements</label>
                        <div className="flex flex-wrap gap-2">
                          {serviceRequirements.map(req => (
                            <Tooltip key={req.id} content={keywordDescriptions[req.id]}>
                              <button
                                type="button"
                                className={`px-3 py-2 text-sm rounded-xl transition-colors ${keywords.includes(req.id)
                                  ? 'bg-[#47403a] text-white'
                                  : 'bg-[#f8f7f5] text-[#2d2a26] hover:bg-[#f1f0ee]'
                                  }`}
                                onClick={() => toggleKeyword(req.id)}
                              >
                                {req.label}
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Production details */}
                <div className="w-full lg:w-7/12 bg-white rounded-2xl shadow-sm p-8 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Shooting days and locations row - with spread out plus/minus buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* OSLO DAYS */}
                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Shooting in Oslo</label>
                        <div className={`bg-[#fbfaf8] p-3 rounded-xl h-16 flex items-center justify-between ${errors.days ? 'ring-2 ring-red-400' : ''}`}>
                          {/* Left minus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] ml-2"
                            onClick={() => setDaysInOslo(Math.max(0, daysInOslo - 1))}
                          >
                            -
                          </button>
                          
                          {/* Center content with input and label */}
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={daysInOslo}
                              onChange={(e) => {
                                setDaysInOslo(Math.max(0, Number(e.target.value)));
                              }}
                              min="0"
                              className="w-12 sm:w-16 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium"
                              placeholder="0"
                            />
                            <span className="text-sm text-[#6f655c]">day{daysInOslo !== 1 ? 's' : ''}</span>
                          </div>
                          
                          {/* Right plus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] mr-2"
                            onClick={() => setDaysInOslo(daysInOslo + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* OUTSIDE OSLO DAYS */}
                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Shooting out of Oslo</label>
                        <div className={`bg-[#fbfaf8] p-3 rounded-xl h-16 flex items-center justify-between ${errors.days ? 'ring-2 ring-red-400' : ''}`}>
                          {/* Left minus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] ml-2"
                            onClick={() => setDaysOutOfOslo(Math.max(0, daysOutOfOslo - 1))}
                          >
                            -
                          </button>
                          
                          {/* Center content with input and label */}
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={daysOutOfOslo}
                              onChange={(e) => {
                                setDaysOutOfOslo(Math.max(0, Number(e.target.value)));
                              }}
                              min="0"
                              className="w-12 sm:w-16 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium"
                              placeholder="0"
                            />
                            <span className="text-sm text-[#6f655c]">day{daysOutOfOslo !== 1 ? 's' : ''}</span>
                          </div>
                          
                          {/* Right plus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] mr-2"
                            onClick={() => setDaysOutOfOslo(daysOutOfOslo + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* LOCATIONS */}
                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Number of locations</label>
                        <div className={`bg-[#fbfaf8] p-3 rounded-xl h-16 flex items-center justify-between ${errors.locations ? 'ring-2 ring-red-400' : ''}`}>
                          {/* Left minus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] ml-2"
                            onClick={() => setLocations(Math.max(daysInOslo > 0 && daysOutOfOslo > 0 ? 2 : 0, locations - 1))}
                            disabled={daysInOslo > 0 && daysOutOfOslo > 0 && locations <= 2}
                          >
                            -
                          </button>
                          
                          {/* Center content with input and label */}
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={locations}
                              onChange={(e) => {
                                setLocations(Math.max(daysInOslo > 0 && daysOutOfOslo > 0 ? 2 : 0, Number(e.target.value)));
                              }}
                              min={daysInOslo > 0 && daysOutOfOslo > 0 ? 2 : 0}
                              className="w-12 sm:w-16 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium"
                              placeholder="0"
                            />
                            <span className="text-sm text-[#6f655c]">location{locations !== 1 ? 's' : ''}</span>
                          </div>
                          
                          {/* Right plus button */}
                          <button
                            type="button"
                            className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#f1f0ee] hover:bg-[#e9e6e2] rounded-full text-[#6f655c] mr-2"
                            onClick={() => setLocations(locations + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Special equipment section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-[#6f655c]">Special Equipment</label>
                        {totalDays === 0 && (
                          <span className="text-[#6f655c] text-xs italic">
                            Add shooting days to enable
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {equipmentOptions.map(equip => (
                          <div 
                            key={equip} 
                            className={`border border-[#eeebe7] rounded-xl overflow-hidden shadow-sm ${totalDays === 0 ? 'opacity-50' : ''}`}
                          >
                            <div
                              className={`p-3 cursor-pointer transition-all ${equipment.some(item => item.type === equip)
                                ? 'bg-[#47403a] text-white'
                                : 'bg-[#fbfaf8] hover:bg-[#f1f0ee]'
                                }`}
                              onClick={() => totalDays > 0 && toggleEquipment(equip)}
                            >
                              <div className={`font-medium text-center ${equipment.some(item => item.type === equip) ? 'text-white' : 'text-[#2d2a26]'}`}>
                                {equip}
                              </div>
                            </div>

                            {equipment.some(item => item.type === equip) && (
                              <div className="bg-white p-2 border-t border-[#eeebe7]">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    className="w-7 h-7 flex items-center justify-center bg-[#f8f7f5] rounded-full text-[#6f655c] hover:bg-[#f1f0ee]"
                                    onClick={() => changeEquipmentDays(equip, -1)}
                                    disabled={totalDays === 0}
                                  >
                                    -
                                  </button>
                                  <span className="text-base font-medium text-[#2d2a26]">
                                    {equipment.find(item => item.type === equip)?.days || 1} {
                                      (equipment.find(item => item.type === equip)?.days || 1) === 1 ? 'day' : 'days'
                                    }
                                  </span>
                                  <button
                                    type="button"
                                    className="w-7 h-7 flex items-center justify-center bg-[#f8f7f5] rounded-full text-[#6f655c] hover:bg-[#f1f0ee]"
                                    onClick={() => changeEquipmentDays(equip, 1)}
                                    disabled={totalDays === 0}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Summary */}
                    <div className="bg-[#fbfaf8] px-5 py-4 rounded-xl mb-4 shadow-sm border border-[#eeebe7]">
                      <h3 className="text-base font-semibold text-center text-[#2d2a26] mb-3">Project Summary</h3>

                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="text-[#6f655c]">Total Shooting Days</div>
                        <div className="text-[#2d2a26] font-medium">
                          {totalDays > 0 ? `${totalDays} day${totalDays !== 1 ? 's' : ''}` : '—'}
                        </div>

                        <div className="text-[#6f655c]">Budget</div>
                        <div className="text-[#2d2a26] font-medium">
                          {budget > 0 
                            ? formatCurrencyDisplay(budget, currency)
                            : '—'}
                        </div>

                        <div className="text-[#6f655c]">Production Type</div>
                        <div className="text-[#2d2a26] font-medium">
                          {keywords.filter((id) => productionTypes.some((pt) => pt.id === id)).length > 0
                            ? keywords
                                .filter((id) => productionTypes.some((pt) => pt.id === id))
                                .map((k) => productionTypes.find((pt) => pt.id === k)?.label)
                                .join(', ')
                            : '—'}
                        </div>

                        <div className="text-[#6f655c]">Service Requirements</div>
                        <div className="text-[#2d2a26] font-medium">
                          {keywords.filter((id) => serviceRequirements.some((sr) => sr.id === id)).length > 0
                            ? keywords
                                .filter((id) => serviceRequirements.some((sr) => sr.id === id))
                                .map((k) => serviceRequirements.find((sr) => sr.id === k)?.label)
                                .join(', ')
                            : '—'}
                        </div>

                        <div className="text-[#6f655c]">Special Equipment</div>
                        <div className="text-[#2d2a26] font-medium">
                          {equipment.length > 0
                            ? equipment
                                .map((item) => `${item.type} (${item.days}d)`)
                                .join(', ')
                            : '—'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 bg-[#47403a] hover:bg-[#35302b] text-white py-4 px-6 rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                        disabled={isSubmitting || totalDays === 0 || budget === 0}
                        onClick={() => markFieldAsTouched('submit')}
                      >
                        {isSubmitting ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291z"></path>
                          </svg>
                        ) : (
                          <Mail className="h-5 w-5" />
                        )}
                        Get your estimate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed navigation at the bottom with logo */}
<div className="fixed bottom-0 left-0 right-0 z-10">
  <div className="pt-4 pb-6 shadow-md sm:shadow-none sm:bg-transparent sm:backdrop-blur-none bg-[#f8f7f5]/80 backdrop-blur-md transition-all">
    <div className="flex flex-col items-center">

{/* Pills (narrow, equal 2px border all around) */}
<div className="nav-pills relative flex w-full max-w-[450px] h-12 bg-white rounded-full shadow-sm border border-[#eeebe7] mb-3 p-[6px] overflow-hidden">
  {/* Indicator */}
  <div
  className="absolute top-[6px] bottom-[6px] left-[6px] rounded-full bg-[#47403a] transition-transform duration-200 ease-in-out"
  style={{
    width: 'calc((100% - 12px) / 3)', // 12px = 2 * 6px padding
    transform:
      step === 1 ? 'translateX(0%)' :
      step === 2 ? 'translateX(100%)' :
                    'translateX(200%)'
  }}
/>

  {/* Buttons */}
  <div className="relative z-10 flex h-full w-full">
    <button
      onClick={() => handleStepChange(1)}
      className="flex-1 h-full rounded-full flex items-center justify-center"
    >
      <span className={`font-medium text-sm transition-colors duration-200 ${step === 1 ? 'text-white' : 'text-[#6f655c]'}`}>
        Info
      </span>
    </button>

    <button
      onClick={() => handleStepChange(2)}
      className="flex-1 h-full rounded-full flex items-center justify-center"
    >
      <span className={`font-medium text-sm transition-colors duration-200 ${step === 2 ? 'text-white' : 'text-[#6f655c]'}`}>
        Smart
      </span>
    </button>

    <button
      onClick={() => handleStepChange(3)}
      className="flex-1 h-full rounded-full flex items-center justify-center"
    >
      <span className={`font-medium text-sm transition-colors duration-200 ${step === 3 ? 'text-white' : 'text-[#6f655c]'}`}>
        Inputs
      </span>
    </button>
  </div>
</div>

      {/* Logo */}
      <div className="w-10 sm:w-14 mt-4">
        <a href="https://www.line.productions/" target="_blank" rel="noopener noreferrer">
          <img src={Logo} alt="Line.Production Logo" className="w-full" />
        </a>
      </div>

    </div>
  </div>
</div>
    </div>
  );
};

export default BudgetCalculator;