export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function showError(message, container = document.getElementById('error-container')) {
  const messageElement = document.getElementById('error-message');
  messageElement.textContent = message;
  container.classList.remove('hidden');
}

export function hideLoading() {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.classList.add('hidden');
  }
}

export function showLoading() {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.classList.remove('hidden');
  }
}

export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 60 + 10;
  const s = 60 + (Math.abs(hash) % 30);
  const l = 40 + (Math.abs(hash) % 20);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function formatChapterId(chapterId) {
  if (!chapterId || typeof chapterId !== 'string') return 'Untitled Chapter';
  return chapterId
    .replace(/^chapter-/i, 'Chapter ')
    .replace(/-/g, ' ')
    .replace(/(\b\w)/g, char => char.toUpperCase());
}

export function setBookTitle(bookId) {
  const titleElement = document.getElementById('book-title');
  if (!titleElement) return; // ✅ Prevent errors on pages without book-title element

  const formattedTitle = bookId
    .replace(/-/g, ' ')
    .replace(/(\b\w)/g, char => char.toUpperCase());

  titleElement.textContent = formattedTitle;
  document.title = `${formattedTitle} - Chapters`;
}
