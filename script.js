let countriesData = [];

fetch("countries.json")
    .then(res => res.json())
    .then(data => {
        countriesData = data;
        renderGallery(data);
    });

function renderGallery(data) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    data.forEach(country => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        const wrapper = document.createElement("div");
        wrapper.classList.add("flag-wrapper");

        const img = document.createElement("img");
        img.classList.add("gallery-image");

        if (!country.read) img.classList.add("grayscale");

        // Choose image source
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

        // Popup only for read countries
        if (country.read && country.books.length > 0) {
            const overlay = document.createElement("div");
            overlay.classList.add("popup-overlay");

            const popup = document.createElement("div");
            popup.classList.add("popup-box");

            const title = document.createElement("h2");
            title.textContent = country.name;
            popup.appendChild(title);

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

        gallery.appendChild(item);
    });
}

/* ----------------- FILTER LOGIC ----------------- */

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("continentFilter").addEventListener("change", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);

function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const continent = document.getElementById("continentFilter").value;
    const type = document.getElementById("typeFilter").value;

    const filtered = countriesData.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search);
        const matchContinent = continent === "all" || c.continent === continent;
        const matchType = type === "all" || c.type === type;
        return matchSearch && matchContinent && matchType;
    });

    renderGallery(filtered);
}
