# Decisions

## Why I Chose This Stack

I used plain HTML, CSS, and JavaScript for the frontend because the application requirements were straightforward and did not require a frontend framework.

I chose Node.js with Express for the backend because it is lightweight, easy to structure as a REST API, and works well with JavaScript across the full stack.

I used MySQL because the data is relational and needs to persist between application restarts.

## One Decision Not Specified in the Brief

I chose session-based authentication instead of token-based authentication.

Since the application runs in the browser and only has admin and student roles, sessions provided a simple and secure way to manage authentication while keeping the code easy to understand.

## One Thing I Would Improve With More Time

I would add automated tests for the main user flows such as login, event creation, registration, duplicate registration checks, and capacity limits.

I would also replace the default session store with a database-backed session store for a more production-ready solution.
