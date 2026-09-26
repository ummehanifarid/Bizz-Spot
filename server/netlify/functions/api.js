require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Note: routes are defined WITHOUT the /api prefix here.
// netlify.toml redirects /api/* -> /.netlify/functions/api/:splat,
// so by the time a request reaches this function, /api has already been stripped.

app.get('/businesses', async (req, res) => {
  const { q, category } = req.query;
  let query = supabase.from('businesses').select('*').order('created_at', { ascending: false });

  if (q) query = query.ilike('business_name', `%${q}%`);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/businesses/stats', async (req, res) => {
  const { data, error } = await supabase.from('businesses').select('city, category');
  if (error) return res.status(500).json({ error: error.message });

  const total = data.length;
  const cities = new Set(data.map(b => b.city)).size;
  const categories = new Set(data.map(b => b.category)).size;

  res.json({ total, cities, categories });
});

app.post('/businesses', async (req, res) => {
  const { business_name, owner_name, category, city, tagline, website, email } = req.body;

  const fields = {};
  if (!business_name) fields.business_name = 'Business name is required';
  if (!owner_name) fields.owner_name = 'Owner name is required';
  if (!category) fields.category = 'Category is required';
  if (!city) fields.city = 'City is required';
  if (!email) fields.email = 'Email is required';

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ fields });
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert([{ business_name, owner_name, category, city, tagline, website, email }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports.handler = serverless(app);
