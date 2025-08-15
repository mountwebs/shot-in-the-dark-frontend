// utils/advancedProductionAnalysis.js - Utvidet produksjonsanalyse for Norge

export function analyzeProductionBrief(text, options = {}) {
  console.log("Starter avansert produksjonsanalyse...");
  
  const normalizedText = (text || "").toLowerCase();
  const has = (regex) => regex.test(normalizedText);
  const count = (regex) => (normalizedText.match(regex) || []).length;
  const extract = (regex) => (normalizedText.match(regex) || []).map(m => m.trim());
  
  // CREW ANALYSE - Utvidet for norske produksjoner
  const crewAnalysis = {
      director: has(/\b(regissør|director|regi)\b/) || has(/\b(creative|konsept|vision)\b/),
      dop: has(/\b(dop|director of photography|cinematographer|foto|fotograf)\b/),
      gaffer: has(/\b(gaffer|lys|lighting|elektriker)\b/),
      soundRecordist: has(/\b(lyd|sound|lydmann|boom|audio)\b/),
      producer: has(/\b(produsent|producer|produksjonsleder)\b/),
      productionManager: has(/\b(production manager|produksjonskoordinator)\b/),
      firstAD: has(/\b(1st ad|første assistent|assistant director)\b/),
      scriptSupervisor: has(/\b(script|continuity|script supervisor)\b/),
      makeupArtist: has(/\b(makeup|sminke|sminkeartist|beauty)\b/),
      stylist: has(/\b(stylist|styling|kostyme|wardrobe)\b/),
      setDesigner: has(/\b(production designer|scenograf|set design)\b/),
      locationManager: has(/\b(location manager|location scout)\b/),
      droneOperator: has(/\b(drone|fpv|aerial cinematographer)\b/),
      underwaterCrew: has(/\b(underwater|dykker|subsea|undervanns)\b/),
      stuntCoordinator: has(/\b(stunt|action|sikkerhet|safety)\b/),
      animalWrangler: has(/\b(dyr|animal|hest|horse|hund|wildlife)\b/),
      marineCoordinator: has(/\b(båt|boat|marine|sjø|maritim)\b/),
      winterSpecialist: has(/\b(vinter|snow|ski|snowboard|is|ice)\b/),
      mountainGuide: has(/\b(fjell|mountain|klatring|climbing|guide)\b/),
  };

  // VÆR OG SESONG ANALYSE
  const weatherSeasonAnalysis = {
      vinter: has(/\b(vinter|winter|snø|snow|ski|is|ice|kulde|frost)\b/),
      vår: has(/\b(vår|spring|blomstring|påske)\b/),
      sommer: has(/\b(sommer|summer|sol|sun|varme|heat|midnattssol)\b/),
      høst: has(/\b(høst|autumn|fall|farger|colors|storm)\b/),
      regn: has(/\b(regn|rain|våt|wet|nedbør)\b/),
      tåke: has(/\b(tåke|fog|mist|dis)\b/),
      storm: has(/\b(storm|vind|wind|uvær)\b/),
      nordlys: has(/\b(nordlys|aurora|northern lights)\b/),
      midnattssol: has(/\b(midnattssol|midnight sun|lyse netter)\b/),
      værgaranti: has(/\b(værgaranti|weather backup|reserve)\b/),
  };

  // PERMIT OG TILLATELSER
  const permitAnalysis = {
      nasjonalpark: has(/\b(nasjonalpark|national park|vernet|protected)\b/),
      privatEiendom: has(/\b(privat|private property|gård|farm)\b/),
      offentligVei: has(/\b(vei|road|gate|street|motorvei|highway)\b/),
      jernbane: has(/\b(tog|train|jernbane|railway|nsb|vy)\b/),
      luftfart: has(/\b(fly|airport|lufthavn|helikopter|luftrom)\b/),
      havn: has(/\b(havn|harbour|port|kai|dock)\b/),
      militært: has(/\b(militær|military|forsvaret|base)\b/),
      kulturminne: has(/\b(kulturminne|heritage|historisk|museum)\b/),
      droneFlygning: has(/\b(drone|uav|luftfoto)\b/),
      pyroteknikk: has(/\b(pyro|eksplosjon|explosion|fyrverkeri)\b/),
      våpen: has(/\b(våpen|weapon|skytevåpen|firearms)\b/),
      alkohol: has(/\b(alkohol|alcohol|øl|beer|vin|wine)\b/),
      barn: has(/\b(barn|children|mindreårig|minor)\b/),
  };

  // TRANSPORT OG LOGISTIKK
  const transportLogistics = {
      ferge: has(/\b(ferge|ferry|ferje)\b/),
      helikopter: has(/\b(helikopter|helicopter|heli)\b/),
      båt: has(/\b(båt|boat|skip|ship|vessel)\b/),
      firehjuling: has(/\b(atv|firehjuling|quad|terrenggående)\b/),
      snøscooter: has(/\b(snøscooter|snowmobile|scooter)\b/),
      lastebil: has(/\b(lastebil|truck|transport|frakt)\b/),
      campingvogn: has(/\b(camping|bobil|rv|mobile home)\b/),
      generatorBehov: has(/\b(generator|strøm|power|elektrisitet)\b/),
      drivstoff: has(/\b(drivstoff|fuel|bensin|diesel)\b/),
      fjernKontroll: has(/\b(remote|fjernkontroll|wireless|trådløs)\b/),
      satellitt: has(/\b(satellitt|satellite|starlink)\b/),
  };

  // INNKVARTERING OG CATERING
  const accommodationCatering = {
      hotell: has(/\b(hotell|hotel|overnatting)\b/),
      hytte: has(/\b(hytte|cabin|cottage|rorbu)\b/),
      camping: has(/\b(camping|telt|tent)\b/),
      frokost: has(/\b(frokost|breakfast)\b/),
      lunsj: has(/\b(lunsj|lunch|måltid)\b/),
      middag: has(/\b(middag|dinner)\b/),
      kaffePauser: has(/\b(kaffe|coffee|pause|break)\b/),
      spesialDiett: has(/\b(vegetar|vegan|allergi|gluten|halal|kosher)\b/),
      alkoholServering: has(/\b(alkohol|øl|vin|bar)\b/),
      cateringBil: has(/\b(catering|matbil|food truck)\b/),
  };

  // FORSIKRING OG RISIKO
  const insuranceRisk = {
      høyRisiko: has(/\b(stunt|action|farlig|dangerous|risiko|risk)\b/),
      vannAktivitet: has(/\b(vann|water|sjø|sea|dykking|diving)\b/),
      luftAktivitet: has(/\b(fly|luftfart|fallskjerm|paragliding)\b/),
      fjellAktivitet: has(/\b(fjell|mountain|klatring|climbing|ski)\b/),
      dyrAktivitet: has(/\b(dyr|animal|hest|ville dyr)\b/),
      barnAktivitet: has(/\b(barn|children|mindreårig)\b/),
      kjøretøy: has(/\b(bil|car|motorsykkel|båt)\b/),
      dyrtUtstyr: has(/\b(arri|red|alexa|expensive|dyrt)\b/),
      publikum: has(/\b(publikum|audience|crowd|masse)\b/),
      internasjonal: has(/\b(internasjonal|international|utenlandsk)\b/),
  };

  // POSTPRODUKSJON ANALYSE
  const postProductionAnalysis = {
      fargekorreksjon: has(/\b(color|farge|grading|grade|davinci)\b/),
      lydMiksing: has(/\b(lydmiks|sound mix|audio post|5.1|atmos)\b/),
      visualEffects: has(/\b(vfx|visual effects|cgi|3d|compositing)\b/),
      animasjon: has(/\b(animasjon|animation|motion graphics)\b/),
      musikk: has(/\b(musikk|music|komponist|score|sang)\b/),
      voiceOver: has(/\b(voice over|vo|forteller|narrator)\b/),
      tekstingDubbing: has(/\b(teksting|subtitles|dubbing|oversettelse)\b/),
      arkivMateriale: has(/\b(arkiv|archive|stock|historisk)\b/),
      droneBearbeiding: has(/\b(drone|stabilisering|tracking)\b/),
      formatKonvertering: has(/\b(format|delivery|master|eksport)\b/),
  };

  // MILJØ OG BÆREKRAFT
  const sustainabilityAnalysis = {
      miljøVennlig: has(/\b(miljø|environmental|bærekraft|sustainable|grønn)\b/),
      lokaltCrew: has(/\b(lokal|local crew|stedlig)\b/),
      kollektivTransport: has(/\b(kollektiv|public transport|tog|buss)\b/),
      avfallsHåndtering: has(/\b(avfall|waste|resirkulering|recycling)\b/),
      fornybarEnergi: has(/\b(fornybar|renewable|sol|vind|energi)\b/),
      vegetarMat: has(/\b(vegetar|plantebasert|plant-based)\b/),
      papirløs: has(/\b(papirløs|paperless|digital)\b/),
      karbonNøytral: has(/\b(karbon|carbon neutral|klimanøytral)\b/),
  };

  // SPESIALEFFEKTER OG TEKNISK UTSTYR
  const specialEquipmentAnalysis = {
      steadicam: has(/\b(steadicam|movi|ronin|gimbal)\b/),
      jib: has(/\b(jib|kran|crane|russian arm)\b/),
      dolly: has(/\b(dolly|skinner|tracks|slider)\b/),
      underwaterHousing: has(/\b(underwater|undervanns|housing|aqua)\b/),
      highSpeed: has(/\b(high speed|phantom|slow motion|fps)\b/),
      timelapse: has(/\b(timelapse|time lapse|hyperlapse)\b/),
      ledWall: has(/\b(led wall|virtual production|volume)\b/),
      motionControl: has(/\b(motion control|moco|robot)\b/),
      techvis: has(/\b(techvis|previs|visualization)\b/),
      lidar: has(/\b(lidar|3d scanning|photogrammetry)\b/),
  };

  // CASTING OG TALENT
  const castingAnalysis = {
      hovedRoller: count(/\b(hovedrolle|lead|protagonist|hovedperson)\b/),
      biRoller: count(/\b(birolle|supporting|støtterolle)\b/),
      statister: has(/\b(statist|extra|crowd|folkemengde)\b/),
      barn: has(/\b(barn|child|ungdom|teen)\b/),
      eldre: has(/\b(eldre|elderly|pensjonist|senior)\b/),
      mangfold: has(/\b(mangfold|diversity|inkludering)\b/),
      lokaleAktører: has(/\b(lokal|local talent|stedlig)\b/),
      profesjonelle: has(/\b(profesjonell|professional|skuespiller)\b/),
      influencers: has(/\b(influencer|kjendis|celebrity)\b/),
      dyr: has(/\b(dyr|animal|hund|hest|katt)\b/),
  };

  // KOMMUNIKASJON OG SPRÅK
  const communicationAnalysis = {
      flerspråklig: has(/\b(engelsk|english|internasjonal|språk)\b/),
      tegnspråk: has(/\b(tegnspråk|sign language|døv)\b/),
      dialekt: has(/\b(dialekt|dialect|nynorsk|bokmål)\b/),
      samisk: has(/\b(samisk|sami|sápmi)\b/),
      tolk: has(/\b(tolk|translator|oversetter)\b/),
  };

  // BUDSJETT BEREGNING - Oppdatert og utvidet
  let baseDailyRate = 40000;
  let crewMultiplier = 1.0;
  let complexityScore = 0;
  
  // Crew kompleksitet
  const activeCrew = Object.entries(crewAnalysis).filter(([k,v]) => v);
  crewMultiplier = 1 + (activeCrew.length * 0.15);
  
  // Sesong kompleksitet
  if (weatherSeasonAnalysis.vinter) complexityScore += 15;
  if (weatherSeasonAnalysis.nordlys) complexityScore += 20;
  if (weatherSeasonAnalysis.storm) complexityScore += 10;
  
  // Permit kompleksitet
  const activePermits = Object.entries(permitAnalysis).filter(([k,v]) => v);
  complexityScore += activePermits.length * 5;
  
  // Transport kompleksitet
  if (transportLogistics.helikopter) complexityScore += 30;
  if (transportLogistics.båt) complexityScore += 15;
  if (transportLogistics.generatorBehov) complexityScore += 10;
  
  // Risiko faktor
  if (insuranceRisk.høyRisiko) complexityScore += 25;
  if (insuranceRisk.vannAktivitet) complexityScore += 15;
  if (insuranceRisk.fjellAktivitet) complexityScore += 20;
  
  // Post-produksjon
  if (postProductionAnalysis.visualEffects) complexityScore += 20;
  if (postProductionAnalysis.fargekorreksjon) complexityScore += 10;
  if (postProductionAnalysis.musikk) complexityScore += 15;
  
  // Spesialutstyr
  const specialEquipment = Object.entries(specialEquipmentAnalysis).filter(([k,v]) => v);
  complexityScore += specialEquipment.length * 8;
  
  // AVANSERT LOCATION ANALYSE
  const locationComplexity = calculateLocationComplexity(text);
  const travelDays = estimateTravelDays(locationComplexity);
  
  // VÆRRISIKO VURDERING
  const weatherRisk = calculateWeatherRisk(weatherSeasonAnalysis, locationComplexity);
  
  // TOTAL BUDSJETT KALKULASJON
  const productionDays = Math.max(1, travelDays.shooting);
  const prepDays = Math.ceil(productionDays * 0.5);
  const wrapDays = Math.ceil(productionDays * 0.25);
  const totalDays = productionDays + prepDays + wrapDays;
  
  let totalBudget = baseDailyRate * totalDays * crewMultiplier;
  totalBudget *= (1 + complexityScore / 100);
  
  // Legg til spesielle kostnader
  if (transportLogistics.helikopter) totalBudget += 150000;
  if (insuranceRisk.høyRisiko) totalBudget += 50000;
  if (postProductionAnalysis.visualEffects) totalBudget += 100000;
  
  // Confidence beregning
  const confidence = calculateConfidence(text, complexityScore);
  
  return {
      success: true,
      metadata: {
          source: "advanced_analysis",
          chars: text.length,
          analysisVersion: "3.0",
          timestamp: new Date().toISOString()
      },
      confidence: confidence,
      suggestions: {
          // Original felt
          productionTypes: detectProductionTypes(text),
          serviceRequirements: detectServices(text),
          equipment: detectEquipment(text),
          daysInOslo: travelDays.oslo,
          daysOutOfOslo: travelDays.outOfOslo,
          locations: locationComplexity.count,
          budgetNOK: Math.round(totalBudget),
          
          // Nye avanserte felt
          crew: {
              required: activeCrew.map(([role]) => role),
              estimatedSize: activeCrew.length + 5,
              specialistNeeded: detectSpecialists(crewAnalysis)
          },
          weatherConsiderations: {
              season: detectSeason(weatherSeasonAnalysis),
              risks: weatherRisk,
              backupDaysNeeded: Math.ceil(productionDays * weatherRisk.factor)
          },
          permits: {
              required: activePermits.map(([type]) => type),
              estimatedProcessingDays: activePermits.length * 7,
              complexity: activePermits.length > 3 ? 'high' : 'medium'
          },
          logistics: {
              transport: Object.entries(transportLogistics).filter(([k,v]) => v).map(([k]) => k),
              accommodation: detectAccommodation(accommodationCatering),
              catering: detectCateringNeeds(accommodationCatering, activeCrew.length + 5)
          },
          insurance: {
              riskLevel: calculateRiskLevel(insuranceRisk),
              specialCoverage: Object.entries(insuranceRisk).filter(([k,v]) => v).map(([k]) => k),
              estimatedCost: Math.round(totalBudget * 0.03)
          },
          postProduction: {
              services: Object.entries(postProductionAnalysis).filter(([k,v]) => v).map(([k]) => k),
              estimatedDays: calculatePostDays(postProductionAnalysis),
              estimatedCost: calculatePostCost(postProductionAnalysis)
          },
          sustainability: {
              score: calculateSustainabilityScore(sustainabilityAnalysis),
              recommendations: generateSustainabilityTips(sustainabilityAnalysis)
          },
          casting: {
              requirements: generateCastingRequirements(castingAnalysis),
              estimatedCastingDays: calculateCastingDays(castingAnalysis),
              diversityConsiderations: castingAnalysis.mangfold
          },
          timeline: {
              preProduction: prepDays + activePermits.length * 7,
              production: productionDays,
              postProduction: calculatePostDays(postProductionAnalysis),
              total: prepDays + productionDays + wrapDays + calculatePostDays(postProductionAnalysis) + activePermits.length * 7
          },
          risks: identifyKeyRisks(insuranceRisk, weatherSeasonAnalysis, locationComplexity),
          contingency: {
              percentage: complexityScore > 50 ? 20 : 15,
              amount: Math.round(totalBudget * (complexityScore > 50 ? 0.20 : 0.15))
          }
      }
  };
}

