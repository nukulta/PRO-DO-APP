const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SUPABASE_JWT_SECRET = (process.env.SUPABASE_JWT_SECRET || 'your-supabase-jwt-secret-here').trim(); // CRITICAL: Get this from Supabase Dashboard > Settings > API

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use Service Role Key if possible for full access, or Anon key
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('ProDO Backend is running');
});

// Custom Auth Routes (Wrapped Supabase Auth)

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Use Supabase Auth to Sign Up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || '',
                }
            }
        });

        if (error) throw error;

        // Note: data.user will be null if email confirmation is required and not yet clicked?
        // Actually data.user is usually returned but session might be null.

        res.json({
            message: 'User registered successfully. Please check your email to confirm if required.',
            user: data.user
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use Supabase Auth to Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        // Return the full session tokens provided by Supabase
        res.json({
            message: 'Login successful',
            token: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const secret = process.env.SUPABASE_JWT_SECRET || '';
    console.log(`Loaded JWT Secret (first 5 chars): ${secret.substring(0, 5)}...`);
    console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
});
