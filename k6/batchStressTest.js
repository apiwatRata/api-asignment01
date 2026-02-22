import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        stress_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 20 },  // เพิ่มผู้ใช้จำลองถึง 20 ภายใน 10s
                { duration: '20s', target: 50 },  // เพิ่มต่อจนถึง 50 VUs
                { duration: '1m', target: 100 }, // เพิ่มต่อจนถึง 100 VUs
                { duration: '30s', target: 0 },   // ลดลงเหลือ 0
            ],
            gracefulRampDown: '5s',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    }
};

export default function () {
    function randomLimit() {
        return Math.floor(Math.random() * 100) + 1; // 1–100
    }

    const res = http.get(`http://localhost:3000/recommendations/batch?limit=${randomLimit()}&page=1`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has recommendations': (r) => JSON.parse(r.body).results.length > 0,
    });
    sleep(0.1);
}