// HJELPEFUNKSJONER

function calculateLocationComplexity(text) {
  const locations = {
      oslo: /\b(oslo|akershus)\b/gi,
      westCoast: /\b(bergen|stavanger|ålesund|vestlandet)\b/gi,
      mountains: /\b(fjell|mountain|jotunheimen|rondane)\b/gi,
      north: /\b(tromsø|finnmark|nordland|lofoten)\b/gi,
      islands: /\b(øy|island|lofoten|vesterålen)\b/gi
  };
  
  let count = 0;
  let complexity = 1.0;
  
  Object.entries(locations).forEach(([type, regex]) => {
      if (regex.test(text)) {
          count++;
          complexity += type === 'north' ? 0.5 : 0.3;
      }
  });
  
  return { count: Math.max(1, count), complexity };
}

function estimateTravelDays(locationComplexity) {
  const baseDays = 2;
  const travelDays = Math.ceil(locationComplexity.count * 0.5);
  
  return {
      oslo: locationComplexity.count === 1 ? baseDays : 1,
      outOfOslo: locationComplexity.count > 1 ? baseDays + travelDays : 0,
      shooting: baseDays + travelDays
  };
}

function calculateWeatherRisk(weatherSeason, location) {
  let riskFactor = 0.1;
  const risks = [];
  
  if (weatherSeason.vinter) {
      riskFactor += 0.3;
      risks.push('Snø og kulde kan påvirke produksjonen');
  }
  if (weatherSeason.storm) {
      riskFactor += 0.2;
      risks.push('Stormrisiko - trenger værgaranti');
  }
  if (weatherSeason.nordlys && !weatherSeason.vinter) {
      risks.push('Nordlys krever spesifikke forhold');
  }
  
  return { factor: riskFactor, risks };
}

function detectProductionTypes(text) {
  const types = [];
  const normalized = text.toLowerCase();
  
  if (/\b(film|spillefilm|feature|narrative)\b/.test(normalized)) types.push('film');
  if (/\b(reklame|commercial|kampanje|tvc)\b/.test(normalized)) types.push('commercial');
  if (/\b(dokumentar|documentary)\b/.test(normalized)) types.push('documentary');
  if (/\b(musikkvideo|music video)\b/.test(normalized)) types.push('music');
  if (/\b(bedrift|corporate|intern)\b/.test(normalized)) types.push('corporate');
  
  return types.length ? types : ['commercial'];
}

function detectServices(text) {
  const services = [];
  const normalized = text.toLowerCase();
  
  if (/\b(full service|turnkey|komplett)\b/.test(normalized)) {
      services.push('full-service');
  }
  if (/\b(creative|konsept|idé)\b/.test(normalized)) {
      services.push('creative');
  }
  if (/\b(produksjon|production)\b/.test(normalized)) {
      services.push('production');
  }
  if (/\b(post|etterarbeid|redigering)\b/.test(normalized)) {
      services.push('post-production');
  }
  
  return services.length ? services : ['production'];
}

function detectEquipment(text) {
  const equipment = [];
  const normalized = text.toLowerCase();
  
  const equipmentMap = {
      'Drone': /\b(drone|uav|fpv|luftfoto)\b/,
      'Steadicam': /\b(steadicam|movi|ronin)\b/,
      'Jib/Crane': /\b(jib|kran|crane)\b/,
      'Underwater': /\b(underwater|undervanns)\b/,
      'High-speed': /\b(high speed|phantom|slowmo)\b/,
      'LED Wall': /\b(led wall|virtual production)\b/
  };
  
  Object.entries(equipmentMap).forEach(([name, regex]) => {
      if (regex.test(normalized)) {
          equipment.push({ type: name, days: 1 });
      }
  });
  
  return equipment;
}

