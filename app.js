const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use customerRoutes for /api/customers
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
