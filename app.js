const centers = {
  regensburg: {
    name: "ILS Regensburg",
    weather: "Leichter Regen, 12 C",
    mapCenter: [49.0134, 12.1016],
    zoom: 13,
    stations: [
      { id: "rkt-west", label: "RKT West", address: "Ziegetsdorfer Straße 50", lat: 49.0031, lng: 12.0704, vehicles: { RTW: 1 } },
      { id: "malteser-bruderwoehrd", label: "Malteser Bruderwöhrdstraße", address: "Bruderwöhrdstraße 3", lat: 49.0218, lng: 12.1182, vehicles: { RTW: 1 } },
      { id: "brk-straubinger", label: "BRK Rettungswache Straubinger Straße", address: "Hoher-Kreuz-Weg 7", lat: 49.0191, lng: 12.1441, vehicles: { RTW: 3, KTW: 1 } },
      { id: "johanniter-haslbach", label: "Johanniter Haslbach", address: "Wernberger Straße 1", lat: 49.0558, lng: 12.1300, vehicles: { RTW: 1 } },
      { id: "nef-ukr", label: "NEF Universitätsklinikum", address: "Franz-Josef-Strauß-Allee 11", lat: 48.9879, lng: 12.0900, vehicles: { NEF: 1 } },
      { id: "nef-barmherzige", label: "NEF Barmherzige Brüder", address: "Prüfeninger Straße 86", lat: 49.0162, lng: 12.0663, vehicles: { NEF: 1 } }
    ],
    hospitals: [
      { id: "kh-ukr", label: "Universitätsklinikum Regensburg", address: "Franz-Josef-Strauß-Allee 11", lat: 48.9879, lng: 12.0900 },
      { id: "kh-barmherzige", label: "Krankenhaus Barmherzige Brüder", address: "Prüfeninger Straße 86", lat: 49.0162, lng: 12.0663 },
      { id: "kh-st-josef", label: "Caritas-Krankenhaus St. Josef", address: "Landshuter Straße 65", lat: 49.0049, lng: 12.1124 },
      { id: "kh-st-hedwig", label: "KUNO Klinik St. Hedwig", address: "Steinmetzstraße 1-3", lat: 49.0188, lng: 12.0838 },
      { id: "kh-medbo", label: "medbo Bezirksklinikum Regensburg", address: "Universitätsstraße 84", lat: 48.9919, lng: 12.0914 }
    ]
  }
};

const rdKeywords = window.rdKeywords || [];
const keywordDefaults = Object.fromEntries(rdKeywords.map((item) => [item.label, item]));



const callTemplates = [
  {
    type: "emergency",
    keyword: "RD 2 Herz/Kreislauf - vitale Bedrohung",
    callerName: "Herr Lehner",
    callerText: "Guten Tag, hier ist Lehner aus der Maximilianstraße. Meine Frau hat starke Schmerzen in der Brust, ist blass und kaltschweißig. Sie sagt, es drückt bis in den linken Arm.",
    location: "Maximilianstraße 18, Regensburg",
    lat: 49.0177,
    lng: 12.0985,
    required: ["RTW", "NEF"],
    priority: "hoch",
    signal: true
  },
  {
    type: "emergency",
    keyword: "RD 1 Trauma - Verkehrsunfall nur RD",
    callerName: "Polizei Regensburg",
    callerText: "Verkehrsunfall an der Nibelungenbrücke Richtung Stadtmitte. Zwei Pkw, eine Person klagt über Schmerzen, Verkehr staut sich.",
    location: "Nibelungenbrücke, Regensburg",
    lat: 49.0204,
    lng: 12.1129,
    required: ["RTW", "NEF"],
    priority: "hoch",
    signal: true
  },
  {
    type: "emergency",
    keyword: "RD 2 Bewusstsein - vitale Bedrohung",
    callerName: "Frau Bauer",
    callerText: "Im Donau-Einkaufszentrum ist ein Mann umgekippt. Er reagiert nicht richtig, atmet aber. Wir sind am Haupteingang beim Bäcker.",
    location: "Donau-Einkaufszentrum, Regensburg",
    lat: 49.0305,
    lng: 12.1113,
    required: ["RTW", "NEF"],
    priority: "hoch",
    signal: true
  },
  {
    type: "emergency",
    keyword: "RD 2 Atmung - vitale Bedrohung",
    callerName: "Herr Schneider",
    callerText: "Mein Vater bekommt schlecht Luft. Er sitzt am Fenster, ist sehr unruhig und kann kaum sprechen.",
    location: "Prüfeninger Straße 74, Regensburg",
    lat: 49.0189,
    lng: 12.0727,
    required: ["RTW"],
    priority: "hoch",
    signal: true
  },
  {
    type: "transport",
    keyword: "RD KTP - Transport zum Krankenhaus",
    callerName: "Station 3B",
    callerText: "Wir brauchen einen liegenden Transport vom St. Josef zur ambulanten Untersuchung. Patient ist stabil und angemeldet.",
    location: "Caritas-Krankenhaus St. Josef, Regensburg",
    lat: 49.0067,
    lng: 12.1114,
    required: ["KTW"],
    priority: "normal",
    signal: false
  },
  {
    type: "scheduled",
    keyword: "RD KTP - Dialyse",
    callerName: "Dialysezentrum Regensburg",
    callerText: "Der Rücktransport einer Dialysepatientin ist in zwanzig Minuten bereit. Sitzend, keine Sonderrechte.",
    location: "Dialysezentrum, Friedenstrasse 10, Regensburg",
    lat: 49.0116,
    lng: 12.1144,
    required: ["KTW"],
    priority: "terminiert",
    signal: false
  },
  {
    type: "emergency",
    keyword: "RD 1 Schmerzen",
    callerName: "Frau Wagner",
    callerText: "Mein Mann hat seit einer Stunde starke Bauchschmerzen und kann kaum aufstehen. Wir sind in der Dechbettener Straße.",
    location: "Dechbettener Straße 12, Regensburg",
    lat: 49.0102,
    lng: 12.0759,
    required: ["RTW"],
    priority: "normal",
    signal: true
  },
  {
    type: "emergency",
    keyword: "RD 1 Kind - erkrankt",
    callerName: "Herr Albrecht",
    callerText: "Unser Kind hat hohes Fieber und wirkt sehr matt. Wir machen uns Sorgen, bitte schicken Sie jemanden.",
    location: "Kumpfmühler Straße 39, Regensburg",
    lat: 49.0056,
    lng: 12.0912,
    required: ["RTW"],
    priority: "normal",
    signal: true
  },
  {
    type: "transport",
    keyword: "RD KTP - Verlegung",
    callerName: "Barmherzige Brüder Aufnahme",
    callerText: "Verlegung eines stabilen Patienten zur weiteren Diagnostik in das Universitätsklinikum. Liegend, ohne Sonderrechte.",
    location: "Krankenhaus Barmherzige Brüder, Regensburg",
    lat: 49.0162,
    lng: 12.0663,
    required: ["KTW"],
    priority: "normal",
    signal: false,
    fixedDestinationId: "kh-ukr"
  },
  {
    type: "transport",
    keyword: "RD 1 Verlegung - Notfalltransport mit RTW",
    callerName: "Klinik St. Hedwig",
    callerText: "Wir benötigen einen RTW für einen zeitkritischen Notfalltransport zum Universitätsklinikum. Patient ist transportfertig.",
    location: "KUNO Klinik St. Hedwig, Regensburg",
    lat: 49.0188,
    lng: 12.0838,
    required: ["RTW"],
    priority: "hoch",
    signal: true,
    fixedDestinationId: "kh-ukr"
  },
  {
    type: "scheduled",
    keyword: "RD KTP - Heimfahrt",
    callerName: "Ambulanz UKR",
    callerText: "Patient nach ambulanter Behandlung abholbereit, sitzend nach Hause, kein Sauerstoff, keine Sonderrechte.",
    location: "Universitätsklinikum Regensburg",
    lat: 48.9879,
    lng: 12.0900,
    required: ["KTW"],
    priority: "terminiert",
    signal: false
  }
];

const state = {
  center: centers.regensburg,
  dispatcher: "Gast",
  minute: 0,
  speed: 1,
  paused: false,
  pendingCall: null,
  audioContext: null,
  editingIncidentId: null,
  selectedIncidentId: null,
  selectedVehicleId: null,
  incidentFilter: "emergency",
  incidents: [],
  vehicles: [],
  timers: [],
  timeouts: [],
  lastClockTick: Date.now(),
  lastCallRateMinute: 0,
  editorPoints: [],
  editingMapPointId: null,
  selectedDialogVehicleIds: new Set(),
  lastCallTemplateIndex: -1,
  availableMaps: [],
  coveragePoints: [
    { id: "cov-altstadt", label: "Altstadt / Innenstadt", lat: 49.0194, lng: 12.0974 },
    { id: "cov-west", label: "Regensburg West", lat: 49.0130, lng: 12.0618 },
    { id: "cov-ost", label: "Regensburg Ost", lat: 49.0164, lng: 12.1426 },
    { id: "cov-nord", label: "Regensburg Nord / Haslbach", lat: 49.0476, lng: 12.1184 },
    { id: "cov-sued", label: "Universität / Süd", lat: 48.9913, lng: 12.0962 }
  ],
  map: null,
  mapReady: false,
  layers: {
    stations: [],
    hospitals: [],
    incidents: [],
    vehicles: [],
    routes: []
  }
};

const el = {
  startScreen: document.querySelector("#start-screen"),
  dispatchScreen: document.querySelector("#dispatch-screen"),
  shiftForm: document.querySelector("#shift-form"),
  centerSelect: document.querySelector("#center-select"),
  dispatcherName: document.querySelector("#dispatcher-name"),
  timeSelect: document.querySelector("#time-select"),
  startMapEditorButton: document.querySelector("#start-map-editor-button"),
  startIncidentEditorButton: document.querySelector("#start-incident-editor-button"),
  activeCenter: document.querySelector("#active-center"),
  operatorLabel: document.querySelector("#operator-label"),
  weatherLabel: document.querySelector("#weather-label"),
  map: document.querySelector("#map"),
  incidentList: document.querySelector("#incident-list"),
  incidentCount: document.querySelector("#incident-count"),
  callLog: document.querySelector("#call-log"),
  radioLog: document.querySelector("#radio-log"),
  callActions: document.querySelector("#call-actions"),
  vehicleList: document.querySelector("#vehicle-list"),
  answerButton: document.querySelector("#answer-button"),
  forwardButton: document.querySelector("#forward-button"),
  newCallButton: document.querySelector("#new-call-button"),
  adminModeButton: document.querySelector("#admin-mode-button"),
  speedSelect: document.querySelector("#speed-select"),
  pauseButton: document.querySelector("#pause-button"),
  endShiftButton: document.querySelector("#end-shift-button"),
  editorButton: document.querySelector("#editor-button"),
  incidentEditorButton: document.querySelector("#incident-editor-button"),
  coverageButton: document.querySelector("#coverage-button"),
  vehicleSort: document.querySelector("#vehicle-sort"),
  clockLabel: document.querySelector("#clock-label"),
  incidentDialog: document.querySelector("#incident-dialog"),
  incidentForm: document.querySelector("#incident-form"),
  incidentLocation: document.querySelector("#incident-location"),
  incidentKeywordSearch: document.querySelector("#incident-keyword-search"),
  incidentKeyword: document.querySelector("#incident-keyword"),
  incidentSignal: document.querySelector("#incident-signal"),
  dispositionSuggestion: document.querySelector("#disposition-suggestion"),
  incidentFw: document.querySelector("#incident-fw"),
  incidentPol: document.querySelector("#incident-pol"),
  incidentCaller: document.querySelector("#incident-caller"),
  incidentNote: document.querySelector("#incident-note"),
  incidentMapButton: document.querySelector("#incident-map-button"),
  dialogVehicleList: document.querySelector("#dialog-vehicle-list"),
  editorDialog: document.querySelector("#editor-dialog"),
  editorType: document.querySelector("#editor-type"),
  editorMapName: document.querySelector("#editor-map-name"),
  editorName: document.querySelector("#editor-name"),
  editorRtw: document.querySelector("#editor-rtw"),
  editorKtw: document.querySelector("#editor-ktw"),
  editorNef: document.querySelector("#editor-nef"),
  editorRef: document.querySelector("#editor-ref"),
  editorRth: document.querySelector("#editor-rth"),
  editorLat: document.querySelector("#editor-lat"),
  editorLng: document.querySelector("#editor-lng"),
  useMapCenterButton: document.querySelector("#use-map-center-button"),
  addMapPointButton: document.querySelector("#add-map-point-button"),
  editorPointList: document.querySelector("#editor-point-list"),
  newMapButton: document.querySelector("#new-map-button"),
  saveMapButton: document.querySelector("#save-map-button"),
  savedMapList: document.querySelector("#saved-map-list"),
  coverageDialog: document.querySelector("#coverage-dialog"),
  coverageList: document.querySelector("#coverage-list"),
  radioAlerts: document.querySelector("#radio-alerts"),
  callDispositionDialog: document.querySelector("#call-disposition-dialog"),
  callDispositionText: document.querySelector("#call-disposition-text"),
  callFwButton: document.querySelector("#call-fw-button"),
  callPolButton: document.querySelector("#call-pol-button"),
  callAendButton: document.querySelector("#call-aend-button"),
  callRejectButton: document.querySelector("#call-reject-button"),
  callMapButton: document.querySelector("#call-map-button"),
  callCreateButton: document.querySelector("#call-create-button")
};

el.shiftForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await startShift();
});

el.answerButton.addEventListener("click", answerCall);
el.forwardButton.addEventListener("click", forwardCall);
el.newCallButton.addEventListener("click", receiveCall);
el.adminModeButton.addEventListener("click", enableAdminMode);
el.startMapEditorButton?.addEventListener("click", openEditor);
el.startIncidentEditorButton?.addEventListener("click", openIncidentEditor);
el.callFwButton.addEventListener("click", () => referPendingCall("FW"));
el.callPolButton.addEventListener("click", () => referPendingCall("POL"));
el.callAendButton.addEventListener("click", () => referPendingCall("AEND"));
el.callRejectButton.addEventListener("click", rejectPendingCall);
el.callMapButton.addEventListener("click", showPendingCallOnMap);
el.callCreateButton.addEventListener("click", () => {
  openIncidentDialog();
  el.callDispositionDialog.close();
});
el.callDispositionDialog.addEventListener("close", handleCallDispositionClosed);
el.speedSelect.addEventListener("change", setSpeed);
el.pauseButton.addEventListener("click", togglePause);
el.endShiftButton.addEventListener("click", endShift);
el.editorButton.addEventListener("click", openEditor);
el.incidentEditorButton.addEventListener("click", openIncidentEditor);
el.coverageButton.addEventListener("click", openCoverageDialog);
el.vehicleSort.addEventListener("change", renderVehicles);
el.incidentMapButton.addEventListener("click", showPendingCallOnMap);
el.incidentForm.addEventListener("submit", submitIncidentDialog);
el.incidentKeyword.addEventListener("change", renderDispositionSuggestion);
el.incidentKeywordSearch.addEventListener("input", () => populateKeywordSelectGrouped(el.incidentKeywordSearch.value));
el.editorType.addEventListener("change", updateEditorVehicleControls);
el.useMapCenterButton.addEventListener("click", fillEditorFromMapCenter);
el.addMapPointButton.addEventListener("click", addEditorPoint);
el.newMapButton.addEventListener("click", createBlankMap);
el.saveMapButton.addEventListener("click", saveCurrentMap);
makeDialogDraggable(el.incidentDialog);

populateKeywordSelectGrouped();
loadCenterOptions();

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.incidentFilter = button.dataset.filter;
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderIncidents();
  });
});

async function startShift() {
  state.center = await loadSelectedMap(el.centerSelect.value) || await loadDefaultMap() || centers.regensburg;
  state.center.callRates = normalizedCallRates(state.center.callRates);
  state.incidentCatalog = await loadIncidentCatalog();
  ensureHospitalDepartments(state.center);
  ensurePoiCatalog(state.center);
  state.dispatcher = el.dispatcherName.value.trim() || "Gast";
  state.minute = startingMinute(el.timeSelect.value);
  state.incidents = [];
  state.pendingCall = null;
  state.editingIncidentId = null;
  state.adminMode = false;
  state.selectedIncidentId = null;
  state.selectedDialogVehicleIds = new Set();
  state.timeouts.forEach((timer) => clearTimeout(timer));
  state.timeouts = [];
  state.speed = Number(el.speedSelect.value) || 1;
  state.lastClockTick = Date.now();
  state.lastCallRateMinute = Math.floor(state.minute);
  state.vehicles = seedVehicles(state.center);

  el.activeCenter.textContent = state.center.name;
  el.operatorLabel.textContent = state.dispatcher;
  el.weatherLabel.textContent = state.center.weather;
  updateCurrentWeather();
  el.startScreen.classList.add("hidden");
  el.dispatchScreen.classList.remove("hidden");
  document.body.classList.add("dispatch-active");
  clearLogs();
  updateAdminControls();
  logCall("Schicht gestartet. Telefon ist frei.", "call");
  logRadio("Alle Fahrzeuge melden einsatzbereit.", "radio");
  initMap();
  renderAll();
  receiveCall();
  startClock();
}

async function loadCenterOptions() {
  const fallback = [{ id: "regensburg", name: centers.regensburg.name }];
  try {
    const response = await fetch("/api/maps");
    if (!response.ok) throw new Error("map list unavailable");
    const maps = await response.json();
    state.availableMaps = Array.isArray(maps) && maps.length ? maps : fallback;
  } catch {
    state.availableMaps = fallback;
  }

  const previousValue = el.centerSelect.value;
  el.centerSelect.innerHTML = "";
  state.availableMaps.forEach((map) => {
    const option = document.createElement("option");
    option.value = map.id || "regensburg";
    option.textContent = map.name || map.id || centers.regensburg.name;
    el.centerSelect.append(option);
  });
  const defaultId = state.availableMaps.find((map) => map.id === "regensburg-test")?.id
    || state.availableMaps[0]?.id
    || "regensburg";
  el.centerSelect.value = state.availableMaps.some((map) => map.id === previousValue) ? previousValue : defaultId;
}

function enableAdminMode() {
  if (state.adminMode) {
    state.adminMode = false;
    updateAdminControls();
    return;
  }
  const password = window.prompt("Admin-Passwort");
  if (password !== "XXX112XXX") {
    logRadio("Admin-Modus: falsches Passwort.", "warn");
    return;
  }
  state.adminMode = true;
  updateAdminControls();
  logRadio("Admin-Modus aktiviert.", "radio");
}

function updateAdminControls() {
  document.querySelectorAll(".admin-only").forEach((node) => {
    node.hidden = !state.adminMode;
  });
  el.adminModeButton.textContent = state.adminMode ? "Admin aktiv" : "Admin";
}

function ensureHospitalDepartments(center) {
  const defaults = {
    "kh-ukr": ["cardiology", "neurology", "trauma", "pediatrics", "obstetrics", "internal", "stroke", "icu"],
    "kh-barmherzige": ["cardiology", "neurology", "trauma", "internal", "stroke", "icu"],
    "kh-st-josef": ["cardiology", "internal", "obstetrics"],
    "kh-st-hedwig": ["pediatrics", "obstetrics"],
    "kh-medbo": ["psychiatry"]
  };
  center.hospitals.forEach((hospital) => {
    hospital.departments = (hospital.departments || defaults[hospital.id] || ["internal"]).map(normalizeDepartmentKey);
  });
}

function ensurePoiCatalog(center) {
  const existing = Array.isArray(center.poi) ? center.poi : [];
  const stations = (center.stations || []).map((station) => ({
    id: `station-${station.id}`,
    label: station.label,
    address: station.address,
    lat: station.lat,
    lng: station.lng,
    categories: ["station"]
  }));
  const hospitals = (center.hospitals || []).map((hospital) => ({
    id: `hospital-${hospital.id}`,
    label: hospital.label,
    address: hospital.address,
    lat: hospital.lat,
    lng: hospital.lng,
    categories: ["hospital", ...(hospital.departments || [])]
  }));
  const byId = new Map([...existing, ...stations, ...hospitals].map((poi) => [poi.id || poi.label, poi]));
  center.poi = [...byId.values()];
}

async function updateCurrentWeather() {
  const [lat, lng] = state.center.mapCenter || [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("weather unavailable");
    const data = await response.json();
    const weather = weatherLabel(data.current?.weather_code);
    const temperature = Math.round(Number(data.current?.temperature_2m));
    if (Number.isFinite(temperature)) {
      state.center.weather = `${weather}, ${temperature}°C`;
      el.weatherLabel.textContent = state.center.weather;
    }
  } catch {
    el.weatherLabel.textContent = state.center.weather || "Wetter nicht verfügbar";
  }
}

function weatherLabel(code) {
  if ([0].includes(code)) return "Klar";
  if ([1, 2].includes(code)) return "Heiter";
  if ([3].includes(code)) return "Bewölkt";
  if ([45, 48].includes(code)) return "Nebel";
  if ([51, 53, 55, 56, 57].includes(code)) return "Nieselregen";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Regen";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Schnee";
  if ([95, 96, 99].includes(code)) return "Gewitter";
  return "Wetter";
}

function rd(label, type, required, signal) {
  return { label, type, required, signal };
}

function populateKeywordSelect() {
  el.incidentKeyword.innerHTML = '<option value="">Bitte wählen</option>';
  rdKeywords.forEach((keyword) => {
    const option = document.createElement("option");
    option.value = keyword.label;
    option.textContent = keyword.label;
    el.incidentKeyword.append(option);
  });
}

function keywordGroupName(label) {
  if (label.includes("KTP")) return "Krankentransport";
  if (label.includes("Herz") || label.includes("Kreislauf")) return "Herz/Kreislauf";
  if (label.includes("Atmung")) return "Atmung";
  if (label.includes("Trauma")) return "Trauma";
  if (label.includes("Neuro") || label.includes("Psych")) return "Neuro/Psych";
  if (label.includes("Kind") || label.includes("KIND") || label.includes("Säugling")) return "Kind";
  if (label.includes("Verlegung")) return "Verlegung";
  if (label.includes("ABSICHERUNG") || label.includes("SONSTIGE") || label.includes("HILFE")) return "Planbar / Sonstige";
  return "Rettungsdienst";
}

