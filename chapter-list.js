import dbService from './db-service.js';
import { getUrlParam, showError, showLoading, hideLoading, formatChapterId, setBookTitle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const bookId = getUrlParam('book');

  if (!bookId) {
    showError('No book specified. Please select a book from the home page.');
    hideLoading();
    return;
  }

  setBookTitle(bookId);
  loadChapters(bookId);
});

/**
 * Load and display all chapters for a book
 * @param {string} bookId - The book ID
 */
async function loadChapters(bookId) {
  const chaptersContainer = document.getElementById('chapters-container');
  const chaptersList = chaptersContainer?.querySelector('ul');

  try {
    showLoading();
    await dbService.init();

    const chapters = await dbService.getChapters(bookId);
    console.log('📘 Loading chapter data:', chapters); // ✅ Debug key

    if (!chapters || chapters.length === 0) {
      showError(`No chapters found for book "${bookId}".`);
      return;
    }

    // Set creation date (using the created_at field from the first chapter)
    if (chapters[0] && chapters[0].created_at) {
      const createdDate = new Date(chapters[0].created_at);
      const formattedDate = createdDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const createdDateElement = document.getElementById('created-date');
      if (createdDateElement) {
        createdDateElement.textContent = `Created on: ${formattedDate}`;
      }
    }

    chapters.forEach((chapter, index) => {
      const chapterItem = createChapterItem(chapter, index + 1);
      chaptersList?.appendChild(chapterItem);
    });

    setTimeout(() => {
      document.querySelectorAll('#chapters-container li').forEach((item, index) => {
        setTimeout(() => item.classList.add('visible'), index * 100);
      });
    }, 100);

    chaptersContainer.classList.remove('hidden');
  } catch (error) {
    console.error(`❌ Failed to load chapters for book ${bookId}:`, error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}


/**
 * Create a chapter list item element
 * @param {Object} chapter - The chapter object
 * @param {number} index - The chapter number
 * @returns {HTMLElement} - The chapter list item element
 */
function createChapterItem(chapter, index) {
  const chapterId = chapter.chapterId || chapter.chapter_id;
  const bookId = chapter.bookId || chapter.book_id;
  const title = chapter.title || formatChapterId(chapterId);

  if (!chapterId || !bookId) {
    console.warn('⛔️ Missing chapterId or bookId:', chapter);
    return document.createElement('div'); // Return empty element to avoid errors
  }

  const item = document.createElement('li');
  item.className = 'chapter-item py-4 opacity-0 transition-opacity duration-500';

  item.innerHTML = `
    <a href="chapter.html?book=${encodeURIComponent(bookId)}&chapter=${encodeURIComponent(chapterId)}" 
       class="flex items-center group">
      <span class="text-3xl font-serif font-bold text-amber-300 dark:text-amber-600 mr-4">${index}</span>
      <div>
        <h3 class="text-xl font-serif font-semibold text-amber-900 dark:text-amber-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">${title}</h3>
        <p class="text-amber-700 dark:text-amber-400 mt-1">${chapterId}</p>
      </div>
      <div class="ml-auto">
        <span class="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transform transition-transform duration-300">→</span>
      </div>
    </a>
  `;

  return item;
}

