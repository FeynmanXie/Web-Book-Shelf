/**
 * Book List Module
 * Handles the display and interaction of books on the index page
 */
import {
  showLoading,
  hideLoading,
  showError,
  stringToColor
} from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

/**
 * Load and display all books
 */
async function loadBooks() {
  const booksContainer = document.getElementById('books-container');

  try {
    showLoading();

    // 获取所有章节（含封面），按 book_id + chapter_id 排序
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chapters?select=book_id,chapter_id,cover_url&order=book_id.asc,chapter_id.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      }
    });

    const chapters = await res.json();

    if (!Array.isArray(chapters) || chapters.length === 0) {
      // 创建一个"No Books Here Yet..."的提示，而不是报错
      const noBookMessage = document.createElement('div');
      noBookMessage.className = 'text-center py-12 text-amber-700 text-xl font-serif';
      noBookMessage.innerHTML = `
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p>No Books Here Yet...</p>
        <p class="text-sm mt-2">Please check back later for updates.</p>
      `;
      booksContainer.appendChild(noBookMessage);
      booksContainer.classList.remove('hidden');
      return;
    }

    // 提取每本书的第一章
    const bookMap = new Map();
    chapters.forEach(chapter => {
      if (!bookMap.has(chapter.book_id)) {
        bookMap.set(chapter.book_id, chapter.cover_url);
      }
    });

    bookMap.forEach((coverUrl, bookId) => {
      const card = createBookCard(bookId, coverUrl);
      booksContainer.appendChild(card);
    });

    booksContainer.classList.remove('hidden');
  } catch (error) {
    console.error('Failed to load books:', error);
    // 发生错误时也显示友好的提示，而不是错误信息
    const errorMessage = document.createElement('div');
    errorMessage.className = 'text-center py-12 text-amber-700 text-xl font-serif';
    errorMessage.innerHTML = `
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p>No Books Here Yet...</p>
      <p class="text-sm mt-2">There was an issue loading the books. Please try again later.</p>
    `;
    booksContainer.appendChild(errorMessage);
    booksContainer.classList.remove('hidden');
  } finally {
    hideLoading();
  }
}

/**
 * Create a book card element
 * @param {string} bookId - The book ID
 * @param {string|null} coverUrl - Optional cover image URL
 * @returns {HTMLElement} - The book card element
 */
function createBookCard(bookId, coverUrl) {
  const card = document.createElement('div');
  card.className = 'book-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105';

  const formattedTitle = bookId
    .replace(/-/g, ' ')
    .replace(/(\b\w)/g, char => char.toUpperCase());

  const finalCoverUrl = coverUrl || 'https://flowbite.com/docs/images/examples/image-3@2x.jpg';

  card.innerHTML = `
    <a href="book.html?book=${encodeURIComponent(bookId)}" class="block">
      <div class="w-full relative overflow-hidden rounded-t-lg" style="aspect-ratio: 3 / 4;">
        <img src="${finalCoverUrl}" alt="${formattedTitle}" class="w-full h-full object-cover" />
      </div>
      <div class="p-4">
        <h2 class="text-xl font-serif font-semibold text-amber-900 dark:text-amber-100">${formattedTitle}</h2>
        <p class="text-amber-700 dark:text-amber-300 mt-1">作者：<span class="font-semibold">FeynmanXie</span></p>
        <p class="text-amber-700 dark:text-amber-300 mt-2">点击查看章节</p>
      </div>
    </a>
  `;

  return card;
}
