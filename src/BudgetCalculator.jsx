import React, { useState, useEffect } from 'react';
import { Mail, Check } from 'lucide-react';

const BudgetCalculator = () => {
  // State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState(100000);
  const [daysInOslo, setDaysInOslo] = useState(1);
  const [daysOutOfOslo, setDaysOutOfOslo] = useState(0);
  const [locations, setLocations] = useState(1);
  const [keywords, setKeywords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [currency, setCurrency] = useState('NOK');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      min: 100000,
      max: 2500000,
      step: 100000
    },
    USD: {
      symbol: 'USD',
      rate: 0.09,
      min: 9000,
      max: 225000,
      step: 9000
    },
    GBP: {
      symbol: '£',
      rate: 0.07,
      min: 7000,
      max: 175000,
      step: 7000
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
    if (keywords.includes('music')) dailyRate += 20000;

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

    // Fixer adjustment
    if (keywords.includes('fixer')) {
      if (daysOutOfOslo > 0) {
        dailyRate += 70000;
      } else {
        dailyRate += 40000;
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

    // Calculate base budget
    let minBudget = totalDays * dailyRate;

    // Location factor
    const locationFactor = 1 + (0.1 * (locations - 1));
    minBudget = minBudget * locationFactor;

    // Add special equipment
    equipment.forEach(item => {
      const cost = item.type === 'Drone' ? 30000 :
        item.type === 'Road block' ? 40000 : 25000;
      minBudget += cost * item.days;
    });

    // Ensure minimum budget in NOK
    const minNOK = Math.max(100000, Math.round(minBudget));

    // Convert to selected currency
    return Math.round(convertAmount(minNOK, 'NOK', currency));
  };

  // Calculate total days and budget per day
  const totalDays = daysInOslo + daysOutOfOslo;
  const budgetPerDay = totalDays > 0 ? Math.round(budget / totalDays) : 0;
  const minimumBudget = calculateMinimumBudget();

  // Toggle keyword
  const toggleKeyword = (keywordId) => {
    if (keywords.includes(keywordId)) {
      setKeywords(keywords.filter(id => id !== keywordId));
    } else {
      setKeywords([...keywords, keywordId]);
    }
  };

  // Toggle equipment
  const toggleEquipment = (equipType) => {
    if (equipment.some(item => item.type === equipType)) {
      setEquipment(equipment.filter(item => item.type !== equipType));
    } else {
      setEquipment([...equipment, { type: equipType, days: 1 }]);
    }
  };

  // Change equipment days
  const changeEquipmentDays = (equipType, change) => {
    setEquipment(equipment.map(item => {
      if (item.type === equipType) {
        return {
          ...item,
          days: Math.max(1, Math.min(totalDays, item.days + change))
        };
      }
      return item;
    }));
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    // Convert budget to new currency
    const newBudget = Math.round(convertAmount(budget, currency, newCurrency));
    setBudget(newBudget);
    setCurrency(newCurrency);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Project name is required";
    if (!email) newErrors.email = "Email is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";

    if (budget < minimumBudget) {
      newErrors.budget = `Budget must be at least ${formatNumber(minimumBudget)} ${currencySettings[currency].symbol}`;
    }

    if (totalDays < 1) {
      newErrors.days = "At least one shooting day is required";
    }

    if (daysInOslo > 0 && daysOutOfOslo > 0 && locations < 2) {
      newErrors.locations = "At least 2 locations required when shooting both in and out of Oslo";
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
  }, [daysInOslo, daysOutOfOslo, locations]);

  // Effect to update budget when minimum changes
  useEffect(() => {
    if (budget < minimumBudget) {
      setBudget(minimumBudget);
    }
  }, [budget, minimumBudget]);

  // Success message
  if (success) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Estimate Sent!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We've sent your project estimate to <span className="font-semibold">{email}</span>.
          Please check your inbox.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Create Another Estimate
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Basic info */}
        <div className="w-full lg:w-5/12">
          <div className="mb-8">
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400 ${errors.title ? 'ring-2 ring-red-500' : ''}`}
                placeholder="Give your project a title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400"
                  placeholder="Company name (optional)"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Your email (required)"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={formatNumber(budget)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setBudget(value === '' ? currencySettings[currency].min : Number(value));
                    }}
                    className={`w-full p-4 bg-gray-50 border-0 rounded-l-md text-gray-900 text-xl font-medium ${errors.budget ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="Your budget"
                  />
                  <div className="absolute inset-y-0 right-0 flex">
                    <select
                      value={currency}
                      onChange={handleCurrencyChange}
                      className="h-full bg-gray-50 border-0 border-l border-gray-200 rounded-r-md appearance-none px-3 text-gray-500"
                    >
                      <option value="NOK">NOK</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="px-2">
                  <input
                    type="range"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={minimumBudget}
                    max={currencySettings[currency].max}
                    step={currencySettings[currency].step}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatNumber(minimumBudget)}</span>
                    <span>{formatNumber(Math.round(currencySettings[currency].max * 0.4))}</span>
                    <span>{formatNumber(currencySettings[currency].max)}</span>
                  </div>
                </div>
              </div>
              {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}

              {/* Keywords section */}
              <div className="mt-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Production Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Production Type</label>
                    <div className="flex flex-wrap gap-2">
                      {productionTypes.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${keywords.includes(type.id)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          onClick={() => toggleKeyword(type.id)}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Requirements */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Requirements</label>
                    <div className="flex flex-wrap gap-2">
                      {serviceRequirements.map(req => (
                        <button
                          key={req.id}
                          type="button"
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${keywords.includes(req.id)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          onClick={() => toggleKeyword(req.id)}
                        >
                          {req.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Production details */}
        <div className="w-full lg:w-7/12 bg-white rounded-lg shadow-sm p-6 border border-gray-100">

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shooting days and locations row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm text-gray-500 mb-1">Shooting in Oslo</label>
                <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                  <input
                    type="number"
                    value={daysInOslo}
                    onChange={(e) => setDaysInOslo(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className={`w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium ${errors.days ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-500 ml-1">day{daysInOslo !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-500 mb-1">Shooting out of Oslo</label>
                <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                  <input
                    type="number"
                    value={daysOutOfOslo}
                    onChange={(e) => setDaysOutOfOslo(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-500 ml-1">day{daysOutOfOslo !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-500 mb-1">Number of locations</label>
                <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                  <input
                    type="number"
                    value={locations}
                    onChange={(e) => setLocations(Math.max(1, Number(e.target.value)))}
                    min={daysInOslo > 0 && daysOutOfOslo > 0 ? 2 : 1}
                    className={`w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium ${errors.locations ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="1"
                  />
                  <span className="text-sm text-gray-500 ml-1">location{locations !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            {errors.days && <p className="mt-1 text-sm text-red-500">{errors.days}</p>}
            {errors.locations && <p className="mt-1 text-sm text-red-500">{errors.locations}</p>}

            {/* Special equipment section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Equipment</label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {equipmentOptions.map(equip => (
                  <div key={equip} className="border border-gray-200 rounded-md overflow-hidden">
                    <div
                      className={`p-3 cursor-pointer transition-all ${equipment.some(item => item.type === equip)
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      onClick={() => toggleEquipment(equip)}
                    >
                      <div className="font-medium text-center">{equip}</div>
                    </div>

                    {equipment.some(item => item.type === equip) && (
                      <div className="bg-white p-2 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                            onClick={() => changeEquipmentDays(equip, -1)}
                          >
                            -
                          </button>
                          <span className="text-base font-medium">
                            {equipment.find(item => item.type === equip)?.days || 1} {
                              (equipment.find(item => item.type === equip)?.days || 1) === 1 ? 'day' : 'days'
                            }
                          </span>
                          <button
                            type="button"
                            className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                            onClick={() => changeEquipmentDays(equip, 1)}
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

{/* Summary */}
<div className="bg-gray-50 p-3 rounded-md mb-4">
  <h3 className="text-base font-semibold text-gray-800 mb-2">Project Summary</h3>
  <div className="grid grid-cols-2 gap-2 text-sm">
    <div className="text-gray-500">Total Shooting Days:</div>
    <div>{totalDays} day{totalDays !== 1 ? 's' : ''}</div>

    <div className="text-gray-500">Budget:</div>
    <div>{formatNumber(budget)} {currencySettings[currency].symbol}</div>

    <div className="text-gray-500">Production Type:</div>
    <div>
      {keywords.filter((id) =>
        productionTypes.some((pt) => pt.id === id)
      ).length > 0
        ? keywords
            .filter((id) => productionTypes.some((pt) => pt.id === id))
            .map((k) => productionTypes.find((pt) => pt.id === k)?.label)
            .join(', ')
        : 'None selected'}
    </div>

    <div className="text-gray-500">Service Requirements:</div>
    <div>
      {keywords.filter((id) =>
        serviceRequirements.some((sr) => sr.id === id)
      ).length > 0
        ? keywords
            .filter((id) => serviceRequirements.some((sr) => sr.id === id))
            .map((k) => serviceRequirements.find((sr) => sr.id === k)?.label)
            .join(', ')
        : 'None selected'}
    </div>

    <div className="text-gray-500">Special Equipment:</div>
    <div>
      {equipment.length > 0
        ? equipment
            .map(
              (item) =>
                `${item.type} (${item.days} day${item.days !== 1 ? 's' : ''})`
            )
            .join(', ')
        : 'None selected'}
    </div>
  </div>
</div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-md transition-colors disabled:opacity-70"
                disabled={isSubmitting}
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
    </div>
  );
};

export default BudgetCalculator;
