window.buildImagesHtml = function(images, title) {
  if (!Array.isArray(images) || images.length === 0) return '';

  const safeTitle = (title || 'Case study').toString();

  let html = '<div class="images">';

  images.forEach((img, idx) => {
    let src = '';
    let caption = '';

    // supports both formats:
    // images: ["a.jpg"]
    // images: [{src:"a.jpg", caption:"..."}]
    if (typeof img === 'string') {
      src = img;
    } else if (img && typeof img === 'object') {
      src = img.src || '';
      caption = img.caption || '';
    }

    if (!src) return;

    // simple HTML escaping for captions/titles
    const esc = (s) =>
      String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    html +=
      '<figure style="margin:0 0 0.75rem 0;">' +
        '<img src="' + esc(src) + '" alt="' + esc(safeTitle) + ' image ' + (idx + 1) + '" style="max-width:100%; margin-bottom:0.25rem;">' +
        (caption ? '<figcaption style="font-size:0.85rem; color:#666;">' + esc(caption) + '</figcaption>' : '') +
      '</figure>';
  });

  html += '</div>';
  return html;
};

window.buildVideoHtml = function(video) {
  if (!video) return '';
  return `
    <video controls style="width: 800px; max-width: 100%; margin-top: 1rem; border: #ccc solid 1px;">
      <source src="${video}" type="video/mp4"/>
      Your browser does not support the video tag.
    </video>
  `;
};

window.buildCaseStudyHtml = function(cs, includeViewFullScreenBtn = false) {
  const imagesHtml = window.buildImagesHtml(cs.images, cs.title);
  const videoHtml = window.buildVideoHtml(cs.video);
  const viewFullScreenBtnHtml = includeViewFullScreenBtn
    ? `<button id="viewFullScreenBtn" style="margin-top: 0.5rem; font-size: 1rem; cursor: pointer;">View Full Screen</button>`
    : '';
  return `
    <h2>${cs.title}</h2>
    <p><strong>Location:</strong> ${cs.location}</p>
    <p><strong>Chemical:</strong> ${cs.chemical}</p>
    <p><strong>Approach:</strong> ${cs.approach || ''}</p>
    <p><strong>Scale:</strong> ${cs.scale || ''}</p>
    <p><strong>Source:</strong> ${cs.source || 'N/A'}</p>

    ${imagesHtml}
    ${videoHtml}
    <h3>Summary</h3>
    <p>${cs.summary}</p>

    <h3>Analysis</h3>
    <p>${cs.analysis}</p>

    <h3>References</h3>
    <p>${cs.references}</p>
    <hr>

    ${viewFullScreenBtnHtml}
  `;
};
