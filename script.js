// --- Helper: CSV to JSON ---
function csvToJson(csv) {
  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

<<<<<<< HEAD
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
=======
fetch('countries.json')
  .then(res => res.json())
  .then(data => {
    countriesData = data;
    renderGallery(data);
  });
>>>>>>> parent of 817b08d (add style sheet)

// --- Render the gallery ---
function renderGallery(data) {
<<<<<<< HEAD
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
=======
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear previous
  data.forEach(country => {
    // Same gallery-item creation logic as before
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    const wrapper = document.createElement('div');
    wrapper.classList.add('flag-wrapper');

    const img = document.createElement('img');
    img.classList.add('gallery-image');
    if (!country.read) img.classList.add('grayscale');

    if (country.code.startsWith('http') || country.code.includes('/')) {
      img.src = country.code;
    } else {
      img.src = `https://flagcdn.com/w640/${country.code}.png`;
    }
    img.alt = `Flag of ${country.name}`;
    wrapper.appendChild(img);
    item.appendChild(wrapper);

    const caption = document.createElement('div');
    caption.classList.add('caption');
    caption.textContent = country.name;
    item.appendChild(caption);

    if (country.read && country.books.length) {
      const overlay = document.createElement('div');
      overlay.classList.add('popup-overlay');

      const popup = document.createElement('div');
      popup.classList.add('popup-box');

      const title = document.createElement('h2');
      title.textContent = country.name;
      popup.appendChild(title);

      const list = document.createElement('ul');
      country.books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} – ${book.author}`;
        list.appendChild(li);
      });
      popup.appendChild(list);

      const close = document.createElement('a');
      close.href = '#';
      close.classList.add('close-btn');
      close.textContent = 'Close';
      close.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.remove('active');
      });
      popup.appendChild(close);

      overlay.appendChild(popup);
      item.appendChild(overlay);

      wrapper.addEventListener('click', () => {
        overlay.classList.add('active');
      });
    }

>>>>>>> parent of 817b08d (add style sheet)
    gallery.appendChild(item);
  });
}

<<<<<<< HEAD
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

=======
// --- Filter logic ---
document.getElementById('continentFilter').addEventListener('change', applyFilters);
document.getElementById('typeFilter').addEventListener('change', applyFilters);

function applyFilters() {
  const continent = document.getElementById('continentFilter').value;
  const type = document.getElementById('typeFilter').value;

  const filtered = countriesData.filter(c => {
    const continentMatch = continent === 'all' || c.continent === continent;
    const typeMatch = type === 'all' || c.type === type;
    return continentMatch && typeMatch;
  });

>>>>>>> parent of 817b08d (add style sheet)
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
