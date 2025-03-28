import React, { useState, useEffect } from 'react';
import { ChevronDown, Mail, Download, Check } from 'lucide-react';

const BudgetCalculator = () => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    email: '',
    budget: 100000,
    daysInOslo: 1,
    daysOutOfOslo: 0,
    numberOfLocations: 1,
    special1: 'N/A',
    daysSpecial1: 0,
    special2: 'N/A',
    daysSpecial2: 0,
    special3: 'N/A',
    daysSpecial3: 0
  });

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const specialOptions = ['N/A', 'Drone', 'Road block', 'Lowloader'];
  const keywords = [
    { id: 'stills', label: 'Stills' },
    { id: 'car', label: 'Car' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'film', label: 'Film' },
    { id: 'plates', label: 'Plates' },
    { id: 'underwater', label: 'Underwater' },
    { id: 'aerial', label: 'Aerial' },
    { id: 'documentary', label: 'Documentary' },
    { id: 'music', label: 'Music Video' },
    { id: 'fixer', label: 'Fixer' },
    { id: 'full-crew', label: 'Full Crew' },
    { id: 'tech-equipment', label: 'Technical Equipment' }
  ];

  // Format number with spaces as thousands separator
  const formatNumberWithSpaces = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Calculate the minimum budget based on inputs
  const calculateMinimumBudget = () => {
    let minBudget = 100000; // Default minimum
    const totalDays = formData.daysInOslo + formData.daysOutOfOslo;

    // Base per day rate
    let dailyRate = 40000; // Base daily rate

    // Adjust for keywords
    if (selectedKeywords.includes('film')) {
      dailyRate = 120000;
    } else if (selectedKeywords.includes('car') || selectedKeywords.includes('underwater')) {
      dailyRate = 100000;
    } else if (selectedKeywords.includes('commercial') || selectedKeywords.includes('fashion')) {
      dailyRate = 80000;
    } else if (selectedKeywords.includes('aerial')) {
      dailyRate = 70000;
    }

    // Full crew adjustment
    if (selectedKeywords.includes('full-crew')) {
      dailyRate += 40000; // Substantial increase for full crew
    }

    // Technical equipment adjustment
    if (selectedKeywords.includes('tech-equipment')) {
      dailyRate += 25000;
    }

    // Calculate base on days and rate
    const calculatedMin = totalDays * dailyRate;

    // Account for locations
    const locationFactor = 1 + (0.1 * (formData.numberOfLocations - 1));

    // Special equipment adds cost
    let specialEquipmentCost = 0;
    if (formData.special1 === 'Drone') {
      specialEquipmentCost += 30000 * formData.daysSpecial1;
    } else if (formData.special1 === 'Road block') {
      specialEquipmentCost += 40000 * formData.daysSpecial1;
    } else if (formData.special1 === 'Lowloader') {
      specialEquipmentCost += 25000 * formData.daysSpecial1;
    }

    // Final calculation with minimum enforced
    return Math.max(minBudget, Math.round((calculatedMin * locationFactor) + specialEquipmentCost));
  };

  // Calculate derived values
  const totalDays = formData.daysInOslo + formData.daysOutOfOslo;
  const budgetPerDay = totalDays > 0 ? Math.round(formData.budget / totalDays) : 0;
  const minimumBudget = calculateMinimumBudget();

  // Toggle keywords
  const toggleKeyword = (keywordId) => {
    setSelectedKeywords(prevSelected => {
      if (prevSelected.includes(keywordId)) {
        return prevSelected.filter(id => id !== keywordId);
      } else {
        return [...prevSelected, keywordId];
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number' || type === 'range') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Project name is required";
    if (!formData.email) newErrors.email = "Email is required for sending";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.budget || formData.budget < minimumBudget) {
      newErrors.budget = `Budget must be at least ${formatNumberWithSpaces(minimumBudget)} NOK based on your selections`;
    }

    const totalDays = formData.daysInOslo + formData.daysOutOfOslo;
    if (totalDays < 1) {
      newErrors.daysInOslo = "At least one shooting day is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, action = 'email') => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'email') {
        setSubmitSuccess(true);
      } else {
        // For download option
        const dummyPdfUrl = "#";
        const link = document.createElement('a');
        link.href = dummyPdfUrl;
        link.download = `${formData.title || 'project'}-estimate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update budget when inputs change
  useEffect(() => {
    const newMinBudget = calculateMinimumBudget();
    if (formData.budget < newMinBudget) {
      setFormData(prev => ({
        ...prev,
        budget: newMinBudget
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.daysInOslo,
    formData.daysOutOfOslo,
    formData.numberOfLocations,
    formData.special1,
    formData.daysSpecial1,
    // selectedKeywords is an object that changes reference, so we use length instead
    selectedKeywords.length
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      {submitSuccess ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Estimate Sent!</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We've sent your project estimate to <span className="font-semibold">{formData.email}</span>.
            Please check your inbox.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Create Another Estimate
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="w-full lg:w-5/12">
            <h1 className="text-4xl font-bold mb-4">Estimate you price</h1>
            <p className="text-gray-800 mb-2">
              This calculator estimates costs based on key variables, providing a clear overview of resource allocation.
            </p>
            <p className="text-gray-500 mb-6">
              Acknowledging the early stage of production, consider this a preliminary draft.
              We'll collaborate closely to refine options tailored to your needs.
            </p>

            <div className="mb-8">
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400 ${errors.title ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Give your project a title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400"
                    placeholder="Company name (optional)"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 placeholder-gray-400 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="Your email (required for sending)"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="budget"
                      value={formatNumberWithSpaces(formData.budget)}
                      onChange={(e) => {
                        // Remove all non-digit characters and parse as number
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({
                          ...formData,
                          budget: value === '' ? '' : Number(value)
                        });
                      }}
                      className={`w-full p-4 bg-gray-50 border-0 rounded-md text-gray-900 text-xl font-medium ${errors.budget ? 'ring-2 ring-red-500' : ''}`}
                      placeholder="Your budget"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">NOK</span>
                  </div>

                  <div className="px-2">
                    <input
                      type="range"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min={minimumBudget}
                      max={5000000}
                      step={100000}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatNumberWithSpaces(minimumBudget)}</span>
                      <span>{formatNumberWithSpaces(1000000)}</span>
                      <span>{formatNumberWithSpaces(2500000)}</span>
                      <span>{formatNumberWithSpaces(5000000)}</span>
                    </div>
                  </div>
                </div>
                {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}

                {/* Keywords section - moved beneath budget outside the form frame */}
                <div className="mt-6 space-y-2 mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords for your production</label>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map(keyword => (
                      <button
                        key={keyword.id}
                        type="button"
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedKeywords.includes(keyword.id)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        onClick={() => toggleKeyword(keyword.id)}
                      >
                        {keyword.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-7/12 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="mb-2 flex items-center">
              <div className="w-4 h-4 rounded-sm bg-gray-200 mr-2 flex items-center justify-center">
                <Check className="w-3 h-3 text-gray-500" />
              </div>
              <span className="text-gray-800 font-medium">Fill in your info and get your estimate</span>
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'email')} className="space-y-8">
              {/* Shooting days and locations row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 mb-1">Shooting in Oslo</label>
                  <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                    <input
                      type="number"
                      name="daysInOslo"
                      value={formData.daysInOslo}
                      onChange={handleChange}
                      min="0"
                      className={`w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium ${errors.daysInOslo ? 'ring-2 ring-red-500' : ''}`}
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-500 ml-1">day{formData.daysInOslo !== 1 ? 's' : ''}</span>
                  </div>
                  {errors.daysInOslo && <p className="mt-1 text-sm text-red-500">{errors.daysInOslo}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 mb-1">Shooting out of Oslo</label>
                  <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                    <input
                      type="number"
                      name="daysOutOfOslo"
                      value={formData.daysOutOfOslo}
                      onChange={handleChange}
                      min="0"
                      className="w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-500 ml-1">day{formData.daysOutOfOslo !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 mb-1">Number of locations</label>
                  <div className="bg-gray-50 p-4 rounded-md h-16 flex items-center justify-center">
                    <input
                      type="number"
                      name="numberOfLocations"
                      value={formData.numberOfLocations}
                      onChange={handleChange}
                      min="1"
                      className="w-20 text-center bg-transparent border-0 text-gray-900 text-xl font-medium"
                      placeholder="1"
                    />
                    <span className="text-sm text-gray-500 ml-1">location{formData.numberOfLocations !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Special equipment section - separated into individual items */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Equipment</label>

                {/* Drone option */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        special1: prev.special1 === 'Drone' ? 'N/A' : 'Drone',
                        daysSpecial1: prev.special1 === 'Drone' ? 0 : prev.daysSpecial1 || 1
                      }));
                    }}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${formData.special1 === 'Drone'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    Drone
                  </button>

                  {formData.special1 === 'Drone' && (
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <input
                        type="number"
                        name="daysSpecial1"
                        value={formData.daysSpecial1}
                        onChange={handleChange}
                        min="1"
                        max={totalDays}
                        className="w-12 text-center bg-transparent border-0 text-gray-900 text-sm"
                      />
                      <span className="text-sm text-gray-600 ml-1">day{formData.daysSpecial1 !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Road block option */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        special1: prev.special1 === 'Road block' ? 'N/A' : 'Road block',
                        daysSpecial1: prev.special1 === 'Road block' ? 0 : prev.daysSpecial1 || 1
                      }));
                    }}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${formData.special1 === 'Road block'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    Road block
                  </button>

                  {formData.special1 === 'Road block' && (
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <input
                        type="number"
                        name="daysSpecial1"
                        value={formData.daysSpecial1}
                        onChange={handleChange}
                        min="1"
                        max={totalDays}
                        className="w-12 text-center bg-transparent border-0 text-gray-900 text-sm"
                      />
                      <span className="text-sm text-gray-600 ml-1">day{formData.daysSpecial1 !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Lowloader option */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        special1: prev.special1 === 'Lowloader' ? 'N/A' : 'Lowloader',
                        daysSpecial1: prev.special1 === 'Lowloader' ? 0 : prev.daysSpecial1 || 1
                      }));
                    }}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${formData.special1 === 'Lowloader'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    Lowloader
                  </button>

                  {formData.special1 === 'Lowloader' && (
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <input
                        type="number"
                        name="daysSpecial1"
                        value={formData.daysSpecial1}
                        onChange={handleChange}
                        min="1"
                        max={totalDays}
                        className="w-12 text-center bg-transparent border-0 text-gray-900 text-sm"
                      />
                      <span className="text-sm text-gray-600 ml-1">day{formData.daysSpecial1 !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {errors.special1 && <p className="mt-1 text-sm text-red-500">{errors.special1}</p>}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Request Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Total Shooting Days:</div>
                  <div>{totalDays} day{totalDays !== 1 ? 's' : ''}</div>

                  <div className="text-gray-500">Budget:</div>
                  <div>{formatNumberWithSpaces(formData.budget)} NOK</div>

                  <div className="text-gray-500">Budget per Day:</div>
                  <div>{formatNumberWithSpaces(budgetPerDay)} NOK</div>

                  <div className="text-gray-500">Project Type:</div>
                  <div>{selectedKeywords.length > 0
                    ? selectedKeywords.map(k => keywords.find(kw => kw.id === k)?.label).join(', ')
                    : 'None selected'}</div>

                  {formData.special1 !== 'N/A' && (
                    <>
                      <div className="text-gray-500">{formData.special1}:</div>
                      <div>{formData.daysSpecial1} day{formData.daysSpecial1 !== 1 ? 's' : ''}</div>
                    </>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 p-4 rounded-md text-red-600">
                  {submitError}
                </div>
              )}

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

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'download')}
                  className="w-full flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-md transition-colors disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291z"></path>
                    </svg>
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  Download estimate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCalculator;
