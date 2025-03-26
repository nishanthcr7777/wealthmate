const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', chatRoutes);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wealthmate.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Temporary user storage (replace with a database in production)
const users = [];

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user
        users.push({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this after your existing routes

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Add this middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Add profile update endpoint
app.post('/api/profile/update', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        const { fullName, phone, location } = req.body;

        // Find user (in a real app, you'd update this in a database)
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile
        user.profile = {
            fullName,
            phone,
            location
        };

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Budget tracking endpoints
app.post('/api/budget/add', verifyToken, async (req, res) => {
    try {
        const { category, amount, type, date } = req.body;
        // Store transaction data
        res.json({ message: 'Transaction added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Investment portfolio endpoints
app.post('/api/portfolio/add', verifyToken, async (req, res) => {
    try {
        const { stockSymbol, shares, purchasePrice } = req.body;
        // Add investment to portfolio
        res.json({ message: 'Investment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Financial goals endpoints
app.post('/api/goals/create', verifyToken, async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        // Store financial goal
        res.json({ message: 'Goal created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Analytics endpoints
app.get('/api/analytics/summary', verifyToken, async (req, res) => {
    try {
        // Generate financial summary
        const summary = {
            totalBalance: 58200,
            investments: 45750,
            savings: 12450,
            monthlyExpenses: 3200
        };
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// AI Assistant endpoints
app.post('/api/ai/advice', verifyToken, async (req, res) => {
    try {
        const { query } = req.body;
        // Generate AI-powered financial advice
        res.json({ advice: 'AI-generated financial advice would go here' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Bank account linking endpoints
app.post('/api/accounts/link', verifyToken, async (req, res) => {
    try {
        const { bankName, accountNumber } = req.body;
        // Link bank account
        res.json({ message: 'Account linked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add this with other routes
app.get('/budget', (req, res) => {
    res.sendFile(path.join(__dirname, 'budget.html'));
});