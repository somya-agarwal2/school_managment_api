const mysql = require('mysql2/promise');

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length) {
    console.error(` Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1); // Exit process if required variables are missing
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

// Function to test the database connection
const testDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL');
        connection.release(); // Release the connection after successful check
    } catch (error) {
        console.error(' MySQL Connection Error:', error.message);

        switch (error.code) {
            case 'ER_ACCESS_DENIED_ERROR':
                console.error(' Access denied! Check your MySQL credentials.');
                break;
            case 'ER_BAD_DB_ERROR':
                console.error(' Database not found! Check if the database exists.');
                break;
            case 'ECONNREFUSED':
                console.error(' Connection refused! Ensure MySQL is running and accessible.');
                break;
            case 'ETIMEDOUT':
                console.error(' Connection timeout! Check network settings.');
                break;
            default:
                console.error(' Unknown MySQL error:', error.code);
        }

        process.exit(1); // Stop the application if database connection fails
    }
};

// Test database connection when the app starts
testDatabaseConnection();

// Handling unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
});

// Handling process termination (CTRL+C or system stop)
process.on('SIGINT', async () => {
    console.log('\n🔄 Closing MySQL connection pool...');
    await pool.end();
    console.log('✅ MySQL pool closed. Exiting process.');
    process.exit(0);
});

module.exports = pool;
