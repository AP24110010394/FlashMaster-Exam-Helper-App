async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user@flashmaster.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful');

        const res = await fetch('http://localhost:5000/api/studyplan', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                examDate: '2026-12-31',
                subjects: ['Math'],
                topics: ['Algebra'],
                dailyStudyHours: 2
            })
        });
        const data = await res.json();
        console.log('Response Status:', res.status);
        console.log('Data:', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