function populateKeywordSelectGrouped(filter = "") {
  const currentValue = el.incidentKeyword.value;
  const query = normalizeSearch(filter);
  el.incidentKeyword.innerHTML = '<option value="">Bitte wählen</option>';
  const groups = new Map();
  rdKeywords
    .filter((keyword) => !query || normalizeSearch(keyword.label).includes(query))
    .forEach((keyword) => {
    const groupName = keywordGroupName(keyword.label);
    if (!groups.has(groupName)) {
      const group = document.createElement("optgroup");
      group.label = groupName;
      groups.set(groupName, group);
      el.incidentKeyword.append(group);
    }
    const option = document.createElement("option");
    option.value = keyword.label;
    option.textContent = keyword.label;
    groups.get(groupName).append(option);
  });
  if (currentValue && [...el.incidentKeyword.options].some((option) => option.value === currentValue)) {
    el.incidentKeyword.value = currentValue;
  }
}

function vehicleTypeLabel(type) {
  const labels = {
    RTW: "Rettungswagen",
    KTW: "Krankentransportwagen",
    NEF: "Notarzteinsatzfahrzeug",
    REF: "Rettungseinsatzfahrzeug",
    RTH: "Rettungshubschrauber"
  };
  return labels[type] || type;
}

function endShift() {
  state.timers.forEach((timer) => clearInterval(timer));
  state.timeouts.forEach((timer) => clearTimeout(timer));
  state.timers = [];
  state.timeouts = [];
  el.dispatchScreen.classList.add("hidden");
  el.startScreen.classList.remove("hidden");
  document.body.classList.remove("dispatch-active");
}

function startingMinute(value) {
  if (value === "now") {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function seedVehicles(center) {
  return center.stations.flatMap((station, stationIndex) => {
    const vehicles = [];
    if (Array.isArray(station.units) && station.units.length) {
      station.units.forEach((unit, unitIndex) => {
        const type = unit.type || unit.name?.split(" ")[0]?.toUpperCase() || "RTW";
        const name = unit.fullName || unit.name || `${type} ${stationIndex + 1}/${unitIndex + 1}`;
        vehicles.push({
          id: `${type}-${stationIndex + 1}-${unitIndex + 1}`,
          name,
          shortName: unit.shortName || unit.short || name,
          shift: unit.shift || "",
          type,
          label: vehicleTypeLabel(type),
          station: station.label,
          stationId: station.id,
          status: 2,
          statusText: "auf Wache",
          lat: station.lat + unitIndex * 0.00045,
          lng: station.lng + unitIndex * 0.00045,
          target: null,
          incidentId: null,
          radioStatus: null,
          radioMessage: "",
          awaitingSpeechPrompt: false,
          waitingForSpeechPrompt: false,
          pendingTransportRequest: null,
          shiftWarning: false,
          coveragePointId: null
        });
      });
      return vehicles;
    }
    Object.entries(station.vehicles || { RTW: 1 }).forEach(([type, count]) => {
      for (let unitIndex = 0; unitIndex < count; unitIndex += 1) {
        vehicles.push({
          id: `${type}-${stationIndex + 1}-${unitIndex + 1}`,
          name: `${type} ${stationIndex + 1}/${unitIndex + 1}`,
          shortName: `${type} ${stationIndex + 1}/${unitIndex + 1}`,
          shift: "",
          type,
          label: vehicleTypeLabel(type),
          station: station.label,
          stationId: station.id,
          status: 2,
          statusText: "auf Wache",
          lat: station.lat + unitIndex * 0.00045,
          lng: station.lng + unitIndex * 0.00045,
          target: null,
          incidentId: null,
          radioStatus: null,
          radioMessage: "",
          awaitingSpeechPrompt: false,
          waitingForSpeechPrompt: false,
          pendingTransportRequest: null,
          shiftWarning: false,
          coveragePointId: null
        });
      }
    });
    return vehicles;
  });
}

function initMap() {
  if (typeof L === "undefined") {
    el.map.innerHTML = '<div class="map-fallback">OpenStreetMap konnte nicht geladen werden. Mit Internetverbindung erscheint hier die echte Regensburg-Karte.</div>';
    state.mapReady = false;
    return;
  }

  if (!state.map) {
    state.map = L.map(el.map, { zoomControl: true, closePopupOnClick: true }).setView(state.center.mapCenter, state.center.zoom);
    state.map.on("click", clearSelectedVehiclePopup);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      keepBuffer: 4,
      attribution: "Tiles &copy; Esri, HERE, Garmin, FAO, NOAA, USGS"
    }).addTo(state.map);
  } else {
    state.map.setView(state.center.mapCenter, state.center.zoom);
  }

  state.mapReady = true;
  repairMapSize();
  [150, 500, 1200, 2500].forEach((delay) => window.setTimeout(repairMapSize, delay));
  if (!state.mapResizeObserver) {
    state.mapResizeObserver = new ResizeObserver(() => repairMapSize());
    state.mapResizeObserver.observe(el.map);
    window.addEventListener("resize", repairMapSize);
  }
  if (!state.vehicleSelectionListener) {
    state.vehicleSelectionListener = true;
    document.addEventListener("pointerdown", (event) => {
      if (!state.selectedVehicleId) return;
      if (event.target.closest(".leaflet-popup, .vehicle-marker, .vehicle-row")) return;
      clearSelectedVehiclePopup();
    });
  }
}

function clearSelectedVehiclePopup() {
  if (!state.selectedVehicleId) return;
  state.selectedVehicleId = null;
  if (state.mapReady) state.map.closePopup();
  renderVehicles();
}

function repairMapSize() {
  if (!state.mapReady) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.map.invalidateSize({ animate: false, pan: false });
      state.map.setView(state.center.mapCenter, state.center.zoom, { animate: false });
    });
  });
}

function startClock() {
  state.timers.forEach((timer) => clearInterval(timer));
  state.timers = [];
  state.timers.push(setInterval(() => {
    if (state.paused) return;
    const now = Date.now();
    const elapsedMs = now - state.lastClockTick;
    state.lastClockTick = now;
    state.minute = (state.minute + (elapsedMs / 60000) * state.speed) % 1440;
    processCallRates();
    renderClock();
    if (state.incidents.some((incident) => incident.status !== "geschlossen")) {
      renderIncidents();
    }
    updateShiftStates();
  }, 1000));

  state.timers.push(setInterval(() => {
    if (!state.paused) updateVehicleTracking();
  }, 1000));
}

function processCallRates() {
  if (state.pendingCall || el.incidentDialog.open) return;
  const currentMinute = Math.floor(state.minute);
  let previous = state.lastCallRateMinute ?? currentMinute;
  if (currentMinute < previous) previous -= 1440;
  const steps = Math.min(60, currentMinute - previous);
  for (let index = 0; index < steps; index += 1) {
    const minute = (previous + index + 1 + 1440) % 1440;
    const type = callTypeForMinute(minute);
    if (type) {
      receiveCall(type);
      break;
    }
  }
  state.lastCallRateMinute = currentMinute;
}

function callTypeForMinute(minute) {
  const hour = Math.floor(minute / 60);
  const rate = normalizedCallRates(state.center.callRates)[hour];
  const rolls = [
    ["emergency", rate.emergency],
    ["transport", rate.transport],
    ["scheduled", rate.scheduled]
  ].filter(([, value]) => Math.random() < Math.max(0, Number(value) || 0) / 60);
  if (!rolls.length) return null;
  return rolls.sort((a, b) => b[1] - a[1])[0][0];
}

function normalizedCallRates(rates) {
  const fallback = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    emergency: hour >= 7 && hour <= 22 ? 0.9 : 0.35,
    transport: hour >= 7 && hour <= 18 ? 0.55 : 0.1,
    scheduled: hour >= 7 && hour <= 16 ? 0.25 : 0.02
  }));
  if (!Array.isArray(rates)) return fallback;
  return fallback.map((base) => ({ ...base, ...(rates.find((item) => Number(item.hour) === base.hour) || {}) }));
}

function receiveCall(forcedType = null) {
  if (state.pendingCall) return;
  let templateIndex = weightedCallTemplateIndex(forcedType);
  const templates = availableCallTemplates();
  if (templates.length > 1 && templateIndex === state.lastCallTemplateIndex) {
    templateIndex = (templateIndex + randomInt(1, templates.length - 1)) % templates.length;
  }
  state.lastCallTemplateIndex = templateIndex;
  const template = resolveTemplateLocation(normalizeIncidentTemplate(templates[templateIndex]));
  state.pendingCall = {
    ...template,
    id: makeId(),
    location: template.location || "Regensburg",
    lat: Number.isFinite(template.lat) ? template.lat : state.center.mapCenter[0],
    lng: Number.isFinite(template.lng) ? template.lng : state.center.mapCenter[1]
  };
  updateCallAddressFromNearestSource(state.pendingCall);
  reverseGeocodeCall(state.pendingCall);
  playPhoneRing();
  logCall("Neuer Telefonanruf.", "warn");
  el.answerButton.disabled = false;
  el.forwardButton.disabled = false;
  el.answerButton.classList.add("pending-call-alert");
}

function resolveTemplateLocation(template) {
  if (template.locationMode === "hospital" && state.center.hospitals?.length) {
    const hospital = state.center.hospitals[randomInt(0, state.center.hospitals.length - 1)];
    return { ...template, location: hospital.label, lat: hospital.lat, lng: hospital.lng, fixedDestinationId: template.fixedDestinationId };
  }
  if (template.locationMode === "poi" && state.center.poi?.length) {
    const candidates = matchingPoiCandidates(template);
    const poi = candidates[randomInt(0, candidates.length - 1)] || state.center.poi[randomInt(0, state.center.poi.length - 1)];
    return { ...template, location: poi.label, lat: poi.lat, lng: poi.lng };
  }
  if (template.locationMode === "random") {
    const point = randomPointInCoverage();
    return { ...template, location: point.label || nearestAddressLabel(point.lat, point.lng, template.location), lat: point.lat, lng: point.lng };
  }
  return template;
}

function matchingPoiCandidates(template) {
  const poiIds = listValue(template.poiIds).map((item) => item.toLowerCase());
  const categories = listValue(template.poiCategories).map((item) => item.toLowerCase());
  return (state.center.poi || []).filter((poi) => {
    const id = String(poi.id || poi.label || "").toLowerCase();
    const poiCategories = (poi.categories || []).map((category) => String(category).toLowerCase());
    const idMatches = !poiIds.length || poiIds.includes(id);
    const categoryMatches = !categories.length || categories.some((category) => poiCategories.includes(category));
    return idMatches && categoryMatches;
  });
}

function listValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split(/[,;|]/).map((item) => item.trim()).filter(Boolean);
}

function randomPointInCoverage() {
  if (state.center.poi?.length && Math.random() < .45) {
    const poi = state.center.poi[randomInt(0, state.center.poi.length - 1)];
    return { lat: poi.lat, lng: poi.lng, label: poi.label };
  }
  const ring = state.center.coverageGeoJson?.geometry?.coordinates?.[0];
  if (!Array.isArray(ring) || !ring.length) {
    return { lat: state.center.mapCenter[0], lng: state.center.mapCenter[1], label: nearestAddressLabel(state.center.mapCenter[0], state.center.mapCenter[1], "Regensburg") };
  }
  const lngs = ring.map((point) => point[0]);
  const lats = ring.map((point) => point[1]);
  return {
    lat: randomFloat(Math.min(...lats), Math.max(...lats)),
    lng: randomFloat(Math.min(...lngs), Math.max(...lngs))
  };
}

function updateCallAddressFromNearestSource(call) {
  if (!call || !Number.isFinite(call.lat) || !Number.isFinite(call.lng)) return;
  if (call.locationMode !== "random" && call.location) return;
  call.location = nearestAddressLabel(call.lat, call.lng, call.location);
}

function nearestAddressLabel(lat, lng, fallback = "Regensburg") {
  const candidates = [
    ...(state.center.poi || []),
    ...(state.center.hospitals || []),
    ...(state.center.stations || [])
  ]
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
    .map((item) => ({
      label: item.address || item.label,
      distance: mapDistance(lat, lng, item.lat, item.lng)
    }))
    .sort((a, b) => a.distance - b.distance);
  if (candidates[0]?.distance <= 0.45) return candidates[0].label;
  return fallback || "Regensburg";
}

async function reverseGeocodeCall(call) {
  if (!call || !Number.isFinite(call.lat) || !Number.isFinite(call.lng) || !window.fetch) return;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${call.lat}&lon=${call.lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) return;
    const data = await response.json();
    const address = data.address || {};
    const road = address.road || address.pedestrian || address.footway || address.cycleway || address.path;
    if (!road) return;
    const city = address.city || address.town || address.village || "Regensburg";
    call.location = `${road}${address.house_number ? ` ${address.house_number}` : ""}, ${city}`;
    if (state.pendingCall?.id === call.id) {
      renderCallDisposition();
      renderPendingCallActions();
    }
  } catch {
    // Offline/fallback bleibt bei der nächsten bekannten Adresse.
  }
}

function audioContext() {
  if (!state.audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    state.audioContext = new AudioCtx();
  }
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function beep(frequency, start, duration, gain = .045) {
  const ctx = audioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  envelope.gain.setValueAtTime(0, ctx.currentTime + start);
  envelope.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + .015);
  envelope.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + start + duration);
  oscillator.connect(envelope).connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + .03);
}

function playPagerTone() {
  [1060, 1160, 1270, 1400, 1530].forEach((tone, index) => beep(tone, index * .18, .13, .035));
}

function playPhoneRing() {
  beep(440, 0, .28, .035);
  beep(440, .38, .28, .035);
}

function playStatusTone(code) {
  if (code === 0) {
    beep(920, 0, .12, .06);
    beep(680, .16, .12, .06);
    beep(920, .32, .12, .06);
  } else if (code === 5) {
    beep(760, 0, .1, .045);
    beep(760, .16, .1, .045);
  }
}

function weightedCallTemplateIndex(forcedType = null) {
  const roll = Math.random();
  const wantedType = forcedType || (roll < .72 ? "emergency" : roll < .9 ? "transport" : "scheduled");
  const templates = availableCallTemplates();
  const candidates = templates
    .map((template, index) => ({ template, index }))
    .filter((item) => item.template.type === wantedType);
  const pool = candidates.length ? candidates : templates.map((template, index) => ({ template, index }));
  return pool[Math.floor(Math.random() * pool.length)].index;
}

function availableCallTemplates() {
  if (Array.isArray(state.incidentCatalog) && state.incidentCatalog.length) return state.incidentCatalog;
  return Array.isArray(window.incidentCatalog) && window.incidentCatalog.length ? window.incidentCatalog : callTemplates;
}

async function loadIncidentCatalog() {
  try {
    const response = await fetch("/api/incidents");
    if (!response.ok) throw new Error("incident api unavailable");
    const catalog = await response.json();
    return Array.isArray(catalog) && catalog.length ? catalog : window.incidentCatalog;
  } catch {
    return window.incidentCatalog || callTemplates;
  }
}

async function loadDefaultMap() {
  return loadSelectedMap("regensburg-test");
}

async function loadSelectedMap(mapId) {
  if (!mapId || mapId === "regensburg") return null;
  try {
    const response = await fetch(`/api/maps/${encodeURIComponent(mapId)}`);
    if (!response.ok) throw new Error("map api unavailable");
    const map = await response.json();
    return map?.stations?.length ? map : null;
  } catch {
    return null;
  }
}

function normalizeIncidentTemplate(template) {
  if (!template.variants) {
    return {
      ...template,
      callerText: randomDelimitedText(template.callerText),
      callerName: randomDelimitedText(template.callerName) || "Anrufer"
    };
  }
  const variant = template.variants[Math.floor(Math.random() * template.variants.length)];
  const normalized = {
    ...template,
    ...variant,
    id: undefined,
    catalogId: template.id,
    variantId: variant.id || makeId(),
    keyword: variant.keyword || template.keyword || template.title || template.category || "Eigener Einsatz",
    type: variant.type || template.type,
    priority: variant.priority || template.priority || "normal",
    required: variant.required || template.required || ["RTW"],
    signal: false
  };
  normalized.callerText = randomDelimitedText(normalized.callerText);
  normalized.callerName = randomDelimitedText(normalized.callerName) || "Anrufer";
  return normalized;
}

function randomDelimitedText(value) {
  const parts = String(value || "").split("|").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return value || "";
  return parts[randomInt(0, parts.length - 1)];
}

function answerCall() {
  if (!state.pendingCall) return;
  const call = state.pendingCall;
  logCall(`${call.callerName}: ${call.callerText}`, "call");
  logCall(`Einsatzort genannt: ${call.location}.`, "call");
  el.callActions.innerHTML = "";
  el.answerButton.disabled = true;
  el.answerButton.classList.remove("pending-call-alert");
  renderCallDisposition();
  showDialog(el.callDispositionDialog);
}

function renderCallDisposition() {
  const call = state.pendingCall;
  if (!call) return;
  const tag = callTypeTag(call.type);
  el.callDispositionText.innerHTML = `
    <section class="call-disposition-summary">
      <span class="call-type">${escapeHtml(tag)}</span>
      <h3>${escapeHtml(call.callerName || "Anrufer")}</h3>
      <p class="call-location">${escapeHtml(call.location || "Regensburg")}</p>
      <p>${escapeHtml(call.callerText || "")}</p>
    </section>
  `;
}

function normalizeSearch(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function callTypeTag(type) {
  if (type === "transport" || type === "scheduled") return "19222";
  return "112";
}

function handleCallDispositionClosed() {
  if (!state.pendingCall || el.incidentDialog.open) return;
  renderPendingCallActions();
}

function renderPendingCallActions() {
  el.callActions.innerHTML = "";
  const reopenButton = document.createElement("button");
  reopenButton.type = "button";
  reopenButton.textContent = "Dispositionsfenster öffnen";
  reopenButton.addEventListener("click", () => {
    renderCallDisposition();
    showDialog(el.callDispositionDialog);
  });
  const rejectButton = document.createElement("button");
  rejectButton.type = "button";
  rejectButton.textContent = "Anruf ablehnen";
  rejectButton.addEventListener("click", rejectPendingCall);
  const mapButton = document.createElement("button");
  mapButton.type = "button";
  mapButton.textContent = "auf Karte zeigen";
  mapButton.addEventListener("click", showPendingCallOnMap);
  el.callActions.append(reopenButton, rejectButton, mapButton);
}

function rejectPendingCall() {
  if (!state.pendingCall) return;
  logCall("Anruf abgelehnt.", "warn");
  state.pendingCall = null;
  el.answerButton.disabled = true;
  el.answerButton.classList.remove("pending-call-alert");
  el.forwardButton.disabled = true;
  el.callActions.innerHTML = "";
  if (el.callDispositionDialog.open) el.callDispositionDialog.close();
}

function referPendingCall(service) {
  if (!state.pendingCall) return;
  const labels = { FW: "Feuerwehr", POL: "Polizei", AEND: "Ärztlichen Notdienst" };
  logCall(`Anruf an ${labels[service] || service} verwiesen.`, "warn");
  state.pendingCall = null;
  el.answerButton.disabled = true;
  el.answerButton.classList.remove("pending-call-alert");
  el.forwardButton.disabled = true;
  el.callActions.innerHTML = "";
  el.callDispositionDialog.close();
}

function forwardCall() {
  if (!state.pendingCall) return;
  logCall("Anruf beendet oder weitergeleitet.", "warn");
  state.pendingCall = null;
  el.answerButton.disabled = true;
  el.answerButton.classList.remove("pending-call-alert");
  el.forwardButton.disabled = true;
  el.callActions.innerHTML = "";
  if (el.callDispositionDialog.open) el.callDispositionDialog.close();
}

function openIncidentDialog(source = null) {
  const incident = typeof source === "string"
    ? state.incidents.find((item) => item.id === source)
    : source?.assigned ? source : null;
  const call = incident || source || state.pendingCall;
  if (!call) return;

  state.editingIncidentId = incident?.id || null;
  state.selectedDialogVehicleIds = new Set();
  el.incidentDialog.querySelector(".modal-header h2").textContent = incident ? "Einsatz bearbeiten" : "Neuen Einsatz erstellen";
  el.incidentLocation.value = call.location || "Regensburg";
  el.incidentKeywordSearch.value = "";
  populateKeywordSelectGrouped();
  el.incidentKeyword.value = incident && keywordDefaults[call.keyword] ? call.keyword : "";
  el.incidentSignal.value = call.signal ? "yes" : "no";
  el.incidentFw.checked = Boolean(incident?.requiredServices?.includes("FW") || call.requiredServices?.includes?.("FW"));
  el.incidentPol.checked = Boolean(incident?.requiredServices?.includes("POL") || call.requiredServices?.includes?.("POL"));
  el.incidentCaller.value = call.callerName || "";
  el.incidentNote.value = call.note || "";
  document.querySelector("#create-incident-button").textContent = incident ? "Änderungen speichern" : "Einsatz erstellen";
  document.querySelector("#create-alarm-button").textContent = incident ? "Speichern & weitere alarmieren" : "Erstellen & alarmieren";
  renderDispositionSuggestion();
  renderDialogVehicles(call, incident);
  showDialog(el.incidentDialog);
}

function renderDispositionSuggestion() {
  if (!el.dispositionSuggestion) return;
  const keyword = el.incidentKeyword.value;
  const defaults = keywordDefaults[keyword];
  if (!defaults) {
    el.dispositionSuggestion.hidden = true;
    el.dispositionSuggestion.textContent = "";
    return;
  }
  el.dispositionSuggestion.hidden = false;
  el.dispositionSuggestion.innerHTML = "";
  const label = document.createElement("strong");
  label.textContent = "Dispositionsvorschlag";
  const text = document.createElement("span");
  text.textContent = defaults.disposition || formatDisposition(defaults.required, defaults.requiredServices);
  el.dispositionSuggestion.append(label, text);
}

function formatDisposition(required = [], services = []) {
  const counts = new Map();
  required.forEach((type) => counts.set(type, (counts.get(type) || 0) + 1));
  return [
    ...[...counts.entries()].map(([type, count]) => `${count} ${type}`),
    ...(services || [])
  ].join(", ") || "Lage erkunden";
}

function submitIncidentDialog(event) {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter?.value === "cancel") {
    state.editingIncidentId = null;
    el.incidentDialog.close();
    return;
  }

  const editingIncident = state.editingIncidentId
    ? state.incidents.find((item) => item.id === state.editingIncidentId)
    : null;
  const source = editingIncident || state.pendingCall;
  if (!source) return;

  const keyword = el.incidentKeyword.value;
  const defaults = keywordDefaults[keyword] || keywordDefaults[source.keyword];
  const fallbackLat = Number.isFinite(source.lat) ? source.lat : state.center.mapCenter[0];
  const fallbackLng = Number.isFinite(source.lng) ? source.lng : state.center.mapCenter[1];
  const incidentData = {
    ...source,
    keyword,
    type: defaults.type,
    required: defaults.required,
    signal: el.incidentSignal.value === "yes",
    requiredServices: [el.incidentFw.checked ? "FW" : null, el.incidentPol.checked ? "POL" : null].filter(Boolean),
    services: {
      FW: createServiceState(),
      POL: createServiceState()
    },
    callerName: el.incidentCaller.value.trim() || source.callerName,
    location: el.incidentLocation.value.trim() || source.location || "Regensburg",
    lat: fallbackLat,
    lng: fallbackLng,
    note: el.incidentNote.value.trim()
  };
  const incident = editingIncident || createIncident(incidentData);
  if (editingIncident) {
    const updatedPatient = updatePatientProfile(editingIncident.patient, incidentData);
    Object.assign(editingIncident, incidentData, {
      patient: updatedPatient,
      required: updatedPatient.requiredVehicles
    });
    editingIncident.status = hasRequiredVehicles(editingIncident) ? editingIncident.status : "in Bearbeitung";
    logRadio(`Einsatz bearbeitet: ${editingIncident.keyword} in ${editingIncident.location}.`, "radio");
  }

  const selectedIds = [...state.selectedDialogVehicleIds];
  if (!editingIncident) {
    state.pendingCall = null;
    el.answerButton.disabled = true;
    el.answerButton.classList.remove("pending-call-alert");
    el.forwardButton.disabled = true;
    el.callActions.innerHTML = "";
  }
  state.editingIncidentId = null;
  el.incidentDialog.close();
  renderAll();
  (incident.requiredServices || []).forEach((service) => {
    if (incident.services?.[service]?.status === "nicht alarmiert") alarmService(incident.id, service);
  });

  if (submitter?.value === "alarm") {
    selectedIds.forEach((vehicleId) => assignVehicle(vehicleId, incident.id));
  }
}

