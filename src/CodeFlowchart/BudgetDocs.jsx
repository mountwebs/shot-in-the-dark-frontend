// src/CodeFlowchart/BudgetDocs.jsx
// Investor-friendly, manual walkthrough – **no auto demo**
// Updates per request:
// • Remove top Film/Stills/Car buttons and Car as a branch (Car is now a keyword)
// • Keep only Film and Stills as branches in the flowchart
// • Replace the single "Nøkkelord" node view with an exclusive, clickable keyword picker
//   that explains the effect of one keyword at a time
// • Left info panel stays sticky; Systemflyt auto-height (no inner scroll)

import React, { useState, useEffect } from 'react';

const BudgetDocs = () => {
  // --- Presentation state ---
  const [activeNode, setActiveNode] = useState('start');
  const [chosenType, setChosenType] = useState(null); // 'film' | 'stills' | null
  const [selectedPath, setSelectedPath] = useState(['start']);
  const [showDataInfo, setShowDataInfo] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState(null); // exclusive keyword for explainer

  // Base path (common) – keywords after type
  const basePath = ['start', 'validation', 'dataTransform'];

  const computePath = (type = chosenType) => {
    if (!type) return [...basePath];
    const branch = [type, 'keywords', `${type}Crew`, 'equipment', 'calculate'];
    return [...basePath, ...branch];
  };

  // Keep selectedPath coherent if type changes
  useEffect(() => {
    const p = computePath(chosenType);
    const last = selectedPath[selectedPath.length - 1];
    const idx = p.indexOf(last);
    if (idx === -1) {
      const fallback = chosenType || 'start';
      const cutIdx = p.indexOf(fallback);
      setSelectedPath(cutIdx >= 0 ? p.slice(0, cutIdx + 1) : ['start']);
      setActiveNode(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenType]);

  const resetFlow = () => {
    setChosenType(null);
    setActiveNode('start');
    setSelectedPath(['start']);
    setSelectedKeyword(null);
  };

  const statusOf = (nodeId) => {
    if (nodeId === activeNode) return 'active';
    if (selectedPath.includes(nodeId)) return 'done';
    return 'todo';
  };

  const colorFor = (nodeId) => {
    const status = statusOf(nodeId);
    switch (status) {
      case 'active':
        return { fill: '#374151', stroke: '#374151', text: 'white' }; // slate-700
      case 'done':
        return { fill: '#10b981', stroke: '#10b981', text: 'white' }; // emerald-500
      default:
        return { fill: '#e5e7eb', stroke: '#9ca3af', text: '#374151' }; // gray
    }
  };

  // Investor notes (non-technical)
  const investorNotes = {
    start: [
      'Lav terskel: svært enkel start for brukeren.',
      'Færre felt → flere fullfører prosessen.'
    ],
    validation: [
      'Automatiske sjekker gir færre feil og støttehenvendelser.',
      'Umiddelbar tilbakemelding øker fullføringsgrad.'
    ],
    dataTransform: [
      'Frontend-data oversettes slik at backenden kan regne riktig.',
      'Standardisert form gjør det enkelt å vedlikeholde.'
    ],
    film: [
      'Høy produksjonsverdi, tydelige kostdrivere.',
      'Skalerbar logikk for crew-størrelse.'
    ],
    stills: [
      'Rask produksjon med mindre crew.',
      'Høy effektivitet og lavere logistikk-kost.'
    ],
    keywords: [
      'Tilvalg styrer min/max, hvilke moduler som aktiveres, og anbefalinger.',
      'Viser direkte hvilke grep som påvirker prisen.'
    ],
    filmCrew: [
      'Minsteroller etter best praksis.',
      'Transport, diett, og overtid modelleres.'
    ],
    stillsCrew: [
      'Effektivt fotocrew; utvides ved behov.',
      'Lavere crewkost pr. dag.'
    ],
    equipment: [
      'Utstyr og transport er sentrale kostdrivere.',
      'Tilvalg → direkte upsell-muligheter.'
    ],
    calculate: [
      'Forklarbar pris: linje-for-linje summering.',
      'Transparens → høyere tillit → høyere hit-rate.'
    ]
  };

  // Node info for left panel
  const nodeInfo = {
    start: {
      title: 'Der reisen starter',
      description: 'Enkelt skjema med noen få spørsmål: hva, hvor, hvor lenge.'
    },
    validation: {
      title: 'Sjekk at alt er med',
      description: 'Vi fanger opp åpenbare mangler (f.eks. null dager eller for lavt budsjett) før vi regner.'
    },
    dataTransform: {
      title: 'Data-transformasjon (ikke sending)',
      description: 'Vi gjør om svarene til et strukturert format som kalkulasjons-modulene forstår. Selve innsendingen skjer senere i «Beregn Total». '
    },
    film: {
      title: 'Film',
      description: 'Typisk 8–15 personer. Mer lys, kamera og logistikk.'
    },
    stills: {
      title: 'Stills',
      description: 'Mindre crew, raskere oppsett, enklere logistikk.'
    },
    keywords: {
      title: 'Nøkkelord / Tilvalg',
      description: 'Velg ett nøkkelord av gangen for å se hvordan det påvirker kalkylen.'
    },
    filmCrew: {
      title: 'Hvem må være med (film)',
      description: 'Vi velger roller basert på best praksis og størrelsen på opptaket.'
    },
    stillsCrew: {
      title: 'Hvem må være med (stills)',
      description: 'Strømlinjeformet crew for effektiv fotoproduksjon.'
    },
    equipment: {
      title: 'Utstyr og transport',
      description: 'Kamera/lys/grip og kjøretøy velges ut fra type produksjon og crew.'
    },
    calculate: {
      title: 'Send til motor & beregn',
      description: 'Vi sender strukturert input til backenden og legger sammen linjene. Resultatet vises forklarbart.'
    }
  };

  // Deep-dive (friendly) details per node
  const detailPoints = {
    start: [
      'Henter tidligere data (hvis brukt før) for raskere oppstart.',
      'Støtter flere valutaer; regner på NOK under panseret for konsistens.'
    ],
    validation: [
      'Sjekker gyldig e-post, dager > 0 og lokasjoner > 0.',
      'Advarer hvis budsjett < minimum for valgt oppsett.',
      'Lokasjoner låses til ≥2 hvis både Oslo og utenfor Oslo velges.'
    ],
    dataTransform: [
      'Mapper FE-felter til backend: produksjonstype, crew-flagg, tilvalg, dager og lokasjoner.',
      'Konverterer budsjett til NOK før beregning.',
      'Forbereder datasett for Film/Stills-modulene.'
    ],
    film: [
      'Høyere basisdagrate i FilmCalculations.',
      'Crew skaleres av dager, lokasjoner og spesialutstyr.'
    ],
    stills: [
      'StillsCalculations legger inn effektivt fotocrew.',
      'Rimeligere utstyrspakker og raskere opp/nedrigg.'
    ],
    keywords: [
      'Full crew vs. fixer, tech-utstyr, creatives, scout, post, remote, lokal casting, car m.m.',
      'Påvirker minimum/maximum, anbefalinger og hvilke linjer som tas med.'
    ],
    filmCrew: [
      'Produsent/PM, regi/DOP, gaffer/grip, AC, lyd m.fl.',
      'Transport, per diem og evt. overtid modelleres.'
    ],
    stillsCrew: [
      'Fotograf, assistent, lysansvarlig; styling/MUA ved behov.',
      'Crew kan økes ved flere lokasjoner.'
    ],
    equipment: [
      'Grunnpakke kamera/lys/grip; spesialutstyr som drone/road block/lowloader øker kost.',
      'Transport dimm. av crew-størrelse og lokasjoner; creativeCalculations kan gi påslag.'
    ],
    calculate: [
      'calculate.js summerer linjer og margin/donasjon.',
      'co2-emissions.js estimerer utslipp for transport/strøm.',
      'Resultat vises linje-for-linje med mellomtall.'
    ]
  };

  // --- Keyword model (exclusive selection in explainer) ---
  const keywordItems = [
    {
      id: 'full-crew',
      title: 'Full crew',
      blurb: 'Full service: komplett crew, produksjon og logistikk.',
      impact: [
        'Setter et høyere minimumsbudsjett (film/stills avhenger av type).',
        'Aktiverer flere crew-linjer (PM/Prod, gaffer/grip, AC, lyd m.m.).',
        'Kan kreve mer utstyr og transport.'
      ]
    },
    {
      id: 'fixer',
      title: 'Fixer',
      blurb: 'Lokal fasilitering uten fullt crew.',
      impact: [
        'Lavere crewkostnad enn full crew.',
        'Mer fleksibelt oppsett – passer research/enkle opptak.'
      ]
    },
    {
      id: 'tech-equipment',
      title: 'Teknisk utstyr',
      blurb: 'Kamera/lys/grip-pakker og tekniske spesialer.',
      impact: [
        'Øker minimumsbudsjett (mer i film enn stills).',
        'Trigger spesiallinjer (drone, jib, steadicam, underwater, specialized).'
      ]
    },
    {
      id: 'creatives',
      title: 'Creatives',
      blurb: 'DOP og evt. regissør som kreativt tillegg.',
      impact: [
        'Hever ambisjonsnivå og påslag via creativeCalculations.',
        'Særlig nyttig ved remote shoots.'
      ]
    },
    {
      id: 'scout',
      title: 'Location scout',
      blurb: 'Finner og sikrer lokasjoner.',
      impact: [
        'Legger til scouting-dager og transport.',
        'Reduserer risiko for uforutsette kostnader på opptaksdag.'
      ]
    },
    {
      id: 'postproduction',
      title: 'Postproduksjon',
      blurb: 'Klipp, farge og lyd.',
      impact: [
        'Øker anbefalt/min/max (typisk +10–30%).',
        'Gir mer forklarbare linjer etter opptak.'
      ]
    },
    {
      id: 'local-talent',
      title: 'Casting (lokal talent)',
      blurb: 'Skuespillere/ekstraer lokalt.',
      impact: [
        'Egne linjer for castinghonorar, administrasjon og koordinering.',
        'Kan gi ekstra transport/forpleining.'
      ]
    },
    {
      id: 'remote-shoot',
      title: 'Remote shoot',
      blurb: 'Teknisk oppsett for fjernregi.',
      impact: [
        'Teknisk rigg og QA for monitor/lyd/tilkobling.',
        'Gir påslag i anbefalt budsjett.'
      ]
    },
    {
      id: 'car',
      title: 'Car (som nøkkelord)',
      blurb: 'Bil-opptak med sikkerhet/rigg/forsikring.',
      impact: [
        'Stor påvirkning på min-budsjett (road blocks, lowloader, forsikring).',
        'Mer crew og logistikk enn standard – selv ved stills.'
      ]
    }
  ];

  // Helper: go to a node by id
  const goTo = (nodeId) => {
    const p = computePath();
    const idx = p.indexOf(nodeId);
    if (idx !== -1) {
      setActiveNode(nodeId);
      setSelectedPath(p.slice(0, idx + 1));
    }
  };

  // Node click handler: only Film/Stills are selectable as branches
  const handleNodeClick = (nodeId) => {
    if (nodeId === 'film' || nodeId === 'stills') {
      setChosenType(nodeId);
      const p = computePath(nodeId);
      const idx = p.indexOf(nodeId);
      setActiveNode(nodeId);
      setSelectedPath(p.slice(0, idx + 1));
      return;
    }
    goTo(nodeId);
  };

  return (
    <div className="bg-[#f8f7f5] min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2d2a26]">Line.Calc – Flowshart</h1>
              <p className="text-[#6f655c]">Interaktiv gjennomgang </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetFlow}
                className="px-4 py-2 bg-[#47403a] text-white rounded-lg hover:bg-[#35302b] transition-colors"
              >
                Start på nytt
              </button>
              <button
                onClick={() => setShowDataInfo(!showDataInfo)}
                className="px-4 py-2 bg-[#f8f7f5] text-[#47403a] border border-[#eeebe7] rounded-lg hover:bg-[#eeebe7] transition-colors"
              >
                {showDataInfo ? 'Skjul' : 'Vis'} Data Info
              </button>
              <button
                onClick={() => setShowDeepDive((v) => !v)}
                className="px-4 py-2 bg-[#f8f7f5] text-[#47403a] border border-[#eeebe7] rounded-lg hover:bg-[#eeebe7] transition-colors"
              >
                {showDeepDive ? 'Skjul' : 'Vis'} dypdykk
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-[#f8f7f5] text-[#47403a] border border-[#eeebe7] rounded-lg hover:bg-[#eeebe7] transition-colors font-medium"
              >
                Tilbake
              </a>
            </div>
          </div>

          {/* Friendly Data Info */}
          {showDataInfo && (
            <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <h3 className="font-bold text-amber-900 mb-2">Hva skjer “under panseret” – uten kode</h3>
              <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
                <li><strong>Summering &amp; regler:</strong> <code>calculate.js</code> samler linjer og margin/donasjon.</li>
                <li><strong>Film:</strong> <code>FilmCalculations.js</code> beskriver crew, utstyr og dager.</li>
                <li><strong>Stills:</strong> <code>StillsCalculations.js</code> gjør det samme for foto.</li>
                <li><strong>Kreative påslag:</strong> <code>creativeCalculations.js</code> justerer for idé/ambisjonsnivå.</li>
                <li><strong>Fotavtrykk:</strong> <code>co2-emissions.js</code> estimerer utslipp.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main area – sticky info left, flowchart right */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left info panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Hva skjer i dette steget?</h2>

              {/* Default node info */}
              {activeNode !== 'keywords' && nodeInfo[activeNode] && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{nodeInfo[activeNode].title}</h3>
                    <p className="text-gray-600">{nodeInfo[activeNode].description}</p>
                  </div>

                  {showDeepDive && detailPoints[activeNode] && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-[#2d2a26] mb-1">Vurderinger i dette steget</h4>
                      <ul className="list-disc list-inside text-sm text-[#47403a] space-y-1">
                        {detailPoints[activeNode].map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {investorNotes[activeNode] && (
                    <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Hvorfor dette betyr noe for forretningen</h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-1">
                        {investorNotes[activeNode].map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Keyword explainer (exclusive) */}
              {activeNode === 'keywords' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{nodeInfo.keywords.title}</h3>
                    <p className="text-gray-600">{nodeInfo.keywords.description}</p>
                  </div>

                  {/* Keyword list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {keywordItems.map((k) => (
                      <button
                        key={k.id}
                        onClick={() => setSelectedKeyword(k.id)}
                        className={`text-left px-3 py-2 rounded-lg border transition-colors ${
                          selectedKeyword === k.id
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-[#f8f7f5] border-[#eeebe7] text-[#2d2a26] hover:bg-[#f1f0ee]'
                        }`}
                      >
                        <div className="font-medium">{k.title}</div>
                        <div className={`text-xs mt-0.5 ${selectedKeyword === k.id ? 'text-emerald-50' : 'text-[#6f655c]'}`}>{k.blurb}</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected keyword details */}
                  {selectedKeyword && (
                    <div className="mt-3">
                      {(() => {
                        const k = keywordItems.find((x) => x.id === selectedKeyword);
                        if (!k) return null;
                        return (
                          <div className="bg-white border border-[#eeebe7] rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-[#2d2a26]">{k.title}</h4>
                              <button
                                onClick={() => setSelectedKeyword(null)}
                                className="text-xs px-2 py-1 rounded bg-[#f8f7f5] border border-[#eeebe7]"
                              >
                                Tøm valg
                              </button>
                            </div>
                            <p className="text-sm text-[#47403a] mt-1">{k.blurb}</p>
                            <div className="mt-3">
                              <div className="text-xs text-[#6f655c] mb-1">Hvordan påvirker dette budsjettet?</div>
                              <ul className="list-disc list-inside text-sm text-[#2d2a26] space-y-1">
                                {k.impact.map((i, idx) => (
                                  <li key={idx}>{i}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Business angle */}
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-emerald-800 mb-1">Hvorfor nøkkelord betyr noe</div>
                    <p className="text-sm text-emerald-900">Nøkkelord gjør det lett å forklare <em>hvorfor</em> prisen endrer seg. Det gir transparens og bedre dialog med kunde/investor.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flowchart (right) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Systemflyt</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#e5e7eb] border border-[#9ca3af]"></span>
                  <span className="text-gray-600">= ikke gjennomført</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#10b981] ml-3"></span>
                  <span className="text-gray-600">= ferdig</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-[#374151] ml-3"></span>
                  <span className="text-gray-600">= aktivt steg</span>
                </div>
              </div>

              <div className="relative">
                <svg viewBox="0 0 600 850" className="w-full">
                  {/* Start */}
                  {(() => { const c = colorFor('start'); return (
                    <g onClick={() => handleNodeClick('start')} className="cursor-pointer">
                      <title>Start • Bruker fyller inn grunninfo</title>
                      <circle cx="300" cy="50" r="35" fill={c.fill} stroke={c.stroke} />
                      <text x="300" y="55" textAnchor="middle" fill={c.text} fontSize="16" fontWeight="bold">START</text>
                    </g>
                  ); })()}
                  <line x1="300" y1="85" x2="300" y2="110" stroke="#9ca3af" strokeWidth="2" />

                  {/* Validation */}
                  {(() => { const c = colorFor('validation'); return (
                    <g onClick={() => handleNodeClick('validation')} className="cursor-pointer">
                      <title>Validering • Sjekker at input er komplett</title>
                      <rect x="225" y="110" width="150" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="300" y="140" textAnchor="middle" fill={c.text} fontSize="14" fontWeight="bold">Validering</text>
                    </g>
                  ); })()}
                  <line x1="300" y1="160" x2="300" y2="185" stroke="#9ca3af" strokeWidth="2" />

                  {/* Data Transform */}
                  {(() => { const c = colorFor('dataTransform'); return (
                    <g onClick={() => handleNodeClick('dataTransform')} className="cursor-pointer">
                      <title>Data Transform • Strukturér FE-data (ikke sending)</title>
                      <rect x="210" y="185" width="180" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="300" y="215" textAnchor="middle" fill={c.text} fontSize="14" fontWeight="bold">Data Transform</text>
                    </g>
                  ); })()}
                  <line x1="300" y1="235" x2="300" y2="260" stroke="#9ca3af" strokeWidth="2" />

                  {/* Branch selection (Film / Stills) */}
                  <line x1="300" y1="260" x2="150" y2="260" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="150" y1="260" x2="150" y2="280" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="300" y1="260" x2="450" y2="260" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="450" y1="260" x2="450" y2="280" stroke="#9ca3af" strokeWidth="2" />

                  {/* Film box */}
                  {(() => { const c = colorFor('film'); return (
                    <g onClick={() => handleNodeClick('film')} className="cursor-pointer">
                      <title>Film • 8–15 crew, høy produksjonsverdi</title>
                      <rect x="75" y="280" width="150" height="60" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="150" y="315" textAnchor="middle" fontSize="14" fontWeight="bold" fill={c.text}>Film</text>
                    </g>
                  ); })()}

                  {/* Stills box */}
                  {(() => { const c = colorFor('stills'); return (
                    <g onClick={() => handleNodeClick('stills')} className="cursor-pointer">
                      <title>Stills • Rask produksjon, mindre crew</title>
                      <rect x="375" y="280" width="150" height="60" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="450" y="315" textAnchor="middle" fontSize="14" fontWeight="bold" fill={c.text}>Stills</text>
                    </g>
                  ); })()}

                  {/* Merge to Keywords */}
                  <line x1="150" y1="340" x2="150" y2="365" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="450" y1="340" x2="450" y2="365" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="150" y1="365" x2="300" y2="365" stroke="#9ca3af" strokeWidth="2" />
                  <line x1="450" y1="365" x2="300" y2="365" stroke="#9ca3af" strokeWidth="2" />

                  {/* Keywords node */}
                  {(() => { const c = colorFor('keywords'); return (
                    <g onClick={() => handleNodeClick('keywords')} className="cursor-pointer">
                      <title>Nøkkelord / Tilvalg • Klikk for å utforske</title>
                      <rect x="225" y="365" width="150" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="300" y="395" textAnchor="middle" fill={c.text} fontSize="13" fontWeight="bold">Nøkkelord</text>
                    </g>
                  ); })()}

                  {/* Crew selection (depends on branch) */}
                  <line x1="300" y1="415" x2="300" y2="445" stroke="#9ca3af" strokeWidth="2" />
                  {(() => {
                    const crewNode = chosenType ? `${chosenType}Crew` : 'filmCrew';
                    const c = colorFor(crewNode);
                    return (
                      <g
                        onClick={() => {
                          if (chosenType === 'film') setActiveNode('filmCrew');
                          else if (chosenType === 'stills') setActiveNode('stillsCrew');
                          setSelectedPath(computePath().slice(0, computePath().indexOf(crewNode) + 1));
                        }}
                        className="cursor-pointer"
                      >
                        <title>Crew seleksjon • Roller basert på behov og budsjett</title>
                        <rect x="200" y="445" width="200" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                        <text x="300" y="475" textAnchor="middle" fill={c.text} fontSize="14" fontWeight="bold">Crew Seleksjon</text>
                      </g>
                    );
                  })()}

                  {/* Equipment */}
                  <line x1="300" y1="495" x2="300" y2="525" stroke="#9ca3af" strokeWidth="2" />
                  {(() => { const c = colorFor('equipment'); return (
                    <g onClick={() => handleNodeClick('equipment')} className="cursor-pointer">
                      <title>Utstyr &amp; Transport • Kostdriver og upsell</title>
                      <rect x="200" y="525" width="200" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="300" y="555" textAnchor="middle" fill={c.text} fontSize="14" fontWeight="bold">Utstyr &amp; Transport</text>
                    </g>
                  ); })()}

                  {/* Calculate */}
                  <line x1="300" y1="575" x2="300" y2="605" stroke="#9ca3af" strokeWidth="2" />
                  {(() => { const c = colorFor('calculate'); return (
                    <g onClick={() => handleNodeClick('calculate')} className="cursor-pointer">
                      <title>Beregn • Send til motor & forklarbar totalpris</title>
                      <rect x="215" y="605" width="170" height="50" rx="8" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
                      <text x="300" y="635" textAnchor="middle" fill={c.text} fontSize="14" fontWeight="bold">Beregn Total 💰</text>
                    </g>
                  ); })()}
                </svg>
              </div>
            </div>

            {/* Path visualization */}
            {selectedPath.length > 1 && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-700 mb-3">Din vei gjennom systemet:</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedPath.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        step === activeNode ? 'bg-[#374151] text-white' : 'bg-[#10b981] text-white'
                      }`}>
                        {nodeInfo[step]?.title || step}
                      </span>
                      {idx < selectedPath.length - 1 && <span className="text-gray-400">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDocs;