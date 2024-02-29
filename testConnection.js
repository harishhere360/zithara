const db = require('./db');

async function testConnection() {
  try {
    // Attempt to connect
    const client = await db.connect();
    console.log('Connected to PostgreSQL!');
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
  }
}

// Call the test function
testConnection();
