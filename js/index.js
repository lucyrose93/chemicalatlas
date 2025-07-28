
document.addEventListener('DOMContentLoaded', () => {
    
    
    
const toggleBtn = document.getElementById('toggleFiltersBtn');
const filtersContainer = document.getElementById('filters');
    
  filtersContainer.style.display = 'none';

toggleBtn.addEventListener('click', () => {
  const isHidden = filtersContainer.style.display === 'none';
  filtersContainer.style.display = isHidden ? 'block' : 'none';
  toggleBtn.setAttribute('aria-expanded', isHidden);
});
    
  const cardsEl = document.getElementById('cards');
  const topicFilters = document.getElementById('topicFilters');
  const scaleFilters = document.getElementById('scaleFilters');
  const knowledgeFilters = document.getElementById('knowledgeFilters');
  const glossaryFilters = document.getElementById('glossaryFilters');

  let caseStudies = [];
  let glossary = [];

  // Helper: get unique sorted values, filtering out empty
  function uniqueSorted(arr) {
    return [...new Set(arr.filter(Boolean))].sort();
  }

  // Render case study cards
  function renderCards(items) {
  cardsEl.innerHTML = '';
  if (items.length === 0) {
    cardsEl.innerHTML = '<p>No case studies match your filters.</p>';
    return;
  }
  items.forEach(cs => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3><a href="case-study.html?id=${cs.id}" target="_blank" rel="noopener noreferrer">${cs.title}</a></h3>
      <p><strong>Topic:</strong> ${cs.topic}</p>
      <p><strong>Scale:</strong> ${cs.scale}</p>
      <p><strong>Knowledge Area:</strong> ${cs.knowledge_area}</p>
    `;
    cardsEl.appendChild(card);
  });
}

  // Generate checkbox inputs for filter groups
  function createCheckboxFilters(container, name, options) {
    container.innerHTML = '';
    options.forEach(opt => {
      const id = `${name}-${opt.replace(/\s+/g, '-')}`;
      const label = document.createElement('label');
      label.htmlFor = id;
      label.style = "display: block; margin-bottom: 0.3rem; cursor: pointer;";

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      checkbox.name = name;
      checkbox.value = opt;

      label.appendChild(checkbox);
      label.append(` ${opt}`);

      container.appendChild(label);
    });
  }

  // Get selected filters as arrays by group name
  function getSelectedFilters(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map(input => input.value);
  }

  // Filter case studies by selected checkboxes (AND logic across groups)
  function filterCaseStudies() {
    const selectedTopics = getSelectedFilters('topic');
    const selectedScales = getSelectedFilters('scale');
    const selectedKnowledge = getSelectedFilters('knowledge');
    const selectedGlossary = getSelectedFilters('glossary');

    return caseStudies.filter(cs => {
      const matchTopic = selectedTopics.length === 0 || selectedTopics.includes(cs.topic);
      const matchScale = selectedScales.length === 0 || selectedScales.includes(cs.scale);
      const matchKnowledge = selectedKnowledge.length === 0 || selectedKnowledge.includes(cs.knowledge_area);
      const matchGlossary = selectedGlossary.length === 0 || selectedGlossary.includes(cs.glossary_term);

      return matchTopic && matchScale && matchKnowledge && matchGlossary;
    });
  }

  // Event listener to run filtering when any checkbox changes
  function onFilterChange() {
    const filtered = filterCaseStudies();
    renderCards(filtered);
  }

  // Initialize filters and cards
  Promise.all([
    fetch('../case-studies.json').then(res => res.json()),
    fetch('../glossary.json').then(res => res.json())
  ])
  .then(([csData, glossaryData]) => {
    caseStudies = csData;
    glossary = glossaryData;

    createCheckboxFilters(topicFilters, 'topic', uniqueSorted(caseStudies.map(cs => cs.topic)));
    createCheckboxFilters(scaleFilters, 'scale', uniqueSorted(caseStudies.map(cs => cs.scale)));
    createCheckboxFilters(knowledgeFilters, 'knowledge', uniqueSorted(caseStudies.map(cs => cs.knowledge_area)));
    createCheckboxFilters(glossaryFilters, 'glossary', uniqueSorted(glossary.map(g => g.term)));

    // Attach change event listeners to all checkboxes
    document.querySelectorAll('#filters input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', onFilterChange);
    });

    // Initial render: show all
    renderCards(caseStudies);
  })
  .catch(err => {
    console.error('Error loading data:', err);
    cardsEl.innerHTML = '<p>Error loading data.</p>';
  });
});

//const materials = [
//  { title: "Reflecting on Microplastics", theme: "Reporting", type: "Article" },
//  { title: "Teachers’ Guide", theme: "Education", type: "PDF" },
//  { title: "Workshop: Microplastic Mapping", theme: "Environment", type: "Presentation" },
//  { title: "Toxic Narratives", theme: "Reporting", type: "Article" },
//  { title: "Plastic and Policy", theme: "Environment", type: "PDF" },
//  { title: "Chemical Literacy Toolkit", theme: "Education", type: "Guide" }
//];
//
//const cardsEl = document.getElementById("cards");
//const filterEl = document.getElementById("themeFilter");
//
//function renderCards(filterTheme = "All") {
//  cardsEl.innerHTML = "";
//  const filtered = materials.filter(m => filterTheme === "All" || m.theme === filterTheme);
//  filtered.forEach(m => {
//    const card = document.createElement("div");
//    card.className = "card";
//    card.innerHTML = `
//      <h3>${m.title}</h3>
//      <div class="tags">${m.theme} • ${m.type}</div>
//    `;
//    cardsEl.append(card);
//  });
//}
//
//filterEl.addEventListener("change", () => {
//  renderCards(filterEl.value);
//});
//
//renderCards();
