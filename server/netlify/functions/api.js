require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


// ===============================
// GET ALL BUSINESSES
// ===============================
app.get('/businesses', async (req, res) => {
  try {
    const { q, category } = req.query;

    let query = supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (q) {
      query = query.ilike(
        'business_name',
        `%${q}%`
      );
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    res.status(200).json(data || []);

  } catch (error) {
    console.error('Server error:', error);

    res.status(500).json({
      error: 'Failed to load businesses'
    });
  }
});


// ===============================
// GET BUSINESS STATS
// ===============================
app.get('/businesses/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('city, category');

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    const total = data.length;

    const cities = new Set(
      data.map(b => b.city)
    ).size;

    const categories = new Set(
      data.map(b => b.category)
    ).size;

    res.status(200).json({
      total,
      cities,
      categories
    });

  } catch (error) {
    console.error('Stats error:', error);

    res.status(500).json({
      error: 'Failed to load statistics'
    });
  }
});


// ===============================
// ADD NEW BUSINESS
// ===============================
app.post('/businesses', async (req, res) => {
  try {
    const {
      business_name,
      owner_name,
      category,
      city,
      tagline,
      website,
      email
    } = req.body;

    const fields = {};

    if (!business_name) {
      fields.business_name = 'Business name is required';
    }

    if (!owner_name) {
      fields.owner_name = 'Owner name is required';
    }

    if (!category) {
      fields.category = 'Category is required';
    }

    if (!city) {
      fields.city = 'City is required';
    }

    if (!email) {
      fields.email = 'Email is required';
    }

    if (Object.keys(fields).length > 0) {
      return res.status(400).json({
        fields
      });
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert([
        {
          business_name,
          owner_name,
          category,
          city,
          tagline,
          website,
          email
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    res.status(201).json(data[0]);

  } catch (error) {
    console.error('Add business error:', error);

    res.status(500).json({
      error: 'Failed to add business'
    });
  }
});


// ===============================
// NETLIFY FUNCTION
// ===============================
module.exports.handler = serverless(app);