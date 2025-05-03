import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MongoClient } from 'npm:mongodb@6.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const client = new MongoClient(Deno.env.get('MONGODB_URI') || '');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await client.connect();
    const db = client.db('bookstore');
    const collection = db.collection('books');

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    const [bookId, chapterId] = path;

    // GET /books - List all books
    if (!bookId) {
      const books = await collection.distinct('bookId');
      return new Response(JSON.stringify(books), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /books/:bookId - List all chapters
    if (bookId && !chapterId) {
      const chapters = await collection
        .find({ bookId })
        .sort({ chapterId: 1 })
        .toArray();
      return new Response(JSON.stringify(chapters), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /books/:bookId/:chapterId - Get specific chapter
    if (bookId && chapterId) {
      const chapter = await collection.findOne({ bookId, chapterId });
      if (!chapter) {
        return new Response(JSON.stringify({ error: 'Chapter not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid route' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
});