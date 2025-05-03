# BookShelf - 网页图书管理系统

中文 | [English](README.md)

## 简介

BookShelf是一个优雅的网页图书管理系统，允许用户管理和浏览书籍及其章节。它具有简洁、用户友好的界面，帮助您高效地组织数字图书收藏。

## 功能特性

- **图书管理**：在您的数字图书馆中添加、查看和组织书籍
- **章节管理**：为每本书创建、编辑和删除章节
- **封面图片支持**：为书籍设置和显示封面图片
- **用户友好界面**：直观的设计和响应式布局
- **阅读体验**：通过"上一章"和"下一章"控件轻松在章节间导航

## 技术栈

- **前端**：HTML、CSS、JavaScript
- **后端**：Supabase（无服务器数据库）
- **样式**：Tailwind CSS
- **托管**：兼容任何静态网站托管服务

## 快速开始

1. 克隆此仓库：
   ```bash
   git clone <仓库链接>
   ```

2. 导航到项目目录：
   ```bash
   cd bookshelf
   ```

3. 配置Supabase：
   - 在[supabase.com](https://supabase.com)创建Supabase账户
   - 创建新项目并记下您的项目URL和匿名密钥
   - 在以下文件中更新Supabase凭据：
     - `js/db-service.js`
     - `js/book-list.js`
     - `admin.html`

4. 使用任何HTTP服务器提供文件，例如：
   ```bash
   npx http-server
   ```

5. 在浏览器中访问`http://localhost:5173`来使用应用

## 使用方法

### 管理面板

1. 打开`admin.html`访问管理面板
2. 填写书籍ID、章节ID、标题和内容
3. 点击"添加章节"添加新章节
4. 使用表格界面管理现有章节
5. 使用提供的控件为书籍设置封面图片

### 阅读界面

1. 打开`index.html`查看图书收藏
2. 点击任意书籍查看其章节
3. 使用上一章/下一章按钮在章节间导航

## 项目结构

- `index.html` - 显示所有书籍的主页
- `book.html` - 显示特定书籍章节的页面
- `chapter.html` - 阅读单个章节的页面
- `admin.html` - 管理书籍和章节的管理面板
- `js/` - 应用功能的JavaScript文件
- `css/` - 样式的CSS文件

## 数据库结构

应用程序使用Supabase数据库，表结构如下：

| 字段        | 类型      | 描述                           |
|-------------|-----------|-------------------------------|
| id          | uuid      | 每条记录的唯一标识符           |
| book_id     | text      | 书籍标识符                     |
| chapter_id  | text      | 章节标识符                     |
| title       | text      | 章节标题                       |
| content     | text      | 章节内容                       |
| created_at  | timestamp | 创建时间戳                     |
| cover_url   | text      | 章节封面图片URL                |

## 许可证

MIT许可证。详情请参阅LICENSE文件。

## 贡献

欢迎贡献！请随时提交Pull Request。 