function showPendingCallOnMap() {
  const source = state.editingIncidentId
    ? state.incidents.find((item) => item.id === state.editingIncidentId)
    : state.pendingCall;
  if (!source || !state.mapReady) return;
  const lat = Number.isFinite(source.lat) ? source.lat : state.center.mapCenter[0];
  const lng = Number.isFinite(source.lng) ? source.lng : state.center.mapCenter[1];
  state.map.setView([lat, lng], 15);
  L.popup()
    .setLatLng([lat, lng])
    .setContent(`<strong>${escapeHtml(source.location || "Regensburg")}</strong>`)
    .openOn(state.map);
}

function createIncident(call) {
  const patientProfile = createPatientProfile(call);
  const incident = {
    id: call.id,
    type: call.type,
    keyword: call.keyword,
    location: call.location || "Regensburg",
    callerName: call.callerName,
    note: call.note || "",
    required: patientProfile.requiredVehicles,
    signal: call.signal,
    priority: call.priority,
    lat: Number.isFinite(call.lat) ? call.lat : state.center.mapCenter[0],
    lng: Number.isFinite(call.lng) ? call.lng : state.center.mapCenter[1],
    createdAtMinute: state.minute,
    status: "offen",
    assigned: [],
    patient: patientProfile,
    transportRequest: null,
    transportRequests: [],
    requiredServices: requiredExternalServices(call, patientProfile),
    services: {
      FW: call.services?.FW || createServiceState(),
      POL: call.services?.POL || createServiceState()
    }
  };
  state.incidents.unshift(incident);
  state.selectedIncidentId = incident.id;
  logRadio(`Neuer Einsatz: ${incident.keyword} in ${incident.location}.`, "warn");
  return incident;
}

function createServiceState() {
  return {
    status: "nicht alarmiert",
    eta: null,
    arriveAtMinute: null,
    alarmedAt: null
  };
}

function requiredExternalServices(call, patientProfile) {
  const services = new Set(call.requiredServices || []);
  ["FW", "POL"].forEach((service) => {
    if (call.services?.[service] && call.services[service].status !== "nicht alarmiert") services.add(service);
  });
  if (call.needsFW) services.add("FW");
  if (call.needsPOL) services.add("POL");
  (patientProfile.patients || []).forEach((patient) => {
    if (patient.needsFW) services.add("FW");
    if (patient.needsPOL) services.add("POL");
  });
  return [...services].filter((service) => service === "FW" || service === "POL");
}

function createPatientProfile(call) {
  const keyword = call.keyword || "";
  const critical = keyword.includes("RD 2") || keyword.includes("MANV") || (call.required || []).includes("NEF");
  const trauma = keyword.includes("Trauma") || keyword.includes("Verkehrsunfall");
  const child = keyword.includes("Kind") || keyword.includes("Säugling");
  const transport = call.type === "transport" || keyword.includes("KTP") || keyword.includes("Verlegung");
  const departmentKey = call.requiredDepartmentKey || call.requiredDepartmentKeys?.[0] || departmentKeyForKeyword(keyword, trauma, child);
  const patients = normalizePatients(call, departmentKey);
  const requiredVehicles = aggregateRequiredVehicles(patients, call.required || ["RTW"]);
  return {
    condition: transport ? "transportstabil" : critical ? "kritisch" : "stabil",
    status: "unversorgt",
    treatmentStartedAt: null,
    readyForTransport: false,
    transportNeeded: call.type !== "scheduled",
    requiredDepartmentKey: departmentKey,
    requiredDepartmentKeys: call.requiredDepartmentKeys || [departmentKey],
    requiredDepartment: departmentLabels(call.requiredDepartmentKeys || [departmentKey]),
    report: "",
    pendingReport: call.report || "",
    situationReport: call.situationReport || "",
    patientCount: patients.length,
    patients,
    requiredVehicles,
    noTransportLikely: Boolean(call.noTransportLikely),
    outcome: null,
    fixedDestinationId: call.fixedDestinationId || null,
    fixedDestination: call.fixedDestination || null
  };
}

function updatePatientProfile(existing, call) {
  const next = createPatientProfile(call);
  return {
    ...next,
    status: existing?.status || next.status,
    treatmentStartedAt: existing?.treatmentStartedAt || null,
    readyForTransport: existing?.readyForTransport || false,
    outcome: existing?.outcome || null,
    report: existing?.report || "",
    pendingReport: existing?.pendingReport || next.pendingReport,
    situationReport: existing?.situationReport || next.situationReport,
    patients: existing?.patients?.length ? existing.patients : next.patients
  };
}

function normalizePatients(call, fallbackDepartmentKey) {
  if (Array.isArray(call.patients) && call.patients.length) {
    return call.patients.map((patient, index) => ({
      id: patient.id || `pat-${index + 1}`,
      label: patient.label || `Pat ${index + 1}`,
      required: resolvePatientRequirement(patient.required || patient.options || [{ vehicles: patient.vehicles || ["RTW"], probability: 1 }]),
      requiredDepartmentKey: (patient.requiredDepartmentKeys || [patient.requiredDepartmentKey || fallbackDepartmentKey])[0],
      requiredDepartmentKeys: patient.requiredDepartmentKeys || [patient.requiredDepartmentKey || fallbackDepartmentKey],
      requiredDepartment: departmentLabels(patient.requiredDepartmentKeys || [patient.requiredDepartmentKey || fallbackDepartmentKey]),
      transportSignalProbability: Number(patient.transportSignalProbability) || 0,
      needsFW: Boolean(patient.needsFW),
      needsPOL: Boolean(patient.needsPOL),
      noTransportProbability: clampProbability(patient.noTransportProbability),
      noTransportText: patient.noTransportText || "Ambulante Versorgung ausreichend, kein Transport.",
      transportNeeded: patient.transportNeeded !== false,
      assignedVehicles: []
    }));
  }
  const count = Math.max(1, Number(call.patientCount) || 1);
  const baseRequired = call.required?.length ? call.required : ["RTW"];
  return Array.from({ length: count }, (_, index) => ({
    id: `pat-${index + 1}`,
    label: `Pat ${index + 1}`,
    required: index === 0 ? [...baseRequired] : ["RTW"],
    requiredDepartmentKey: fallbackDepartmentKey,
    requiredDepartmentKeys: [fallbackDepartmentKey],
    requiredDepartment: departmentLabels([fallbackDepartmentKey]),
    needsFW: false,
    needsPOL: false,
    noTransportProbability: 0,
    noTransportText: "Ambulante Versorgung ausreichend, kein Transport.",
    transportNeeded: call.type !== "scheduled",
    assignedVehicles: []
  }));
}

function clampProbability(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(1, number));
}

function resolvePatientRequirement(options) {
  const choices = Array.isArray(options) ? options : [{ vehicles: ["RTW"], probability: 1 }];
  const total = choices.reduce((sum, option) => sum + (Number(option.probability) || 0), 0) || 1;
  let draw = Math.random() * total;
  for (const option of choices) {
    draw -= Number(option.probability) || 0;
    if (draw <= 0) return [...(option.vehicles || option.required || [])];
  }
  return [...(choices.at(-1)?.vehicles || choices.at(-1)?.required || ["RTW"])];
}

function aggregateRequiredVehicles(patients, fallback = ["RTW"]) {
  const required = patients.flatMap((patient) => patient.required || []);
  return required.length ? required : fallback;
}

function departmentForKeyword(keyword, trauma = false, child = false) {
  if (child) return "Pädiatrie / Kinderklinik";
  if (trauma) return "Unfallchirurgie / Schockraum";
  if (keyword.includes("Herz") || keyword.includes("Kreislauf")) return "Kardiologie / Chest Pain Unit";
  if (keyword.includes("Atmung")) return "Innere Medizin / Überwachung";
  if (keyword.includes("Neuro")) return "Neurologie / Stroke Unit";
  if (keyword.includes("Psych")) return "Psychiatrie";
  if (keyword.includes("Geburt")) return "Geburtshilfe";
  if (keyword.includes("Verlegung")) return "aufnehmende Fachabteilung";
  if (keyword.includes("KTP")) return "Ziel nach Auftrag";
  return "Notaufnahme";
}

function departmentKeyForKeyword(keyword, trauma = false, child = false) {
  if (child) return "pediatrics";
  if (trauma) return "trauma";
  if (keyword.includes("Herz") || keyword.includes("Kreislauf")) return "cardiology";
  if (keyword.includes("Atmung")) return "internal";
  if (keyword.includes("Neuro")) return "neurology";
  if (keyword.includes("Psych")) return "psychiatry";
  if (keyword.includes("Geburt")) return "obstetrics";
  if (keyword.includes("KTP") || keyword.includes("Verlegung")) return "internal";
  return "internal";
}

function departmentLabel(key) {
  if (key === "emergency") return "Innere Medizin";
  return (window.departmentCatalog || []).find((department) => department.key === key)?.label || key || "Innere Medizin";
}

function departmentLabels(keys) {
  const normalized = (keys || []).filter(Boolean).map(normalizeDepartmentKey);
  return normalized.length ? normalized.map(departmentLabel).join(" / ") : "kein Klinikziel";
}

function normalizeDepartmentKey(key) {
  return key === "emergency" ? "internal" : key;
}

function assignVehicle(vehicleId, incidentId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!vehicle || !incident || !isAlarmable(vehicle) || incident.assigned.includes(vehicle.id)) return;

  if (vehicle.status === 8 && vehicle.incidentId && vehicle.incidentId !== incident.id) {
    detachVehicleFromIncident(vehicle.id, vehicle.incidentId);
  }

  if (vehicle.status === 3) {
    cancelVehicleRoute(vehicle);
    logRadio(`${vehicle.name}: Folgeauftrag übernommen, bricht aktuelle Anfahrt ab.`, "warn");
  }

  const delayMinutes = vehicle.status === 8 ? randomInt(2, 15) : turnoutDelayMinutes(vehicle);
  vehicle.nextIncidentId = incident.id;
  vehicle.previousIncidentId = vehicle.incidentId;
  vehicle.pendingDispatchUntil = Date.now() + simulationDelay(delayMinutes);
  vehicle.pendingDispatchDelay = delayMinutes;
  vehicle.dispatchSignal = Boolean(incident.signal);
  vehicle.statusText = vehicle.status === 8
    ? `Folgeeinsatz möglich in ca. ${delayMinutes} min`
    : `alarmiert, rückt in ca. ${delayMinutes} min aus`;

  if (vehicle.handoverTimer) {
    clearTimeout(vehicle.handoverTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.handoverTimer);
    vehicle.handoverTimer = null;
  }

  incident.assigned.push(vehicle.id);
  incident.status = hasRequiredVehicles(incident) ? "alarmiert" : "in Bearbeitung";
  logRadio(`${vehicle.name}: Einsatzauftrag erhalten, Ausrücken in ca. ${delayMinutes} Minute(n).`, vehicle.status === 8 ? "warn" : "radio");
  playPagerTone();
  if (Math.random() < .015) triggerRadioStatus(vehicle, 0, "Notrufsignal ausgelöst, Rückfrage läuft.");
  renderAll();
  vehicle.dispatchTimer = scheduleTimeout(() => startResponse(vehicle.id), simulationDelay(delayMinutes));
}

function triggerRadioStatus(vehicle, code, message) {
  vehicle.radioStatus = code;
  vehicle.radioMessage = code === 0 ? "Sprechwunsch" : message;
  vehicle.awaitingSpeechPrompt = code === 5;
  if (code === 0) vehicle.awaitingSpeechPrompt = true;
  playStatusTone(code);
  logRadio(`${vehicle.name}: Status ${code}${code === 0 ? " - Sprechwunsch" : ` - ${message}`}`, code === 0 ? "warn" : "radio");
  if (code !== 0 && code !== 5) {
    scheduleTimeout(() => {
      if (vehicle.radioStatus === code) {
        vehicle.radioStatus = null;
        vehicle.radioMessage = "";
        vehicle.awaitingSpeechPrompt = false;
        renderVehicles();
        renderRadioAlerts();
      }
    }, simulationDelay(.5));
  }
}

function sendSpeechPrompt(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle) return;
  const pendingTransportRequest = vehicle.radioStatus === 5 ? vehicle.pendingTransportRequest : null;
  const pendingClearRequest = vehicle.radioStatus === 5 ? vehicle.pendingClearRequest : null;
  const pendingAssistanceRequest = vehicle.radioStatus === 0 ? vehicle.pendingAssistanceRequest : null;
  const pendingSituationReport = vehicle.radioStatus === 0 ? vehicle.pendingSituationReport : null;
  const pendingKtwHandoverRequest = vehicle.radioStatus === 5 ? vehicle.pendingKtwHandoverRequest : null;
  const relatedIncident = relatedIncidentForVehicle(vehicle, pendingTransportRequest, pendingAssistanceRequest);
  if (vehicle.radioStatus === 5 || vehicle.radioStatus === 0) {
    const radioStatus = vehicle.radioStatus;
    logRadio(`${vehicle.name}: Sprechaufforderung J gesendet.`, radioStatus === 0 ? "warn" : "radio");
    vehicle.radioStatus = null;
    vehicle.radioMessage = "";
    vehicle.awaitingSpeechPrompt = false;
    vehicle.waitingForSpeechPrompt = false;
    renderAll();
    renderRadioAlerts();
    scheduleTimeout(() => completeSpeechPromptResponse(vehicle.id, {
      radioStatus,
      pendingTransportRequest,
      pendingClearRequest,
      pendingAssistanceRequest,
      pendingSituationReport,
      pendingKtwHandoverRequest,
      relatedIncidentId: relatedIncident?.id || null
    }), simulationDelay(randomRange(5, 12) / 60));
    return;
  }
  completeSpeechPromptResponse(vehicle.id, {
    radioStatus: vehicle.radioStatus,
    pendingTransportRequest,
    pendingClearRequest,
    pendingAssistanceRequest,
    pendingSituationReport,
    pendingKtwHandoverRequest,
    relatedIncidentId: relatedIncident?.id || null
  });
}

function completeSpeechPromptResponse(vehicleId, context) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle) return;
  const pendingTransportRequest = context.pendingTransportRequest;
  const pendingClearRequest = context.pendingClearRequest;
  const pendingAssistanceRequest = context.pendingAssistanceRequest;
  const pendingSituationReport = context.pendingSituationReport;
  const pendingKtwHandoverRequest = context.pendingKtwHandoverRequest;
  const relatedIncident = state.incidents.find((incident) => incident.id === context.relatedIncidentId) || relatedIncidentForVehicle(vehicle, pendingTransportRequest, pendingAssistanceRequest);
  if (vehicle.radioStatus === 5) {
    if (pendingClearRequest) {
      releasePatientAssignment(vehicle);
      logRadio(`${vehicle.name}: ${pendingClearRequest.reason || "nicht benötigt"}, meldet frei.`, "radio");
    } else if (vehicle.status === 3 || vehicle.nextIncidentId) {
      logRadio(`${vehicle.name}: unterwegs zu ${vehicleDestinationText(vehicle, relatedIncident)}.`, "radio");
    }
  } else if (context.radioStatus === 5) {
    if (pendingClearRequest) {
      releasePatientAssignment(vehicle);
      logRadio(`${vehicle.name}: ${pendingClearRequest.reason || "nicht benötigt"}, meldet frei.`, "radio");
    } else if (pendingKtwHandoverRequest) {
      logRadio(`${vehicle.name}: KTW-Patient. Ist ein KTW zeitnah verfügbar?`, "radio");
      const incident = state.incidents.find((item) => item.id === pendingKtwHandoverRequest.incidentId);
      if (incident) {
        incident.ktwHandoverDecision = pendingKtwHandoverRequest;
        state.selectedIncidentId = incident.id;
      }
    } else if (vehicle.status === 3 || vehicle.nextIncidentId) {
      logRadio(`${vehicle.name}: unterwegs zu ${vehicleDestinationText(vehicle, relatedIncident)}.`, "radio");
    }
  } else if (context.radioStatus === 0 && pendingSituationReport) {
    logRadio(`${vehicle.name}: Sprechaufforderung J gesendet. Lage: ${pendingSituationReport.text}`, "warn");
    const incident = state.incidents.find((item) => item.id === pendingSituationReport.incidentId);
    if (incident) {
      incident.patient.report = pendingSituationReport.text;
      incident.patient.situationReported = true;
      incident.status = "Lage gemeldet";
      state.selectedIncidentId = incident.id;
      maybeRequestAdditionalResources(vehicle, incident);
    }
  } else if (context.radioStatus === 0 && pendingAssistanceRequest) {
    logRadio(`${vehicle.name}: Nachforderung: ${pendingAssistanceRequest.missing.join(", ")}.`, "warn");
    const incident = state.incidents.find((item) => item.id === pendingAssistanceRequest.incidentId);
    if (incident) {
      incident.status = "Nachforderung";
      incident.assistanceDecision = {
        vehicleId: vehicle.id,
        vehicleType: vehicle.type,
        missing: pendingAssistanceRequest.missing,
        createdAtMinute: state.minute
      };
      state.selectedIncidentId = incident.id;
    }
  } else {
    logRadio(`${vehicle.name}: Status ${context.radioStatus} quittiert.`, "radio");
  }
  vehicle.radioStatus = null;
  vehicle.radioMessage = "";
  vehicle.awaitingSpeechPrompt = false;
  vehicle.waitingForSpeechPrompt = false;
  vehicle.pendingAssistanceRequest = null;
  vehicle.pendingSituationReport = null;
  vehicle.pendingClearRequest = null;
  vehicle.pendingKtwHandoverRequest = null;
  vehicle.supportOnly = false;
  if (pendingTransportRequest) {
    activateTransportRequest(vehicle, pendingTransportRequest.incidentId);
  }
  if (pendingClearRequest) {
    clearVehicle(vehicle.id);
    return;
  }
  renderAll();
  renderRadioAlerts();
}

function relatedIncidentForVehicle(vehicle, pendingTransportRequest = null, pendingAssistanceRequest = null) {
  const id = pendingTransportRequest?.incidentId
    || pendingAssistanceRequest?.incidentId
    || vehicle.nextIncidentId
    || vehicle.incidentId;
  return state.incidents.find((item) => item.id === id) || null;
}

function releasePatientAssignment(vehicle) {
  if (!vehicle?.patientId) return;
  state.incidents.forEach((incident) => {
    (incident.patient?.patients || []).forEach((patient) => {
      patient.assignedVehicles = (patient.assignedVehicles || []).filter((id) => id !== vehicle.id);
    });
  });
  vehicle.patientId = null;
}

function vehicleDestinationText(vehicle, incident) {
  if (vehicle.target?.label) return vehicle.target.label;
  if (incident?.location) return incident.location;
  return "Einsatzstelle";
}

function startResponse(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle?.nextIncidentId) return;
  const incident = state.incidents.find((item) => item.id === vehicle.nextIncidentId);
  if (!incident) return;

  vehicle.status = 3;
  vehicle.statusText = "auf Anfahrt";
  vehicle.coveragePointId = null;
  vehicle.patientId = null;
  vehicle.incidentId = incident.id;
  vehicle.nextIncidentId = null;
  vehicle.previousIncidentId = null;
  vehicle.pendingDispatchUntil = null;
  vehicle.pendingDispatchDelay = null;
  vehicle.dispatchTimer = null;
  if (vehicle.radioStatus === 5) {
    vehicle.radioMessage = "Sprechwunsch offen";
  }
  triggerRadioStatus(vehicle, 5, `Status 3, Anfahrt ${incident.keyword}. Fahrzeug rückt aus.`);
  renderAll();
  const signal = Boolean(vehicle.dispatchSignal);
  vehicle.dispatchSignal = false;
  driveVehicleTo(vehicle, incident, { signal, phase: "scene" }, () => arriveOnScene(vehicle.id));
}

function arriveOnScene(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 3) return;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  if (!incident) return;

  vehicle.status = 4;
  vehicle.statusText = "am Einsatzort";
  vehicle.lat = incident.lat;
  vehicle.lng = incident.lng;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  assignVehicleToPatient(vehicle, incident);
  releaseSupportDoctorsReadyForHandover(incident);
  maybeRequestKtwHandover(vehicle, incident);
  maybeSendSituationReport(vehicle, incident);
  if (!incident.patient?.situationRequested) maybeRequestAdditionalResources(vehicle, incident);
  incident.patient.status = "in Behandlung";
  if (incident.patient.patients?.some((patient) => patient.assignedVehicles?.length)) {
    incident.patient.treatmentStartedAt ??= state.minute;
  }
  incident.status = "vor Ort";
  logRadio(`${vehicle.name}: Status 4, Einsatzstelle erreicht. Patientenversorgung begonnen.`, "radio");
  renderAll();
  scheduleSurplusRelease(incident.id);
  scheduleTreatmentCompletion(vehicle, incident);
}

