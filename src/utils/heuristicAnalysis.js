// utils/heuristicAnalysis.js - Produksjonsanalyse for Norge v3.0

/**
 * Konfigurasjonsobjekt for alle vekter, priser og multiplikatorer
 * Gjør det enkelt å justere verdier uten å endre logikken
 */
const CONFIG = {
  // Basis dagrater per produksjonstype (NOK)
  baseDailyRates: {
    film: 160000,
    commercial: 120000,
    stills: 60000,
    documentary: 70000,
    default: 80000
  },
  
  // Crew type multiplikatorer
  crewMultipliers: {
    fullCrew: 1.0,
    fixer: 0.6
  },
  
  // Poengvekter for produksjonstype
  productionTypeWeights: {
    film: 30,
    commercial: 25,
    stills: 20,
    documentary: 15
  },
  
  // Poengvekter for crew type
  crewTypeWeights: {
    fullCrew: 30,
    fixer: 15
  },
  
  // Utstyrskostnader (NOK)
  equipmentCosts: {
    drone: 30000,
    underwater: 100000,
    steadicam: 40000,
    jib: 40000,
    roadblock: 50000,
    lowloader: 60000,
    specialized: 50000
  },
  
  // Tilleggskostnader
  additionalCosts: {
    scout: 50000,
    creatives: 100000,
    travelPerDay: 20000
  },
  
  // Internasjonale multiplikatorer
  internationalMultipliers: {
    american: 1.5,
    nordic: 1.2,
    european: 1.3,
    default: 1.0
  },
  
  // Confidence score ranges
  confidenceThresholds: {
    high: 0.85,
    medium: 0.75,
    low: 0.5
  }
};

/**
 * Analyserer produksjonsbrief og returnerer strukturerte forslag
 * @param {string} inputText - Brief tekst å analysere
 * @returns {Object} Analysert resultat med suggestions, confidence og details
 * @returns {Object} returns.suggestions - Forslag til produksjonsoppsett
 * @returns {string} returns.suggestions.productionType - Type produksjon (film/commercial/stills/documentary)
 * @returns {string} returns.suggestions.crewType - Crew type (fullCrew/fixer)
 * @returns {boolean} returns.suggestions.includeScout - Om scout skal inkluderes
 * @returns {boolean} returns.suggestions.includeCreatives - Om creatives skal inkluderes
 * @returns {number} returns.suggestions.daysInOslo - Antall dager i Oslo
 * @returns {number} returns.suggestions.daysOutOfOslo - Antall dager utenfor Oslo
 * @returns {number} returns.suggestions.locations - Antall lokasjoner
 * @returns {Array} returns.suggestions.equipment - Liste med utstyr [{type: string, days: number}]
 * @returns {number} returns.suggestions.budgetNOK - Estimert budsjett i NOK
 * @returns {number} returns.confidence - Konfidensnivå mellom 0 og 1
 * @returns {Object} returns.details - Detaljer om analysen
 * @returns {Array} returns.details.reasons - Liste med forklaringer
 * @returns {Object} returns.details.scores - Scorer per kategori
 */
