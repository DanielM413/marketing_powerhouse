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

    // We removed the wrapper `div` which has a corresponding closing `</div>` somewhere before `{/* New Audience Modal */}`.
    // The previous structure had the inner `Personas Grid` closed right before the `Detail Panel`.
    // Wait... if the `wrapperOpen` is removed, then we must remove its matching `</div>`.
    // Let's find the closing tag for the wrapper. It is the last closing tag in the `pre` string?
    // Actually, no. Let's look at the original code:
    /**
         * <div wrapper>
         *    <div personas grid>
         *       ...
         *    </div>
         *    
         *    {/* Detail Panel * /}
         *    ...
         * </div>
         */
    // Since we are replacing EVERYTHING from `{/* Detail Panel */}` to `endIdx` (which is after the `</div>` of the wrapper), we just do `content = pre + replacement + post;`. Because the `</div>` of the wrapper is somewhere between `startIdx` and `endIdx`! And wait, if the `</div>` of the wrapper is AFTER the `endIdx`, then `post` starts with `</div>`. Let's assume it's BETWEEN `startIdx` and `endIdx`. Wait, no. The detail panel is INSIDE the wrapper. 
    // Let's check lines 294-297:
    //                 )}
    //             </div>
    // 
    //             {/* New Audience Modal */}
    // The </div> on line 295 IS the wrapper closing tag!
    // So by removing from `{/* Detail Panel */}` to `{/* New Audience Modal */}`, we are ALSO removing the wrapper's </div>!
    // That means we don't need to manually remove an extra </div> anywhere else. The wrapper's closing tag is ALREADY wiped out by this block replacement.

    let post = content.substring(endIdx);
    content = pre + replacement + post;
}

fs.writeFileSync('src/pages/AudiencesPage.jsx', content, 'utf-8');
console.log('Patched with Node script successfully!');