function detectSpecialists(crewAnalysis) {
  const specialists = [];
  
  if (crewAnalysis.underwaterCrew) specialists.push('Undervanns spesialist');
  if (crewAnalysis.droneOperator) specialists.push('Drone pilot');
  if (crewAnalysis.stuntCoordinator) specialists.push('Stunt koordinator');
  if (crewAnalysis.animalWrangler) specialists.push('Dyre håndterer');
  if (crewAnalysis.mountainGuide) specialists.push('Fjellguide');
  
  return specialists;
}

function detectSeason(weatherAnalysis) {
  const seasons = Object.entries(weatherAnalysis)
      .filter(([season, detected]) => detected && ['vinter', 'vår', 'sommer', 'høst'].includes(season))
      .map(([season]) => season);
  
  return seasons.length ? seasons[0] : 'ukjent';
}

function calculateRiskLevel(risks) {
  const riskCount = Object.values(risks).filter(v => v).length;
  
  if (riskCount >= 5) return 'høy';
  if (riskCount >= 3) return 'medium';
  return 'lav';
}

function calculatePostDays(postProduction) {
  let days = 5; // minimum
  
  if (postProduction.visualEffects) days += 10;
  if (postProduction.fargekorreksjon) days += 3;
  if (postProduction.lydMiksing) days += 2;
  if (postProduction.animasjon) days += 7;
  if (postProduction.musikk) days += 5;
  
  return days;
}