function releaseSupportDoctorsReadyForHandover(incident) {
  (incident.patient?.patients || []).forEach((patient) => {
    if (!patientHasTransportUnitAtScene(patient) || patientTreatmentProgress(patient, incident) < 0.8) return;
    (patient.assignedVehicles || [])
      .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
      .filter((vehicle) => vehicle && ["NEF", "RTH"].includes(vehicle.type) && vehicle.status === 4 && vehicle.supportOnly)
      .forEach((vehicle) => requestVehicleClearance(vehicle, incident, "Patient an Transportfahrzeug übergeben"));
  });
}

function scheduleTreatmentCompletion(vehicle, incident) {
  const patient = patientForVehicle(vehicle, incident);
  if (!patient) return;
  const remaining = remainingTreatmentMinutes(patient, incident);
  if (remaining <= 0) {
    transportOrClear(vehicle.id);
    return;
  }
  if (vehicle.treatmentTimer) {
    clearTimeout(vehicle.treatmentTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.treatmentTimer);
  }
  vehicle.treatmentTimer = scheduleTimeout(() => {
    vehicle.treatmentTimer = null;
    transportOrClear(vehicle.id);
  }, simulationDelay(remaining));
}

function remainingTreatmentMinutes(patient, incident) {
  const progress = patientTreatmentProgress(patient, incident);
  const cap = currentTreatmentCap(patient, incident).cap;
  return Math.max(0, treatmentMinutes(incident) * (cap - progress));
}

function scheduleSurplusRelease(incidentId) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  surplusVehiclesAtScene(incident).forEach((vehicle) => {
    if (vehicle.surplusTimer) return;
    const delay = randomInt(3, 12);
    vehicle.surplusTimer = scheduleTimeout(() => {
      vehicle.surplusTimer = null;
      const currentIncident = state.incidents.find((item) => item.id === incidentId);
      if (!currentIncident || vehicle.status !== 4 || vehicle.incidentId !== incidentId) return;
      const stillSurplus = surplusVehiclesAtScene(currentIncident).some((unit) => unit.id === vehicle.id);
      if (!stillSurplus) return;
      requestVehicleClearance(vehicle, currentIncident, "an der Einsatzstelle nicht benötigt");
    }, simulationDelay(delay));
  });
}

function surplusVehiclesAtScene(incident) {
  const requiredCounts = incident.required.reduce((counts, type) => {
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
  const usedCounts = {};
  return incident.assigned
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle?.status === 4)
    .filter((vehicle) => !vehicle.patientId)
    .filter((vehicle) => {
      const doctorRequired = (requiredCounts.NEF || 0) + (requiredCounts.RTH || 0) > 0;
      if (vehicle.type === "NEF" && !doctorRequired) return true;
      usedCounts[vehicle.type] = (usedCounts[vehicle.type] || 0) + 1;
      return usedCounts[vehicle.type] > (requiredCounts[vehicle.type] || 0);
    });
}

function requestVehicleClearance(vehicle, incident, reason) {
  if (vehicle.radioStatus || vehicle.pendingClearRequest) return;
  vehicle.pendingClearRequest = { incidentId: incident?.id || vehicle.incidentId, reason };
  vehicle.statusText = "Status 5: Freimeldung";
  triggerRadioStatus(vehicle, 5, `Freimeldung: ${reason}.`);
  renderAll();
}

function assignVehicleToPatient(vehicle, incident) {
  const patients = incident.patient?.patients || [];
  if (!patients.length || vehicle.patientId) return;
  let preferred = vehicle.type === "KTW"
    ? patients.find((patient) => patient.awaitingKtwHandover && !patient.completed && !patient.transporting)
    : null;
  preferred ??= patients
    .filter((patient) => patientMissingTypes(patient).some((type) => vehicleSatisfiesRequirement(vehicle.type, type)))
    .sort((a, b) => (a.assignedVehicles?.length || 0) - (b.assignedVehicles?.length || 0))[0];
  if (!preferred && ["NEF", "RTH"].includes(vehicle.type)) {
    preferred = patients
      .filter((patient) => !patient.completed && !patient.transporting && patientNeedsTransportUnit(patient))
      .sort((a, b) => patientTreatmentProgress(a, incident) - patientTreatmentProgress(b, incident))[0];
  }
  if (!preferred && vehicle.type === "KTW") {
    preferred = patients
      .filter((patient) => ktwCanFirstRespond(patient))
      .filter((patient) => !patient.completed && !patient.transporting && !patientHasRequiredTransportUnitAtScene(patient))
      .filter((patient) => !(patient.assignedVehicles || []).some((id) => state.vehicles.find((unit) => unit.id === id)?.type === "KTW"))
      .sort((a, b) => patientTreatmentProgress(a, incident) - patientTreatmentProgress(b, incident))[0];
  }
  const patient = preferred;
  if (!patient) return;
  const canContribute = (patient.required || []).some((type) => vehicleSatisfiesRequirement(vehicle.type, type));
  const canFirstRespond = vehicle.type === "KTW" && ktwCanFirstRespond(patient);
  if (!canContribute && !["NEF", "RTH"].includes(vehicle.type) && !canFirstRespond && (patient.assignedVehicles || []).length) return;
  patient.assignedVehicles = patient.assignedVehicles || [];
  patient.assignedVehicles.push(vehicle.id);
  patient.treatmentStartedAt ??= state.minute;
  vehicle.patientId = patient.id;
  vehicle.supportOnly = !canContribute && (["NEF", "RTH"].includes(vehicle.type) || canFirstRespond);
  if (vehicle.type === "KTW" && patient.awaitingKtwHandover) {
    patient.supportCapReachedAt = state.minute;
    patient.supportCapValue = Math.min(patient.supportCapValue || 0.95, 0.95);
  }
}

function ktwCanFirstRespond(patient) {
  const required = patient.required || [];
  if (required.includes("KTW")) return false;
  return required.includes("RTW") || required.includes("NEF") || required.includes("RTH");
}

function patientHasRequiredTransportUnitAtScene(patient) {
  return (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .some((vehicle) => vehicle && vehicle.status === 4 && (patient.required || []).some((type) => ["RTW", "KTW"].includes(type) && vehicleSatisfiesRequirement(vehicle.type, type)));
}

function patientNeedsTransportUnit(patient) {
  return (patient.required || []).some((type) => ["RTW", "KTW"].includes(type));
}

function patientNeedsMoreVehicles(patient) {
  return patientMissingTypes(patient).length > 0;
}

function patientMissingTypes(patient) {
  const assigned = (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean);
  const used = new Set();
  return (patient.required || []).filter((requiredType) => {
    const match = assigned.find((vehicle) => !used.has(vehicle.id) && vehicleSatisfiesRequirement(vehicle.type, requiredType));
    if (!match) return true;
    used.add(match.id);
    return false;
  });
}

function maybeSendSituationReport(vehicle, incident) {
  if (incident.patient?.situationReported || incident.patient?.situationRequested) return;
  const missing = missingVehicleTypesForDispatch(incident);
  if ((incident.patient?.patientCount || 1) <= 1 && !missing.length) return;
  incident.patient.situationRequested = true;
  vehicle.pendingSituationReport = {
    incidentId: incident.id,
    text: incident.patient.situationReport || `${incident.patient.patientCount || 1} Patient(en), Lage wird erkundet. ${patientNeedSummary(incident)}`
  };
  triggerRadioStatus(vehicle, 0, `Lagemeldung: ${incident.patient.patientCount || 1} Patient(en).`);
}

function patientNeedSummary(incident) {
  const counts = incident.required.reduce((sum, type) => {
    sum[type] = (sum[type] || 0) + 1;
    return sum;
  }, {});
  return `Benötigt: ${Object.entries(counts).map(([type, count]) => `${count} ${type}`).join(", ")}.`;
}

function maybeRequestAdditionalResources(vehicle, incident) {
  if ((incident.patient?.patientCount || 1) > 1 && !incident.patient?.situationReported) return;
  if (incident.assistanceRequested) return;
  const missing = missingVehicleTypesForDispatch(incident);
  const missingServices = missingExternalServices(incident, "dispatch");
  const needsDoctor = missing.includes("NEF") || missing.includes("RTH");
  const needsSceneTransport = ["NEF", "RTH", "REF"].includes(vehicle.type) && missing.some((type) => ["RTW", "KTW"].includes(type));
  const needsTransport = vehicle.type === "KTW" && (missing.includes("RTW") || missing.includes("NEF"));
  const refNeedsTransport = vehicle.type === "REF" && (incident.patient?.transportNeeded || missing.includes("RTW") || missing.includes("KTW"));
  if (!needsDoctor && !needsSceneTransport && !needsTransport && !refNeedsTransport && !missingServices.length) return;
  vehicle.pendingAssistanceRequest = {
    incidentId: incident.id,
    missing: [...missing, ...missingServices]
  };
  triggerRadioStatus(vehicle, 0, `Nachforderung erforderlich: ${[...missing, ...missingServices].join(", ") || "Transportmittel"}.`);
  incident.status = "Nachforderung offen";
  incident.assistanceRequested = true;
}

function missingVehicleTypesForDispatch(incident) {
  const patients = incident.patient?.patients || [];
  const rawMissing = patients.length
    ? patients
      .filter((patient) => !patient.completed && !patient.transporting)
      .flatMap((patient) => patientMissingTypes(patient))
    : missingVehicleTypes(incident);
  const coverResources = (incident.assigned || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean)
    .filter((vehicle) => {
      if (vehicle.status === 4 && !vehicle.patientId) return true;
      if (vehicle.status === 3 && vehicle.incidentId === incident.id) return true;
      return vehicle.nextIncidentId === incident.id;
    });
  const used = new Set();
  return rawMissing.filter((requiredType) => {
    const match = coverResources.find((vehicle) => !used.has(vehicle.id) && vehicleSatisfiesRequirement(vehicle.type, requiredType));
    if (!match) return true;
    used.add(match.id);
    return false;
  });
}

function maybeRequestKtwHandover(vehicle, incident) {
  const patient = patientForVehicle(vehicle, incident);
  if (!vehicle || vehicle.type !== "RTW" || !patientRequiresOnlyKtw(patient)) return;
  if (patient.rtwMustTransport || patient.ktwHandoverAsked || patient.awaitingKtwHandover) return;
  patient.ktwHandoverAsked = true;
  vehicle.pendingKtwHandoverRequest = {
    incidentId: incident.id,
    vehicleId: vehicle.id,
    patientId: patient.id
  };
  vehicle.statusText = "Status 5: KTW-Rückfrage";
  triggerRadioStatus(vehicle, 5, "KTW-Patient, Rückfrage zur Übergabe.");
}

function patientRequiresOnlyKtw(patient) {
  const required = patient?.required || [];
  return required.length > 0 && required.every((type) => type === "KTW");
}

function missingExternalServices(incident, mode = "dispatch") {
  return (incident.requiredServices || []).filter((service) => {
    const status = incident.services?.[service]?.status || "nicht alarmiert";
    if (mode === "transport") return status !== "an Einsatzstelle";
    return status !== "unterwegs" && status !== "an Einsatzstelle";
  });
}

function transportOrClear(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 4) return;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  if (!incident) return;
  const assignedPatient = patientForVehicle(vehicle, incident);

  incident.patient.status = "versorgt";
  incident.patient.readyForTransport = true;
  incident.patient.report = patientReport(incident);
  if (vehicle.supportOnly && vehicle.type === "KTW" && assignedPatient && patientNeedsMoreVehicles(assignedPatient)) {
    maybeRequestAdditionalResources(vehicle, incident);
    vehicle.statusText = `${assignedPatient.label} erstversorgt, wartet auf Rettungsmittel`;
    renderAll();
    return;
  }
  if (vehicle.type === "RTW" && assignedPatient?.awaitingKtwHandover && !assignedPatient.rtwMustTransport) {
    const ktw = ktwForHandoverAtScene(assignedPatient);
    if (ktw) {
      requestVehicleClearance(vehicle, incident, `${assignedPatient.label} an ${ktw.shortName || ktw.name} übergeben`);
      scheduleTreatmentCompletion(ktw, incident);
    } else {
      vehicle.statusText = `${assignedPatient.label} bis Übergabe versorgt`;
      scheduleTimeout(() => transportOrClear(vehicle.id), simulationDelay(1));
    }
    renderAll();
    return;
  }
  const outcome = patientOutcome(incident, assignedPatient);
  if (outcome) {
    finishPatientWithoutTransport(incident, assignedPatient, vehicle, outcome);
    return;
  }
  const missingServices = missingExternalServices(incident, "transport");
  if (missingServices.length) {
    vehicle.pendingAssistanceRequest = { incidentId: incident.id, missing: missingServices };
    triggerRadioStatus(vehicle, 0, `Transportbeginn wartet auf ${missingServices.join(" und ")}.`);
    incident.status = "wartet auf Zusatzkräfte";
    renderAll();
    scheduleTimeout(() => transportOrClear(vehicle.id), simulationDelay(1));
    return;
  }

  if (!["RTW", "KTW"].includes(vehicle.type)) {
    const patient = patientForVehicle(vehicle, incident);
    if (vehicle.supportOnly && patient && patientTreatmentProgress(patient, incident) >= 0.8 && patientHasTransportUnitAtScene(patient)) {
      requestVehicleClearance(vehicle, incident, "Patient an Transportfahrzeug übergeben");
      return;
    }
    if (reassignVehicleToNextPatient(vehicle, incident)) {
      logRadio(`${vehicle.name}: übernimmt die Versorgung des nächsten Patienten.`, "radio");
      renderAll();
      scheduleTreatmentCompletion(vehicle, incident);
      return;
    }
    requestVehicleClearance(vehicle, incident, "kein Patiententransport durch dieses Fahrzeug");
    return;
  }

  const fixedHospital = incident.patient.fixedDestinationId
    ? state.center.hospitals.find((hospital) => hospital.id === incident.patient.fixedDestinationId)
    : null;
  if (incident.patient.fixedDestination) {
    beginTransportToDestination(incident.id, incident.patient.fixedDestination, vehicle.id);
    return;
  }
  if (fixedHospital || isAutomaticTransport(incident)) {
    beginTransport(incident.id, fixedHospital?.id || nearestHospital(incident)?.id, vehicle.id);
    return;
  }

  requestTransportDestination(vehicle, incident);
}

function ktwForHandoverAtScene(patient) {
  return (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .find((vehicle) => vehicle?.type === "KTW" && vehicle.status === 4);
}

function patientReport(incident) {
  const patient = incident.patient;
  if (patient.report) return patient.report;
  if (patient.pendingReport) return patient.pendingReport;
  if (incident.type === "transport") {
    return `Patient transportbereit, benötigt ${patient.requiredDepartment}.`;
  }
  const stateText = patient.condition === "kritisch" ? "kritisch, aber transportfähig" : "stabil nach Erstversorgung";
  return `${stateText}; benötigt ${patient.requiredDepartment}.`;
}

function patientOutcome(incident, patient = null) {
  if (incident.type === "transport") return null;
  if (patient && Math.random() < (Number(patient.noTransportProbability) || 0)) {
    return patient.noTransportText || "Ambulante Versorgung ausreichend, kein Transport.";
  }
  if (incident.patient.noTransportLikely && Math.random() < .8) return "Ambulante Einschätzung ausreichend, kein Transport.";
  const keyword = incident.keyword || "";
  if (keyword.includes("Kreislaufstillstand") && Math.random() < .22) return "Tod festgestellt, kein Transport.";
  if (incident.patient.condition === "stabil" && Math.random() < .08) return "Keine rettungsdienstliche Transportindikation.";
  return null;
}

function finishPatientWithoutTransport(incident, patient, vehicle, reason) {
  if (!incident || !patient) {
    finishWithoutTransport(incident?.id, reason);
    return;
  }
  patient.outcome = reason;
  patient.transportNeeded = false;
  patient.transporting = false;
  patient.completed = true;
  patient.completedAtMinute = state.minute;
  incident.patient.outcome = reason;
  incident.patient.status = incidentHasOpenPatients(incident) ? "teilweise abgeschlossen" : "abgeschlossen ohne Transport";
  (patient.assignedVehicles || [vehicle?.id])
    .map((id) => state.vehicles.find((unit) => unit?.id === id))
    .filter((unit) => unit && [3, 4].includes(unit.status))
    .forEach((unit) => requestVehicleClearance(unit, incident, reason));
  closeIncidentIfAllPatientsDone(incident);
  renderAll();
}

function isAutomaticTransport(incident) {
  return incident.type === "transport" || incident.keyword.includes("KTP") || incident.keyword.includes("Verlegung");
}

function requestTransportDestination(vehicle, incident) {
  incident.status = "wartet auf Zielklinik";
  vehicle.pendingTransportRequest = {
    id: makeId(),
    incidentId: incident.id,
    report: incident.patient.report,
    requiredDepartment: patientForVehicle(vehicle, incident)?.requiredDepartment || incident.patient.requiredDepartment,
    patientId: vehicle.patientId || patientForVehicle(vehicle, incident)?.id || null
  };
  vehicle.statusText = "Status 5: Sprechwunsch";
  triggerRadioStatus(vehicle, 5, "Sprechwunsch zur Patientenrückmeldung.");
  renderAll();
}

function activateTransportRequest(vehicle, incidentId) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident || !vehicle.pendingTransportRequest) return;
  const request = {
    id: vehicle.pendingTransportRequest.id || makeId(),
    vehicleId: vehicle.id,
    report: vehicle.pendingTransportRequest.report,
    requiredDepartment: vehicle.pendingTransportRequest.requiredDepartment,
    patientId: vehicle.pendingTransportRequest.patientId
  };
  incident.transportRequests = (incident.transportRequests || []).filter((item) => item.vehicleId !== vehicle.id);
  incident.transportRequests.push(request);
  incident.transportRequest = incident.transportRequests[0] || null;
  vehicle.pendingTransportRequest = null;
  vehicle.statusText = "wartet auf Transportziel";
  logRadio(`${vehicle.name}: Rückmeldung: ${request.report}`, "radio");
  renderAll();
}

function patientForVehicle(vehicle, incident) {
  return (incident.patient?.patients || []).find((patient) => patient.id === vehicle.patientId)
    || (incident.patient?.patients || [])[0]
    || null;
}

function beginTransport(incidentId, hospitalId, vehicleId = null, requestId = null) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  const request = requestId
    ? (incident.transportRequests || []).find((item) => item.id === requestId)
    : incident.transportRequest;
  const vehicle = state.vehicles.find((unit) => unit.id === (vehicleId || request?.vehicleId));
  const hospital = state.center.hospitals.find((item) => item.id === hospitalId);
  if (!vehicle || vehicle.status !== 4) return;
  if (!hospital) {
    logRadio(`${vehicle.name}: Kein geeignetes Krankenhaus hinterlegt, Transportziel erforderlich.`, "warn");
    requestTransportDestination(vehicle, incident);
    return;
  }

  clearTransportRequest(incident, request?.id, vehicle.id);
  incident.patient.status = "Transport läuft";
  incident.status = "Transport";
  markPatientTransportStarted(vehicle, incident);
  releaseNonRequiredDoctors(incident, vehicle.id);
  vehicle.radioStatus = null;
  vehicle.radioMessage = "";
  vehicle.pendingTransportRequest = null;
  vehicle.status = 7;
  vehicle.statusText = `Transport zu ${hospital.label}`;
  logRadio(`${vehicle.name}: Status 7, Transportziel ${hospital.label}.`, "radio");
  if (!hospitalSuitableForIncident(hospital, incident, request)) {
    scheduleSecondaryTransfer(incident, hospital);
  }
  renderAll();
  const signal = transportUsesSignal(vehicle, incident);
  maybeDoctorAccompaniesTransport(incident, vehicle, hospital, signal);
  driveVehicleTo(vehicle, hospital, { signal, phase: "hospital" }, () => arriveAtHospital(vehicle.id));
}

function beginTransportToDestination(incidentId, destination, vehicleId) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!incident || !vehicle || vehicle.status !== 4) return;
  const target = {
    label: destination.label || "Zieladresse",
    lat: Number.isFinite(destination.lat) ? destination.lat : incident.lat,
    lng: Number.isFinite(destination.lng) ? destination.lng : incident.lng,
    type: destination.type || "destination"
  };
  clearTransportRequest(incident, null, vehicle.id);
  incident.patient.status = "Transport läuft";
  incident.status = "Transport";
  markPatientTransportStarted(vehicle, incident);
  releaseNonRequiredDoctors(incident, vehicle.id);
  vehicle.radioStatus = null;
  vehicle.radioMessage = "";
  vehicle.pendingTransportRequest = null;
  vehicle.status = 7;
  vehicle.statusText = `Transport zu ${target.label}`;
  logRadio(`${vehicle.name}: Status 7, Transportziel ${target.label}.`, "radio");
  renderAll();
  const signal = transportUsesSignal(vehicle, incident);
  maybeDoctorAccompaniesTransport(incident, vehicle, target, signal);
  driveVehicleTo(vehicle, target, { signal, phase: "destination" }, () => arriveAtTransportDestination(vehicle.id));
}

function clearTransportRequest(incident, requestId = null, vehicleId = null) {
  incident.transportRequests = (incident.transportRequests || []).filter((request) => {
    if (requestId && request.id === requestId) return false;
    if (vehicleId && request.vehicleId === vehicleId) return false;
    return true;
  });
  incident.transportRequest = incident.transportRequests[0] || null;
}

function transportUsesSignal(vehicle, incident) {
  const patient = patientForVehicle(vehicle, incident);
  if (incident.patient?.forceTransportSignal || patient?.forceTransportSignal) return true;
  const probability = Number(patient?.transportSignalProbability) || 0;
  return Math.random() < probability;
}

function releaseNonRequiredDoctors(incident, transportingVehicleId = null) {
  const doctorRequired = incident.required.includes("NEF") || incident.required.includes("RTH");
  if (doctorRequired) return;
  incident.assigned.forEach((id) => {
    if (id === transportingVehicleId) return;
    const vehicle = state.vehicles.find((unit) => unit.id === id);
    if (vehicle?.type === "NEF" && vehicle.status === 4) {
      requestVehicleClearance(vehicle, incident, "Notarzt nicht erforderlich");
    }
  });
}

