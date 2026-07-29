import http from 'http';

const testRateLimit = () => {
    const postData = JSON.stringify({
        email: "test@campusspace.in",
        password: "invalidpassword"
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/signin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log("Starting Rate Limit Verification test...");
    console.log("Firing 7 consecutive requests to http://localhost:3000/signin...");

    let completed = 0;

    for (let i = 1; i <= 7; i++) {
        setTimeout(() => {
            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    console.log(`[Request #${i}] Status: ${res.statusCode} | Response: ${body.trim()}`);
                    completed++;
                    if (completed === 7) {
                        console.log("\nVerification finished. Requests #6 and #7 should have failed with status 429.");
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`Request #${i} failed: ${e.message}`);
            });

            req.write(postData);
            req.end();
        }, i * 150); // slight delay to avoid client-side socket bottlenecks
    }
};

testRateLimit();
