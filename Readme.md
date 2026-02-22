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

### This is backend API assignment developed by Pacheng14557