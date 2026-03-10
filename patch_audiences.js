const fs = require('fs');
let content = fs.readFileSync('src/pages/AudiencesPage.jsx', 'utf-8');

if (!content.includes('import AudienceDetailModal')) {
    content = content.replace("import PageHelp from '../components/PageHelp';", "import PageHelp from '../components/PageHelp';\nimport AudienceDetailModal from '../components/AudienceDetailModal';");
}

const wrapperOpen = "<div style={{ display: 'grid', gridTemplateColumns: selectedAudience ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'start' }}>";
if (content.includes(wrapperOpen)) {
    content = content.replace(wrapperOpen, "");
}

const innerOpen = "<div style={{ display: 'grid', gridTemplateColumns: selectedAudience ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>";
if (content.includes(innerOpen)) {
    content = content.replace(innerOpen, "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>");
}

const startIdx = content.indexOf('{/* Detail Panel */}');
const endIdx = content.indexOf('{/* New Audience Modal */}');

if (startIdx > -1 && endIdx > -1) {
    const replacement = `            {/* Detail Modal */}
            {selectedAudience && (
                <AudienceDetailModal
                    audience={selectedAudience}
                    onClose={() => setSelectedAudience(null)}
                />
            )}\n\n            `;

    let pre = content.substring(0, startIdx);
    // Remove the trailing </div> from the pre section
    const idxDivider = pre.lastIndexOf('</div>');
    if (idxDivider > -1) {
        pre = pre.substring(0, idxDivider) + pre.substring(idxDivider + 6);
    }

    let post = content.substring(endIdx);

    content = pre + replacement + post;
}

fs.writeFileSync('src/pages/AudiencesPage.jsx', content, 'utf-8');
console.log('Patched with Node script successfully!');