function maybeDoctorAccompaniesTransport(incident, transportingVehicle, destination, signal) {
  const patient = patientForVehicle(transportingVehicle, incident);
  if (!patient?.required?.some((type) => ["NEF", "RTH"].includes(type))) return;
  const doctor = (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .find((vehicle) => vehicle && ["NEF", "RTH"].includes(vehicle.type) && vehicle.status === 4);
  if (!doctor) return;
  const active = Math.random() < 0.5;
  doctor.status = 7;
  doctor.statusText = active
    ? `begleitet aktiv zu ${destination.label}`
    : `begleitet abkömmlich zu ${destination.label}`;
  doctor.accompanyingActive = active;
  doctor.pendingTransportRequest = null;
  doctor.radioStatus = null;
  doctor.radioMessage = "";
  logRadio(`${doctor.name}: Status 7, ${active ? "aktive" : "abkömmliche"} Notarztbegleitung.`, "radio");
  const destinationPhase = destination.type === "destination" ? "destination" : "hospital";
  const arrivalHandler = destination.type === "destination" ? arriveAtTransportDestination : arriveAtHospital;
  driveVehicleTo(doctor, destination, { signal, phase: destinationPhase }, () => arrivalHandler(doctor.id));
}

function markPatientTransportStarted(vehicle, incident) {
  const patient = patientForVehicle(vehicle, incident);
  if (!patient) return;
  patient.transporting = true;
  patient.transportVehicleId = vehicle.id;
}

function completeTransportedPatient(vehicle, incident) {
  const patient = patientForVehicle(vehicle, incident);
  if (!patient) return;
  patient.transporting = false;
  patient.completed = true;
  patient.completedAtMinute = state.minute;
}

function incidentHasOpenPatients(incident) {
  const patients = incident.patient?.patients || [];
  if (!patients.length) return false;
  return patients.some((patient) => patient.transportNeeded !== false && !patient.completed);
}

function closeIncidentIfAllPatientsDone(incident) {
  if (!incident || incidentHasOpenPatients(incident)) return false;
  if (incident.status === "geschlossen") return true;
  incident.status = "geschlossen";
  logRadio(`Einsatz abgeschlossen: ${incident.keyword}.`, "radio");
  return true;
}

function reassignVehicleToNextPatient(vehicle, incident) {
  const patients = incident.patient?.patients || [];
  if (!patients.length) return false;
  releasePatientAssignment(vehicle);
  const next = patients.find((patient) => {
    if (patient.completed || patient.transporting) return false;
    const missing = patientMissingTypes(patient);
    return missing.some((type) => vehicleSatisfiesRequirement(vehicle.type, type))
      || (["NEF", "RTH"].includes(vehicle.type) && patientNeedsTransportUnit(patient) && patientTreatmentProgress(patient, incident) < 0.8)
      || !(patient.assignedVehicles || []).length;
  });
  if (!next) return false;
  next.assignedVehicles = next.assignedVehicles || [];
  if (!next.assignedVehicles.includes(vehicle.id)) next.assignedVehicles.push(vehicle.id);
  next.treatmentStartedAt ??= state.minute;
  vehicle.patientId = next.id;
  vehicle.supportOnly = ["NEF", "RTH"].includes(vehicle.type) && !next.required?.some((type) => vehicleSatisfiesRequirement(vehicle.type, type));
  vehicle.statusText = `versorgt ${next.label}`;
  maybeRequestAdditionalResources(vehicle, incident);
  return true;
}

function arriveAtTransportDestination(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 7) return;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  const targetLabel = vehicle.target?.label || "Zielort";
  if (incident) completeTransportedPatient(vehicle, incident);
  vehicle.status = 8;
  vehicle.statusText = targetLabel;
  vehicle.lat = vehicle.target?.lat ?? vehicle.lat;
  vehicle.lng = vehicle.target?.lng ?? vehicle.lng;
  vehicle.patientId = null;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  vehicle.accompanyingActive = false;
  logRadio(`${vehicle.name}: Status 8, ${targetLabel}`, "radio");
  if (incident) closeIncidentIfAllPatientsDone(incident);
  renderAll();
  vehicle.handoverTimer = scheduleTimeout(() => clearVehicle(vehicle.id), simulationDelay(handoverMinutes()));
}

function scheduleSecondaryTransfer(sourceIncident, hospital) {
  if (Math.random() > .75) return;
  const delayMinutes = randomInt(15, 60);
  scheduleTimeout(() => {
    const transfer = buildSecondaryTransferCall(sourceIncident, hospital);
    if (!state.pendingCall) {
      state.pendingCall = transfer;
      el.answerButton.disabled = false;
      el.forwardButton.disabled = false;
      logCall("Neuer Telefonanruf.", "warn");
      logCall(`${transfer.callerName}: ${transfer.callerText}`, "call");
    } else {
      createIncident(transfer);
    }
    logRadio(`Folgetransport wegen ungeeigneter Zielklinik angelegt: ${hospital.label}.`, "warn");
    renderAll();
  }, simulationDelay(delayMinutes));
}

function buildSecondaryTransferCall(sourceIncident, hospital) {
  const critical = sourceIncident.patient?.condition === "kritisch" || sourceIncident.required.includes("NEF");
  const keyword = critical ? "RD 2 Verlegung - Notfalltransport mit NA" : sourceIncident.type === "transport" ? "RD KTP - Verlegung" : "RD 1 Verlegung - Notfalltransport mit RTW";
  const defaults = keywordDefaults[keyword] || { type: "transport", required: critical ? ["RTW", "NEF"] : ["RTW"], signal: critical };
  return {
    id: makeId(),
    type: defaults.type,
    keyword,
    callerName: `${hospital.label} Aufnahme`,
    callerText: `Patient aus ${sourceIncident.keyword} benoetigt Verlegung, da die erforderliche Fachabteilung (${sourceIncident.patient?.requiredDepartment || "Fachrichtung"}) nicht verfuegbar ist.`,
    location: hospital.label,
    lat: hospital.lat,
    lng: hospital.lng,
    required: defaults.required,
    requiredDepartmentKey: sourceIncident.patient?.requiredDepartmentKey || "emergency",
    priority: critical ? "hoch" : "normal",
    signal: defaults.signal,
    fixedDestinationId: nearestSuitableHospital(sourceIncident)?.id || null
  };
}

function nearestSuitableHospital(incident) {
  return nearestHospitals(incident).find((hospital) => hospital.suitable);
}

function finishWithoutTransport(incidentId, reason) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  incident.patient.outcome = reason;
  incident.patient.transportNeeded = false;
  incident.patient.status = "abgeschlossen ohne Transport";
  incident.transportRequest = null;
  incident.transportRequests = [];
  incident.assistanceDecision = null;
  incident.assistanceRequested = false;
  (incident.patient.patients || []).forEach((patient) => {
    patient.transportNeeded = false;
    patient.transporting = false;
    patient.completed = true;
    patient.completedAtMinute = state.minute;
  });
  incident.assigned.forEach((id) => {
    const assigned = state.vehicles.find((unit) => unit.id === id);
    if (assigned) {
      assigned.pendingTransportRequest = null;
      assigned.pendingAssistanceRequest = null;
      assigned.pendingSituationReport = null;
      assigned.pendingClearRequest = null;
      assigned.radioStatus = null;
      assigned.radioMessage = "";
      assigned.awaitingSpeechPrompt = false;
      assigned.supportOnly = false;
    }
  });
  logRadio(`Einsatz ${incident.keyword}: ${reason}`, "warn");
  incident.assigned.forEach((id) => {
    const vehicle = state.vehicles.find((unit) => unit.id === id);
    if (vehicle && [3, 4, 7].includes(vehicle.status)) clearVehicle(vehicle.id);
  });
  incident.status = "geschlossen";
  logRadio(`Einsatz abgeschlossen: ${incident.keyword}.`, "radio");
  renderAll();
}

function handoffIncident(incidentId, service) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  const labels = { FW: "Feuerwehr", POL: "Polizei", AEND: "Ärztlichen Notdienst" };
  incident.status = "geschlossen";
  incident.handoff = service;
  incident.assigned.forEach((id) => {
    const vehicle = state.vehicles.find((unit) => unit.id === id);
    if (vehicle && [1, 2, 3].includes(vehicle.status)) removeAssignedVehicle(vehicle.id, incident.id);
  });
  incident.status = "geschlossen";
  logRadio(`Einsatz ${incident.keyword} an ${labels[service] || service} abgegeben.`, "warn");
  renderAll();
}

