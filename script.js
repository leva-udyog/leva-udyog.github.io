let businesses = [];
let filteredList = [];
let currentPage = 1;
const perPage = 9;

async function fetchBusinesses() {
  const res = await fetch('data/businesses.json');
  businesses = await res.json();
  filteredList = businesses; // initial full list
  setupFilters();
  renderPage();
}

function paginate(array, page, size) {
  return array.slice((page - 1) * size, page * size);
}

function renderPage() {
  const container = document.getElementById('businessList');
  const paginated = paginate(filteredList, currentPage, perPage);
  container.innerHTML = '';

  if (paginated.length === 0) {
    container.innerHTML = '<p class="text-center col-span-3">No businesses found.</p>';
    renderPagination(); // clears pagination
    return;
  }

  const fragment = document.createDocumentFragment();

  paginated.forEach(biz => {
    const card = document.createElement('div');
    card.className = "bg-white p-4 rounded shadow";
    card.innerHTML = `
      <img loading="lazy" src="${biz.image}" class="w-full h-40 object-cover mb-2 rounded" />
      <h2 class="text-xl font-bold">${biz.name}</h2>
      <p><strong>Category:</strong> ${biz.category}</p>
      <p><strong>Location:</strong> ${biz.location}</p>
      <p class="text-sm mt-1">${biz.description}</p>
      <p class="mt-2 text-blue-600 font-medium">📞 ${biz.contact}</p>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  renderPagination();
}

function renderPagination() {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  const totalPages = Math.ceil(filteredList.length / perPage);

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `px-3 py-1 m-1 border rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white'}`;
    btn.innerText = i;
    btn.onclick = () => {
      currentPage = i;
      renderPage();
    };
    container.appendChild(btn);
  }
}

function setupFilters() {
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('categoryFilter');

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 300);
  });

  categoryFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
  const searchText = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;

  filteredList = businesses.filter(biz => {
    const matchesSearch =
      biz.name.toLowerCase().includes(searchText) ||
      biz.location.toLowerCase().includes(searchText);
    const matchesCategory = !selectedCategory || biz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  currentPage = 1;
  renderPage();
}

fetchBusinesses();
