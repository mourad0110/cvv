# CV Builder

A professional CV/Resume builder application with Angular frontend and Spring Boot backend.

## Features

- 🎨 Multiple professional resume templates (Atlas, Nova)
- ✏️ Real-time preview while editing
- 💾 Save resumes to database or localStorage
- 📄 Export to PDF
- 🖨️ Print directly
- 🌐 Right-to-left (RTL) text support
- 🔄 Template switching without page refresh

## Project Structure

```
CV_Builder/
├── src/                    # Angular frontend
│   └── app/
│       ├── features/        # Feature modules
│       └── core/           # Core services and models
└── backend/                # Spring Boot backend
    └── src/main/java/
        └── com/cvbuilder/
            ├── entity/      # JPA entities
            ├── dto/         # Data transfer objects
            ├── repository/  # Data repositories
            ├── service/     # Business logic
            └── controller/  # REST controllers
```

## Prerequisites

### Frontend
- Node.js 20.19+ or 22.12+
- npm 11.6.2+

### Backend
- Java 17+
- Maven 3.6+

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

### Backend Setup

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

The backend will be available at `http://localhost:8080`

## API Endpoints

- `POST /api/resumes` - Create a new resume
- `GET /api/resumes/{id}` - Get a resume by ID
- `GET /api/resumes` - Get all resumes
- `PUT /api/resumes/{id}` - Update a resume
- `DELETE /api/resumes/{id}` - Delete a resume

## Database

By default, the backend uses H2 in-memory database for development.

Access H2 console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:cvbuilder`
- Username: `sa`
- Password: (empty)

For production, configure PostgreSQL in `backend/src/main/resources/application.properties`.

## Configuration

### Enable Backend Integration

To use the backend API instead of localStorage, update `resume-store.service.ts`:

```typescript
private useBackend = true; // Change to true
```

## Development

### Frontend
- Angular 21.1.1
- Angular Material
- TypeScript 5.9.2

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (dev) / PostgreSQL (prod)
- Lombok

## License

This project is open source and available for personal and commercial use.
