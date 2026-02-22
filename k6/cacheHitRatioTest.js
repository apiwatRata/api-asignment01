import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        cache_test: {
            executor: 'constant-vus',
            vus: 100,
            duration: '1m',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const res = http.get(`http://localhost:3000/users/1/recommendations?limit=10`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has recommendations': (r) => JSON.parse(r.body).recommendations.length > 0,
    });
    sleep(0.1);
}