function calculatePostCost(postProduction) {
  let cost = 50000; // minimum
  
  if (postProduction.visualEffects) cost += 150000;
  if (postProduction.fargekorreksjon) cost += 40000;
  if (postProduction.lydMiksing) cost += 30000;
  if (postProduction.animasjon) cost += 80000;
  if (postProduction.musikk) cost += 60000;
  
  return cost;
}

function detectAccommodation(accommodation) {
  const needs = [];
  
  if (accommodation.hotell) needs.push('Hotell');
  if (accommodation.hytte) needs.push('Hytte/Rorbu');
  if (accommodation.camping) needs.push('Camping');
  
  return needs.length ? needs : ['Hotell'];
}

function detectCateringNeeds(catering, crewSize) {
  return {
      meals: ['Frokost', 'Lunsj', 'Middag'],
      specialDiets: catering.spesialDiett,
      coffeeBreaks: true,
      estimatedDailyCost: crewSize * 500
  };
}

function calculateSustainabilityScore(sustainability) {
  const factors = Object.values(sustainability).filter(v => v).length;
  return Math.round((factors / Object.keys(sustainability).length) * 100);
}

function generateSustainabilityTips(sustainability) {
  const tips = [];
  
  if (!sustainability.lokaltCrew) tips.push('Vurder lokal crew for å redusere reiseutslipp');
  if (!sustainability.kollektivTransport) tips.push('Bruk kollektivtransport der mulig');
  if (!sustainability.vegetarMat) tips.push('Tilby vegetariske alternativer');
  if (!sustainability.papirløs) tips.push('Gå for digital produksjon');
  
  return tips;
}

