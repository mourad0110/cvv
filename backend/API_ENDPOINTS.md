# API Endpoints Reference

## Base URL
```
http://localhost:8080
```

## Available Endpoints

### 1. Home/Health Check
- **GET** `http://localhost:8080/` - API information
- **GET** `http://localhost:8080/health` - Health check

### 2. Resume Endpoints

#### Get All Resumes
- **URL:** `http://localhost:8080/api/resumes`
- **Method:** `GET`
- **Response:** Array of resumes
- **Example:**
  ```bash
  curl http://localhost:8080/api/resumes
  ```

#### Get Resume by ID
- **URL:** `http://localhost:8080/api/resumes/{id}`
- **Method:** `GET`
- **Example:**
  ```bash
  curl http://localhost:8080/api/resumes/1
  ```

#### Create Resume
- **URL:** `http://localhost:8080/api/resumes`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Example:**
  ```bash
  curl -X POST http://localhost:8080/api/resumes \
    -H "Content-Type: application/json" \
    -d '{
      "templateId": "atlas",
      "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "education": [],
      "experience": [],
      "skills": [],
      "languages": [],
      "interests": []
    }'
  ```

#### Update Resume
- **URL:** `http://localhost:8080/api/resumes/{id}`
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Example:**
  ```bash
  curl -X PUT http://localhost:8080/api/resumes/1 \
    -H "Content-Type: application/json" \
    -d '{
      "id": 1,
      "templateId": "nova",
      "personal": {
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "education": [],
      "experience": [],
      "skills": [],
      "languages": [],
      "interests": []
    }'
  ```

#### Delete Resume
- **URL:** `http://localhost:8080/api/resumes/{id}`
- **Method:** `DELETE`
- **Example:**
  ```bash
  curl -X DELETE http://localhost:8080/api/resumes/1
  ```

## Testing in Browser

You can test GET endpoints directly in your browser:

1. **Home page:** http://localhost:8080/
2. **Health check:** http://localhost:8080/health
3. **Get all resumes:** http://localhost:8080/api/resumes

## Common Errors

### 404 Not Found
- **Cause:** Wrong URL or endpoint doesn't exist
- **Solution:** Check the URL matches exactly: `/api/resumes` (not `/api/resume`)

### 405 Method Not Allowed
- **Cause:** Using wrong HTTP method (e.g., GET instead of POST)
- **Solution:** Use correct method for the endpoint

### 500 Internal Server Error
- **Cause:** Database connection issue or application error
- **Solution:** Check Spring Boot console for error messages

