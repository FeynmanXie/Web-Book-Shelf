/**
 * Chapter View Module
 * Handles the display and navigation of a chapter's content
 */



import {
  showLoading,
  hideLoading,
  showError,
  stringToColor
} from './utils.js';


import { getUrlParam, formatChapterId } from './utils.js';
import dbService from './db-service.js';

let currentBookId = '';
let currentChapterId = '';
let allChapters = [];

document.addEventListener('DOMContentLoaded', () => {
  // Get the book and chapter IDs from the URL
  currentBookId = getUrlParam('book');
  currentChapterId = getUrlParam('chapter');
  
  if (!currentBookId || !currentChapterId) {
    showError('No book or chapter specified. Please select a chapter from the book page.');
    hideLoading();
    return;
  }
  
  // Update the back link
  const backLink = document.getElementById('back-to-chapters');
  backLink.href = `book.html?book=${encodeURIComponent(currentBookId)}`;
  
  // Load the chapter content
  loadChapterContent(currentBookId, currentChapterId);
  
  // Initialize the reading progress bar
  initReadingProgress();
});

/**
 * Load and display the chapter content
 * @param {string} bookId - The book ID
 * @param {string} chapterId - The chapter ID
 */
async function loadChapterContent(bookId, chapterId) {
  const chapterContentElement = document.getElementById('chapter-content');
  const chapterTitleElement = document.getElementById('chapter-title');
  
  try {
    showLoading();
    
    // Initialize the database
    await dbService.init();
    
    // Get all chapters for navigation
    allChapters = await dbService.getChapters(bookId);
    
    if (!allChapters || allChapters.length === 0) {
      // 没有找到任何章节时显示友好的提示
      chapterTitleElement.textContent = "No Chapters Available";
      document.title = "No Chapters Available - Reading";
      
      chapterContentElement.innerHTML = `
        <div class="text-center py-12 text-amber-700">
          <div class="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p class="text-xl font-serif">No Chapters Here Yet...</p>
          <p class="text-sm mt-2">This book doesn't have any chapters available. Please check back later.</p>
        </div>
      `;
      
      // 禁用导航按钮
      document.getElementById('prev-chapter').disabled = true;
      document.getElementById('next-chapter').disabled = true;
      
      // 显示内容区域
      chapterContentElement.classList.remove('hidden');
      setTimeout(() => {
        chapterContentElement.classList.add('fade-in');
      }, 100);
      
      return;
    }
    
    // Get the specific chapter content
    const chapter = await dbService.getChapter(bookId, chapterId);
    
    if (!chapter || !chapter.content) {
      // 特定章节不存在或内容为空时显示友好的提示
      chapterTitleElement.textContent = "Chapter Not Found";
      document.title = "Chapter Not Found - Reading";
      
      chapterContentElement.innerHTML = `
        <div class="text-center py-12 text-amber-700">
          <div class="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-xl font-serif">No Chapter Content Available</p>
          <p class="text-sm mt-2">The requested chapter could not be found or has no content. Please try another chapter.</p>
        </div>
      `;
      
      // 设置导航按钮
      setupChapterNavigation(bookId, chapterId);
      
      // 显示内容区域
      chapterContentElement.classList.remove('hidden');
      setTimeout(() => {
        chapterContentElement.classList.add('fade-in');
      }, 100);
      
      return;
    }
    
    // Set the chapter title
    chapterTitleElement.textContent = chapter.title || formatChapterId(chapter.chapterId);
    document.title = `${chapter.title || formatChapterId(chapter.chapterId)} - Reading`;
    
    // 添加作者信息（如果存在作者信息的元素）
    const authorElement = document.querySelector('.author-info');
    if (authorElement) {
      authorElement.innerHTML = `<span class="font-semibold">FeynmanXie</span>`;
    }
    
    // 添加创建日期（如果有）
    if (chapter.created_at) {
      const createdDate = new Date(chapter.created_at);
      const formattedDate = createdDate.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
        
      const dateElement = document.querySelector('.creation-date');
      if (dateElement) {
        dateElement.textContent = `创建于：${formattedDate}`;
      }
    }
    
    // Format the chapter content (assuming it's plain text)
    const formattedContent = formatChapterContent(chapter.content);
    chapterContentElement.innerHTML = formattedContent;
    
    // Setup navigation buttons
    setupChapterNavigation(bookId, chapterId);
    
    // Show the chapter content with animation
    chapterContentElement.classList.remove('hidden');
    setTimeout(() => {
      chapterContentElement.classList.add('fade-in');
    }, 100);
    
    // Show the progress bar
    document.getElementById('progress-container').classList.remove('hidden');
  } catch (error) {
    console.error(`Failed to load chapter ${chapterId} from book ${bookId}:`, error);
    
    // 显示友好的错误信息而不是技术性错误
    chapterTitleElement.textContent = "Something Went Wrong";
    document.title = "Error - Reading";
    
    chapterContentElement.innerHTML = `
      <div class="text-center py-12 text-amber-700">
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-xl font-serif">No Books Here Yet...</p>
        <p class="text-sm mt-2">There was an issue loading the chapter. Please try again later.</p>
      </div>
    `;
    
    // 禁用导航按钮
    document.getElementById('prev-chapter').disabled = true;
    document.getElementById('next-chapter').disabled = true;
    
    // 显示内容区域
    chapterContentElement.classList.remove('hidden');
    setTimeout(() => {
      chapterContentElement.classList.add('fade-in');
    }, 100);
  } finally {
    hideLoading();
  }
}