function renderServiceSupport(incident) {
  if (!incident.services) {
    incident.services = { FW: createServiceState(), POL: createServiceState() };
  }
  const wrapper = document.createElement("div");
  wrapper.className = "service-support";
  ["FW", "POL"].forEach((service) => {
    const stateInfo = incident.services[service] || createServiceState();
    refreshServiceArrival(incident, service, stateInfo);
    incident.services[service] = stateInfo;
    const box = document.createElement("div");
    box.className = `service-box service-${stateInfo.status.replace(/\s+/g, "-")}`;
    const title = document.createElement("strong");
    title.textContent = service;
    const status = document.createElement("span");
    status.textContent = stateInfo.arriveAtMinute && stateInfo.status === "unterwegs"
      ? `${stateInfo.status}, ca. ${serviceRemainingMinutes(stateInfo)} min`
      : stateInfo.status;
    box.append(title, status);
    if (stateInfo.status === "nicht alarmiert") {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${service} alarmieren`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        alarmService(incident.id, service);
      });
      box.append(button);
    }
    wrapper.append(box);
  });
  return wrapper;
}

function refreshServiceArrival(incident, service, serviceState) {
  if (serviceState.status !== "unterwegs" || !serviceState.arriveAtMinute || state.minute < serviceState.arriveAtMinute) return;
  serviceState.status = "an Einsatzstelle";
  serviceState.eta = null;
  serviceState.arriveAtMinute = null;
  logRadio(`${service}: an der Einsatzstelle eingetroffen.`, "radio");
}

function alarmService(incidentId, service) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  if (!incident.services) incident.services = { FW: createServiceState(), POL: createServiceState() };
  const serviceState = incident.services[service] || createServiceState();
  if (serviceState.status !== "nicht alarmiert") return;
  const eta = randomInt(3, 12);
  serviceState.status = "alarmiert";
  serviceState.eta = eta;
  serviceState.arriveAtMinute = state.minute + eta;
  serviceState.alarmedAt = state.minute;
  incident.services[service] = serviceState;
  logRadio(`${service}: zu ${incident.keyword} alarmiert.`, "warn");
  renderAll();
  scheduleTimeout(() => {
    if (serviceState.status !== "alarmiert") return;
    serviceState.status = "unterwegs";
    logRadio(`${service}: unterwegs zu ${incident.location}.`, "radio");
    renderAll();
  }, simulationDelay(.3));
  scheduleTimeout(() => {
    if (!["alarmiert", "unterwegs"].includes(serviceState.status)) return;
    serviceState.status = "an Einsatzstelle";
    serviceState.eta = null;
    serviceState.arriveAtMinute = null;
    logRadio(`${service}: an der Einsatzstelle eingetroffen.`, "radio");
    renderAll();
  }, simulationDelay(eta));
}

function serviceRemainingMinutes(serviceState) {
  if (!serviceState.arriveAtMinute) return serviceState.eta || 0;
  return Math.max(1, Math.ceil(serviceState.arriveAtMinute - state.minute));
}

function arriveAtHospital(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 7) return;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  if (incident) completeTransportedPatient(vehicle, incident);
  vehicle.status = 8;
  vehicle.statusText = "am Krankenhaus";
  vehicle.patientId = null;
  vehicle.lat = vehicle.target?.lat ?? vehicle.lat;
  vehicle.lng = vehicle.target?.lng ?? vehicle.lng;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  vehicle.accompanyingActive = false;
  logRadio(`${vehicle.name}: Status 8, Übergabe im Krankenhaus.`, "radio");
  if (incident) closeIncidentIfAllPatientsDone(incident);
  renderAll();
  vehicle.handoverTimer = scheduleTimeout(() => clearVehicle(vehicle.id), simulationDelay(handoverMinutes()));
}

function clearVehicle(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle) return;
  const oldStatus = vehicle.status;
  const oldIncidentId = vehicle.incidentId;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  const station = state.center.stations.find((item) => item.id === vehicle.stationId);
  cancelVehicleRoute(vehicle);
  vehicle.coveragePointId = null;
  releasePatientAssignment(vehicle);

  vehicle.status = 1;
  vehicle.statusText = "frei über Funk";
  if (oldStatus === 8 && oldIncidentId) detachVehicleFromIncident(vehicle.id, oldIncidentId);
  logRadio(`${vehicle.name}: Status 1, einsatzbereit.`, "radio");

  if (incident && !incidentHasOpenPatients(incident) && incident.assigned.every((id) => {
    const assigned = state.vehicles.find((unit) => unit.id === id);
    return assigned && [1, 2].includes(assigned.status);
  })) {
    closeIncidentIfAllPatientsDone(incident);
  }

  renderAll();
  if (station) driveVehicleTo(vehicle, station, { signal: false, phase: "station" }, () => returnToStation(vehicle.id));
}

function returnToStation(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 1) return;
  const station = state.center.stations.find((item) => item.id === vehicle.stationId);
  if (!station) return;
  vehicle.status = 2;
  vehicle.statusText = "auf Wache";
  vehicle.lat = station.lat;
  vehicle.lng = station.lng;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  vehicle.incidentId = null;
  vehicle.coveragePointId = null;
  renderAll();
}

async function driveVehicleTo(vehicle, destination, options, onArrival) {
  const route = await buildRoute(vehicle, destination);
  vehicle.target = { lat: destination.lat, lng: destination.lng };
  vehicle.route = route.points;
  vehicle.routeDistanceKm = route.distanceKm;
  const speedKmh = routeSpeedKmh(vehicle, options.signal);
  const travelMs = Math.max(8000, (route.distanceKm / speedKmh) * 3600000 / state.speed);
  const token = makeId();
  vehicle.routeToken = token;
  vehicle.routeMeta = {
    token,
    startAt: Date.now(),
    endAt: Date.now() + travelMs,
    points: route.points,
    cumulative: routeCumulative(route.points),
    distanceKm: route.distanceKm,
    destination,
    signal: Boolean(options.signal)
  };
  renderAll();
  vehicle.routeArrivalHandler = () => {
    if (vehicle.routeToken !== token) return;
    onArrival();
  };
  vehicle.routeTimer = scheduleTimeout(vehicle.routeArrivalHandler, travelMs);
}

async function buildRoute(vehicle, destination) {
  const directDistance = mapDistance(vehicle.lat, vehicle.lng, destination.lat, destination.lng);
  const fallbackDistance = directDistance * 1.35;
  const fallback = {
    distanceKm: Math.max(.2, fallbackDistance),
    points: [[vehicle.lat, vehicle.lng], [destination.lat, destination.lng]]
  };
  if (vehicle.type === "RTH") {
    return {
      distanceKm: Math.max(.2, directDistance),
      points: [[vehicle.lat, vehicle.lng], [destination.lat, destination.lng]]
    };
  }

  if (!window.fetch) return fallback;

  const url = `https://router.project-osrm.org/route/v1/driving/${vehicle.lng},${vehicle.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    if (!response.ok) return fallback;
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route?.geometry?.coordinates?.length) return fallback;
    return {
      distanceKm: Math.max(.2, route.distance / 1000),
      points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    };
  } catch {
    return fallback;
  }
}

function routeSpeedKmh(vehicle, signal) {
  if (vehicle?.type === "RTH") return 200;
  const normalCitySpeed = 38;
  return signal ? normalCitySpeed * 1.3 : normalCitySpeed;
}

function treatmentMinutes(incident) {
  if (incident.required.includes("NEF")) return 18;
  if (incident.type === "transport") return 6;
  return 12;
}

function handoverMinutes() {
  const roll = Math.random();
  if (roll < .7) return randomRange(15, 20);
  if (roll < .9) return randomRange(10, 14);
  return randomRange(21, 45);
}

function simulationDelay(minutes) {
  return minutes * 60000 / state.speed;
}

function scheduleTimeout(handler, delay) {
  let timer = null;
  const fire = () => {
    state.timeouts = state.timeouts.filter((item) => item !== timer);
    if (state.paused) {
      timer = window.setTimeout(fire, 500);
      state.timeouts.push(timer);
      return;
    }
    handler();
  };
  timer = window.setTimeout(fire, delay);
  state.timeouts.push(timer);
  return timer;
}

function updateVehicleTracking() {
  let changed = false;
  const now = Date.now();
  state.vehicles.forEach((vehicle) => {
    if (!vehicle.routeMeta) return;
    const progress = Math.min(1, Math.max(0, (now - vehicle.routeMeta.startAt) / (vehicle.routeMeta.endAt - vehicle.routeMeta.startAt)));
    const position = pointAtProgress(vehicle.routeMeta, progress);
    if (!position) return;
    vehicle.lat = position.lat;
    vehicle.lng = position.lng;
    changed = true;
  });
  if (changed) renderMap();
}

function routeCumulative(points) {
  const cumulative = [0];
  for (let index = 1; index < points.length; index += 1) {
    const [lat1, lng1] = points[index - 1];
    const [lat2, lng2] = points[index];
    cumulative[index] = cumulative[index - 1] + mapDistance(lat1, lng1, lat2, lng2);
  }
  return cumulative;
}

function pointAtProgress(routeMeta, progress) {
  const total = routeMeta.cumulative.at(-1) || routeMeta.distanceKm;
  if (!total || routeMeta.points.length < 2) return null;
  const targetDistance = total * progress;
  let segment = 1;
  while (segment < routeMeta.cumulative.length && routeMeta.cumulative[segment] < targetDistance) {
    segment += 1;
  }
  const previousDistance = routeMeta.cumulative[segment - 1] || 0;
  const nextDistance = routeMeta.cumulative[segment] || total;
  const localProgress = nextDistance === previousDistance ? 1 : (targetDistance - previousDistance) / (nextDistance - previousDistance);
  const [lat1, lng1] = routeMeta.points[segment - 1];
  const [lat2, lng2] = routeMeta.points[segment] || routeMeta.points.at(-1);
  return {
    lat: lat1 + (lat2 - lat1) * localProgress,
    lng: lng1 + (lng2 - lng1) * localProgress
  };
}

function cancelVehicleRoute(vehicle) {
  if (vehicle.routeTimer) {
    clearTimeout(vehicle.routeTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.routeTimer);
  }
  vehicle.routeTimer = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  vehicle.routeToken = null;
  vehicle.routeArrivalHandler = null;
  vehicle.target = null;
}

function isAlarmable(vehicle) {
  return ([1, 2, 8].includes(vehicle.status)
    || (vehicle.status === 3 && vehicle.routeMeta && !vehicle.routeMeta.signal)
    || (vehicle.type === "NEF" && vehicle.status === 7 && !vehicle.accompanyingActive)) && !vehicle.nextIncidentId;
}

function turnoutDelayMinutes(vehicle) {
  let delay = randomRange(.5, 2);
  if (vehicle.status === 1) delay = 0;
  if (vehicle.status === 3) delay = .5;
  return vehicle.type === "RTH" ? delay * 2 : delay;
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function randomRange(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function nearestHospital(incident) {
  return nearestHospitals(incident)[0];
}

function nearestHospitals(incident, request = incident.transportRequest) {
  return state.center.hospitals
    .map((hospital) => ({
      ...hospital,
      distance: mapDistance(hospital.lat, hospital.lng, incident.lat, incident.lng),
      suitable: hospitalSuitableForIncident(hospital, incident, request)
    }))
    .sort((a, b) => a.distance - b.distance);
}

function hospitalSuitableForIncident(hospital, incident, request = incident.transportRequest) {
  const keys = requiredDepartmentKeysForTransport(incident, request).map(normalizeDepartmentKey);
  if (!keys.length || keys.includes("none")) return true;
  if (hospital.pediatricOnly && !keys.includes("pediatrics")) return false;
  const departments = hospital.departments || [];
  return keys.every((key) => departments.includes(key));
}

function requiredDepartmentKeysForTransport(incident, request = incident.transportRequest) {
  const patientId = request?.patientId;
  const patients = incident.patient?.patients || [];
  const patient = patients.find((item) => item.id === patientId) || patients[0];
  return patient?.requiredDepartmentKeys || (patient?.requiredDepartmentKey ? [patient.requiredDepartmentKey] : incident.patient?.requiredDepartmentKeys || [incident.patient?.requiredDepartmentKey || "internal"]);
}

function hasRequiredVehicles(incident) {
  return !missingVehicleTypes(incident).length;
}

function missingVehicleTypes(incident) {
  const assigned = incident.assigned
    .map((id) => state.vehicles.find((unit) => unit.id === id))
    .filter((vehicle) => vehicle && ![6].includes(vehicle.status));
  const used = new Set();
  return (incident.required || []).filter((requiredType) => {
    const match = assigned.find((vehicle) => !used.has(vehicle.id) && vehicleSatisfiesRequirement(vehicle.type, requiredType));
    if (!match) return true;
    used.add(match.id);
    return false;
  });
}

function vehicleSatisfiesRequirement(vehicleType, requiredType) {
  if (vehicleType === requiredType) return true;
  if (requiredType === "KTW" && vehicleType === "RTW") return true;
  return false;
}

function setSpeed() {
  const oldSpeed = state.speed || 1;
  state.speed = Number(el.speedSelect.value) || 1;
  state.lastClockTick = Date.now();
  rescaleActiveTimers(oldSpeed, state.speed);
}

function rescaleActiveTimers(oldSpeed, newSpeed) {
  if (!oldSpeed || !newSpeed || oldSpeed === newSpeed) return;
  const factor = oldSpeed / newSpeed;
  const now = Date.now();
  state.vehicles.forEach((vehicle) => {
    if (vehicle.routeMeta) {
      const total = Math.max(1, vehicle.routeMeta.endAt - vehicle.routeMeta.startAt);
      const progress = Math.min(1, Math.max(0, (now - vehicle.routeMeta.startAt) / total));
      const remaining = Math.max(0, vehicle.routeMeta.endAt - now) * factor;
      const newTotal = progress >= 1 ? 1 : remaining / Math.max(.001, 1 - progress);
      vehicle.routeMeta.startAt = now - progress * newTotal;
      vehicle.routeMeta.endAt = now + remaining;
      if (vehicle.routeTimer) {
        clearTimeout(vehicle.routeTimer);
        state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.routeTimer);
      }
      if (vehicle.routeArrivalHandler) {
        vehicle.routeTimer = scheduleTimeout(vehicle.routeArrivalHandler, remaining);
      }
    }
    if (vehicle.dispatchTimer && vehicle.pendingDispatchUntil) {
      const remaining = Math.max(0, vehicle.pendingDispatchUntil - now) * factor;
      vehicle.pendingDispatchUntil = now + remaining;
      clearTimeout(vehicle.dispatchTimer);
      state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.dispatchTimer);
      vehicle.dispatchTimer = scheduleTimeout(() => startResponse(vehicle.id), remaining);
    }
  });
}

function togglePause() {
  state.paused = !state.paused;
  if (state.paused) {
    state.pauseStartedAt = Date.now();
  } else if (state.pauseStartedAt) {
    const pausedMs = Date.now() - state.pauseStartedAt;
    state.vehicles.forEach((vehicle) => {
      if (vehicle.routeMeta) {
        vehicle.routeMeta.startAt += pausedMs;
        vehicle.routeMeta.endAt += pausedMs;
      }
      if (vehicle.pendingDispatchUntil) vehicle.pendingDispatchUntil += pausedMs;
    });
    state.pauseStartedAt = null;
    state.lastClockTick = Date.now();
  }
  el.pauseButton.textContent = state.paused ? "Weiter" : "Pause";
}

function renderAll() {
  renderClock();
  renderMap();
  renderIncidents();
  renderVehicles();
  renderRadioAlerts();
}

function renderRadioAlerts() {
  if (!el.radioAlerts) return;
  const alerts = state.vehicles.filter((vehicle) => vehicle.radioStatus === 5 || vehicle.radioStatus === 0);
  el.radioAlerts.innerHTML = "";
  alerts.forEach((vehicle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `radio-alert radio-alert-${vehicle.radioStatus}`;
    button.textContent = `${vehicle.radioStatus} - ${vehicle.shortName || vehicle.name}`;
    button.title = `Status ${vehicle.radioStatus} ${vehicle.name} annehmen`;
    button.addEventListener("click", () => sendSpeechPrompt(vehicle.id));
    el.radioAlerts.append(button);
  });
}

function renderClock() {
  const displayMinute = Math.floor(state.minute);
  const hours = String(Math.floor(displayMinute / 60)).padStart(2, "0");
  const minutes = String(displayMinute % 60).padStart(2, "0");
  el.clockLabel.textContent = `${hours}:${minutes}`;
}

function updateShiftStates() {
  let changed = false;
  state.vehicles.forEach((vehicle) => {
    const inShift = vehicleInShift(vehicle);
    const shouldWarn = !inShift && ![2, 6].includes(vehicle.status);
    if (vehicle.shiftWarning !== shouldWarn) {
      vehicle.shiftWarning = shouldWarn;
      changed = true;
    }
    if (!inShift && vehicle.status === 2) {
      vehicle.status = 6;
      vehicle.statusText = "außer Dienst";
      changed = true;
    }
    if (inShift && vehicle.status === 6) {
      vehicle.status = 2;
      vehicle.statusText = "auf Wache";
      changed = true;
    }
  });
  if (changed) renderVehicles();
}

function vehicleInShift(vehicle) {
  if (!vehicle.shift || vehicle.shift.toLowerCase() === "24h") return true;
  return vehicle.shift.split(",").some((interval) => vehicleInShiftInterval(interval.trim()));
}

function vehicleInShiftInterval(interval) {
  const match = interval.match(/(\d{1,2})(?::?(\d{2}))?\s*-\s*(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return true;
  const start = Number(match[1]) * 60 + Number(match[2] || 0);
  const end = Number(match[3]) * 60 + Number(match[4] || 0);
  const now = Math.floor(state.minute) % 1440;
  if (start === end) return true;
  if (start < end) return now >= start && now < end;
  return now >= start || now < end;
}

function renderMap() {
  if (!state.mapReady) return;
  clearMapLayers();

  state.center.stations.forEach((station) => {
    const vehicleSummary = Object.entries(station.vehicles || {})
      .map(([type, count]) => `${count} ${type}`)
      .join(", ");
    const availableCount = stationAvailableVehicles(station).length;
    const stationType = availableCount ? "station station-available" : "station station-empty";
    const stationLabel = station.vehicles?.NEF && !station.vehicles?.RTW && !station.vehicles?.KTW ? "NEF" : "RW";
    const availabilityText = availableCount ? `${availableCount} Fahrzeug(e) an der Wache` : "keine Fahrzeuge an der Wache";
    const position = offsetStationPosition(station);
    const marker = addMapMarker("stations", position.lat, position.lng, stationLabel, stationType, `<strong>${escapeHtml(station.label)}</strong><br>${escapeHtml(station.address)}<br>${escapeHtml(vehicleSummary)}<br>${escapeHtml(availabilityText)}`);
    marker.bindPopup(stationPopupContent(station), { autoClose: true, closeOnClick: true, closeButton: true });
  });
  state.center.hospitals.forEach((hospital) => {
    addMapMarker("hospitals", hospital.lat, hospital.lng, "KH", "hospital", `<strong>${escapeHtml(hospital.label)}</strong><br>${escapeHtml(hospital.address)}`);
  });
  state.incidents.filter((incident) => incident.status !== "geschlossen").forEach((incident) => {
    const lat = Number.isFinite(incident.lat) ? incident.lat : state.center.mapCenter[0];
    const lng = Number.isFinite(incident.lng) ? incident.lng : state.center.mapCenter[1];
    const attention = incidentHasRadioAttention(incident) ? " attention" : "";
    const marker = addMapMarker("incidents", lat, lng, "!", `incident${attention}`, `${incident.keyword}<br>${incident.location || "Regensburg"}`);
    marker.on("click", () => {
      state.selectedIncidentId = incident.id;
      renderAll();
    });
  });
  state.vehicles.filter((vehicle) => vehicleVisibleOnMap(vehicle)).forEach((vehicle) => {
    const routeIncidentId = vehicle.incidentId || vehicle.nextIncidentId;
    if (vehicle.route?.length && routeIncidentId === state.selectedIncidentId) {
      const line = L.polyline(vehicle.route, {
        color: "#1d5f9f",
        weight: 3,
        opacity: .65
      }).addTo(state.map);
      state.layers.routes.push(line);
    }

    const icon = L.divIcon({
      className: "",
      html: `<span class="vehicle-marker vehicle-${vehicle.type} ${vehicle.status > 2 ? "busy" : ""} ${vehicle.routeMeta?.signal ? "signal" : ""} ${vehicle.radioStatus ? "radio-attention" : ""}"><span class="vehicle-marker-text"><strong>${escapeHtml(vehicle.type)}</strong><small>${escapeHtml(vehicle.shortName || vehicle.name)}</small></span><em class="vehicle-marker-status status-${vehicle.status}">${vehicle.status}</em></span>`,
      iconSize: [72, 34],
      iconAnchor: [36, 17]
    });
    const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
      .bindPopup(vehiclePopupContent(vehicle))
      .addTo(state.map);
    marker.on("click", (event) => {
      if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
      state.selectedVehicleId = vehicle.id;
      renderVehicles();
    });
    if (vehicle.id === state.selectedVehicleId) {
      window.setTimeout(() => marker.openPopup(), 0);
    }
    state.layers.vehicles.push(marker);
  });
}

function offsetStationPosition(station) {
  const overlapsHospital = state.center.hospitals.some((hospital) => mapDistance(station.lat, station.lng, hospital.lat, hospital.lng) < .08);
  if (!overlapsHospital) return { lat: station.lat, lng: station.lng };
  return { lat: station.lat + .0012, lng: station.lng - .0012 };
}

function stationAvailableVehicles(station) {
  return state.vehicles.filter((vehicle) => vehicle.stationId === station.id && vehicle.status === 2 && !vehicle.nextIncidentId);
}

function vehicleVisibleOnMap(vehicle) {
  return Boolean(vehicle.routeMeta || vehicle.route?.length || [3, 7].includes(vehicle.status));
}

function incidentHasRadioAttention(incident) {
  return incident.assigned.some((id) => {
    const vehicle = state.vehicles.find((unit) => unit.id === id);
    return vehicle?.radioStatus === 5 || vehicle?.radioStatus === 0;
  }) || activeTransportRequests(incident).length > 0 || missingVehicleTypesAtScene(incident).length > 0 || missingExternalServices(incident, "dispatch").length > 0;
}

function missingVehicleTypesAtScene(incident) {
  const assigned = incident.assigned
    .map((id) => state.vehicles.find((unit) => unit.id === id))
    .filter((vehicle) => vehicle && vehicle.status === 4);
  const used = new Set();
  return (incident.required || []).filter((requiredType) => {
    const match = assigned.find((vehicle) => !used.has(vehicle.id) && vehicleSatisfiesRequirement(vehicle.type, requiredType));
    if (!match) return true;
    used.add(match.id);
    return false;
  });
}

function incidentHasVehicleStatus(incident, status) {
  return incident.assigned.some((id) => state.vehicles.find((vehicle) => vehicle.id === id)?.status === status);
}

function stationPopupContent(station) {
  const wrapper = document.createElement("div");
  wrapper.className = "map-popup-actions";
  const title = document.createElement("strong");
  title.textContent = station.label;
  wrapper.append(title);
  const vehicles = state.vehicles.filter((vehicle) => vehicle.stationId === station.id && vehicle.status !== 6);
  if (!vehicles.length) {
    appendTextBlock(wrapper, "p", "Keine aktiven Fahrzeuge.");
    return wrapper;
  }
  vehicles.forEach((vehicle) => {
    appendTextBlock(wrapper, "p", `${vehicle.name}: Status ${vehicle.status} - ${vehicle.statusText}`);
  });
  return wrapper;
}

function vehiclePopupContent(vehicle) {
  const wrapper = document.createElement("div");
  wrapper.className = "map-popup-actions";
  const title = document.createElement("strong");
  title.textContent = vehicle.name;
  wrapper.append(title);
  appendTextBlock(wrapper, "p", `Status ${vehicle.status}: ${vehicle.statusText}`);
  if (vehicle.radioStatus) addPopupButton(wrapper, `Status ${vehicle.radioStatus} annehmen`, () => sendSpeechPrompt(vehicle.id));
  if (vehicle.status === 1) addPopupButton(wrapper, "Status H", () => sendVehicleHome(vehicle.id));
  if (vehicle.status === 3) {
    addPopupButton(wrapper, "Status E", () => abortVehicleMission(vehicle.id));
    addPopupButton(wrapper, vehicle.routeMeta?.signal ? "ohne Sondersignal weiter" : "mit Sondersignal weiter", () => toggleVehicleSignal(vehicle.id));
  }
  if (vehicle.status === 4 && vehicle.type === "RTW") {
    const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
    const patient = incident ? patientForVehicle(vehicle, incident) : null;
    if (patient?.awaitingKtwHandover && !patient.rtwMustTransport) {
      addPopupButton(wrapper, "selbst transportieren", () => forceRtwTransport(vehicle.id));
    }
  }
  if ((vehicle.status === 2 || vehicle.status === 8) && vehicle.nextIncidentId) {
    addPopupButton(wrapper, "mit Sondersignal zum Auftrag", () => toggleVehicleSignal(vehicle.id));
  }
  if (vehicle.status === 7) addPopupButton(wrapper, "Zielortwechsel", () => changeTransportDestination(vehicle.id));
  if (canReleaseAccompanyingDoctor(vehicle)) addPopupButton(wrapper, "abkömmlich freimelden", () => releaseAccompanyingDoctor(vehicle.id));
  if (vehicle.status === 8) addPopupButton(wrapper, "einsatzklar?", () => clearVehicle(vehicle.id));
  return wrapper;
}

function forceRtwTransport(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const incident = state.incidents.find((item) => item.id === vehicle?.incidentId);
  const patient = incident ? patientForVehicle(vehicle, incident) : null;
  if (!vehicle || !incident || !patient) return;
  patient.rtwMustTransport = true;
  patient.awaitingKtwHandover = false;
  incident.ktwHandoverDecision = null;
  logRadio(`${vehicle.name}: RTW übernimmt den Transport.`, "radio");
  scheduleTreatmentCompletion(vehicle, incident);
  renderAll();
}

function canReleaseAccompanyingDoctor(vehicle) {
  return ["NEF", "RTH"].includes(vehicle.type) && vehicle.status === 7 && vehicle.accompanyingActive === false && /abkömmlich|abkoemmlich/i.test(vehicle.statusText || "");
}

function releaseAccompanyingDoctor(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || !canReleaseAccompanyingDoctor(vehicle)) return;
  cancelVehicleRoute(vehicle);
  vehicle.status = 1;
  vehicle.statusText = "abkömmlich freigemeldet";
  vehicle.incidentId = null;
  vehicle.patientId = null;
  vehicle.accompanyingActive = false;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  logRadio(`${vehicle.name}: Status 1, Notarzt abkömmlich freigemeldet.`, "radio");
  renderAll();
}

function addPopupButton(parent, label, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", handler);
  parent.append(button);
}

function toggleVehicleSignal(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle) return;
  if (vehicle.routeMeta) {
    const oldSignal = vehicle.routeMeta.signal;
    vehicle.routeMeta.signal = !vehicle.routeMeta.signal;
    rescaleVehicleRouteForSignal(vehicle, oldSignal, vehicle.routeMeta.signal);
    logRadio(`${vehicle.name}: Fahrt ${vehicle.routeMeta.signal ? "mit" : "ohne"} Sondersignal fortgesetzt.`, "radio");
  } else {
    vehicle.dispatchSignal = !vehicle.dispatchSignal;
    logRadio(`${vehicle.name}: Anfahrt ${vehicle.dispatchSignal ? "mit" : "ohne"} Sondersignal vorgemerkt.`, "radio");
  }
  renderAll();
}

function rescaleVehicleRouteForSignal(vehicle, oldSignal, newSignal) {
  if (!vehicle.routeMeta || oldSignal === newSignal || vehicle.type === "RTH") return;
  const oldSpeed = routeSpeedKmh(vehicle, oldSignal);
  const newSpeed = routeSpeedKmh(vehicle, newSignal);
  if (!oldSpeed || !newSpeed || oldSpeed === newSpeed) return;
  const now = Date.now();
  const remaining = Math.max(0, vehicle.routeMeta.endAt - now) * (oldSpeed / newSpeed);
  vehicle.routeMeta.endAt = now + remaining;
  if (vehicle.routeTimer) {
    clearTimeout(vehicle.routeTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.routeTimer);
  }
  if (vehicle.routeArrivalHandler) vehicle.routeTimer = scheduleTimeout(vehicle.routeArrivalHandler, remaining);
}

function changeTransportDestination(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const incident = state.incidents.find((item) => item.id === vehicle?.incidentId);
  if (!vehicle || !incident || vehicle.status !== 7) return;
  cancelVehicleRoute(vehicle);
  vehicle.status = 4;
  vehicle.statusText = "wartet auf neues Transportziel";
  incident.status = "wartet auf Zielklinik";
  incident.transportRequest = {
    id: makeId(),
    vehicleId: vehicle.id,
    report: incident.patient?.report || "Zielortwechsel angefordert.",
    requiredDepartment: incident.patient?.requiredDepartment || "Notaufnahme",
    patientId: vehicle.patientId || patientForVehicle(vehicle, incident)?.id || null
  };
  incident.transportRequests = [incident.transportRequest];
  state.selectedIncidentId = incident.id;
  logRadio(`${vehicle.name}: Zielortwechsel angefordert.`, "warn");
  renderAll();
}

function addMapMarker(group, lat, lng, label, type, popup) {
  const icon = L.divIcon({
    className: "",
    html: `<span class="map-marker ${type}">${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
  const marker = L.marker([lat, lng], { icon }).bindPopup(popup).addTo(state.map);
  state.layers[group].push(marker);
  return marker;
}

function clearMapLayers() {
  Object.values(state.layers).flat().forEach((layer) => layer.remove());
  state.layers = {
    stations: [],
    hospitals: [],
    incidents: [],
    vehicles: [],
    routes: []
  };
}

function renderIncidents() {
  const active = state.incidents.filter((incident) => incident.status !== "geschlossen");
  el.incidentCount.textContent = `${active.length} offen`;
  const visible = active
    .filter((incident) => incidentListBucket(incident) === state.incidentFilter)
    .sort((a, b) => (b.createdAtMinute ?? 0) - (a.createdAtMinute ?? 0));

  if (!visible.length) {
    el.incidentList.className = "incident-list empty-state";
    el.incidentList.textContent = "Keine offenen Einsätze.";
    return;
  }

  el.incidentList.className = "incident-list";
  el.incidentList.innerHTML = "";
  renderIncidentsCollapsible(visible);
  return;
  visible.forEach((incident) => {
    const card = document.createElement("article");
    card.className = `incident-card ${incident.id === state.selectedIncidentId ? "active" : ""}`;
    appendTextBlock(card, "h3", incident.keyword);
    appendTextBlock(card, "p", incident.location || "Regensburg");
    appendTextBlock(card, "p", `Status: ${incident.status}${incident.signal ? " | Sondersignal" : ""}`);
    appendTextBlock(card, "p", `Fahrzeuge: ${incident.assigned.length ? incident.assigned.map(unitName).join(", ") : "noch keine"}`);
    if (incident.patient && incidentHasVehicleStatus(incident, 4)) {
      appendTextBlock(card, "p", `Patienten: ${incident.patient.patientCount || 1} | ${incident.patient.status}, ${incident.patient.requiredDepartment}`);
      if (incident.patient.report) appendTextBlock(card, "p", `Rückmeldung: ${incident.patient.report}`);
      if (incident.patient.outcome) appendTextBlock(card, "p", `Ergebnis: ${incident.patient.outcome}`);
    }
    pendingDispatchVehicles(incident).forEach((vehicle) => {
      appendTextBlock(card, "p", `${vehicle.name} meldet: noch ca. ${remainingDispatchMinutes(vehicle)} min bis Ausrücken.`);
      const replacementButton = document.createElement("button");
      replacementButton.type = "button";
      replacementButton.textContent = `anderes Auto statt ${vehicle.name}`;
      replacementButton.addEventListener("click", (event) => {
        event.stopPropagation();
        releasePendingVehicle(vehicle.id, incident.id);
      });
      card.append(replacementButton);
    });
    if (incident.note) appendTextBlock(card, "p", `Zusatz: ${incident.note}`);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Bearbeiten / nachalarmieren";
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openIncidentDialog(incident);
    });
    card.append(editButton);

    const handoffBox = document.createElement("div");
    handoffBox.className = "handoff-actions";
    [
      ["FW", "an FW"],
      ["POL", "an POL"],
      ["AEND", "an ÄND"]
    ].forEach(([service, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handoffIncident(incident.id, service);
      });
      handoffBox.append(button);
    });
    card.append(handoffBox);

    if (incident.transportRequest) {
      const transportBox = document.createElement("div");
      transportBox.className = "transport-choice";
      appendTransportRequestHeader(transportBox, incident);
      nearestHospitals(incident).slice(0, 5).forEach((hospital) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = hospital.suitable ? "hospital-choice suitable" : "hospital-choice unsuitable";
        button.textContent = `${hospital.label} (${hospital.distance.toFixed(1).replace(".", ",")} km)`;
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          beginTransport(incident.id, hospital.id);
        });
        transportBox.append(button);
      });
      ["Tod festgestellt", "Keine Indikation RD", "Transport verweigert"].forEach((reason) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = reason;
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          finishWithoutTransport(incident.id, reason);
        });
        transportBox.append(button);
      });
      card.append(transportBox);
    }

    card.addEventListener("click", () => {
      state.selectedIncidentId = incident.id;
      const lat = Number.isFinite(incident.lat) ? incident.lat : state.center.mapCenter[0];
      const lng = Number.isFinite(incident.lng) ? incident.lng : state.center.mapCenter[1];
      if (state.mapReady) state.map.setView([lat, lng], 15);
      renderIncidents();
    });

    nearestAvailableVehicles(incident).forEach((vehicle) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${vehicle.name} alarmieren`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        assignVehicle(vehicle.id, incident.id);
      });
      card.append(button);
    });
    el.incidentList.append(card);
  });
}

function incidentListBucket(incident) {
  if (incident.signal) return "emergency";
  if (incident.assigned?.length) return "transport";
  return "scheduled";
}

function incidentNeedsSlowAlert(incident) {
  return incident.signal && !incident.assigned?.length && incident.status !== "geschlossen";
}

function nearestAvailableVehicles(incident) {
  return state.vehicles
    .filter((vehicle) => isAlarmable(vehicle))
    .sort((a, b) => distanceToIncident(a, incident) - distanceToIncident(b, incident))
    .slice(0, 4);
}

function renderIncidentsCollapsible(visible) {
  visible.forEach((incident) => {
    const isOpen = incident.id === state.selectedIncidentId;
    const card = document.createElement("article");
    card.className = `incident-card ${isOpen ? "active" : ""} ${incidentHasRadioAttention(incident) ? "attention" : ""} ${incidentNeedsSlowAlert(incident) ? "slow-alert" : ""}`;
    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "incident-summary";
    summary.innerHTML = `
      <span>
        <strong>${escapeHtml(incident.keyword)}</strong>
        <small>${escapeHtml(incident.location || "Regensburg")}</small>
      </span>
      <span class="incident-state">${incidentElapsedLabel(incident)} | ${escapeHtml(incident.status)}</span>
    `;
    summary.addEventListener("click", () => {
      state.selectedIncidentId = isOpen ? null : incident.id;
      const lat = Number.isFinite(incident.lat) ? incident.lat : state.center.mapCenter[0];
      const lng = Number.isFinite(incident.lng) ? incident.lng : state.center.mapCenter[1];
      if (!isOpen && state.mapReady) state.map.setView([lat, lng], 15);
      renderAll();
    });
    card.append(summary);
    if (!isOpen) {
      el.incidentList.append(card);
      return;
    }

    const details = document.createElement("div");
    details.className = "incident-details";
    details.append(renderIncidentVehicleStatus(incident));
    if (incident.patient && incidentHasVehicleStatus(incident, 4)) {
      if (incident.patient.report) details.append(renderIncidentReport(incident.patient.report));
      if (incident.patient.outcome) appendTextBlock(details, "p", `Ergebnis: ${incident.patient.outcome}`);
      details.append(renderPatientAssignments(incident));
    }
    pendingDispatchVehicles(incident).forEach((vehicle) => {
      appendTextBlock(details, "p", `${vehicle.name} meldet: noch ca. ${remainingDispatchMinutes(vehicle)} min bis Ausrücken.`);
      const replacementButton = document.createElement("button");
      replacementButton.type = "button";
      replacementButton.textContent = `anderes Auto statt ${vehicle.name}`;
      replacementButton.addEventListener("click", (event) => {
        event.stopPropagation();
        releasePendingVehicle(vehicle.id, incident.id);
      });
      details.append(replacementButton);
    });
    if (incident.note) appendTextBlock(details, "p", `Zusatz: ${incident.note}`);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Bearbeiten / nachalarmieren";
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openIncidentDialog(incident);
    });
    details.append(editButton);

    const handoffBox = document.createElement("div");
    handoffBox.className = "handoff-actions";
    [
      ["FW", "an FW"],
      ["POL", "an POL"],
      ["AEND", "an ÄND"]
    ].forEach(([service, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handoffIncident(incident.id, service);
      });
      handoffBox.append(button);
    });
    handoffBox.hidden = true;
    details.append(renderServiceSupport(incident));
    if (incident.assistanceDecision) details.append(renderAssistanceDecision(incident));
    if (incident.ktwHandoverDecision) details.append(renderKtwHandoverDecision(incident));

    activeTransportRequests(incident).forEach((request) => {
      const transportBox = document.createElement("div");
      transportBox.className = "transport-choice";
      appendTransportRequestHeader(transportBox, incident, request);
      nearestHospitals(incident, request).slice(0, 5).forEach((hospital) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = hospital.suitable ? "hospital-choice suitable" : "hospital-choice unsuitable";
        button.textContent = `${hospital.label} (${hospital.distance.toFixed(1).replace(".", ",")} km)`;
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          beginTransport(incident.id, hospital.id, request.vehicleId, request.id);
        });
        transportBox.append(button);
      });
      details.append(transportBox);
    });

    card.append(details);
    el.incidentList.append(card);
  });
}

