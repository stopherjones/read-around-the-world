// Fetch JSON and render gallery
fetch('countries.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('gallery');
    data.forEach(country => {
      // Create gallery item
      const item = document.createElement('div');
      item.classList.add('gallery-item');

      // Create flag wrapper
      const wrapper = document.createElement('div');
      wrapper.classList.add('flag-wrapper');

      // Flag image
      const img = document.createElement('img');
      img.classList.add('gallery-image');
      if (!country.read) img.classList.add('grayscale');

      // Determine image src
      if (country.code.startsWith('http') || country.code.includes('/')) {
        img.src = country.code; // custom path
      } else {
        img.src = `https://flagcdn.com/w640/${country.code}.png`;
      }
      img.alt = `Flag of ${country.name}`;
      wrapper.appendChild(img);
      item.appendChild(wrapper);

      // Caption
      const caption = document.createElement('div');
      caption.classList.add('caption');
      caption.textContent = country.name;
      item.appendChild(caption);

      // If read, add popup
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

        // Click on flag opens popup
        wrapper.addEventListener('click', () => {
          overlay.classList.add('active');
        });
      }

      gallery.appendChild(item);
    });
  });