function generateCastingRequirements(casting) {
  const requirements = [];
  
  if (casting.hovedRoller > 0) requirements.push(`${casting.hovedRoller} hovedroller`);
  if (casting.statister) requirements.push('Statister påkrevd');
  if (casting.barn) requirements.push('Barneaktører - ekstra tillatelser nødvendig');
  if (casting.dyr) requirements.push('Dyr i produksjonen');
  
  return requirements;
}

function calculateCastingDays(casting) {
  let days = 0;
  
  if (casting.hovedRoller > 0) days += casting.hovedRoller * 0.5;
  if (casting.statister) days += 1;
  if (casting.barn) days += 2;
  
  return Math.ceil(days);
}

function identifyKeyRisks(insurance, weather, location) {
  const risks = [];
  
  if (insurance.høyRisiko) risks.push('Høyrisiko aktiviteter planlagt');
  if (weather.storm) risks.push('Værforhold kan forstyrre produksjonen');
  if (location.complexity > 2) risks.push('Kompleks logistikk med flere lokasjoner');
  if (insurance.vannAktivitet) risks.push('Vannscener krever ekstra sikkerhet');
  
  return risks;
}

function calculateConfidence(text, complexity) {
  const baseConfidence = 0.7;
  const textLengthBonus = Math.min(0.2, text.length / 5000);
  const complexityPenalty = Math.min(0.2, complexity / 200);
  
  return Math.max(0.3, Math.min(0.95, baseConfidence + textLengthBonus - complexityPenalty));
}

// Eksporter også hjelpefunksjoner for testing
export const helpers = {
  calculateLocationComplexity,
  estimateTravelDays,
  calculateWeatherRisk,
  detectProductionTypes,
  detectServices,
  detectEquipment,
  calculateRiskLevel,
  calculatePostDays,
  calculatePostCost,
  calculateSustainabilityScore,
  identifyKeyRisks
};