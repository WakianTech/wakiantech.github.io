const postsPerPage = 4;
let currentPage = 1;
let currentCategory = 'all';
let searchTerm = '';
let allPosts = [];

async function loadPosts() {
  try {
    const response = await fetch('data/posts_data.json');
    allPosts = await response.json();
    showPage(1);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
}

function getFilteredPosts() {
  return allPosts.filter(post => {
    const content = `${post.title} ${post.date} ${post.category} ${post.content}`.toLowerCase();
    return (currentCategory === 'all' || post.category === currentCategory) &&
           content.includes(searchTerm.toLowerCase());
  });
}

function renderPosts(posts) {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'news-post';
    postEl.dataset.category = post.category;

    let imageHTML = post.image
      ? `<img src="${post.image}" alt="${post.title}" class="news-image">`
      : "";

    postEl.innerHTML = `
      ${imageHTML}
      <span class="tag">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
      <h2>${post.title}</h2>
      <p><strong>Date:</strong> ${post.date}</p>
      <p>${post.content}</p>
    `;

    container.appendChild(postEl);
  });
}

function showPage(page) {
  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  currentPage = Math.max(1, Math.min(page, totalPages));

  const pagePosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  renderPosts(pagePosts);

  document.getElementById('page-number').innerText = `Page ${currentPage}`;
}

function nextPage() {
  showPage(currentPage + 1);
}

function prevPage() {
  showPage(currentPage - 1);
}

function filterByCategory(category) {
  currentCategory = category;
  currentPage = 1;
  showPage(currentPage);
}

function searchPosts() {
  searchTerm = document.getElementById('search-input').value;
  currentPage = 1;
  showPage(currentPage);
}

document.addEventListener('DOMContentLoaded', loadPosts);