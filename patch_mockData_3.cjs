const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.js', 'utf-8');

// Add contentIds to customerJourneys
content = content.replace(
    /metrics: { label: 'Reichweite', value: '45.000', trend: '\+12%' } }/g,
    "metrics: { label: 'Reichweite', value: '45.000', trend: '+12%' }, contentIds: ['cnt1'] }"
);
content = content.replace(
    /metrics: { label: 'SEO Clicks', value: '2.100', trend: '\+5%' } }/g,
    "metrics: { label: 'SEO Clicks', value: '2.100', trend: '+5%' }, contentIds: ['cnt4'] }"
);
content = content.replace(
    /metrics: { label: 'Webinar Signups', value: '350', trend: '\+20%' } }/g,
    "metrics: { label: 'Webinar Signups', value: '350', trend: '+20%' }, contentIds: ['cnt2'] }"
);

fs.writeFileSync('src/data/mockData.js', content, 'utf-8');