/**
 * Format the chapter content for display
 * @param {string} content - The raw chapter content
 * @returns {string} - Formatted HTML content
 */
function formatChapterContent(content) {
  if (!content) return '<p>No content available for this chapter.</p>';
  
  // Split content by double newlines (paragraphs)
  const paragraphs = content.split(/\n\n+/);
  
  // Convert each paragraph to a <p> element
  return paragraphs
    .map(p => {
      // Skip empty paragraphs
      if (!p.trim()) return '';
      
      // Check if it's a heading (starts with # or ##)
      if (p.trim().startsWith('# ')) {
        return `<h2 class="text-2xl font-serif font-bold mt-8 mb-4">${p.trim().substring(2)}</h2>`;
      } else if (p.trim().startsWith('## ')) {
        return `<h3 class="text-xl font-serif font-bold mt-6 mb-3">${p.trim().substring(3)}</h3>`;
      }
      
      // Regular paragraph
      return `<p class="mb-4 leading-relaxed">${p}</p>`;
    })
    .join('');
}

/**
 * Setup the previous/next chapter navigation buttons
 * @param {string} bookId - The book ID
 * @param {string} chapterId - The current chapter ID
 */
function setupChapterNavigation(bookId, chapterId) {
  const prevButton = document.getElementById('prev-chapter');
  const nextButton = document.getElementById('next-chapter');
  
  // Find the current chapter index
  const currentIndex = allChapters.findIndex(ch => ch.chapter_id === chapterId);
  
  if (currentIndex === -1) {
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }
  
  // Setup previous chapter button
  if (currentIndex === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
    const prevChapter = allChapters[currentIndex - 1];
    prevButton.onclick = () => {
      window.location.href = `chapter.html?book=${encodeURIComponent(bookId)}&chapter=${encodeURIComponent(prevChapter.chapter_id)}`;
    };
  }
  
  // Setup next chapter button
  if (currentIndex === allChapters.length - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
    const nextChapter = allChapters[currentIndex + 1];
    nextButton.onclick = () => {
      window.location.href = `chapter.html?book=${encodeURIComponent(bookId)}&chapter=${encodeURIComponent(nextChapter.chapter_id)}`;
    };
  }
}

/**
 * Initialize the reading progress bar
 */
function initReadingProgress() {
  const progressBar = document.getElementById('progress-bar');
  
  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    // Calculate the scroll percentage
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }
  
  // Update on scroll
  window.addEventListener('scroll', updateProgress);
  
  // Initial update
  updateProgress();
}