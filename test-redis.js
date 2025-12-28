// Quick Redis Connection Test
require('dotenv').config({ path: './api/.env' });
const redis = require('redis');

async function testRedis() {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const db = parseInt(process.env.REDIS_DB || '0', 10);
    
    console.log('Testing Redis connection...');
    console.log(`Host: ${host}, Port: ${port}, DB: ${db}`);
    
    try {
        const client = redis.createClient({
            host: host,
            port: port,
            db: db,
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    return new Error('Redis server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    return undefined;
                }
                return Math.min(options.attempt * 100, 3000);
            }
        });
        
        client.on('error', (err) => {
            console.error('✗ Redis connection error:', err.message);
            console.error('\nMake sure Redis is running:');
            console.error('  - Windows: Use Docker or WSL');
            console.error('  - Docker: docker run -d -p 6379:6379 redis');
            process.exit(1);
        });
        
        client.on('connect', () => {
            console.log('✓ Redis connection successful!');
        });
        
        await new Promise((resolve, reject) => {
            client.ping((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✓ Redis PING response:', result);
                    resolve();
                }
            });
        });
        
        // Test SET/GET
        await new Promise((resolve, reject) => {
            client.set('test_key', 'test_value', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        const value = await new Promise((resolve, reject) => {
            client.get('test_key', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        
        console.log('✓ Redis SET/GET test successful:', value);
        
        // Cleanup
        await new Promise((resolve) => {
            client.del('test_key', () => {
                client.quit();
                resolve();
            });
        });
        
        console.log('✓ All Redis tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Redis test failed!');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testRedis();

