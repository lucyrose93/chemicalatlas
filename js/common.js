function toggleMenu() {
  const menu = document.getElementById("navMenu");
  const mapContainer = document.getElementById("map");

  menu.classList.toggle("active");

  if (menu.classList.contains("active")) {
    mapContainer.style.pointerEvents = "none"; // disable map interaction
  } else {
    mapContainer.style.pointerEvents = "auto"; // re-enable map interaction
  }
}
