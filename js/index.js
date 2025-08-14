
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
  const chemicalFilters = document.getElementById('chemicalFilters');
  const scaleFilters = document.getElementById('scaleFilters');
  const approachFilters = document.getElementById('approachFilters');
  const glossaryFilters = document.getElementById('glossaryFilters');

  let caseStudies = [];
  let glossary = [];

  // Helper: get unique sorted values, filtering out empty
  function uniqueSorted(arr) {
    return [...new Set(arr.filter(Boolean))].sort();
  }

    function renderCards(items) {
  cardsEl.innerHTML = '';
  if (items.length === 0) {
    cardsEl.innerHTML = '<p>No case studies match your filters.</p>';
    return;
  }
  items.forEach(cs => {
    const thumbnailHtml = cs.images && cs.images.length > 0
      ? `<img src="${cs.images[0]}" alt="${cs.title} thumbnail" style="width: 100%; max-height: 210px; object-fit: cover; border-radius: 2px; margin-bottom: 0.2rem;">`
      : '';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${thumbnailHtml}
      <h3><a href="case-study.html?id=${cs.id}" rel="noopener noreferrer" style="text-decoration:underline">${cs.title}</a></h3>
      <p><strong>Chemical:</strong> ${cs.chemical}</p>
      <p><strong>Scale:</strong> ${cs.scale}</p>
      <p><strong>Approach:</strong> ${cs.approach}</p>
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
    const selectedChemicals = getSelectedFilters('chemical');
    const selectedScales = getSelectedFilters('scale');
    const selectedApproach = getSelectedFilters('approach');
    const selectedGlossary = getSelectedFilters('glossary');

    return caseStudies.filter(cs => {
      const matchChemical = selectedChemicals.length === 0 || selectedChemicals.includes(cs.chemical);
      const matchScale = selectedScales.length === 0 || selectedScales.includes(cs.scale);
      const matchApproach = selectedApproach.length === 0 || selectedApproach.includes(cs.approach);
      const matchGlossary = selectedGlossary.length === 0 || selectedGlossary.includes(cs.glossary_term);

      return matchChemical && matchScale && matchApproach && matchGlossary;
    });
  }

  // Event listener to run filtering when any checkbox changes
  function onFilterChange() {
    const filtered = filterCaseStudies();
    renderCards(filtered);
  }

  // Initialize filters and cards
  Promise.all([
    fetch('./case-studies.json').then(res => res.json()),
    fetch('./glossary.json').then(res => res.json())
  ])
  .then(([csData, glossaryData]) => {
    caseStudies = csData;
    glossary = glossaryData;

    createCheckboxFilters(chemicalFilters, 'chemical', uniqueSorted(caseStudies.map(cs => cs.chemical)));
    createCheckboxFilters(scaleFilters, 'scale', uniqueSorted(caseStudies.map(cs => cs.scale)));
    createCheckboxFilters(approachFilters, 'knowledge', uniqueSorted(caseStudies.map(cs => cs.approach)));
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
