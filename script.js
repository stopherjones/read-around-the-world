// --- Helper: CSV to JSON ---
function csvToJson(csv) {
  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

// --- Helper: Convert string booleans and books ---
function normalizeData(data) {
  return data.map(c => ({
    ...c,
    read: c.read?.toLowerCase() === "true",
    filterable: c.filterable?.toLowerCase() === "true",
    books: c.book_title
      ? [{ title: c.book_title, author: c.book_author }]
      : []
  }));
}

// --- Render the gallery ---
function renderGallery(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  data.forEach(country => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = country.flag;
    img.alt = `Flag of ${country.name}`;
    img.className = "gallery-image";
    if (!country.read) img.style.filter = "grayscale(100%)";

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = country.name;

    // If read, add a simple tooltip with book info
    if (country.read && country.books.length) {
      caption.title = country.books
        .map(b => `${b.title} — ${b.author}`)
        .join("\n");
    }

    item.appendChild(img);
    item.appendChild(caption);
    gallery.appendChild(item);
  });
}

// --- Filter & search ---
function applyFilters(data) {
  const continentFilter = document.querySelector("#continent-filter").value;
  const searchTerm = document.querySelector("#search-box").value.toLowerCase();

  const filtered = data.filter(c => {
    const matchesContinent =
      continentFilter === "all" || c.region === continentFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm);
    return matchesContinent && matchesSearch;
  });

  renderGallery(filtered);
}

// --- Load CSV and initialize ---
fetch("data/countries.csv")
  .then(r => r.text())
  .then(csv => {
    let countries = csvToJson(csv);
    countries = normalizeData(countries);
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // Initial render
    renderGallery(countries);

    // Set up filter & search events
    document
      .querySelector("#continent-filter")
      .addEventListener("change", () => applyFilters(countries));
    document
      .querySelector("#search-box")
      .addEventListener("input", () => applyFilters(countries));
  });
