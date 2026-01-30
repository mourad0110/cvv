# CV Builder Backend

Spring Boot backend for the CV Builder application.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

- `POST /api/resumes` - Create a new resume
- `GET /api/resumes/{id}` - Get a resume by ID
- `GET /api/resumes` - Get all resumes
- `PUT /api/resumes/{id}` - Update a resume
- `DELETE /api/resumes/{id}` - Delete a resume

## Database

By default, the application uses H2 in-memory database for development. 
Access the H2 console at: `http://localhost:8080/h2-console`

For production, configure PostgreSQL in `application.properties`.

## CORS

CORS is configured to allow requests from `http://localhost:4200` (Angular frontend).