export function analyzeBrief(inputText) {
  if (!inputText || typeof inputText !== 'string') {
    return {
      suggestions: {
        productionType: 'commercial',
        crewType: 'fixer',
        includeScout: false,
        includeCreatives: true,
        daysInOslo: 1,
        daysOutOfOslo: 0,
        locations: 1,
        equipment: [],
        budgetNOK: 150000
      },
      confidence: 0.1,
      details: {
        reasons: ['No input text provided'],
        scores: {}
      }
    };
  }

  const normalizedText = inputText.toLowerCase();
  const details = {
    reasons: [],
    scores: {}
  };

  // Helper funksjoner
  const has = (regex) => regex.test(normalizedText);
  const count = (regex) => (normalizedText.match(regex) || []).length;
  const matchesAny = (text, patterns) => patterns.some(pattern => pattern.test(text));

  // PRODUCTION TYPE DETECTION
  const productionTypePatterns = {
    film: [
      /\b(spillefilm|feature film|langfilm|kortfilm|short film)\b/,
      /\b(kinofilm|movie|film produksjon|film production)\b/,
      /\b(hollywood|blockbuster)\b/,
      /\b(netflix|hbo|viaplay|nrk|tv2)\b.*\b(serie|series|sesong|season)\b/,
      /\b(tv[\s-]?serie|television series|streaming serie)\b/,
      /\b(episode|episoder|pilot)\b/
    ],
    commercial: [
      /\b(reklame|commercial|reklamefilm|tvc|tv commercial)\b/,
      /\b(promotional|promo|markedsføring|marketing)\b/,
      /\b(produkt|product)[\s-]?(video|film)\b/,
      /\b(merkevare|brand|branding)\b/,
      /\b(kampanje|campaign|annonse|advertisement)\b/,
      /\b(bedriftsfilm|corporate video|intern video)\b/,
      /\b(sosiale medier|social media|some)\b/
    ],
    stills: [
      /\b(foto|photo|stillbilder|still photography|stills)\b/,
      /\b(fotograf|photographer|fotografering|photography)\b(?!.*\b(video|film|movie)\b)/,
      /\b(bildekampanje|photo shoot|fotoshoot)\b/,
      /\b(portrett|portrait|fashion|produkt)[\s-]?(foto|photo|bilder)\b/,
      /\b(stillbilde|still image|produktbilder|product photography)\b/,
      /\b(lookbook|katalog|catalogue)\b/
    ],
    documentary: [
      /\b(dokumentar|documentary|dok|doku)\b/,
      /\b(reportasje|journalistisk|journalism)\b/,
      /\b(følge|observational|fly on the wall)\b/,
      /\b(realityserier|reality series)\b/,
      /\b(faktaprogram|factual program)\b/
    ]
  };

  // Finn produksjonstype
  let productionType = 'commercial'; // default
  let maxScore = 0;
  
  Object.entries(productionTypePatterns).forEach(([type, patterns]) => {
    if (matchesAny(normalizedText, patterns)) {
      const score = CONFIG.productionTypeWeights[type] + (count(new RegExp(patterns.map(p => p.source).join('|'), 'gi')) * 5);
      details.scores[`production_${type}`] = score;
      if (score > maxScore) {
        maxScore = score;
        productionType = type;
      }
    }
  });
  
  if (productionType) {
    details.reasons.push(`Detected ${productionType} from keywords`);
  }

  // CREW TYPE DETECTION
  const crewTypePatterns = {
    fullCrew: [
      /\b(full crew|fullt mannskap|komplett crew)\b/,
      /\b(stor produksjon|large production|big production)\b/,
      /\b(innspilling|filming|opptak|shoot)\b/,
      /\b(underwater|undervanns|dykking|diving|subsea)\b/,
      /\b(stunt|action|kampscene|fight scene|biljakt|car chase)\b/,
      /\b(helikopter|helicopter|luftopptak|aerial filming)\b/,
      /\b(kran|crane|jib|dolly|steadicam|gimbal)\b/,
      /\b(spillefilm|feature|hollywood)\b/
    ],
    fixer: [
      /\b(fixer|lokal produsent|local producer)\b/,
      /\b(liten produksjon|small production|enkel|simple)\b/,
      /\b(dokumentar|documentary)\b/,
      /\b(nordlys|aurora|northern lights)\b/,
      /\b(midnattssol|midnight sun)\b/,
      /\b(foto|photo|stills)\b/,
      /\b(rekognosering|location scout|scout)\b/,
      /\b(lavt budsjett|low budget|lite budsjett|small budget)\b/,
      /\b(bare.*få folk|only.*few people|minimal crew)\b/
    ]
  };

  let fullCrewScore = 0;
  let fixerScore = 0;

  if (matchesAny(normalizedText, crewTypePatterns.fullCrew)) {
    fullCrewScore += CONFIG.crewTypeWeights.fullCrew;
  }
  if (matchesAny(normalizedText, crewTypePatterns.fixer)) {
    fixerScore += CONFIG.crewTypeWeights.fixer;
  }

  // Produksjonstype påvirker crew
  if (productionType === 'film' || productionType === 'commercial') {
    fullCrewScore += 20;
  } else if (productionType === 'documentary' || productionType === 'stills') {
    fixerScore += 20;
  }

  // Spesialisert utstyr krever full crew
  if (has(/\b(underwater|stunt|helikopter|kran|crane)\b/)) {
    fullCrewScore += 50;
    details.reasons.push('Specialized equipment requires full crew');
  }

  const crewType = fullCrewScore > fixerScore ? 'fullCrew' : 'fixer';
  details.scores.crew_fullCrew = fullCrewScore;
  details.scores.crew_fixer = fixerScore;
  
  if (crewType === 'fullCrew') {
    details.reasons.push('Full crew needed');
  } else {
    details.reasons.push('Fixer/small crew sufficient');
  }

  // REGION DETECTION - Utvidet med nye regioner
  const regionPatterns = {
    oslo: {
      patterns: [
        /\b(oslo|akershus|østlandet|eastern norway)\b/,
        /\b(studio|studie)\b.*\b(oslo|akershus)\b/
      ],
      daysInOslo: 2,
      daysOutOfOslo: 0,
      includeScout: false
    },
    northernNorway: {
      patterns: [
        /\b(tromsø|finnmark|nordland|lofoten|vesterålen|svalbard)\b/,
        /\b(nord[\s-]?norge|northern norway|arctic|arktis)\b/,
        /\b(nordlys|aurora|northern lights)\b/,
        /\b(midnattssol|midnight sun)\b/,
        /\b(alta|kirkenes|bodø|narvik|nordkapp|north cape)\b/
      ],
      daysInOslo: 0,
      daysOutOfOslo: 3,
      includeScout: true
    },
    westCoast: {
      patterns: [
        /\b(bergen|stavanger|ålesund|haugesund)\b/,
        /\b(vestlandet|western norway|west coast)\b/,
        /\b(fjord|preikestolen|pulpit rock|trolltunga)\b/,
        /\b(geiranger|flåm|sognefjorden|hardangerfjorden)\b/
      ],
      daysInOslo: 0,
      daysOutOfOslo: 2,
      includeScout: true
    },
    trondelag: {
      patterns: [
        /\b(trondheim|trøndelag|trondelag)\b/,
        /\b(røros|roros|namdalen|fosen)\b/,
        /\b(nidarosdomen|munkholmen)\b/
      ],
      daysInOslo: 0,
      daysOutOfOslo: 2,
      includeScout: true
    },
    telemark: {
      patterns: [
        /\b(telemark|notodden|rjukan|rauland|seljord)\b/,
        /\b(gaustatoppen|hardangervidda)\b/
      ],
      daysInOslo: 1,
      daysOutOfOslo: 1,
      includeScout: true
    },
    innlandet: {
      patterns: [
        /\b(lillehammer|gudbrandsdalen|rondane|valdres)\b/,
        /\b(innlandet|hedmark|oppland)\b/,
        /\b(hamar|gjøvik|otta)\b/
      ],
      daysInOslo: 1,
      daysOutOfOslo: 2,
      includeScout: true
    },
    sorlandet: {
      patterns: [
        /\b(kristiansand|mandal|arendal|lista)\b/,
        /\b(sørlandet|sorlandet|southern norway|agder)\b/,
        /\b(lindesnes|grimstad|risør|flekkefjord)\b/
      ],
      daysInOslo: 0,
      daysOutOfOslo: 2,
      includeScout: true
    }
  };

  let daysInOslo = 0;
  let daysOutOfOslo = 0;
  let includeScout = false;
  const detectedRegions = [];

  Object.entries(regionPatterns).forEach(([region, config]) => {
    if (matchesAny(normalizedText, config.patterns)) {
      detectedRegions.push(region);
      daysInOslo += config.daysInOslo;
      daysOutOfOslo += config.daysOutOfOslo;
      if (config.includeScout) {
        includeScout = true;
        details.reasons.push(`Added scout for ${region} region`);
      }
    }
  });

  // Hvis ingen region detektert, bruk default
  if (detectedRegions.length === 0) {
    daysInOslo = 2;
    daysOutOfOslo = 0;
  } else if (detectedRegions.length > 1) {
    // Ved flere regioner, juster dager
    if (detectedRegions.includes('oslo')) {
      daysInOslo = Math.max(1, daysInOslo);
    } else {
      daysInOslo = 0;
    }
  }

  // DAYS PARSING - Forbedret med støtte for flere formater
  const dayPatterns = [
    // Numerisk + d/days/dag/dager
    /(\d+)\s*d(?:ays?|ager?)?\b/,
    /(\d+)\s*(?:days?|dager?)\b/,
    
    // Engelske tallord
    /\b(one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:days?)\b/,
    
    // Norske tallord
    /\b(en|ett|to|tre|fire|fem|seks|syv|åtte|ni|ti)\s*(?:dag(?:er)?)\b/,
    
    // X days per location
    /(\d+)\s*days?\s*per\s*location/,
    /(\d+)\s*dager?\s*per\s*lokasjon/
  ];

  const numberWords = {
    // Engelsk
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    // Norsk
    'en': 1, 'ett': 1, 'to': 2, 'tre': 3, 'fire': 4, 'fem': 5,
    'seks': 6, 'syv': 7, 'åtte': 8, 'ni': 9, 'ti': 10
  };

  let detectedDays = 0;
  dayPatterns.forEach(pattern => {
    const matches = normalizedText.match(pattern);
    if (matches) {
      let days = 0;
      if (matches[1] && !isNaN(matches[1])) {
        days = parseInt(matches[1]);
      } else if (matches[1] && numberWords[matches[1]]) {
        days = numberWords[matches[1]];
      }
      detectedDays = Math.max(detectedDays, days);
    }
  });

  // Hvis dager er spesifisert, overstyr region defaults
  if (detectedDays > 0) {
    const totalCurrentDays = daysInOslo + daysOutOfOslo;
    if (totalCurrentDays > 0) {
      // Behold fordelingen men juster til spesifiserte dager
      const osloRatio = daysInOslo / totalCurrentDays;
      daysInOslo = Math.round(detectedDays * osloRatio);
      daysOutOfOslo = detectedDays - daysInOslo;
    } else {
      daysInOslo = detectedDays;
    }
    details.reasons.push(`Detected ${detectedDays} days from text`);
  }

  // LOCATIONS DETECTION
  let locations = Math.max(1, detectedRegions.length);
  
  if (has(/\b(multi[\s-]?location|flere steder|multiple locations?|various locations?)\b/)) {
    locations = Math.max(locations, 3);
    details.reasons.push('Multiple locations indicated');
  }

  // EQUIPMENT DETECTION - Utvidet med roadblock og lowloader
  const equipmentPatterns = {
    drone: {
      patterns: [
        /\b(drone|droner|uav|fpv)\b/,
        /\b(luftfoto|aerial|luftopptak|aerial photography)\b/,
        /\b(helikopter|helicopter)\b/,
        /\b(fugleperspektiv|bird'?s eye|ovenfra|from above)\b/
      ]
    },
    roadblock: {
      patterns: [
        /\b(road block|roadblock|road[\s-]?block)\b/,
        /\b(rolling lock|lock[\s-]?off|police lock)\b/,
        /\b(veisperring|vei[\s-]?sperring)\b/,
        /\b(rullende sperring|stenging av vei|veistenging)\b/,
        /\b(trafikkontroll|traffic control)\b/
      ]
    },
    lowloader: {
      patterns: [
        /\b(lowloader|low[\s-]?loader)\b/,
        /\b(process trailer|prosess[\s-]?trailer|proses[\s-]?trailer)\b/,
        /\b(tracking vehicle|picture car rig)\b/,
        /\b(lavlaster|lav[\s-]?laster)\b/,
        /\b(kamerabiltilhenger|camera car trailer)\b/
      ]
    },
    steadicam: {
      patterns: [
        /\b(steadicam|steady cam|gimbal|ronin|movi)\b/,
        /\b(stabilisert|stabilized|smooth)\b/
      ]
    },
    jib: {
      patterns: [
        /\b(jib|kran|crane|russian arm)\b/,
        /\b(høye vinkler|high angles|overhead)\b/
      ]
    },
    underwater: {
      patterns: [
        /\b(underwater|undervanns|subsea|diving)\b/,
        /\b(vanntett|waterproof|aqua|housing)\b/
      ]
    },
    specialized: {
      patterns: [
        /\b(phantom|high speed|slow motion|høyhastighet)\b/,
        /\b(motion control|moco|robot)\b/,
        /\b(led wall|virtual production|green screen)\b/,
        /\b(timelapse|time lapse|hyperlapse)\b/
      ]
    }
  };

  const equipment = [];
  let hasTechEquipment = false;

  Object.entries(equipmentPatterns).forEach(([type, config]) => {
    if (matchesAny(normalizedText, config.patterns)) {
      // Parse dager for dette utstyret
      let equipmentDays = 1;
      config.patterns.forEach(pattern => {
        const beforeMatch = normalizedText.match(new RegExp(`(\\d+)\\s*(?:days?|dager?)?\\s*(?:of\\s*)?${pattern.source}`, 'i'));
        const afterMatch = normalizedText.match(new RegExp(`${pattern.source}.*?(\\d+)\\s*(?:days?|dager?)`, 'i'));
        
        if (beforeMatch && beforeMatch[1]) {
          equipmentDays = Math.max(equipmentDays, parseInt(beforeMatch[1]));
        }
        if (afterMatch && afterMatch[1]) {
          equipmentDays = Math.max(equipmentDays, parseInt(afterMatch[1]));
        }
      });
      
      equipment.push({ type, days: equipmentDays });
      details.reasons.push(`Equipment: ${type}`);
      hasTechEquipment = true;
    }
  });

  // CREATIVES DETECTION
  let includeCreatives = crewType === 'fixer'; // Default for fixer
  
  const hasOwnCreativesPatterns = [
    /\b(egen regissør|own director|eget team|own team)\b/,
    /\b(tar med|bringing|kommer med|coming with).*\b(regissør|director|kreativ|creative)\b/,
    /\b(har allerede|already have).*\b(crew|team|regissør)\b/
  ];
  
  if (matchesAny(normalizedText, hasOwnCreativesPatterns)) {
    includeCreatives = false;
    details.reasons.push('Client has own creatives');
  }

  // INTERNATIONAL DETECTION
  const internationalPatterns = {
    american: [
      /\b(amerikansk|american|usa|us production|hollywood)\b/,
      /\b(los angeles|new york|amerikansk crew)\b/
    ],
    nordic: [
      /\b(svensk|swedish|dansk|danish|finsk|finnish|islandsk|icelandic)\b/,
      /\b(nordisk|nordic|skandinavisk|scandinavian)\b/
    ],
    european: [
      /\b(tysk|german|fransk|french|britisk|british|italiensk|italian)\b/,
      /\b(europeisk|european|eu production)\b/
    ]
  };

  let internationalMultiplier = CONFIG.internationalMultipliers.default;
  Object.entries(internationalPatterns).forEach(([region, patterns]) => {
    if (matchesAny(normalizedText, patterns)) {
      internationalMultiplier = Math.max(internationalMultiplier, CONFIG.internationalMultipliers[region]);
      details.reasons.push(`${region.charAt(0).toUpperCase() + region.slice(1)} production detected`);
    }
  });

  // BUDGET CALCULATION
  const totalDays = daysInOslo + daysOutOfOslo;
  let baseDailyRate = CONFIG.baseDailyRates[productionType] || CONFIG.baseDailyRates.default;
  
  // Apply crew multiplier
  if (crewType === 'fixer') {
    baseDailyRate *= CONFIG.crewMultipliers.fixer;
  }
  
  // Hollywood/major production
  if (has(/\b(hollywood|blockbuster|stor produksjon|major production)\b/)) {
    baseDailyRate = Math.max(baseDailyRate, 300000);
    details.reasons.push('Major production - premium rates');
  }
  
  let budgetNOK = baseDailyRate * totalDays;
  
  // Add equipment costs
  equipment.forEach(item => {
    const cost = CONFIG.equipmentCosts[item.type] || 30000;
    budgetNOK += cost * item.days;
  });
  
  // Add scout cost
  if (includeScout) {
    budgetNOK += CONFIG.additionalCosts.scout;
  }
  
  // Add creatives cost
  if (includeCreatives) {
    budgetNOK += CONFIG.additionalCosts.creatives;
  }
  
  // Add travel costs
  if (daysOutOfOslo > 0) {
    budgetNOK += daysOutOfOslo * CONFIG.additionalCosts.travelPerDay;
  }
  
  // Apply international multiplier
  budgetNOK *= internationalMultiplier;
  
  // CONFIDENCE CALCULATION
  let confidence = 0.5; // Base confidence
  
  // Add confidence based on detected elements
  if (productionType) confidence += 0.1;
  if (detectedRegions.length > 0) confidence += 0.1;
  if (equipment.length > 0) confidence += 0.1;
  if (detectedDays > 0) confidence += 0.1;
  if (normalizedText.length > 200) confidence += 0.1;
  
  // Cap at 0.95
  confidence = Math.min(0.95, confidence);
  
  // Lower confidence for very short input
  if (normalizedText.length < 50) {
    confidence *= 0.7;
  }
  
  return {
    suggestions: {
      productionType,
      crewType,
      includeScout,
      includeCreatives,
      daysInOslo: Math.max(0, daysInOslo),
      daysOutOfOslo: Math.max(0, daysOutOfOslo),
      locations: Math.max(1, locations),
      equipment,
      budgetNOK: Math.round(budgetNOK)
    },
    confidence: Math.round(confidence * 100) / 100,
    details
  };
}

// Eksporter hjelpefunksjoner for testing
export const helpers = {
  CONFIG,
  
  detectProductionType: (text) => {
    const analysis = analyzeBrief(text);
    return analysis.suggestions.productionType;
  },
  
  detectCrewType: (text) => {
    const analysis = analyzeBrief(text);
    return analysis.suggestions.crewType;
  },
  
  detectLocations: (text) => {
    const analysis = analyzeBrief(text);
    return {
      daysInOslo: analysis.suggestions.daysInOslo,
      daysOutOfOslo: analysis.suggestions.daysOutOfOslo,
      includeScout: analysis.suggestions.includeScout,
      locations: analysis.suggestions.locations
    };
  },
  
  detectEquipment: (text) => {
    const analysis = analyzeBrief(text);
    return analysis.suggestions.equipment;
  }
};