function renderIncidentReport(text) {
  const box = document.createElement("section");
  box.className = "incident-report-card";
  box.innerHTML = `<strong>Rückmeldung</strong><p>${escapeHtml(text)}</p>`;
  return box;
}

function incidentElapsedLabel(incident) {
  const elapsed = Math.max(0, Math.floor(state.minute - (incident.createdAtMinute ?? state.minute)));
  return `${elapsed} min`;
}

function renderAssistanceDecision(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "assistance-decision";
  const missing = incident.assistanceDecision?.missing || [];
  appendTextBlock(wrapper, "strong", `Nachforderung: ${missing.join(", ")}`);
  if (missing.includes("NEF") || missing.includes("RTH")) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Nachfragen: Transport ohne NEF möglich?";
    button.addEventListener("click", () => applyAssistanceAlternative(incident.id, "without-doctor"));
    wrapper.append(button);
  }
  if (missing.includes("RTW")) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Nachfragen: Transport ohne RTW möglich?";
    button.addEventListener("click", () => applyAssistanceAlternative(incident.id, "without-rtw"));
    wrapper.append(button);
  }
  if (incident.assistanceDecision?.vehicleType === "KTW" && missing.includes("RTW") && (missing.includes("NEF") || missing.includes("RTH"))) {
    const nefKtw = document.createElement("button");
    nefKtw.type = "button";
    nefKtw.textContent = "Nachfragen: NEF + KTW ausreichend?";
    nefKtw.addEventListener("click", () => applyAssistanceAlternative(incident.id, "nef-ktw"));
    wrapper.append(nefKtw);
    const rtwOnly = document.createElement("button");
    rtwOnly.type = "button";
    rtwOnly.textContent = "Nachfragen: RTW alleine ausreichend?";
    rtwOnly.addEventListener("click", () => applyAssistanceAlternative(incident.id, "rtw-only"));
    wrapper.append(rtwOnly);
  }
  return wrapper;
}

function renderKtwHandoverDecision(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "assistance-decision";
  appendTextBlock(wrapper, "strong", "KTW-Patient: KTW zeitnah verfügbar?");
  const yes = document.createElement("button");
  yes.type = "button";
  yes.textContent = "Ja, KTW nachfordern";
  yes.addEventListener("click", () => answerKtwHandover(incident.id, true));
  const no = document.createElement("button");
  no.type = "button";
  no.textContent = "Nein, RTW transportiert";
  no.addEventListener("click", () => answerKtwHandover(incident.id, false));
  wrapper.append(yes, no);
  return wrapper;
}

function answerKtwHandover(incidentId, available) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  const request = incident?.ktwHandoverDecision;
  if (!incident || !request) return;
  const patient = (incident.patient?.patients || []).find((item) => item.id === request.patientId);
  const rtw = state.vehicles.find((vehicle) => vehicle.id === request.vehicleId);
  incident.ktwHandoverDecision = null;
  if (!patient || !rtw) return;
  if (!available) {
    patient.rtwMustTransport = true;
    patient.awaitingKtwHandover = false;
    logRadio(`${rtw.name}: Kein KTW zeitnah verfügbar, RTW übernimmt Transport.`, "radio");
    scheduleTreatmentCompletion(rtw, incident);
    renderAll();
    return;
  }
  patient.awaitingKtwHandover = true;
  patient.rtwMustTransport = false;
  patient.supportCapReachedAt = state.minute;
  patient.supportCapValue = Math.min(patientTreatmentProgress(patient, incident), 0.95);
  logRadio(`${rtw.name}: KTW soll nachgeführt werden, Versorgung bis Übergabe.`, "radio");
  openIncidentDialog(incident);
  scheduleTreatmentCompletion(rtw, incident);
  renderAll();
}

function nearestAvailableVehicleOfType(incident, type) {
  return state.vehicles
    .filter((vehicle) => vehicle.type === type && isAlarmable(vehicle))
    .sort((a, b) => distanceToIncident(a, incident) - distanceToIncident(b, incident))[0] || null;
}

function applyAssistanceAlternative(incidentId, mode) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident?.assistanceDecision) return;
  const chance = mode === "rtw-only" ? .25 : .5;
  const accepted = Math.random() < chance;
  if (!accepted) {
    logRadio(`Rückfrage ${incident.keyword}: nicht möglich, Nachforderung bleibt bestehen.`, "warn");
    incident.assistanceDecision = null;
    renderAll();
    return;
  }
  if (mode === "without-doctor" || mode === "rtw-only") removeRequirementFromIncident(incident, ["NEF", "RTH"]);
  if (mode === "without-rtw" || mode === "nef-ktw") replaceRequirementInIncident(incident, "RTW", "KTW");
  incident.patient.forceTransportSignal = true;
  incident.required = aggregateRequiredVehicles(incident.patient?.patients || [], incident.required);
  incident.assistanceDecision = null;
  incident.assistanceRequested = false;
  incident.status = missingVehicleTypes(incident).length ? "in Bearbeitung" : "vor Ort";
  resetTreatmentCapsAfterRequirementChange(incident);
  logRadio(`Rückfrage ${incident.keyword}: Alternative akzeptiert, Transport später mit Sondersignal.`, "radio");
  rescheduleSceneTreatment(incident);
  renderAll();
}

function removeRequirementFromIncident(incident, types) {
  (incident.patient?.patients || []).forEach((patient) => {
    patient.required = (patient.required || []).filter((type) => !types.includes(type));
  });
  incident.required = (incident.required || []).filter((type) => !types.includes(type));
}

function replaceRequirementInIncident(incident, fromType, toType) {
  (incident.patient?.patients || []).forEach((patient) => {
    patient.required = replaceRequirement(patient.required || [], fromType, toType);
  });
  incident.required = aggregateRequiredVehicles(incident.patient?.patients || [], replaceRequirement(incident.required || [], fromType, toType));
}

function replaceRequirement(required, fromType, toType) {
  const replaced = required.map((type) => type === fromType ? toType : type);
  return replaced.length ? replaced : [toType];
}

function resetTreatmentCapsAfterRequirementChange(incident) {
  (incident.patient?.patients || []).forEach((patient) => {
    const currentProgress = patientTreatmentProgress(patient, incident);
    if (patient.supportCapReachedAt) patient.supportCapReachedAt = state.minute;
    patient.supportCapValue = currentProgress;
  });
}

function rescheduleSceneTreatment(incident) {
  (incident.assigned || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle?.status === 4)
    .forEach((vehicle) => scheduleTreatmentCompletion(vehicle, incident));
}

function renderIncidentVehicleStatus(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "incident-vehicle-status";
  const title = document.createElement("strong");
  title.textContent = "Alarmierte Fahrzeuge";
  wrapper.append(title);
  const vehicles = incident.assigned
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean);
  if (!vehicles.length) {
    const empty = document.createElement("span");
    empty.textContent = "noch keine";
    wrapper.append(empty);
    return wrapper;
  }
  vehicles.forEach((vehicle) => {
    const line = document.createElement("span");
    line.className = "incident-vehicle-chip";
    line.innerHTML = `<b>${escapeHtml(vehicle.shortName || vehicle.name)}</b><em class="status-pill status-${vehicle.status}">${vehicle.status}</em><small>${escapeHtml(vehicle.statusText)}${vehicle.radioStatus ? ` | Sprechwunsch ${vehicle.radioStatus}` : ""}</small>`;
    wrapper.append(line);
  });
  return wrapper;
}

function renderPatientAssignments(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "patient-assignment-list";
  const patients = incident.patient?.patients || [];
  if (!patients.length) return wrapper;
  const progress = treatmentProgress(incident);
  const progressBox = document.createElement("div");
  progressBox.className = "treatment-progress";
  progressBox.innerHTML = `<span>Behandlung</span><strong>${Math.round(progress * 100)}%</strong><i><b style="width:${Math.round(progress * 100)}%"></b></i>`;
  wrapper.append(progressBox);
  const table = document.createElement("table");
  table.className = "patient-table";
  table.innerHTML = "<thead><tr><th>Patient</th><th>Versorgung</th><th>Bedarf</th><th>Klinik</th></tr></thead>";
  const body = document.createElement("tbody");
  patients.forEach((patient) => {
    const row = document.createElement("tr");
    const units = patient.completed
      ? "abgeschlossen"
      : patient.transporting
        ? `Transport mit ${unitName(patient.transportVehicleId)}`
        : (patient.assignedVehicles || []).map(unitName).join(", ") || "noch unversorgt";
    const need = (patient.required || []).join(" + ") || "ambulant";
    const progress = Math.round(patientTreatmentProgress(patient, incident) * 100);
    row.innerHTML = `<td>${escapeHtml(patient.label)}</td><td>${escapeHtml(units)}<div class="mini-progress"><b style="width:${progress}%"></b></div></td><td>${escapeHtml(need)}</td><td>${escapeHtml(patient.requiredDepartment)}</td>`;
    body.append(row);
  });
  table.append(body);
  wrapper.append(table);
  return wrapper;
}

function activeTransportRequests(incident) {
  const requests = incident.transportRequests?.length ? incident.transportRequests : (incident.transportRequest ? [incident.transportRequest] : []);
  return requests.filter((request) => {
    const vehicle = state.vehicles.find((unit) => unit.id === request.vehicleId);
    return vehicle?.status === 4;
  });
}

function appendTransportRequestHeader(parent, incident, request = incident.transportRequest) {
  const patient = (incident.patient?.patients || []).find((item) => item.id === request?.patientId);
  const header = document.createElement("div");
  header.className = "transport-choice-head";
  header.innerHTML = `
    <strong>Transportziel${patient ? ` für ${escapeHtml(patient.label)}` : ""}</strong>
    <span>${escapeHtml(request?.requiredDepartment || patient?.requiredDepartment || "Fachrichtung nach Rückmeldung")}</span>
  `;
  parent.append(header);
  if (request?.report) parent.append(renderIncidentReport(request.report));
}

function treatmentProgress(incident) {
  const patients = incident.patient?.patients || [];
  if (patients.length) {
    const values = patients.map((patient) => patientTreatmentProgress(patient, incident));
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  if (!incident.patient?.treatmentStartedAt) return 0;
  const elapsed = Math.max(0, state.minute - incident.patient.treatmentStartedAt);
  return Math.min(1, elapsed / treatmentMinutes(incident));
}

function patientTreatmentProgress(patient, incident) {
  const assigned = (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle?.status === 4);
  if (!assigned.length) return 0;
  const { cap, support } = currentTreatmentCap(patient, incident, assigned);
  const supportCapReachedAt = patient.supportCapReachedAt;
  const startedAt = supportCapReachedAt ?? patient.treatmentStartedAt ?? incident.patient?.treatmentStartedAt ?? state.minute;
  patient.treatmentStartedAt ??= startedAt;
  const elapsed = Math.max(0, state.minute - startedAt);
  const baseProgress = supportCapReachedAt ? (patient.supportCapValue ?? 0.8) : 0;
  const progress = Math.min(cap, baseProgress + elapsed / treatmentMinutes(incident));
  if (support && progress >= cap) {
    patient.supportCapReachedAt ??= state.minute;
    patient.supportCapValue = cap;
  }
  return progress;
}

function currentTreatmentCap(patient, incident, assignedVehicles = null) {
  const assigned = assignedVehicles || (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle?.status === 4);
  if (patient.awaitingKtwHandover && !patient.rtwMustTransport && !assigned.some((vehicle) => vehicle.type === "KTW")) {
    return { cap: 0.95, support: true };
  }
  const missing = patientMissingTypes(patient);
  if (!missing.length) return { cap: 1, support: false };
  const hasDoctorSupport = assigned.some((vehicle) => ["NEF", "RTH"].includes(vehicle.type));
  const waitingOnlyForTransport = missing.every((type) => ["RTW", "KTW"].includes(type));
  if (hasDoctorSupport && waitingOnlyForTransport) return { cap: 0.8, support: true };
  const hasKtwFirstResponse = assigned.some((vehicle) => vehicle.type === "KTW" && vehicle.supportOnly);
  const hasRequiredTransportUnit = assigned.some((vehicle) => (patient.required || []).some((type) => ["RTW", "KTW"].includes(type) && vehicleSatisfiesRequirement(vehicle.type, type)));
  if (hasKtwFirstResponse && !hasRequiredTransportUnit) {
    const required = patient.required || [];
    if (required.includes("RTW") && (required.includes("NEF") || required.includes("RTH"))) return { cap: 0.25, support: true };
    if (required.length === 1 && required.includes("RTW")) return { cap: 0.4, support: true };
  }
  return { cap: 0.5, support: true };
}

function patientHasTransportUnitAtScene(patient) {
  return (patient.assignedVehicles || [])
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .some((vehicle) => vehicle && ["RTW", "KTW"].includes(vehicle.type) && vehicle.status === 4);
}

function pendingDispatchVehicles(incident) {
  return incident.assigned
    .map((id) => state.vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle?.nextIncidentId === incident.id && vehicle.status === 8);
}

function remainingDispatchMinutes(vehicle) {
  if (!vehicle.pendingDispatchUntil) return vehicle.pendingDispatchDelay || 0;
  return Math.max(1, Math.ceil((vehicle.pendingDispatchUntil - Date.now()) / 60000 * state.speed));
}

function releasePendingVehicle(vehicleId, incidentId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!vehicle || !incident || vehicle.nextIncidentId !== incident.id) return;
  if (vehicle.dispatchTimer) {
    clearTimeout(vehicle.dispatchTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.dispatchTimer);
  }
  vehicle.dispatchTimer = null;
  vehicle.nextIncidentId = null;
  vehicle.incidentId = vehicle.previousIncidentId;
  vehicle.previousIncidentId = null;
  vehicle.pendingDispatchUntil = null;
  vehicle.pendingDispatchDelay = null;
  vehicle.radioStatus = null;
  vehicle.radioMessage = "";
  vehicle.awaitingSpeechPrompt = false;
  vehicle.waitingForSpeechPrompt = false;
  vehicle.statusText = "am Krankenhaus";
  incident.assigned = incident.assigned.filter((id) => id !== vehicle.id);
  incident.status = incident.assigned.length ? "in Bearbeitung" : "offen";
  vehicle.handoverTimer = scheduleTimeout(() => clearVehicle(vehicle.id), simulationDelay(handoverMinutes()));
  logRadio(`${vehicle.name}: Folgeeinsatz zurückgenommen, bleibt zunächst am Krankenhaus.`, "warn");
  renderAll();
}

function canRemoveAssignedVehicle(vehicle, incident) {
  return vehicle.nextIncidentId === incident.id || (vehicle.incidentId === incident.id && vehicle.status === 3);
}

function detachVehicleFromIncident(vehicleId, incidentId) {
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!incident) return;
  incident.assigned = incident.assigned.filter((id) => id !== vehicleId);
  clearTransportRequest(incident, null, vehicleId);
  if (incident.status !== "geschlossen") {
    incident.status = incident.assigned.length ? "in Bearbeitung" : "offen";
  }
}

function removeAssignedVehicle(vehicleId, incidentId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const incident = state.incidents.find((item) => item.id === incidentId);
  if (!vehicle || !incident || !canRemoveAssignedVehicle(vehicle, incident)) return;

  if (vehicle.dispatchTimer) {
    clearTimeout(vehicle.dispatchTimer);
    state.timeouts = state.timeouts.filter((timer) => timer !== vehicle.dispatchTimer);
  }
  if (vehicle.status === 3) {
    cancelVehicleRoute(vehicle);
    vehicle.status = 1;
    vehicle.statusText = "frei nach Rücknahme";
    vehicle.incidentId = null;
  } else {
    vehicle.statusText = vehicle.status === 8 ? "am Krankenhaus" : statusTextForIdleVehicle(vehicle);
    vehicle.incidentId = vehicle.previousIncidentId || null;
    if (vehicle.status === 8 && !vehicle.handoverTimer) {
      vehicle.handoverTimer = scheduleTimeout(() => clearVehicle(vehicle.id), simulationDelay(handoverMinutes()));
    }
  }
  vehicle.dispatchTimer = null;
  vehicle.nextIncidentId = null;
  vehicle.previousIncidentId = null;
  vehicle.pendingDispatchUntil = null;
  vehicle.pendingDispatchDelay = null;
  vehicle.radioStatus = null;
  vehicle.radioMessage = "";
  vehicle.awaitingSpeechPrompt = false;
  vehicle.waitingForSpeechPrompt = false;
  vehicle.pendingTransportRequest = null;
  incident.assigned = incident.assigned.filter((id) => id !== vehicle.id);
  incident.status = incident.assigned.length ? "in Bearbeitung" : "offen";
  logRadio(`${vehicle.name}: vom Einsatz ${incident.keyword} zurückgenommen.`, "warn");
  renderDialogVehicles(incident, incident);
  renderAll();
}

function statusTextForIdleVehicle(vehicle) {
  if (vehicle.status === 1) return "frei über Funk";
  if (vehicle.status === 2) return "auf Wache";
  return vehicle.statusText || "frei";
}

function renderDialogVehicles(call, incident = null) {
  el.dialogVehicleList.innerHTML = "";
  const assignedIds = new Set(incident?.assigned || []);
  const unavailableIds = new Set([...assignedIds, ...state.selectedDialogVehicleIds]);
  renderQuickVehicleButtons(call, unavailableIds, incident);
  if (assignedIds.size) {
    const assigned = document.createElement("section");
    assigned.className = "assigned-vehicles-note";
    const title = document.createElement("strong");
    title.textContent = "Bereits zugeordnet";
    assigned.append(title);
    [...assignedIds].forEach((id) => {
      const vehicle = state.vehicles.find((unit) => unit.id === id);
      if (!vehicle) return;
      const line = document.createElement("div");
      line.className = "assigned-vehicle-line";
      line.innerHTML = `<span>${escapeHtml(vehicle.name)} | Status ${vehicle.status}${vehicle.nextIncidentId === incident.id ? " | alarmiert" : ""}</span>`;
      if (canRemoveAssignedVehicle(vehicle, incident)) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "entfernen";
        button.addEventListener("click", () => removeAssignedVehicle(vehicle.id, incident.id));
        line.append(button);
      }
      assigned.append(line);
    });
    el.dialogVehicleList.append(assigned);
  }
  state.vehicles
    .filter((vehicle) => isAlarmable(vehicle) && !assignedIds.has(vehicle.id))
    .sort((a, b) => distanceToCall(a, call) - distanceToCall(b, call))
    .forEach((vehicle) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `dialog-vehicle-row ${state.selectedDialogVehicleIds.has(vehicle.id) ? "selected" : ""}`;
      row.innerHTML = `
        <div>
          <h3><span class="vehicle-type-badge">${escapeHtml(vehicle.type)}</span> ${escapeHtml(vehicle.name)}</h3>
          <p>${escapeHtml(vehicle.station)} | ${distanceToCall(vehicle, call).toFixed(1).replace(".", ",")} km | ${escapeHtml(vehicle.statusText)}</p>
        </div>
        <span class="status-pill status-${vehicle.status}">${vehicle.status}</span>
      `;
      row.addEventListener("click", () => {
        if (state.selectedDialogVehicleIds.has(vehicle.id)) {
          state.selectedDialogVehicleIds.delete(vehicle.id);
          row.classList.remove("selected");
        } else {
          state.selectedDialogVehicleIds.add(vehicle.id);
          row.classList.add("selected");
        }
      });
      el.dialogVehicleList.append(row);
    });
}

function renderQuickVehicleButtons(call, assignedIds, incident = null) {
  const wrapper = document.createElement("section");
  wrapper.className = "quick-vehicle-picker";
  ["RTW", "KTW", "NEF"].forEach((type) => {
    const vehicle = nearestFreeVehicleOfType(call, type, assignedIds);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = vehicle ? `nächster ${type}: ${vehicle.shortName || vehicle.name}` : `kein ${type} frei`;
    button.disabled = !vehicle;
    button.addEventListener("click", () => {
      if (!vehicle) return;
      if (state.selectedDialogVehicleIds.has(vehicle.id)) state.selectedDialogVehicleIds.delete(vehicle.id);
      else state.selectedDialogVehicleIds.add(vehicle.id);
      renderDialogVehicles(call, incident);
    });
    wrapper.append(button);
  });
  el.dialogVehicleList.append(wrapper);
}

function nearestFreeVehicleOfType(call, type, assignedIds) {
  return state.vehicles
    .filter((vehicle) => !assignedIds.has(vehicle.id) && isAlarmable(vehicle) && vehicle.type === type)
    .sort((a, b) => distanceToCall(a, call) - distanceToCall(b, call))[0];
}

