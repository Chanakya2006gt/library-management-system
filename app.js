// Library Catalog Data & Circulation Engine
const catalog = [
  { id: 1, isbn: "978-0131103627", title: "The C Programming Language", author: "Kernighan & Ritchie", genre: "Computer Science", copies: 4, shelf: "Rack A-12" },
  { id: 2, isbn: "978-0262033848", title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", genre: "Computer Science", copies: 2, shelf: "Rack C-04" },
  { id: 3, isbn: "978-0132350884", title: "Clean Code: A Handbook of Agile", author: "Robert C. Martin", genre: "Software Engineering", copies: 0, shelf: "Rack B-09" },
  { id: 4, isbn: "978-0321125217", title: "Domain-Driven Design", author: "Eric Evans", genre: "Software Engineering", copies: 3, shelf: "Rack B-14" },
  { id: 5, isbn: "978-0136006633", title: "Computer Networks (5th Edition)", author: "Andrew S. Tanenbaum", genre: "Computer Science", copies: 5, shelf: "Rack D-02" },
  { id: 6, isbn: "978-0387953854", title: "Linear Algebra Done Right", author: "Sheldon Axler", genre: "Mathematics", copies: 6, shelf: "Rack M-01" }
];

let borrowedItems = [
  { id: 101, isbn: "978-0262033848", title: "Introduction to Algorithms (CLRS)", date: "2026-09-01", due: "2026-09-21" },
  { id: 102, isbn: "978-0136006633", title: "Computer Networks", date: "2026-09-05", due: "2026-09-25" }
];

function renderCatalog(items) {
  const grid = document.getElementById("catalogGrid");
  grid.innerHTML = items.map(book => `
    <div class="book-card">
      <div>
        <div class="book-header">
          <span class="isbn-tag">${book.isbn}</span>
          <span class="meta-chip">${book.shelf}</span>
        </div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">By ${book.author}</p>
        <div class="book-meta">
          <span class="meta-chip">${book.genre}</span>
        </div>
      </div>
      <div class="card-footer">
        <span class="copies-status ${book.copies > 0 ? 'in-stock' : 'out'}">
          ${book.copies > 0 ? `✓ ${book.copies} Copies Ready` : '✕ Checked Out'}
        </span>
        <button class="btn-borrow" ${book.copies === 0 ? 'disabled' : ''} onclick="borrowBook(${book.id})">
          Borrow Book
        </button>
      </div>
    </div>
  `).join("");
}

function renderBorrowed() {
  const tbody = document.getElementById("borrowedTableBody");
  document.getElementById("borrowedCount").textContent = borrowedItems.length;
  tbody.innerHTML = borrowedItems.map(item => `
    <tr>
      <td><span style="font-family:var(--mono); color:var(--text-muted); font-size:0.8rem;">${item.isbn}</span></td>
      <td><b>${item.title}</b></td>
      <td>${item.date}</td>
      <td><span style="color:#38bdf8; font-weight:600;">${item.due}</span></td>
      <td><button class="btn-return" onclick="returnBook(${item.id})">Return to Shelf</button></td>
    </tr>
  `).join("");
}

function borrowBook(bookId) {
  const book = catalog.find(b => b.id === bookId);
  if (book && book.copies > 0) {
    book.copies--;
    borrowedItems.push({
      id: Date.now(),
      isbn: book.isbn,
      title: book.title,
      date: new Date().toISOString().split("T")[0],
      due: "2026-10-01"
    });
    renderCatalog(catalog);
    renderBorrowed();
  }
}

function returnBook(borrowId) {
  const idx = borrowedItems.findIndex(i => i.id === borrowId);
  if (idx !== -1) {
    const item = borrowedItems[idx];
    const catItem = catalog.find(b => b.isbn === item.isbn);
    if (catItem) catItem.copies++;
    borrowedItems.splice(idx, 1);
    renderCatalog(catalog);
    renderBorrowed();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(catalog);
  renderBorrowed();

  document.getElementById("catalogSearch").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = catalog.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q));
    renderCatalog(filtered);
  });

  const tagBtns = document.querySelectorAll(".tag-btn");
  tagBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tagBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const g = btn.getAttribute("data-genre");
      if (g === "all") renderCatalog(catalog);
      else renderCatalog(catalog.filter(b => b.genre === g));
    });
  });
});
