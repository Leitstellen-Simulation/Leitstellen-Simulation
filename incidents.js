window.incidentCatalog = [
  {
    id: "acs",
    title: "Akutes Koronarsyndrom",
    type: "emergency",
    keyword: "RD 2 Herz/Kreislauf - vitale Bedrohung",
    variants: [
      {
        callerName: "Herr Lehner",
        callerText: "Meine Frau hat starke Schmerzen in der Brust, ist blass und kaltschweissig. Es drueckt bis in den linken Arm.",
        location: "Maximilianstrasse 18, Regensburg",
        lat: 49.0177,
        lng: 12.0985,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "cardiology",
        patientCount: 1,
        report: "ACS-Verdacht, kreislaufstabil nach Erstversorgung, Monitoring erforderlich.",
        signal: true
      },
      {
        callerName: "Praxis Dr. Kern",
        callerText: "Patient mit Thoraxschmerz und auffaelligem EKG, bitte RTW und Notarzt.",
        location: "Pruefeninger Strasse 42, Regensburg",
        lat: 49.0177,
        lng: 12.0801,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "cardiology",
        patientCount: 1,
        report: "STEMI-Verdacht, Notarzt begleitet, Herzkatheterbereitschaft sinnvoll.",
        signal: true
      }
    ]
  },
  {
    id: "stroke",
    title: "Schlaganfall",
    type: "emergency",
    keyword: "RD 2 Neuro/Psych - Neuro vitale Bedrohung",
    variants: [
      {
        callerName: "Frau Schmid",
        callerText: "Mein Vater spricht verwaschen und der Mundwinkel haengt. Beginn vor etwa 25 Minuten.",
        location: "Landshuter Strasse 22, Regensburg",
        lat: 49.0109,
        lng: 12.1087,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "neurology",
        patientCount: 1,
        report: "FAST positiv, Lysefenster offen, Stroke Unit benoetigt.",
        signal: true
      }
    ]
  },
  {
    id: "trauma",
    title: "Trauma / Verkehrsunfall",
    type: "emergency",
    keyword: "RD 2 Trauma - vitale Bedrohung Verkehrsunfall nur RD",
    variants: [
      {
        callerName: "Polizei Regensburg",
        callerText: "Verkehrsunfall an der Nibelungenbruecke, eingeklemmte Person nicht bestaetigt, eine schwer verletzte Person.",
        location: "Nibelungenbruecke, Regensburg",
        lat: 49.0204,
        lng: 12.1129,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "trauma",
        patientCount: 1,
        report: "Polytrauma moeglich, Schockraum sinnvoll.",
        handoffOptions: ["FW", "POL"],
        signal: true
      },
      {
        callerName: "Ersthelfer",
        callerText: "Radfahrer nach Sturz bewusstlos, Helm gebrochen, starke Blutung am Kopf.",
        location: "Donauradweg, Steinerne Bruecke, Regensburg",
        lat: 49.0218,
        lng: 12.0975,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "trauma",
        patientCount: 1,
        report: "SHT-Verdacht, GCS reduziert, Schockraum/CT erforderlich.",
        signal: true
      }
    ]
  },
  {
    id: "rth-trauma",
    title: "Schweres Trauma mit RTH",
    type: "emergency",
    keyword: "RD 2 Trauma - vitale Bedrohung Person schwer verletzt",
    variants: [
      {
        callerName: "Leitstelle Nachbarbereich",
        callerText: "Schwerer Arbeitsunfall ausserhalb der Stadt, RTH-Anforderung wegen langer Fahrzeit.",
        location: "Gewerbegebiet Regenstauf",
        lat: 49.1210,
        lng: 12.1304,
        required: ["RTW", "RTH"],
        requiredDepartmentKey: "trauma",
        patientCount: 1,
        report: "Schweres Trauma, luftgebundener Transport indiziert.",
        handoffOptions: ["FW", "POL"],
        signal: true
      }
    ]
  },
  {
    id: "pediatric",
    title: "Kind erkrankt",
    type: "emergency",
    keyword: "RD 2-KIND Kind erkrankt - vitale Bedrohung",
    variants: [
      {
        callerName: "Herr Albrecht",
        callerText: "Unser Kind ist sehr matt, hohes Fieber, reagiert kaum.",
        location: "Kumpfmuehler Strasse 39, Regensburg",
        lat: 49.0056,
        lng: 12.0912,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "pediatrics",
        patientCount: 1,
        report: "Reduziertes Kind, paediatrische Notaufnahme erforderlich.",
        signal: true
      }
    ]
  },
  {
    id: "respiratory",
    title: "Atemnot",
    type: "emergency",
    keyword: "RD 2 Atmung - vitale Bedrohung",
    variants: [
      {
        callerName: "Herr Schneider",
        callerText: "Mein Vater bekommt schlecht Luft, kann kaum sprechen und ist sehr unruhig.",
        location: "Pruefeninger Strasse 74, Regensburg",
        lat: 49.0189,
        lng: 12.0727,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "internal",
        patientCount: 1,
        report: "Dyspnoe, Sauerstoffpflicht, internistische Ueberwachung benoetigt.",
        signal: true
      }
    ]
  },
  {
    id: "minor-ref",
    title: "Ambulante Einschaetzung REF",
    type: "emergency",
    keyword: "RD 1 Sonstige - Ereignis/Zustand",
    variants: [
      {
        callerName: "Hausnotruf",
        callerText: "Teilnehmerin gestuerzt, steht wieder, moechte aber einmal angeschaut werden.",
        location: "Ostengasse 12, Regensburg",
        lat: 49.0211,
        lng: 12.1028,
        required: ["REF"],
        requiredDepartmentKey: "none",
        patientCount: 1,
        report: "Ambulante Einschaetzung, kein Transport absehbar.",
        noTransportLikely: true,
        signal: false
      },
      {
        callerName: "Pflegedienst",
        callerText: "Patientin mit unklarer Schwäche, vermutlich kein Transport, bitte Einschaetzung.",
        location: "Weichser Weg 5, Regensburg",
        lat: 49.0281,
        lng: 12.1084,
        required: ["REF"],
        requiredDepartmentKey: "none",
        patientCount: 1,
        report: "REF-Einschaetzung, bei Transportbedarf RTW oder KTW nachfordern.",
        noTransportLikely: true,
        signal: false
      }
    ]
  },
  {
    id: "ref-plus-ktw",
    title: "REF mit Transportbedarf",
    type: "transport",
    keyword: "RD KTP/RTW - mit RTW",
    variants: [
      {
        callerName: "REF 9/1",
        callerText: "Nach ambulanter Einschaetzung doch Transportbedarf, Patient stabil und sitzend.",
        location: "Guerickestrasse 8, Regensburg",
        lat: 49.0140,
        lng: 12.1300,
        required: ["REF", "KTW"],
        requiredDepartmentKey: "emergency",
        patientCount: 1,
        report: "Transport nach REF-Einschaetzung, KTW ausreichend.",
        signal: false
      }
    ]
  },
  {
    id: "ktp-dialysis",
    title: "Dialysefahrt",
    type: "scheduled",
    keyword: "RD KTP - Dialyse",
    variants: [
      {
        callerName: "Dialysezentrum Regensburg",
        callerText: "Ruecktransport nach Dialyse, sitzend, keine Sonderrechte.",
        location: "Dialysezentrum, Friedenstrasse 10, Regensburg",
        lat: 49.0116,
        lng: 12.1144,
        required: ["KTW"],
        requiredDepartmentKey: "none",
        patientCount: 1,
        report: "KTP Dialyse, Patient stabil.",
        fixedDestination: {
          label: "Wohnadresse Dialysepatient",
          lat: 49.0240,
          lng: 12.0860,
          type: "home"
        },
        signal: false
      }
    ]
  },
  {
    id: "ktp-ambulance",
    title: "Ambulanzfahrt",
    type: "transport",
    keyword: "RD KTP - Ambulanzfahrt",
    variants: [
      {
        callerName: "Station 3B",
        callerText: "Liegender Transport vom St. Josef zur ambulanten Untersuchung. Patient stabil.",
        location: "Caritas-Krankenhaus St. Josef, Regensburg",
        lat: 49.0067,
        lng: 12.1114,
        required: ["KTW"],
        requiredDepartmentKey: "emergency",
        patientCount: 1,
        report: "Liegender KTP, stabil.",
        fixedDestinationId: "kh-barmherzige",
        signal: false
      }
    ]
  },
  {
    id: "obstetrics",
    title: "Geburt akut",
    type: "emergency",
    keyword: "RD 2 Sonstige - Geburt/Entbindung akut",
    variants: [
      {
        callerName: "Herr Braun",
        callerText: "Meine Frau hat starke Wehen, Fruchtblase geplatzt, Geburt kommt sehr schnell.",
        location: "Hildegard-von-Bingen-Strasse 4, Regensburg",
        lat: 49.0003,
        lng: 12.1184,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "obstetrics",
        patientCount: 2,
        report: "Geburt akut, geburtshilfliche Klinik erforderlich.",
        signal: true
      }
    ]
  },
  {
    id: "psychiatric",
    title: "Psychische Krise",
    type: "emergency",
    keyword: "RD 1 Neuro/Psych - Psych",
    variants: [
      {
        callerName: "Polizei Regensburg",
        callerText: "Akute Eigengefaehrdung, Person kooperativ, Rettungsdienst zur Beurteilung.",
        location: "Bahnhofstrasse 18, Regensburg",
        lat: 49.0121,
        lng: 12.0995,
        required: ["RTW"],
        requiredDepartmentKey: "psychiatry",
        patientCount: 1,
        report: "Psychiatrische Vorstellung, Polizei vor Ort.",
        handoffOptions: ["POL", "AEND"],
        signal: false
      }
    ]
  },
  {
    id: "intox",
    title: "Intoxikation",
    type: "emergency",
    keyword: "RD 2 Sonstige - Intoxikation vitale Bedrohung",
    variants: [
      {
        callerName: "Freundin",
        callerText: "Er hat Tabletten genommen und ist kaum wach zu bekommen.",
        location: "Galgenbergstrasse 25, Regensburg",
        lat: 49.0025,
        lng: 12.0992,
        required: ["RTW", "NEF"],
        requiredDepartmentKey: "internal",
        patientCount: 1,
        report: "Intoxikation, Ueberwachung und Labor erforderlich.",
        handoffOptions: ["POL"],
        signal: true
      }
    ]
  },
  {
    id: "mci-small",
    title: "Mehrere Verletzte",
    type: "emergency",
    keyword: "RD 3 - zwei oder drei verletzte/erkrankte Personen",
    variants: [
      {
        callerName: "Feuerwehr Regensburg",
        callerText: "Kellerbrand, drei Personen mit Rauchgasexposition, Feuerwehr vor Ort.",
        location: "Adolf-Schmetzer-Strasse 9, Regensburg",
        lat: 49.0181,
        lng: 12.1167,
        required: ["RTW", "RTW", "NEF"],
        requiredDepartmentKey: "internal",
        patientCount: 3,
        report: "Drei Patienten mit Rauchgasexposition, Klinikverteilung erforderlich.",
        handoffOptions: ["FW", "POL"],
        signal: true
      }
    ]
  },
  {
    id: "rth-medical",
    title: "Medizinischer RTH-Transport",
    type: "emergency",
    keyword: "RD 2 Herz/Kreislauf - vitale Bedrohung",
    variants: [
      {
        callerName: "Hausarzt Hemau",
        callerText: "Kritischer Patient mit Herzinfarktverdacht, bodengebundene Transportzeit zu lang.",
        location: "Hemau, Stadtplatz",
        lat: 49.0537,
        lng: 11.7815,
        required: ["RTW", "RTH"],
        requiredDepartmentKey: "cardiology",
        patientCount: 1,
        report: "Kritischer ACS-Patient, RTH-Transport zur Kardiologie.",
        signal: true
      }
    ]
  }
];

