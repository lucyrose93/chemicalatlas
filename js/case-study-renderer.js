window.buildImagesHtml = function(images, title) {
  if (!images || images.length === 0) return '';
  let html = '<div class="images">';
  images.forEach(src => {
    html += `<img src="${src}" alt="${title} image" style="max-width: 100%; max-width: 700px; margin-bottom: 0.5rem; margin-top: 0.5rem">`;
  });
  html += '</div>';
  return html;
};

window.buildVideoHtml = function(video) {
  if (!video) return '';
  return `
    <video controls style="width: 100%; max-width: 700px; margin-top: 1rem;">
      <source src="${video}" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  `;
};

window.buildCaseStudyHtml = function(cs, includeViewFullScreenBtn = false) {
  const imagesHtml = window.buildImagesHtml(cs.images, cs.title);
  const videoHtml = window.buildVideoHtml(cs.video);
  const viewFullScreenBtnHtml = includeViewFullScreenBtn
    ? `<button id="viewFullScreenBtn" style="margin-top: 1rem; padding-top:1rem; font-size: 1rem; cursor: pointer;">View Full Screen</button>`
    : '';
  return `
    <h2>${cs.title}</h2>
    <p><strong>Location:</strong> ${cs.location}</p>
    <p><strong>Topic:</strong> ${cs.topic}</p>
    <p><strong>Knowledge Area:</strong> ${cs.knowledge_area || ''}</p>
    <p><strong>Scale:</strong> ${cs.scale || ''}</p>
    <p><strong>Source:</strong> ${cs.source || 'N/A'}</p>

    ${imagesHtml}
    ${videoHtml}
    <h3>Summary</h3>
    <p>${cs.summary}</p>
    <h3>Analysis</h3>
    <p>${cs.analysis}</p>
    ${viewFullScreenBtnHtml}
  `;
};
