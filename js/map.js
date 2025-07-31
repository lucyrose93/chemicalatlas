const map = L.map('map', {
  minZoom: 2  // minimum zoom level
}).setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

const panel = document.getElementById('panel');
const caseContent = document.getElementById('caseContent');
const closeBtn = panel.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
    panel.classList.remove('show');
});

const urlParams = new URLSearchParams(window.location.search);
const highlightId = urlParams.get('id');

const defaultIcon = new L.Icon({
    iconUrl: './imgs/marker.png',
    iconSize: [21, 21],
});

const highlightIcon = new L.Icon({
   iconUrl: './imgs/marker.png',
    iconSize: [70, 70],
});

Promise.all([
  fetch('./case-studies.json').then(res => res.json()),
  fetch('./glossary.json').then(res => res.json())
])
    .then(([caseStudies, glossary]) => {
        // Store markers so we can access highlight marker later
        const markersById = new Map();

        caseStudies.forEach(cs => {
            // Choose icon: highlight if matching ID, else default
            const isHighlight = highlightId && cs.id.toString() === highlightId;
            const icon = isHighlight ? highlightIcon : defaultIcon;

            const marker = L.marker(cs.coords, {
                icon
            }).addTo(map);
            markersById.set(cs.id.toString(), marker);

            marker.on('click', () => {
                // Find glossary term
                let glossaryEntry = null;
                if (cs.glossary_term_id) {
                    glossaryEntry = glossary.find(g => g.id === cs.glossary_term_id);
                } else if (cs.glossary_term) {
                    glossaryEntry = glossary.find(g => g.term === cs.glossary_term);
                }

                let glossaryHtml = '';
                if (glossaryEntry) {
                    glossaryHtml = `
          <section>
            <h3>Relevant Glossary Term</h3>
            <p><strong>${glossaryEntry.term}:</strong> ${glossaryEntry.definition}</p>
          </section>
        `;
                }

                caseContent.innerHTML = window.buildCaseStudyHtml(cs, false) + glossaryHtml;

                const btnHtml = document.createElement('button');
                btnHtml.id = 'viewFullScreenBtn';
                btnHtml.style = 'margin: 1.5rem 0rem; padding: 0.2rem 1rem; font-family: "Forum", serif; font-size: 1rem; cursor: pointer; border: 0; color: #006699; border-radius: 2px; background: inherit; border: solid 1px #ff9999;';
                btnHtml.textContent = 'View full screen';
                caseContent.appendChild(btnHtml);

                btnHtml.addEventListener('click', () => {
                    window.open(`./case-study.html?id=${cs.id}`, '_blank');
                });

                panel.classList.add('show');
            });
        });

        // If highlightId exists, zoom to and open popup for that marker
        if (highlightId && markersById.has(highlightId)) {
            const highlightMarker = markersById.get(highlightId);
            highlightMarker.openPopup();
            map.flyTo(highlightMarker.getLatLng(), 10, {
                animate: true,
                duration: 2,
            });
        }
    })
    .catch(err => {
        console.error('Error loading data:', err);
    });
