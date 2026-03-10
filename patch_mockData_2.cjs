const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.js', 'utf-8');

// Patch campaigns
content = content.replace(/channels: \['Google Ads', 'Meta Ads', 'E-Mail'\],/g, "channels: ['Google Ads', 'Meta Ads', 'E-Mail'],\n        touchpointIds: ['tp1', 'tp6', 'tp4'],");
content = content.replace(/channels: \['YouTube', 'Instagram', 'Google Ads'\],/g, "channels: ['YouTube', 'Instagram', 'Google Ads'],\n        touchpointIds: ['tp6', 'tp1'],");
content = content.replace(/channels: \['Meta Ads', 'LinkedIn', 'E-Mail'\],/g, "channels: ['Meta Ads', 'LinkedIn', 'E-Mail'],\n        touchpointIds: ['tp4', 'tp2', 'tp3'],");

// Patch initialContents
content = content.replace(/platform: 'Instagram',/g, "platform: 'Instagram',\n        touchpointId: 'tp6',");
content = content.replace(/platform: 'E-Mail',/g, "platform: 'E-Mail',\n        touchpointId: 'tp4',");
content = content.replace(/platform: 'Google Ads',/g, "platform: 'Google Ads',\n        touchpointId: 'tp1',");
content = content.replace(/platform: 'Blog',/g, "platform: 'Blog',\n        touchpointId: 'tp3',");

// Patch initialTasks
content = content.replace(/platform: 'Instagram',\n        type: 'Reel\/Video',/g, "platform: 'Instagram',\n        type: 'Reel/Video',\n        touchpointId: 'tp6',");
content = content.replace(/platform: 'LinkedIn',\n        type: 'Post',/g, "platform: 'LinkedIn',\n        type: 'Post',\n        touchpointId: 'tp2',");
content = content.replace(/platform: 'Google Ads',\n        type: 'Anzeige',/g, "platform: 'Google Ads',\n        type: 'Anzeige',\n        touchpointId: 'tp1',");
content = content.replace(/platform: null,\n        type: 'E-Mail',/g, "platform: null,\n        type: 'E-Mail',\n        touchpointId: 'tp4',");

fs.writeFileSync('src/data/mockData.js', content, 'utf-8');
