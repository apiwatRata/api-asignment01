### This is a NodeJS project for practice implementing API with ML.

## Prerequisites

---
- Node 24.12.0
- npm 11.6.2
- Docker
- Docker Compose

## Dependencies

---
- [express](https://expressjs.com/) - Web framework
- [sequelize](https://sequelize.org/) - ORM
- [pg](https://www.npmjs.com/package/pg) - PostgreSQL client
- [pg-hstore](https://www.npmjs.com/package/pg-hstore) - hstore support for Sequelize
- [redis](https://www.npmjs.com/package/redis) - Redis client
- [dayjs](https://day.js.org/) - Date/time utility
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable loader
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) - Migration & seed CLI

## Dev Dependencies

---
- [nodemon](https://www.npmjs.com/package/nodemon) - Auto-restart server during development


# **Installation**

---

For running the server, make sure you have **Docker** and **Docker Compose** installed on your machine.

### Use the following command to start the Docker containers:
```bash
docker compose up -d
```

## **Database Migration**
### Run migrations inside the container:

```bash
docker compose exec node-app sh

npx sequelize-cli db:seed:all
```

# **Architecture Overview**

---
The system is designed as a modular architecture that separates concerns into distinct layers, ensuring scalability, maintainability, and clear data flow.

## High-level System Design Diagram or Description
At a high level, the system consists of:
- **API Route** – Handles incoming HTTP requests and maps them to the appropriate controller.
- **Controller** – Manages the request/response cycle and orchestrates the flow between services and repositories.
- **Service** – Contains business logic, including recommendation workflows and validation rules.
- **Repository** – Encapsulates database queries and provides an abstraction layer for data access.
- **Model** – Defines database schemas and includes logic for calculating recommendation scores.


## Explanation of Each Architectural Layer
- **API Route**: Defines endpoints (e.g., `users/recommendations`, `/recommendations/batch`) and routes requests to controllers.
- **Controller**: Coordinates between services and repositories, ensuring proper request handling and response formatting.
- **Service**: Implements business rules, integrates recommendation algorithms, and processes data before returning results.
- **Repository**: Provides reusable database query methods, ensuring clean separation between business logic and data access.
- **Model**: Represents database entities (e.g., User, Content, WatchHistory) and includes methods for computing recommendation scores.


## Data Flow Through the System
1. **API Layer receives request** – The system accepts incoming HTTP requests from the client.
2. **Validate parameter rules** – Input parameters are checked against validation rules to ensure correctness.
3. **Check cache for user ID** – The system verifies if recommendation data for the given user ID exists in cache.
    - If found, respond immediately with cached data.
4. **Query and compute if not cached** – If no cache is found, the system queries content candidates from the database and computes recommendation scores.
5. **Set cache with recommendation data** – The computed recommendation results are stored in cache for future requests.
6. **Respond with recommendation data** – The final recommendation list is returned to the client as a structured response.


## How the Recommendation Model Integrates with Database Queries
- The recommendation model relies on **user watch history** and **content metadata** stored in the database.
- Queries fetch relevant data (e.g., genres, popularity_score, user activity).
- The model processes this data to compute similarity scores or prediction values.
- Results are returned to the API as a structured response.

# **Design Decisions**

---

### Caching strategy and TTL rationale
We use Redis as the caching layer to store recommendation results.  
TTL (Time-to-Live) is set to 10 minutes to balance between fresh data and system performance.  
This ensures that frequently requested recommendations can be served quickly while still keeping data reasonably up-to-date.

### Error handling philosophy
- A utility function (`utils`) is implemented to handle different error status codes, ensuring consistent and standardized API responses.
- Recommendation batch requests are limited to 5 minutes runtime to prevent request hanging and ensure system stability.

### Database indexing strategy
- Indexes are applied on `user_id`, `content_id`, and a composite index `(user_id, content_id)` within the `watchhistory` table.
- This indexing strategy accelerates queries for recommendation generation, especially when filtering by user activity and content metadata.

### Scoring algorithm rationale and weight choices
The recommendation scoring algorithm prioritizes popularity while incorporating genre preferences and recency:
- **Popularity score**: 0.4
- **Genre frequency**: 0.35
- **Recently watched content**: 0.15
- **Noise/randomization factor**: 0.1

Weights are chosen to emphasize popular content while still tailoring recommendations to user behavior and introducing diversity.

# **Performance Results**

---

### k6 Test Results with Metrics are available in:  
`./k6/Load test result.pdf`

### Cache Hit Rate Analysis are available in:
`./k6/Load test result.pdf`

# Trade-offs and Future Improvements

--- 

### Known limitations of current implementation
- Recommendation scoring currently relies on heuristic/simple weights, which may not be as accurate as machine learning models.
- Cache TTL is fixed, which may not suit all use cases.
- Database query latency remains high under heavy concurrent requests.
- Recommendation computation could become a bottleneck as the user base grows.

### Proposed enhancements if time permitted
- Implement a more robust concurrency control approach to handle simultaneous requests efficiently.
- Integrate machine learning models for recommendations, incorporating additional features such as user age.
- Introduce content tiering that influences recommendation scores:
    - Movies in the **Premium subscription tier** will receive higher recommendation weights.
    - Movies in the **Basic tier** will have moderate influence.
    - Movies in the **Free tier** will have the lowest weight.
- Optimize the performance of recommendation batch processing to reduce execution time.
- Add authentication and authorization mechanisms for secure access.
- Seed a larger number of users and conduct load testing with recommendation batch jobs to evaluate scalability.
- Develop a frontend application, potentially using React Native, to experiment with mobile app development.

### This is backend API assignment developed by Pacheng14557