# BookShelf - Web Book Management System

[中文文档](README.zh-CN.md) | English

## Introduction

BookShelf is an elegant web-based book management system that enables users to manage and browse books and their chapters. Built with a clean, user-friendly interface, it allows you to organize your digital book collection efficiently.

## Features

- **Book Management**: Add, view, and organize books in your digital library
- **Chapter Management**: Create, edit, and delete chapters for each book
- **Cover Image Support**: Set and display cover images for books
- **User-friendly Interface**: Intuitive design with responsive layout
- **Reading Experience**: Easy navigation between chapters with "Previous" and "Next" controls

## Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (serverless database)
- **Styling**: Tailwind CSS
- **Hosting**: Compatible with any static site hosting service

## Getting Started

1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd bookshelf
   ```

3. Configure Supabase:
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project and note your project URL and anon key
   - Update the Supabase credentials in these files:
     - `js/db-service.js`
     - `js/book-list.js`
     - `admin.html`

4. Serve the files using any HTTP server, for example:
   ```bash
   npx http-server
   ```

5. Access the application in your browser at `http://localhost:8080`

## Usage

### Admin Panel

1. Open `admin.html` to access the admin panel
2. Fill out the form with book ID, chapter ID, title, and content
3. Click "Add Chapter" to add a new chapter
4. Use the table interface to manage existing chapters
5. Set cover images for books using the provided controls

### Reader Interface

1. Open `index.html` to view the book collection
2. Click on any book to view its chapters
3. Navigate between chapters using the previous/next buttons

## Project Structure

- `index.html` - Main page displaying all books
- `book.html` - Page displaying chapters of a specific book
- `chapter.html` - Page for reading individual chapters
- `admin.html` - Admin panel for managing books and chapters
- `js/` - JavaScript files for application functionality
- `css/` - CSS files for styling

## Database Structure

The application uses a Supabase database with the following table structure:

| Field       | Type      | Description                      |
|-------------|-----------|----------------------------------|
| id          | uuid      | Unique identifier for each record |
| book_id     | text      | Identifier for the book          |
| chapter_id  | text      | Identifier for the chapter       |
| title       | text      | Title of the chapter             |
| content     | text      | Content of the chapter           |
| created_at  | timestamp | Creation timestamp               |
| cover_url   | text      | URL for the chapter cover image  |

## License

MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 