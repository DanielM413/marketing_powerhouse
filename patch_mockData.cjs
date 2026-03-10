const fs = require('fs');

const touchpointsData = `
export const touchpoints = [
    { id: 'tp1', name: 'Google Search Ads', type: 'Paid Search', url: 'google.com/ads', status: 'active', description: 'Bezahlte Anzeigen auf Google für brand und non-brand Keywords.' },
    { id: 'tp2', name: 'LinkedIn Ads', type: 'Paid Social', url: 'linkedin.com/campaign', status: 'active', description: 'Lead Gen Forms und Sponsored Content auf LinkedIn.' },
    { id: 'tp3', name: 'Webinar Landingpage', type: 'Owned Website', url: 'test-it-academy.de/webinar', status: 'active', description: 'Die zentrale Anmeldeseite für das DiTeLe-Webinar.' },
    { id: 'tp4', name: 'E-Mail Automation (ActiveCampaign)', type: 'Owned CRM', url: 'activecampaign.com', status: 'active', description: 'Follow-up Sequenz nach Webinar-Teilnahme.' },
    { id: 'tp5', name: 'Sales Pipeline (Telefon)', type: 'Direct Sales', url: '-', status: 'planned', description: 'Telefongespräch durch B2B-Closer nach Leadgenerierung.' },
    { id: 'tp6', name: 'Instagram Reels', type: 'Organic Social', url: 'instagram.com/testit', status: 'active', description: 'Kurzvideos für Awareness, um Quereinsteiger zu inspirieren.' },
    { id: 'tp7', name: 'Trustpilot Reviews', type: 'Earned Media', url: 'trustpilot.com/review', status: 'active', description: 'Bewertungen von ehemaligen Schülern.' },
    { id: 'tp8', name: 'Lern-Plattform (LMS)', type: 'Product', url: 'lms.test-it-academy.de', status: 'active', description: 'Die Moodle-basierte Lernumgebung für aktive Kursteilnehmer.' }
];
`;

