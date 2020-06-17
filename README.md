# 20K Leagues

[LIVE APP](link goes here)

[CLIENT REPO](link goes here)

## Summary

20K Leagues is a digital scuba dive log for divers who are interested in marine life. While there may be digital dive logs that provide more features, we have found that too many features can often be distracting. Instead, 20K Leagues provides the features that divers who are interested in seeing unique and fascinating marine life care about.

With 20K Leagues you can log all of your dives and get some interesting fast facts: how many days have you spent underwater, how deep was your deepest dive, how long was your longest dive?

But most importantly, 20K Leagues gives you the ability to track where you spotted some of the most elusive creatures. Not only that, but you have access to where all of our divers have seen these animals. This allows you to records memories of amazing experiences and to get an idea of where to go to see something new.

## Endpoints

- /api/users
  - GET
  - POST
- /api/users/:user_id
  - PATCH
- /api/dives
  - GET
  - POST
- /api/dives/:dive_id
  - PATCH
  - DELETE
- /api/certs
  - GET
  - POST
- /api/certs/:cert_id
  - DELETE
- /api/animalTracker
  - GET
  - POST
  - DELETE
- /api/animals
  - GET
- /api/countries
  - GET
- /api/specialties
  - GET

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Postgrator for SQL migration
- Knex.js for SQL query builder
- Supertest
- Mocha
- Chai
