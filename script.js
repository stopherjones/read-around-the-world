let countriesData = [];

// Load JSON once, then render whatever the page needs
fetch("countries.json")
    .then(res => res.json())
    .then(data => {
        countriesData = data;

        // If we're on the gallery page
        if (document.getElementById("gallery")) {
            renderGallery(data);
            setupGalleryFilters();
        }

        // If we're on the books page
        if (document.getElementById("booksList")) {
            setupBooksFilters();
            renderBooks();
        }

        updateStats(data);
    });

/* ----------------- STATS ----------------- */

function updateStats(data) {
    const totalBooks = data.reduce((sum, c) => sum + (c.books ? c.books.length : 0), 0);
    const readCountries = data.filter(c => c.read).length;
    const totalCountries = data.filter(c => c.type === 'country').length;

    const statText = document.getElementById("statText");
    if (statText) {
        statText.textContent = `${totalBooks} books read in ${readCountries} of ${totalCountries} countries`;
    }
}

/* ----------------- GALLERY (HOME PAGE) ----------------- */

function renderGallery(data) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    gallery.classList.add('sectioned');

    const countries = data.filter(d => d.type === 'country');
    const territories = data.filter(d => d.type === 'territory');

    function renderSection(title, items) {
        if (!items || items.length === 0) return;

        const heading = document.createElement('div');
        heading.classList.add('section-title');
        heading.textContent = title;
        gallery.appendChild(heading);

        const grid = document.createElement("div");
        grid.classList.add("gallery-grid");

        items.forEach(country => {
            const item = document.createElement("div");
            item.classList.add("gallery-item");

            const wrapper = document.createElement("div");
            wrapper.classList.add("flag-wrapper");

            const img = document.createElement("img");
            img.classList.add("gallery-image");

            if (!country.read) img.classList.add("grayscale");

            if (country.code.includes("/") || country.code.startsWith("http")) {
                img.src = country.code;
            } else {
                img.src = `https://flagcdn.com/w640/${country.code}.png`;
            }

            img.alt = `Flag of ${country.name}`;
            wrapper.appendChild(img);
            item.appendChild(wrapper);

            const caption = document.createElement("div");
            caption.classList.add("caption");
            caption.textContent = country.name;
            item.appendChild(caption);

            if (country.read && country.books && country.books.length > 0) {
                const overlay = document.createElement("div");
                overlay.classList.add("popup-overlay");

                const popup = document.createElement("div");
                popup.classList.add("popup-box");

                const titleEl = document.createElement("h2");
                titleEl.textContent = country.name;
                popup.appendChild(titleEl);

                const list = document.createElement("ul");
                country.books.forEach(book => {
                    const li = document.createElement("li");
                    li.textContent = `${book.title} – ${book.author}`;
                    list.appendChild(li);
                });
                popup.appendChild(list);

                const close = document.createElement("a");
                close.href = "#";
                close.classList.add("close-btn");
                close.textContent = "Close";
                close.addEventListener("click", e => {
                    e.preventDefault();
                    overlay.classList.remove("active");
                });
                popup.appendChild(close);

                overlay.appendChild(popup);
                item.appendChild(overlay);

                wrapper.addEventListener("click", () => {
                    overlay.classList.add("active");
                });
            }

            grid.appendChild(item);
        });

        gallery.appendChild(grid);
    }

    renderSection('Countries', countries);
    renderSection('Other regions and territories', territories);

    if (gallery.querySelectorAll('.section-title').length === 0) {
        gallery.classList.remove('sectioned');
    }
}

function setupGalleryFilters() {
    const searchEl = document.getElementById("searchInput");
    const continentEl = document.getElementById("continentFilter");

    if (searchEl) searchEl.addEventListener("input", applyGalleryFilters);
    if (continentEl) continentEl.addEventListener("change", applyGalleryFilters);
}

function applyGalleryFilters() {
    const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const continent = document.getElementById("continentFilter")?.value || "all";

    const filtered = countriesData.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search);
        const matchContinent = continent === "all" || c.continent === continent;
        return matchSearch && matchContinent;
    });

    renderGallery(filtered);
    updateStats(countriesData);
}

/* ----------------- BOOKS LIST PAGE ----------------- */

let booksSearchEl;
let booksContinentEl;
let sortEl;

function setupBooksFilters() {
    booksSearchEl = document.getElementById("searchInput");
    booksContinentEl = document.getElementById("continentFilter");
    sortEl = document.getElementById("sortFilter"); // add this select to books.html

    if (booksSearchEl) booksSearchEl.addEventListener("input", renderBooks);
    if (booksContinentEl) booksContinentEl.addEventListener("change", renderBooks);
    if (sortEl) sortEl.addEventListener("change", renderBooks);
}

function renderBooks() {
    const booksList = document.getElementById("booksList");
    if (!booksList) return;

    booksList.innerHTML = "";

    const search = booksSearchEl?.value.toLowerCase() || "";
    const continent = booksContinentEl?.value || "all";
    const sortMode = sortEl?.value || "alpha";

    const readItems = countriesData.filter(c =>
        c.read &&
        c.books &&
        c.books.length > 0 &&
        (search === "" || c.name.toLowerCase().includes(search)) &&
        (continent === "all" || c.continent === continent)
    );

    if (readItems.length === 0) {
        booksList.innerHTML = '<div class="empty-state">No books recorded yet.</div>';
        return;
    }

    // Flatten all books
    let flatBooks = [];
    readItems.forEach(country => {
        country.books.forEach(book => {
            flatBooks.push({
                ...book,
                countryName: country.name,
                countryCode: country.code,
                type: country.type
            });
        });
    });

    // Sort
    if (sortMode === "recent") {
        flatBooks.sort((a, b) => new Date(b.date_read) - new Date(a.date_read));
    } else {
        flatBooks.sort((a, b) => a.countryName.localeCompare(b.countryName));
    }

    // Render
    flatBooks.forEach(entry => {
        const item = document.createElement("div");
        item.classList.add("book-item");

        const flagDiv = document.createElement("div");
        flagDiv.classList.add("flag-thumbnail");

        const img = document.createElement("img");
        if (entry.countryCode.includes("/") || entry.countryCode.startsWith("http")) {
            img.src = entry.countryCode;
        } else {
            img.src = `https://flagcdn.com/w640/${entry.countryCode}.png`;
        }
        img.alt = `Flag of ${entry.countryName}`;
        flagDiv.appendChild(img);

        const details = document.createElement("div");
        details.classList.add("book-details");

        const countryName = document.createElement("div");
        countryName.classList.add("country-name");
        countryName.textContent = entry.countryName;
        details.appendChild(countryName);

        const title = document.createElement("div");
        title.classList.add("book-title");
        title.textContent = entry.title;
        details.appendChild(title);

        const author = document.createElement("div");
        author.classList.add("book-author");
        author.textContent = `by ${entry.author}`;
        details.appendChild(author);

      if (entry.date_read) {
    const date = new Date(entry.date_read);

    // Format as "Jan 2024" (short month)
    const formatted = date.toLocaleString("en-GB", {
        month: "short",
        year: "numeric"
    });

    const dateEl = document.createElement("div");
    dateEl.classList.add("book-date");
    dateEl.textContent = `Read: ${formatted}`;
    details.appendChild(dateEl);
}

        item.appendChild(flagDiv);
        item.appendChild(details);
        booksList.appendChild(item);
    });

    updateStats(countriesData);
}