const customerJourneysData = `
export const customerJourneys = [
    {
        id: 'j1',
        name: 'Quirin (Quereinsteiger) - B2C Full Flow',
        audienceId: 'a1', 
        description: 'Von der Frustration im alten Job bis zur Anmeldung zum ISTQB-Kurs mit Bildungsgutschein.',
        stages: [
            { id: 's1', phase: 'Attention', title: 'Problembewusstsein', description: 'Quirin erfährt, dass IT-Jobs Quereinsteiger aufnehmen.', touchpoints: ['tp6', 'tp2'], contentFormats: ['Reel: "3 Mythen über IT-Jobs"', 'LinkedIn Post: "Zukunftssicher"'], emotions: ['Orientierungslos', 'Neugierig'], painPoints: ['Angst vor dem Ungewissen', 'Kein Programmier-Wissen'], metrics: { label: 'Reichweite', value: '45.000', trend: '+12%' } },
            { id: 's2', phase: 'Search', title: 'Recherche & Info-Suche', description: 'Er sucht bei Google nach "Software Tester ohne Studium".', touchpoints: ['tp1'], contentFormats: ['Blog: "Was macht ein Tester?"', 'SEO Ratgeber'], emotions: ['Wissbegierig', 'Leicht überfordert'], painPoints: ['Wer zahlt das?', 'Welches Zertifikat brauche ich?'], metrics: { label: 'SEO Clicks', value: '2.100', trend: '+5%' } },
            { id: 's3', phase: 'Interest', title: 'Tieferes Kaufinteresse', description: 'Meldung zum kostenlosen Webinar an.', touchpoints: ['tp3', 'tp2'], contentFormats: ['Webinar Anmeldung', 'Retargeting Case Study'], emotions: ['Hoffnungsvoll'], painPoints: ['Terminfindung', 'Ist das seriös?'], metrics: { label: 'Webinar Signups', value: '350', trend: '+20%' } },
            { id: 's4', phase: 'Desire', title: 'Persönliches Verlangen aufbauen', description: 'Erklärung der Bildungsgutschein-Förderung per Mail.', touchpoints: ['tp4'], contentFormats: ['E-Mail Nurturing', 'Fördermittel-Guide (PDF)'], emotions: ['Motiviert', 'Überzeugt'], painPoints: ['Antragstellung beim Amt'], metrics: { label: 'Open Rate', value: '48%', trend: '+3%' } },
            { id: 's5', phase: 'Action', title: 'Beratung & Buchung', description: 'Telefonische Beratung und endgültige Anmeldung.', touchpoints: ['tp5'], contentFormats: ['Consulting-Leitfaden', 'Anmeldeformular'], emotions: ['Erleichtert', 'Gutmütig nervös'], painPoints: ['Amt muss final zustimmen'], metrics: { label: 'Vertragsabschlüsse', value: '45', trend: '+8%' } },
            { id: 's6', phase: 'Share', title: 'Erfolg teilen', description: 'Prüfung bestanden! Zertifikat wird geteilt.', touchpoints: ['tp7', 'tp8'], contentFormats: ['LinkedIn Zertifikat Template', 'Alumni Interview'], emotions: ['Stolz'], painPoints: ['Jobeinstieg'], metrics: { label: 'Trustpilot Ratings', value: '12', trend: '+2%' } }
        ]
    },
    {
        id: 'j2',
        name: 'Hannah (HR) - B2B Inhouse Flow',
        audienceId: 'a2',
        description: 'Recherche eines Weiterbildungspartners für das Inhouse QA Team.',
        stages: [
            { id: 's1', phase: 'Attention', title: 'Schulungsbedarf erkannt', description: 'Team wächst, Qualität der Releases sinkt.', touchpoints: ['tp2'], contentFormats: ['Whitepaper: "Kosten von Bugs in Prod"'], emotions: ['Gestresst'], painPoints: ['Teamfehler', 'Budgetdruck'], metrics: { label: 'LinkedIn Impr.', value: '15.000', trend: '+10%' } },
            { id: 's2', phase: 'Search', title: 'Anbietervergleich', description: 'Google Suche nach "ISTQB Inhouse Training Frankfurt".', touchpoints: ['tp1', 'tp3'], contentFormats: ['B2B Landingpage', 'Trainer-Profilseite'], emotions: ['Analytisch'], painPoints: ['ISTQB Akkreditierung wichtig'], metrics: { label: 'B2B Traffic', value: '800', trend: '+1%' } },
            { id: 's3', phase: 'Interest', title: 'Kontaktaufnahme', description: 'Hannah kontaktiert uns für ein Angebot.', touchpoints: ['tp3'], contentFormats: ['Pitch Deck', 'Preisliste'], emotions: ['Erwartungsvoll'], painPoints: ['Antwortzeit', 'Flexibilität bei Terminen'], metrics: { label: 'Inbound Leads', value: '15', trend: '+5%' } },
            { id: 's4', phase: 'Desire', title: 'Fachlicher Austausch', description: 'Videocall zur Besprechung der Lernziele des Teams.', touchpoints: ['tp5'], contentFormats: ['Demo der Lernplattform', 'Custom Agenda'], emotions: ['Überzeugt'], painPoints: ['Überzeugt das die GF?'], metrics: { label: 'Sales Calls', value: '8', trend: '0%' } },
            { id: 's5', phase: 'Action', title: 'Vertragsabschluss', description: 'Rahmenvertrag für Inhouse-Schulung wird signiert.', touchpoints: ['tp5'], contentFormats: ['Vertragsdokument'], emotions: ['Erleichtert'], painPoints: ['Rechtliche Prüfung im Haus'], metrics: { label: 'Won Deals', value: '3', trend: '+1%' } },
            { id: 's6', phase: 'Share', title: 'Langfristige Partnerschaft', description: 'Team besteht Prüfung, Hannah lobt uns intern.', touchpoints: ['tp2'], contentFormats: ['B2B Case Study'], emotions: ['Zufrieden', 'Gut positioniert intern'], painPoints: ['Nächstes Fortbildungsjahr'], metrics: { label: 'Upsell %', value: '30%', trend: '+5%' } }
        ]
    },
    {
        id: 'j3',
        name: 'Bea (Junior QA) - Upskill Flow',
        audienceId: 'a3',
        description: 'Bereits in der Ausbildung/Job, aber benötigt den ISTQB Titel für die Gehaltsverhandlung.',
        stages: [
            { id: 's1', phase: 'Attention', title: 'Karriere-Bremse', description: 'Merkt, dass Zertifikate für Beförderung nötig sind.', touchpoints: ['tp6'], contentFormats: ['TikTok "Junior vs Senior Tester"'], emotions: ['Frustriert', 'Ambitioniert'], painPoints: ['Geringes Gehalt'], metrics: { label: 'Views', value: '110.000', trend: '+45%' } },
            { id: 's2', phase: 'Search', title: 'Vorbereitungsmöglichkeiten', description: 'Sucht nach schnellen E-Learning Kursen.', touchpoints: ['tp1'], contentFormats: ['SEO Artikel "ISTQB im Selbststudium"'], emotions: ['Zielorientiert'], painPoints: ['Zeitaufwand neben Job'], metrics: { label: 'Klicks', value: '1.200', trend: '-2%' } },
            { id: 's3', phase: 'Interest', title: 'Probe-Material', description: 'Lädt Mock-Exam runter.', touchpoints: ['tp3'], contentFormats: ['Mock Exam (PDF)', 'Syllabus Checker'], emotions: ['Fokussiert'], painPoints: ['Zu viele Fachbegriffe'], metrics: { label: 'Downloads', value: '450', trend: '+12%' } },
            { id: 's4', phase: 'Desire', title: 'Entscheidung für Premium-Kurs', description: 'Erkennt, dass Selbststudium zu schwer ist.', touchpoints: ['tp4'], contentFormats: ['E-Mail "Warum 60% im 1. Versuch durchfallen"'], emotions: ['Respekt vor Prüfung', 'Kaufbereit'], painPoints: ['Prüfungsgebühr'], metrics: { label: 'Open Rate', value: '55%', trend: '+5%' } },
            { id: 's5', phase: 'Action', title: 'Online-Buchung', description: 'Bucht per Kreditkarte das E-Learning Paket.', touchpoints: ['tp3'], contentFormats: ['Checkout-Page'], emotions: ['Erwartungsvoll'], painPoints: ['Geld-zurück-Garantie?'], metrics: { label: 'Checkouts', value: '120', trend: '+15%' } },
            { id: 's6', phase: 'Share', title: 'Prüfungszeugnis auf Social Media', description: 'Postet stolz das Zertifikat.', touchpoints: ['tp2', 'tp7'], contentFormats: ['Zertifikats-Post Vorlage'], emotions: ['Stolz', 'Gehaltserhöhung in Sicht'], painPoints: ['-'], metrics: { label: 'Mentions', value: '60', trend: '+8%' } }
        ]
    }
];
`;

let content = fs.readFileSync('src/data/mockData.js', 'utf-8');

// remove existing customerJourneys
const journeysIndex = content.indexOf('export const customerJourneys');
if (journeysIndex > -1) {
    content = content.substring(0, journeysIndex);
}

// append
content += touchpointsData + '\\n' + customerJourneysData;

fs.writeFileSync('src/data/mockData.js', content, 'utf-8');
