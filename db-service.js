/**
 * Database Service Module (for Supabase REST API Table)
 */

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

class DBService {
  constructor() {
    this.tableUrl = `${SUPABASE_URL}/rest/v1/chapters`;
    this.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async init() {
    return true;
  }

  /** Get all books (unique book_id list) */
  async getBooks() {
    try {
      const res = await fetch(`${this.tableUrl}?select=book_id`, { headers: this.headers });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Remove duplicates
      const bookIds = [...new Set(data.map(item => item.book_id))];
      return bookIds;
    } catch (error) {
      console.error('Failed to get books:', error);
      throw new Error(`Failed to get books: ${error.message}`);
    }
  }

  /** Get all chapters for a specific book */
  async getChapters(bookId) {
    try {
      const url = `${this.tableUrl}?book_id=eq.${encodeURIComponent(bookId)}&select=chapter_id,title,book_id,created_at&order=chapter_id.asc`;
      const res = await fetch(url, { headers: this.headers });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      console.error(`Failed to get chapters for book ${bookId}:`, error);
      throw new Error(`Failed to get chapters: ${error.message}`);
    }
  }

  /** Get a specific chapter from a book */
  async getChapter(bookId, chapterId) {
    try {
      const url = `${this.tableUrl}?book_id=eq.${encodeURIComponent(bookId)}&chapter_id=eq.${encodeURIComponent(chapterId)}&select=*`;
      const res = await fetch(url, { headers: this.headers });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.length === 0) throw new Error('Chapter not found');
      return data[0];
    } catch (error) {
      console.error(`Failed to get chapter ${chapterId} from book ${bookId}:`, error);
      throw new Error(`Failed to get chapter: ${error.message}`);
    }
  }

  /** Add a new chapter */
  async addChapter({ bookId, chapterId, title, content }) {
    try {
      // Get current time as creation time
      const currentTime = new Date().toISOString();
      
      const body = JSON.stringify([{ 
        book_id: bookId, 
        chapter_id: chapterId, 
        title, 
        content, 
        created_at: currentTime 
      }]);
      
      const res = await fetch(this.tableUrl, {
        method: 'POST',
        headers: this.headers,
        body
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      console.error('Failed to add chapter:', error);
      throw new Error(`Failed to add chapter: ${error.message}`);
    }
  }

  async close() {}
}

const dbService = new DBService();
export default dbService;
