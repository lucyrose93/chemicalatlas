document.addEventListener('DOMContentLoaded', () => {
  const cardGrid = document.querySelector('#glossary .card-grid');
  cardGrid.innerHTML = ''; // Clear placeholders

  const WORD_LIMIT = 80; // approximate word limit for truncation
  const CHAR_LIMIT = 400; // fallback character limit if preferred

  let caseStudiesCache = null;

  fetch('./glossary.json')
    .then(res => res.json())
    .then(glossary => {
      // Sort glossary alphabetically by term (case-insensitive)
      glossary.sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));

      glossary.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card';

        // Function to truncate text nicely on word boundary
        function truncateText(text, wordLimit, charLimit) {
          const words = text.split(/\s+/);
          if (words.length <= wordLimit && text.length <= charLimit) {
            return { truncated: text, isTruncated: false };
          }
          let truncatedWords = words.slice(0, wordLimit);
          let truncatedText = truncatedWords.join(' ');
          if (truncatedText.length > charLimit) {
            truncatedText = truncatedText.slice(0, charLimit);
            truncatedText = truncatedText.slice(0, truncatedText.lastIndexOf(' '));
          }
          return { truncated: truncatedText + '…', isTruncated: true };
        }

        // Get truncated definition and flag if truncated
        const { truncated, isTruncated } = truncateText(entry.definition, WORD_LIMIT, CHAR_LIMIT);

        // Insert HTML with placeholders
        card.innerHTML = `
          <strong>${entry.term}</strong> 
          <p class="definition">${truncated}</p>
          ${isTruncated ? '<p class="read-more" style="color: #ccc; font-style:italic; cursor: pointer; margin: 0.2rem 0;">...continue reading</p>' : ''}
          <p class="toggle-reference" style="color: #cccc99; cursor: pointer; margin-top: 0.5rem;">→ Show reference</p>
          <div class="reference" style="display: none; font-size: 0.9rem; margin-top: 0.25rem; color: #ccc;">${entry.reference || ''}</div>
          <p class="toggle-case-studies" style="color: #006699; cursor: pointer; margin-top: 0.2rem;">→ See relevant case studies</p>
          <div class="case-studies-list" style="display: none; margin-top: 0.2rem;"></div>
        `;

        // Handle read more toggle
        if (isTruncated) {
          const readMore = card.querySelector('.read-more');
          const defP = card.querySelector('.definition');

          readMore.addEventListener('click', () => {
            if (readMore.textContent.includes('...continue reading')) {
              defP.textContent = entry.definition;
              readMore.textContent = '← Show less';
            } else {
              defP.textContent = truncated;
              readMore.textContent = '...continue reading';
            }
          });
        }

        // Reference toggle logic
        const toggleRef = card.querySelector('.toggle-reference');
        const refDiv = card.querySelector('.reference');
        if (!entry.reference) {
          toggleRef.style.display = 'none'; // Hide toggle if no reference
        } else {
          toggleRef.addEventListener('click', () => {
            if (refDiv.style.display === 'none') {
              refDiv.style.display = 'block';
              toggleRef.textContent = '← Hide reference';
            } else {
              refDiv.style.display = 'none';
              toggleRef.textContent = '→ Show reference';
            }
          });
        }

        // Case studies toggle logic
        const toggle = card.querySelector('.toggle-case-studies');
        const caseList = card.querySelector('.case-studies-list');

        toggle.addEventListener('click', () => {
          if (caseList.style.display === 'none') {
            if (!caseStudiesCache) {
              fetch('./case-studies.json')
                .then(res => res.json())
                .then(caseStudies => {
                  caseStudiesCache = caseStudies;
                  showRelevantCases(caseStudiesCache, entry.term, caseList);
                })
                .catch(err => {
                  caseList.innerHTML = '<p>Error loading case studies.</p>';
                  caseList.style.display = 'block';
                });
            } else {
              showRelevantCases(caseStudiesCache, entry.term, caseList);
            }
            toggle.textContent = '← Hide relevant case studies';
            caseList.style.display = 'block';
          } else {
            toggle.textContent = '→ See relevant case studies';
            caseList.style.display = 'none';
          }
        });

        cardGrid.appendChild(card);
      });
    })
    .catch(err => {
      cardGrid.innerHTML = '<p>Error loading glossary entries.</p>';
      console.error('Failed to load glossary:', err);
    });

  function showRelevantCases(caseStudies, term, container) {
    container.innerHTML = '';

    const relevant = caseStudies.filter(cs => cs.glossary_term === term);

    if (relevant.length === 0) {
      container.innerHTML = '<p>No relevant case studies found.</p>';
      return;
    }

    const ul = document.createElement('ul');
    relevant.forEach(cs => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `case-study.html?id=${cs.id}`;
      a.textContent = cs.title;
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }
});


