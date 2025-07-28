function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const caseId = getQueryParam('id');

document.addEventListener('DOMContentLoaded', () => {
  const viewMapBtn = document.getElementById('viewMapBtn');
  if (viewMapBtn && caseId) {
    viewMapBtn.addEventListener('click', () => {
      // Adjust the map page URL path if needed
      window.location.href = `map.html?id=${caseId}`;
    });
  }
});


Promise.all([
  fetch('./case-studies.json').then(res => res.json()),
  fetch('./glossary.json').then(res => res.json())
])
.then(([caseStudies, glossary]) => {
  const cs = caseStudies.find(c => c.id.toString() === caseId);
  if (!cs) {
    document.getElementById('caseStudyMain').innerHTML = '<p>Case study not found.</p>';
    return;
  }

  // Find glossary entry (example with glossary_term_id)
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
        <p><strong>${glossaryEntry.term}:</strong> ${glossaryEntry.definition}<a href="glossary.html"> Open Glossary...</a></p>
      </section>
    `;
  }

  document.getElementById('caseStudyMain').innerHTML = window.buildCaseStudyHtml(cs) + glossaryHtml;
})
.catch(error => {
  document.getElementById('caseStudyMain').innerHTML = '<p>Error loading case study data.</p>';
  console.error(error);
});