function renderVehicles() {
  const sorted = [...state.vehicles].sort((a, b) => {
    if (el.vehicleSort.value === "status") return a.status - b.status || a.name.localeCompare(b.name);
    if (el.vehicleSort.value === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    return a.station.localeCompare(b.station) || a.name.localeCompare(b.name);
  });

  el.vehicleList.innerHTML = "";
  sorted.forEach((vehicle) => {
    const isOpen = vehicle.id === state.selectedVehicleId;
    const row = document.createElement("article");
    row.className = `vehicle-row ${isOpen ? "active" : ""} ${vehicle.shiftWarning ? "shift-warning" : ""}`;
    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "vehicle-summary";
    summary.innerHTML = `
      <strong>${escapeHtml(vehicle.name)}</strong>
      <span class="vehicle-type-label">${escapeHtml(vehicle.type)}</span>
      <span>${escapeHtml(vehicle.station)}</span>
      <em class="status-pill status-${vehicle.status}">${vehicle.status}</em>
    `;
    summary.addEventListener("click", () => {
      state.selectedVehicleId = isOpen ? null : vehicle.id;
      renderVehicles();
    });
    row.append(summary);
    if (isOpen) {
      const details = document.createElement("div");
      details.className = "vehicle-details";
      appendTextBlock(details, "p", `${vehicle.statusText}${vehicle.radioMessage ? ` | ${vehicle.radioMessage}` : ""}`);
      if (vehicle.shortName && vehicle.shortName !== vehicle.name) appendTextBlock(details, "p", `Kurz: ${vehicle.shortName}`);
    if (vehicle.shift) appendTextBlock(details, "p", `Schicht: ${vehicle.shift}`);
      if (vehicle.shiftWarning) appendTextBlock(details, "p", "Schichtende überschritten, Wechsel erst an der Wache möglich.");
      const actions = document.createElement("div");
      actions.className = "vehicle-actions";
      addVehicleAction(actions, "Orten", () => locateVehicle(vehicle.id));
      if (vehicle.radioStatus === 5) addVehicleAction(actions, "J", () => sendSpeechPrompt(vehicle.id));
      if (vehicle.radioStatus === 0) addVehicleAction(actions, "Sprechwunsch annehmen", () => sendSpeechPrompt(vehicle.id));
      if (vehicle.status === 1) addVehicleAction(actions, "Status H", () => sendVehicleHome(vehicle.id));
      if (vehicle.status === 3) addVehicleAction(actions, "Einsatzabbruch (E)", () => abortVehicleMission(vehicle.id));
      if (vehicle.status === 7) addVehicleAction(actions, "Zielort ändern", () => changeTransportDestination(vehicle.id));
      if (canReleaseAccompanyingDoctor(vehicle)) addVehicleAction(actions, "abkömmlich frei", () => releaseAccompanyingDoctor(vehicle.id));
      if (vehicle.status === 8) addVehicleAction(actions, "Einsatzklar?", () => clearVehicle(vehicle.id));
      details.append(actions);
      row.append(details);
    }
    el.vehicleList.append(row);
  });
}

function addVehicleAction(parent, label, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    handler();
  });
  parent.append(button);
}

function locateVehicle(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || !state.mapReady) return;
  state.map.setView([vehicle.lat, vehicle.lng], 15);
  logRadio(`${vehicle.name}: Ortung gesendet, aktuelle Position auf Karte markiert.`, "radio");
}

function queryVehicleStatus(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle) return;
  const reachable = [1, 3, 7].includes(vehicle.status);
  logRadio(reachable
    ? `${vehicle.name}: Status bestätigt (${vehicle.status} - ${vehicle.statusText}).`
    : `${vehicle.name}: keine Antwort auf Statusabfrage.`, reachable ? "radio" : "warn");
}

function sendVehicleHome(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 1) return;
  const station = state.center.stations.find((item) => item.id === vehicle.stationId);
  cancelVehicleRoute(vehicle);
  vehicle.coveragePointId = null;
  logRadio(`${vehicle.name}: Leitstellenstatus H, Rückfahrt zur Wache.`, "radio");
  driveVehicleTo(vehicle, station, { signal: false, phase: "station" }, () => returnToStation(vehicle.id));
}

function abortVehicleMission(vehicleId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  if (!vehicle || vehicle.status !== 3) return;
  const incident = state.incidents.find((item) => item.id === vehicle.incidentId);
  cancelVehicleRoute(vehicle);
  vehicle.status = 1;
  vehicle.statusText = "frei nach Einsatzabbruch";
  if (incident) {
    incident.assigned = incident.assigned.filter((id) => id !== vehicle.id);
    incident.status = incident.assigned.length ? "in Bearbeitung" : "offen";
  }
  logRadio(`${vehicle.name}: Leitstellenstatus E, Einsatzabbruch bestätigt.`, "warn");
  renderAll();
}

function openCoverageDialog() {
  renderCoverageDialog();
  showDialog(el.coverageDialog);
}

function renderCoverageDialog() {
  const available = state.vehicles.filter((vehicle) => [1, 2].includes(vehicle.status) && !vehicle.nextIncidentId);
  el.coverageList.innerHTML = "";
  if (!available.length) {
    el.coverageList.className = "coverage-list empty-state";
    el.coverageList.textContent = "Keine freien Fahrzeuge für Gebietsabsicherung verfügbar.";
    return;
  }
  el.coverageList.className = "coverage-list";
  state.coveragePoints.forEach((point) => {
    const row = document.createElement("article");
    row.className = "coverage-row";
    const nearest = available
      .map((vehicle) => ({ vehicle, distance: mapDistance(vehicle.lat, vehicle.lng, point.lat, point.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(point.label)}</h3>
        <p>${nearest.length ? `Vorschlag: ${escapeHtml(nearest[0].vehicle.name)} (${nearest[0].distance.toFixed(1).replace(".", ",")} km)` : "kein freies Fahrzeug"}</p>
      </div>
    `;
    const actions = document.createElement("div");
    actions.className = "row-actions";
    nearest.forEach(({ vehicle }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = vehicle.name;
      button.addEventListener("click", () => sendVehicleToCoverage(vehicle.id, point.id));
      actions.append(button);
    });
    row.append(actions);
    el.coverageList.append(row);
  });
}

function sendVehicleToCoverage(vehicleId, pointId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const point = state.coveragePoints.find((item) => item.id === pointId);
  if (!vehicle || !point || ![1, 2].includes(vehicle.status)) return;
  if (vehicle.status === 2) vehicle.status = 1;
  vehicle.statusText = `Gebietsabsicherung ${point.label}`;
  vehicle.coveragePointId = point.id;
  logRadio(`${vehicle.name}: Gebietsabsicherung ${point.label}.`, "radio");
  renderAll();
  driveVehicleTo(vehicle, point, { signal: false, phase: "coverage" }, () => arriveAtCoverage(vehicle.id, point.id));
  renderCoverageDialog();
}

function arriveAtCoverage(vehicleId, pointId) {
  const vehicle = state.vehicles.find((unit) => unit.id === vehicleId);
  const point = state.coveragePoints.find((item) => item.id === pointId);
  if (!vehicle || !point) return;
  vehicle.status = 1;
  vehicle.statusText = `steht zur Gebietsabsicherung: ${point.label}`;
  vehicle.lat = point.lat;
  vehicle.lng = point.lng;
  vehicle.target = null;
  vehicle.route = null;
  vehicle.routeMeta = null;
  logRadio(`${vehicle.name}: Gebietsabsicherung ${point.label} erreicht.`, "radio");
  renderAll();
}

function openEditor() {
  window.location.href = "editor.html";
  return;
  el.editorMapName.value = state.center.name;
  state.editingMapPointId = null;
  el.addMapPointButton.textContent = "Punkt hinzufügen";
  updateEditorVehicleControls();
  fillEditorFromMapCenter();
  renderEditorPoints();
  renderSavedMaps();
  showDialog(el.editorDialog);
}

function openIncidentEditor() {
  window.location.href = "incident-editor.html";
}

function fillEditorFromMapCenter() {
  const center = state.mapReady ? state.map.getCenter() : { lat: state.center.mapCenter[0], lng: state.center.mapCenter[1] };
  el.editorLat.value = center.lat.toFixed(6);
  el.editorLng.value = center.lng.toFixed(6);
}

function addEditorPoint() {
  const type = el.editorType.value;
  const label = el.editorName.value.trim();
  const lat = Number(el.editorLat.value.replace(",", "."));
  const lng = Number(el.editorLng.value.replace(",", "."));
  if (!label || Number.isNaN(lat) || Number.isNaN(lng)) return;

  const vehicles = editorVehicleCounts();
  if (state.editingMapPointId) {
    updateEditorPoint(state.editingMapPointId, { label, lat, lng, type, vehicles });
    return;
  }

  const point = { id: makeId(), label, lat, lng, type, vehicles };
  state.editorPoints.push(point);
  if (type === "station") {
    const station = { id: point.id, label, address: "eigener Kartenpunkt", lat, lng, vehicles };
    state.center.stations.push(station);
    addStationVehicles(station);
  } else {
    state.center.hospitals.push({ id: point.id, label, lat, lng });
  }

  el.editorName.value = "";
  renderEditorPoints();
  renderAll();
}

function editorVehicleCounts() {
  if (el.editorType.value !== "station") return {};
  return {
    RTW: Math.max(0, Number(el.editorRtw.value) || 0),
    KTW: Math.max(0, Number(el.editorKtw.value) || 0),
    NEF: Math.max(0, Number(el.editorNef.value) || 0),
    REF: Math.max(0, Number(el.editorRef.value) || 0),
    RTH: Math.max(0, Number(el.editorRth.value) || 0)
  };
}

function updateEditorVehicleControls() {
  const disabled = el.editorType.value !== "station";
  [el.editorRtw, el.editorKtw, el.editorNef, el.editorRef, el.editorRth].forEach((input) => {
    input.disabled = disabled;
  });
}

function updateEditorPoint(pointId, data) {
  const oldStationIndex = state.center.stations.findIndex((station) => station.id === pointId);
  const oldHospitalIndex = state.center.hospitals.findIndex((hospital) => hospital.id === pointId);
  if (oldStationIndex >= 0) state.center.stations.splice(oldStationIndex, 1);
  if (oldHospitalIndex >= 0) state.center.hospitals.splice(oldHospitalIndex, 1);

  if (data.type === "station") {
    const station = {
      id: pointId,
      label: data.label,
      address: "eigener Kartenpunkt",
      lat: data.lat,
      lng: data.lng,
      vehicles: data.vehicles
    };
    state.center.stations.push(station);
    syncStationVehicles(station);
  } else {
    state.center.hospitals.push({ id: pointId, label: data.label, address: "eigener Kartenpunkt", lat: data.lat, lng: data.lng });
    state.vehicles = state.vehicles.filter((vehicle) => vehicle.stationId !== pointId || vehicle.incidentId || vehicle.nextIncidentId);
  }

  state.editingMapPointId = null;
  el.addMapPointButton.textContent = "Punkt hinzufügen";
  el.editorName.value = "";
  renderEditorPoints();
  renderAll();
}

function createBlankMap() {
  const center = state.mapReady ? state.map.getCenter() : { lat: state.center.mapCenter[0], lng: state.center.mapCenter[1] };
  const name = el.editorMapName.value.trim() || "Neue Karte";
  state.center = {
    name,
    weather: state.center.weather,
    mapCenter: [center.lat, center.lng],
    zoom: state.mapReady ? state.map.getZoom() : 13,
    stations: [],
    hospitals: []
  };
  ensureHospitalDepartments(state.center);
  state.vehicles = [];
  state.incidents = [];
  state.pendingCall = null;
  state.selectedIncidentId = null;
  state.editorPoints = [];
  state.editingMapPointId = null;
  el.activeCenter.textContent = state.center.name;
  clearLogs();
  logCall("Neue leere Karte angelegt.", "call");
  logRadio("Keine Fahrzeuge vorhanden. Bitte Wachen im Editor hinzufügen.", "warn");
  renderEditorPoints();
  renderAll();
  repairMapSize();
}

function saveCurrentMap() {
  const name = el.editorMapName.value.trim() || state.center.name;
  const saved = readSavedMaps().filter((map) => map.id !== state.center.id && map.name !== name);
  const mapData = {
    id: state.center.id || makeId(),
    name,
    weather: state.center.weather,
    mapCenter: state.mapReady ? [state.map.getCenter().lat, state.map.getCenter().lng] : state.center.mapCenter,
    zoom: state.mapReady ? state.map.getZoom() : state.center.zoom,
    stations: state.center.stations,
    hospitals: state.center.hospitals
  };
  state.center = structuredClone(mapData);
  ensureHospitalDepartments(state.center);
  saved.push(mapData);
  localStorage.setItem("dispatchsim.maps", JSON.stringify(saved));
  el.activeCenter.textContent = state.center.name;
  renderSavedMaps();
  logCall(`Karte gespeichert: ${name}.`, "call");
}

function readSavedMaps() {
  try {
    return JSON.parse(localStorage.getItem("dispatchsim.maps") || "[]");
  } catch {
    return [];
  }
}

function renderSavedMaps() {
  const maps = readSavedMaps();
  el.savedMapList.innerHTML = "";
  if (!maps.length) {
    el.savedMapList.className = "editor-point-list empty-state";
    el.savedMapList.textContent = "Noch keine gespeicherten Karten.";
    return;
  }

  el.savedMapList.className = "editor-point-list";
  maps.forEach((mapData) => {
    const row = document.createElement("article");
    row.className = "editor-point";
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(mapData.name)}</h3>
        <p>${mapData.stations.length} Wachen | ${mapData.hospitals.length} Kliniken</p>
      </div>
    `;
    const actions = document.createElement("div");
    actions.className = "row-actions";
    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Laden";
    loadButton.addEventListener("click", () => loadSavedMap(mapData.id));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", () => deleteSavedMap(mapData.id));
    actions.append(loadButton, deleteButton);
    row.append(actions);
    el.savedMapList.append(row);
  });
}

function loadSavedMap(mapId) {
  const mapData = readSavedMaps().find((item) => item.id === mapId);
  if (!mapData) return;
  state.center = structuredClone(mapData);
  state.vehicles = seedVehicles(state.center);
  state.incidents = [];
  state.pendingCall = null;
  state.selectedIncidentId = null;
  state.editingMapPointId = null;
  state.editorPoints = mapData.stations.concat(mapData.hospitals).map((point) => ({
    ...point,
    type: state.center.stations.some((station) => station.id === point.id) ? "station" : "hospital"
  }));
  el.editorMapName.value = state.center.name;
  el.activeCenter.textContent = state.center.name;
  if (state.mapReady) state.map.setView(state.center.mapCenter, state.center.zoom);
  renderEditorPoints();
  renderAll();
  logCall(`Karte geladen: ${state.center.name}.`, "call");
}

function deleteSavedMap(mapId) {
  localStorage.setItem("dispatchsim.maps", JSON.stringify(readSavedMaps().filter((item) => item.id !== mapId)));
  renderSavedMaps();
}

function addStationVehicles(station) {
  const stationNumber = state.center.stations.length;
  if (Array.isArray(station.units) && station.units.length) {
    station.units.forEach((unit, index) => {
      const type = unit.type || unit.name?.split(" ")[0]?.toUpperCase() || "RTW";
      const name = unit.fullName || unit.name || `${type} ${stationNumber}/${index + 1}`;
      state.vehicles.push({
        id: `${type}-${stationNumber}-${index + 1}-${makeId()}`,
        name,
        shortName: unit.shortName || unit.short || name,
        shift: unit.shift || "",
        type,
        label: vehicleTypeLabel(type),
        station: station.label,
        stationId: station.id,
        status: 2,
        statusText: "auf Wache",
        lat: station.lat + index * 0.00045,
        lng: station.lng + index * 0.00045,
        target: null,
        incidentId: null,
        radioStatus: null,
        radioMessage: "",
        awaitingSpeechPrompt: false,
        waitingForSpeechPrompt: false,
        pendingTransportRequest: null,
        coveragePointId: null
      });
    });
    return;
  }
  Object.entries(station.vehicles || { RTW: 1 }).forEach(([type, count]) => {
    for (let index = 0; index < count; index += 1) {
      state.vehicles.push({
        id: `${type}-${stationNumber}-${index + 1}-${makeId()}`,
        name: `${type} ${stationNumber}/${index + 1}`,
        shortName: `${type} ${stationNumber}/${index + 1}`,
        shift: "",
        type,
        label: vehicleTypeLabel(type),
        station: station.label,
        stationId: station.id,
        status: 2,
        statusText: "auf Wache",
        lat: station.lat + index * 0.00045,
        lng: station.lng + index * 0.00045,
        target: null,
        incidentId: null,
        radioStatus: null,
        radioMessage: "",
        awaitingSpeechPrompt: false,
        waitingForSpeechPrompt: false,
        pendingTransportRequest: null,
        coveragePointId: null
      });
    }
  });
}

function syncStationVehicles(station) {
  const active = state.vehicles.filter((vehicle) => vehicle.stationId === station.id && (vehicle.incidentId || vehicle.nextIncidentId || vehicle.routeMeta));
  state.vehicles = state.vehicles.filter((vehicle) => vehicle.stationId !== station.id || active.includes(vehicle));
  const stationNumber = state.center.stations.findIndex((item) => item.id === station.id) + 1;
  const activeCounts = active.reduce((counts, vehicle) => {
    counts[vehicle.type] = (counts[vehicle.type] || 0) + 1;
    vehicle.station = station.label;
    return counts;
  }, {});
  Object.entries(station.vehicles || {}).forEach(([type, desired]) => {
    const missing = Math.max(0, desired - (activeCounts[type] || 0));
    for (let index = 0; index < missing; index += 1) {
      state.vehicles.push({
        id: `${type}-${stationNumber}-${index + 1}-${makeId()}`,
        name: `${type} ${stationNumber}/${index + 1}`,
        shortName: `${type} ${stationNumber}/${index + 1}`,
        shift: "",
        type,
        label: vehicleTypeLabel(type),
        station: station.label,
        stationId: station.id,
        status: 2,
        statusText: "auf Wache",
        lat: station.lat + index * 0.00045,
        lng: station.lng + index * 0.00045,
        target: null,
        incidentId: null,
        radioStatus: null,
        radioMessage: "",
        awaitingSpeechPrompt: false,
        waitingForSpeechPrompt: false,
        pendingTransportRequest: null,
        coveragePointId: null
      });
    }
  });
}

function renderEditorPoints() {
  el.editorPointList.innerHTML = "";
  const points = [
    ...state.center.stations.map((point) => ({ ...point, type: "station" })),
    ...state.center.hospitals.map((point) => ({ ...point, type: "hospital" }))
  ];
  if (!points.length) {
    el.editorPointList.className = "editor-point-list empty-state";
    el.editorPointList.textContent = "Noch keine eigenen Punkte.";
    return;
  }

  el.editorPointList.className = "editor-point-list";
  points.forEach((point) => {
    const row = document.createElement("article");
    row.className = "editor-point";
    const vehicleText = point.type === "station"
      ? ` | ${Object.entries(point.vehicles || {}).filter(([, count]) => count > 0).map(([type, count]) => `${count} ${type}`).join(", ") || "keine Fzg"}`
      : "";
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(point.label)}</h3>
        <p>${point.type === "station" ? "Rettungswache" : "Klinik"} | ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}${escapeHtml(vehicleText)}</p>
      </div>
    `;
    const actions = document.createElement("div");
    actions.className = "row-actions";
    const showButton = document.createElement("button");
    showButton.type = "button";
    showButton.textContent = "Anzeigen";
    showButton.addEventListener("click", () => {
      if (state.mapReady) state.map.setView([point.lat, point.lng], 15);
    });
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Bearbeiten";
    editButton.addEventListener("click", () => editMapPoint(point));
    actions.append(showButton, editButton);
    row.append(actions);
    el.editorPointList.append(row);
  });
}

function editMapPoint(point) {
  state.editingMapPointId = point.id;
  el.editorType.value = point.type;
  el.editorName.value = point.label;
  el.editorLat.value = point.lat.toFixed(6);
  el.editorLng.value = point.lng.toFixed(6);
  el.editorRtw.value = point.vehicles?.RTW || 0;
  el.editorKtw.value = point.vehicles?.KTW || 0;
  el.editorNef.value = point.vehicles?.NEF || 0;
  el.editorRef.value = point.vehicles?.REF || 0;
  el.editorRth.value = point.vehicles?.RTH || 0;
  el.addMapPointButton.textContent = "Punkt speichern";
  updateEditorVehicleControls();
}

function unitName(id) {
  return state.vehicles.find((unit) => unit.id === id)?.name || id;
}

function clearLogs() {
  el.callLog.innerHTML = "";
  el.radioLog.innerHTML = "";
  el.callActions.innerHTML = "";
}

function logCall(message, kind = "call") {
  appendLog(el.callLog, message, kind);
}

function logRadio(message, kind = "radio") {
  appendLog(el.radioLog, message, kind);
}

function appendLog(container, message, kind) {
  const entry = document.createElement("article");
  entry.className = `log-entry ${kind} ${logToneClass(message)}`;
  const paragraph = document.createElement("p");
  const time = document.createElement("strong");
  time.textContent = timeLabel();
  paragraph.append(time, " ");
  appendStatusFormattedText(paragraph, message);
  entry.append(paragraph);
  container.prepend(entry);
}

function appendStatusFormattedText(parent, message) {
  const parts = String(message).split(/(Status\s+\d+)/g);
  parts.forEach((part) => {
    if (!part) return;
    if (/^Status\s+\d+$/.test(part)) {
      const strong = document.createElement("strong");
      strong.textContent = part;
      parent.append(strong);
    } else {
      parent.append(part);
    }
  });
}

function logToneClass(message) {
  if (message.includes("Status 0")) return "radio-critical";
  if (message.includes("Nachforderung")) return "radio-critical";
  if (message.includes("Status 5") || message.includes("Sprechaufforderung")) return "radio-speech";
  if (message.includes("Neuer Einsatz") || message.includes("Neuer Telefonanruf")) return "radio-new";
  return "";
}

function appendTextBlock(parent, tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  parent.append(node);
}

function timeLabel() {
  const displayMinute = Math.floor(state.minute);
  const hours = String(Math.floor(displayMinute / 60)).padStart(2, "0");
  const minutes = String(displayMinute % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function distanceToIncident(vehicle, incident) {
  const lat = Number.isFinite(incident.lat) ? incident.lat : state.center.mapCenter[0];
  const lng = Number.isFinite(incident.lng) ? incident.lng : state.center.mapCenter[1];
  return mapDistance(vehicle.lat, vehicle.lng, lat, lng);
}

function distanceToCall(vehicle, call) {
  const lat = Number.isFinite(call.lat) ? call.lat : state.center.mapCenter[0];
  const lng = Number.isFinite(call.lng) ? call.lng : state.center.mapCenter[1];
  return mapDistance(vehicle.lat, vehicle.lng, lat, lng);
}

function mapDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return value * Math.PI / 180;
}

function makeId() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function showDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function makeDialogDraggable(dialog) {
  const card = dialog?.querySelector(".modal-card");
  const header = dialog?.querySelector(".modal-header");
  if (!card || !header) return;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = card.getBoundingClientRect();
    dragging = true;
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    card.classList.add("draggable-modal");
    card.style.left = `${rect.left}px`;
    card.style.top = `${rect.top}px`;
    header.setPointerCapture(event.pointerId);
  });
  header.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    card.style.left = `${Math.max(8, Math.min(window.innerWidth - 80, event.clientX - offsetX))}px`;
    card.style.top = `${Math.max(8, Math.min(window.innerHeight - 60, event.clientY - offsetY))}px`;
  });
  header.addEventListener("pointerup", () => {
    dragging = false;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

