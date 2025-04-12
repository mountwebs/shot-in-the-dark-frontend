import React, { useState, useEffect } from 'react';
import { Mail, Check } from 'lucide-react';
import Logo from './assets/Logo 3.png';
import LogoCalc from './assets/Logo calc.png';

// Import images directly
import Work1 from './assets/Bilder/Work 1.png';
import Work2 from './assets/Bilder/Work 2.png';
import Work3 from './assets/Bilder/Work 3.png';
import Work4 from './assets/Bilder/Work 4.png';
import Work5 from './assets/Bilder/Work 5.png';

// Create an array of all images
const images = [Work1, Work2, Work3, Work4, Work5];

const BudgetCalculator = () => {
  // Get a random image on component mount
  const [randomImage, setRandomImage] = useState('');
  
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
  const [budget, setBudget] = useState(0); // Start with 0 budget
  const [daysInOslo, setDaysInOslo] = useState(0); // Start with 0 days
  const [daysOutOfOslo, setDaysOutOfOslo] = useState(0);
  const [locations, setLocations] = useState(0); // Start with 0 locations
  const [keywords, setKeywords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [currency, setCurrency] = useState('NOK');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);

  // Constants and options
  const productionTypes = [
    { id: 'stills', label: 'Stills' },
    { id: 'car', label: 'Car' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'film', label: 'Film' },
    { id: 'plates', label: 'Plates' },
    { id: 'documentary', label: 'Documentary' },
    { id: 'music', label: 'Music Video' }
  ];

  const serviceRequirements = [
    { id: 'fixer', label: 'Fixer' },
    { id: 'full-crew', label: 'Full Crew' },
    { id: 'tech-equipment', label: 'Technical Equipment' },
    { id: 'local-talent', label: 'Local Talent' },
    { id: 'permits', label: 'Permits' }
  ];

  const equipmentOptions = ['Drone', 'Road block', 'Lowloader'];

  const currencySettings = {
    NOK: {
      symbol: 'NOK',
      rate: 1,
      min: 0, // Changed to 0 to allow starting from zero
      max: 2500000,
      step: 10000
    },
    USD: {
      symbol: 'USD',
      rate: 0.09,
      min: 0, // Changed to 0
      max: 225000,
      step: 900
    },
    GBP: {
      symbol: '£',
      rate: 0.07,
      min: 0, // Changed to 0
      max: 175000,
      step: 700
    }
  };

  // Format number with spaces
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Convert amount between currencies
  const convertAmount = (amount, from, to) => {
    // Convert to NOK first if not already
    const inNOK = from === 'NOK' ? amount : amount / currencySettings[from].rate;
    // Then convert to target currency
    return to === 'NOK' ? inNOK : inNOK * currencySettings[to].rate;
  };

  // Calculate minimum budget
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
      dailyRate = 100000;
    } else if (keywords.includes('commercial') || keywords.includes('fashion')) {
      dailyRate = 80000;
    }

    // Additional production types
    if (keywords.includes('stills')) dailyRate += 5000;
    if (keywords.includes('plates')) dailyRate += 8000;
    if (keywords.includes('documentary')) dailyRate += 15000;
    
    // Music video rate reduced by 15% as requested
    if (keywords.includes('music')) dailyRate += 17000; // Reduced from 20000

    // Service requirements
    if (keywords.includes('local-talent')) dailyRate += 50000;
    if (keywords.includes('permits')) dailyRate += 10000;

    // Full crew adjustments - lower cost for stills, documentary, and music video
    if (keywords.includes('full-crew')) {
      if (keywords.includes('stills') || keywords.includes('documentary') || keywords.includes('music')) {
        // Reduced rates for stills, documentary, and music video productions
        if (daysOutOfOslo > 0) {
          dailyRate = Math.max(dailyRate, 160000); // Lower rate for outside Oslo
        } else {
          dailyRate = Math.max(dailyRate, 120000); // Lower rate for in Oslo
        }
      } else {
        // Standard rates for other production types
        if (daysOutOfOslo > 0) {
          dailyRate = Math.max(dailyRate, 300000);
        } else {
          dailyRate = Math.max(dailyRate, 200000);
        }
      }
    }

    // Technical equipment adjustment - reduced for stills, documentary, and music video
    if (keywords.includes('tech-equipment')) {
      if (keywords.includes('stills') || keywords.includes('documentary') || keywords.includes('music')) {
        dailyRate += 10000; // Further reduced rate
      } else {
        dailyRate += 25000; // Standard rate
      }
    }

    // Calculate base budget for first day
    let minBudget = dailyRate;
    
    // Add costs for additional days (with 10% reduction for each day as requested)
    if (totalDays > 1) {
      for (let day = 2; day <= totalDays; day++) {
        // Apply a 10% reduction for each additional day
        const dayRate = dailyRate * 0.9; // 10% reduction
        minBudget += dayRate;
      }
    }

    // Location factor
    const locationFactor = 1 + (0.1 * (effectiveLocations - 1));
    minBudget = minBudget * locationFactor;

    // Add fixer cost only if fixer is selected and totalDays > 1
    if (keywords.includes('fixer') && totalDays > 1) {
      const fixerCostPerDay = daysOutOfOslo > 0 ? 70000 : 40000;
      minBudget += fixerCostPerDay * (totalDays - 1); // first day included in baseline
    }

    // Add special equipment
    equipment.forEach(item => {
      const cost = item.type === 'Drone' ? 30000 :
        item.type === 'Road block' ? 40000 : 25000;
      minBudget += cost * item.days;
    });

    // Return the calculated minimum budget in NOK
    return Math.round(minBudget);
  };

  // Calculate maximum budget (dynamic based on inputs)
  const calculateMaximumBudget = () => {
    const min = minimumBudget;
    
    // If minimum is 0, use a default max of 100,000
    if (min === 0) return 100000;
    
    // Set max to be a multiple of the minimum, with different scaling based on size
    if (min < 200000) return min * 5; // 5x for smaller budgets
    if (min < 500000) return min * 4; // 4x for medium budgets
    if (min < 1000000) return min * 3; // 3x for larger budgets
    return min * 2; // 2x for very large budgets
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

  // Calculate total days and budget per day
  const totalDays = daysInOslo + daysOutOfOslo;
  const budgetPerDay = totalDays > 0 ? Math.round(budget / totalDays) : 0;
  const minimumBudget = calculateMinimumBudget();
  const maximumBudget = calculateMaximumBudget();

  // Toggle keyword with special handling for fixer + full-crew
  const toggleKeyword = (keywordId) => {
    let newKeywords = [...keywords];
    
    // If clicking full-crew, remove fixer if it exists
    if (keywordId === 'full-crew' && !keywords.includes(keywordId) && keywords.includes('fixer')) {
      newKeywords = newKeywords.filter(id => id !== 'fixer');
    }
    
    // If clicking fixer, remove full-crew if it exists
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
    
    // Update budget when selections change
    if (totalDays > 0) {
      setTimeout(() => {
        const calcBudget = calculateMinimumBudget();
        if (calcBudget > budget || budget === 0) {
          setBudget(calcBudget);
        }
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
    
    // Update budget when selections change
    if (totalDays > 0) {
      setTimeout(() => {
        const calcBudget = calculateMinimumBudget();
        if (calcBudget > budget || budget === 0) {
          setBudget(calcBudget);
        }
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
    
    // Update budget when selections change
    if (totalDays > 0) {
      setTimeout(() => {
        const calcBudget = calculateMinimumBudget();
        if (calcBudget > budget || budget === 0) {
          setBudget(calcBudget);
        }
      }, 0);
    }
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    // Convert budget to new currency
    const newBudget = Math.round(convertAmount(budget, currency, newCurrency));
    setBudget(newBudget);
    setCurrency(newCurrency);
  };

  // Handle budget slider change
  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Project name is required";
    if (!email) newErrors.email = "Email is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
    
    // Require at least one day of shooting
    if (totalDays < 1) {
      newErrors.days = "At least one shooting day is required";
    }
    
    // Require at least one location
    if (locations < 1) {
      newErrors.locations = "At least one location is required";
    }
    
    if (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2) {
      newErrors.locations = "At least 2 locations required when shooting both in and out of Oslo";
    }
    
    // Make sure budget is at least the minimum calculated amount
    if (budget < minimumBudget && minimumBudget > 0) {
      newErrors.budget = `Budget must be at least ${formatNumber(minimumBudget)} ${currencySettings[currency].symbol}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = {
      title,
      companyName,
      email,
      budget,
      daysInOslo,
      daysOutOfOslo,
      locations,
      keywords,
      equipment,
      currency,
    };

    console.log(JSON.stringify(formData));

    try {
      const response = await fetch('https://stiangk.dev/api/shot-in-the-dark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
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

  // Effect to update locations when both in/out of Oslo selected
  useEffect(() => {
    if (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2) {
      setLocations(2);
    }
    
    // Update budget when days change
    const newMinBudget = calculateMinimumBudget();
    if ((totalDays > 0 && (newMinBudget > budget || budget === 0))) {
      setBudget(newMinBudget);
    }
  }, [daysInOslo, daysOutOfOslo]);

  // Effect to update budget when minimum changes
  useEffect(() => {
    const newMinBudget = calculateMinimumBudget();
    if (totalDays > 0 && (newMinBudget > budget || budget === 0)) {
      setBudget(newMinBudget);
    }
  }, [minimumBudget, locations, keywords, equipment]);

  // Success message
  if (success) {
    return (
      <div className="text-center py-16 bg-[#f8f7f5] rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-[#f1f0ee] text-[#47403a] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-[#2d2a26]">Estimate Sent!</h2>
        <p className="text-[#47403a] mb-6 max-w-md mx-auto">
          We've sent your project estimate to <span className="font-semibold">{email}</span>.
          Please check your inbox.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-[#47403a] text-white rounded-xl hover:bg-[#35302b] transition-colors"
        >
          Create Another Estimate
        </button>
      </div>
    );
  }

  return (
    <div className="budget-calculator bg-[#f8f7f5] min-h-screen min-w-[320px] flex flex-col pb-20">
      {/* CSS for slide transitions */}
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
      `}</style>
      
      {/* Logo and Label at the top with more space - improved for mobile */}
      <div className="pt-3 sm:pt-6 pb-2 sm:pb-4">
        <div className="flex justify-center">
          <div className="h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center">
            <img src={LogoCalc} alt="Line.Calc Logo" className="h-6 sm:h-8" />
          </div>
        </div>
      </div>
      
      {/* Main content area with vertical centering */}
      <div className="relative flex flex-col flex-grow" style={{ marginTop: '70px' }}>
  <div className="max-w-6xl w-full mx-auto px-6">
    <div className={`slide-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
            {/* STEP 1 – INTRO SLIDE */}
            {step === 1 && (
              <div className="flex flex-col">
                {/* INTRO SECTION */}
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* LEFT TEXT */}
                  <div className="lg:w-1/2 text-left max-w-[650px]">
                    <p className="text-sm font-medium text-[#6f655c] uppercase mb-3">
                      A free budgeting service for service productions
                    </p>
                    <h2 className="text-4xl font-bold text-[#2d2a26] leading-tight mb-6">
                      How to get your budget
                    </h2>
                    <p className="text-[#2d2a26] text-lg leading-relaxed mb-8">
                      Enter your production details, and Line.Calc will instantly generate a reliable
                      budget estimate based on industry-standard costs and our expertise. The draft will be
                      sent directly to your email — and ours — for further review. This tool gives you a clear
                      starting point to understand the possibilities of filming in Norway with Line.Production.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#2d2a26] mb-12">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
                          <span className="text-xl">📩</span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2d2a26]">Get the budget to your inbox.</h3>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 border border-[#eeebe7] flex-shrink-0 shadow-sm">
                          <span className="text-xl">🌍</span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2d2a26]">Focus on the why and where.</h3>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT IMAGE - Random image from Bilder folder */}
                  <div className="lg:w-[45%] rounded-2xl overflow-hidden shadow-md">
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

            {/* STEP 2 - CALCULATOR */}
            {step === 2 && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-1">
                {/* Left side - Basic info - Vertically centered */}
                <div className="w-full lg:w-5/12 space-y-4 flex flex-col justify-center">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92] ${errors.title ? 'ring-2 ring-red-400' : ''}`}
                      placeholder="Give your project a title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92]"
                        placeholder="Company name (optional)"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] placeholder-[#a39b92] ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                        placeholder="Your email (required)"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

                    <div className="mt-6">
                      <div className="relative">
                        <input
                          type="text"
                          value={budget === 0 ? '' : formatNumber(budget)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setBudget(value === '' ? 0 : Number(value));
                          }}
                          className={`w-full p-4 bg-[#fbfaf8] border-0 rounded-xl text-[#2d2a26] text-left placeholder-[#a39b92] ${errors.budget ? 'ring-2 ring-red-400' : ''}`}
                          placeholder="Add details to calculate"
                          readOnly={totalDays > 0} // Make it read-only when days are added
                        />
                        <div className="absolute inset-y-0 right-0 flex">
                          <select
                            value={currency}
                            onChange={handleCurrencyChange}
                            className="h-full bg-[#fbfaf8] border-0 border-l border-[#eeebe7] rounded-r-xl appearance-none px-3 text-[#6f655c]"
                            disabled={budget === 0}
                          >
                            <option value="NOK">NOK</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Budget slider - only visible when budget > 0 */}
                      {budget > 0 && (
                        <div className="mt-4 px-1">
                          <input
                            type="range"
                            min={minimumBudget}
                            max={maximumBudget}
                            value={budget}
                            onChange={handleBudgetChange}
                            className="w-full h-2 bg-[#f1f0ee] rounded-lg appearance-none cursor-pointer accent-[#47403a]"
                          />
                          <div className="flex justify-between text-xs text-[#6f655c] mt-1">
                            <span>{formatNumber(minimumBudget)}</span>
                            <span>{formatNumber(maximumBudget)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                  </div>

                  {/* Keywords section */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Production Type */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#6f655c] text-left">Production Type</label>
                        <div className="flex flex-wrap gap-2">
                          {productionTypes.map(type => (
                            <button
                              key={type.id}
                              type="button"
                              className={`px-3 py-2 text-sm rounded-xl transition-colors ${keywords.includes(type.id)
                                ? 'bg-[#47403a] text-white'
                                : 'bg-[#f8f7f5] text-[#2d2a26] hover:bg-[#f1f0ee]'
                                }`}
                              onClick={() => toggleKeyword(type.id)}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Service Requirements */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#6f655c] text-left">Service Requirements</label>
                        <div className="flex flex-wrap gap-2">
                          {serviceRequirements.map(req => (
                            <button
                              key={req.id}
                              type="button"
                              className={`px-3 py-2 text-sm rounded-xl transition-colors ${keywords.includes(req.id)
                                ? 'bg-[#47403a] text-white'
                                : 'bg-[#f8f7f5] text-[#2d2a26] hover:bg-[#f1f0ee]'
                                }`}
                              onClick={() => toggleKeyword(req.id)}
                              title={req.id === 'fixer' ? 'Cannot be selected with Full Crew' : 
                                   (req.id === 'full-crew' ? 'Cannot be selected with Fixer' : '')}
                            >
                              {req.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Production details */}
                <div className="w-full lg:w-7/12 bg-white rounded-2xl shadow-sm p-8 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Shooting days and locations row - improved for mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Shooting in Oslo</label>
                        <div className="bg-[#fbfaf8] p-4 rounded-xl h-16 flex items-center justify-center">
                          <input
                            type="number"
                            value={daysInOslo}
                            onChange={(e) => setDaysInOslo(Math.max(0, Number(e.target.value)))}
                            min="0"
                            className={`w-20 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium ${errors.days ? 'ring-2 ring-red-400' : ''}`}
                            placeholder="0"
                          />
                          <span className="text-sm text-[#6f655c] ml-1">day{daysInOslo !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Shooting out of Oslo</label>
                        <div className="bg-[#fbfaf8] p-4 rounded-xl h-16 flex items-center justify-center">
                          <input
                            type="number"
                            value={daysOutOfOslo}
                            onChange={(e) => setDaysOutOfOslo(Math.max(0, Number(e.target.value)))}
                            min="0"
                            className="w-20 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium"
                            placeholder="0"
                          />
                          <span className="text-sm text-[#6f655c] ml-1">day{daysOutOfOslo !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm text-[#6f655c] mb-1">Number of locations</label>
                        <div className="bg-[#fbfaf8] p-4 rounded-xl h-16 flex items-center justify-center">
                          <input
                            type="number"
                            value={locations}
                            onChange={(e) => setLocations(Math.max(0, Number(e.target.value)))}
                            min={daysInOslo > 0 && daysOutOfOslo > 0 ? 2 : 0}
                            className={`w-20 text-center bg-transparent border-0 text-[#2d2a26] text-xl font-medium ${errors.locations ? 'ring-2 ring-red-400' : ''}`}
                            placeholder="0"
                          />
                          <span className="text-sm text-[#6f655c] ml-1">location{locations !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    {errors.days && <p className="mt-1 text-sm text-red-500">{errors.days}</p>}
                    {errors.locations && <p className="mt-1 text-sm text-red-500">{errors.locations}</p>}

                    {/* Special equipment section - disabled until days are added */}
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

                    {/* Condensed Summary - displays "—" when values are 0 */}
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
                            ? `${formatNumber(budget)} ${currencySettings[currency].symbol}`
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

      {/* Fixed navigation at the bottom with logo - with improved mobile spacing */}
      {!success && (
        <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex flex-col items-center justify-center px-4">
          <div className="nav-pills flex w-full max-w-xs h-12 bg-white rounded-full shadow-sm relative border border-[#eeebe7] mb-4 sm:mb-6">
            {/* Background pill that shows on active side */}
            <div 
              className="nav-pill-indicator absolute top-1 bottom-1 bg-[#47403a] rounded-full transition-all duration-200 ease-in-out"
              style={{ 
                width: 'calc(50% - 6px)',
                left: step === 2 ? 'calc(50% + 3px)' : '3px',
              }}
            ></div>
            
            {/* Two equal width buttons */}
            <button 
              onClick={() => handleStepChange(1)}
              className="z-10 flex-1 h-full rounded-full flex items-center justify-center"
            >
              <span className={`font-medium text-sm transition-colors duration-200 ${step === 1 ? 'text-white' : 'text-[#6f655c]'}`}>
                Info
              </span>
            </button>
            
            <button 
              onClick={() => handleStepChange(2)}
              className="z-10 flex-1 h-full rounded-full flex items-center justify-center"
            >
              <span className={`font-medium text-sm transition-colors duration-200 ${step === 2 ? 'text-white' : 'text-[#6f655c]'}`}>
                Budget
              </span>
            </button>
          </div>
          
          {/* Logo at the bottom - fully opaque */}
          <div className="w-12 sm:w-16 mb-2 sm:mb-4">
  <a href="https://www.line.productions/" target="_blank" rel="noopener noreferrer">
    <img src={Logo} alt="Line.Production Logo" className="w-full" />
  </a>
</div>
        </div>
      )}
    </div>
  );
};

export default BudgetCalculator;