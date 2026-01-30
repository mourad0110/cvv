# Testing Guide - Verify Backend is Working

## Step 1: Check MySQL Connection

### Test Database Connection
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Login with username: `root` and password: `daruom`
3. Check if `cvbuilder` database exists
4. If not, create it:
   ```sql
   CREATE DATABASE cvbuilder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Step 2: Start Spring Boot Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### What to Look For:
- ✅ "Started CvBuilderApplication" message
- ✅ No database connection errors
- ✅ Server running on port 8080
- ✅ Tables being created automatically (if you see SQL logs)

## Step 3: Verify Tables Created

1. Open phpMyAdmin
2. Select `cvbuilder` database
3. Check if these tables exist:
   - ✅ `resumes`
   - ✅ `education_items`
   - ✅ `experience_items`
   - ✅ `skill_items`
   - ✅ `language_items`
   - ✅ `resume_interests`
   - ✅ `experience_highlights`

## Step 4: Test API Endpoints

### Option A: Using Browser (GET requests only)
Open these URLs in your browser:

1. **Get all resumes:**
   ```
   http://localhost:8080/api/resumes
   ```
   Should return: `[]` (empty array if no resumes)

### Option B: Using Postman/Thunder Client
1. Install Postman or Thunder Client (VS Code extension)
2. Test each endpoint:

**POST - Create Resume:**
- Method: `POST`
- URL: `http://localhost:8080/api/resumes`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "templateId": "atlas",
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "location": "New York, USA"
  },
  "education": [],
  "experience": [],
  "skills": [],
  "languages": [],
  "interests": []
}
```

**GET - Get All Resumes:**
- Method: `GET`
- URL: `http://localhost:8080/api/resumes`

**GET - Get Resume by ID:**
- Method: `GET`
- URL: `http://localhost:8080/api/resumes/1`

**PUT - Update Resume:**
- Method: `PUT`
- URL: `http://localhost:8080/api/resumes/1`
- Body: Same as POST but include `"id": 1`

**DELETE - Delete Resume:**
- Method: `DELETE`
- URL: `http://localhost:8080/api/resumes/1`

### Option C: Using cURL (Command Line)

**Create Resume:**
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

**Get All Resumes:**
```bash
curl http://localhost:8080/api/resumes
```

**Get Resume by ID:**
```bash
curl http://localhost:8080/api/resumes/1
```

**Update Resume:**
```bash
curl -X PUT http://localhost:8080/api/resumes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "templateId": "atlas",
    "personal": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com"
    },
    "education": [],
    "experience": [],
    "skills": [],
    "languages": [],
    "interests": []
  }'
```

**Delete Resume:**
```bash
curl -X DELETE http://localhost:8080/api/resumes/1
```

## Step 5: Verify Data in phpMyAdmin

1. After creating a resume via API
2. Open phpMyAdmin
3. Select `cvbuilder` database
4. Click on `resumes` table
5. Click "Browse" tab
6. You should see the resume data you just created!

## Step 6: Test Frontend Integration

1. Update `src/app/core/services/resume-store.service.ts`:
   ```typescript
   private useBackend = true; // Change to true
   ```

2. Start Angular frontend:
   ```bash
   npm start
   ```

3. Create a resume in the frontend
4. Check phpMyAdmin - you should see the data in the database!

## Common Issues & Solutions

### ❌ Connection Refused
- **Problem:** Can't connect to MySQL
- **Solution:** 
  - Make sure MySQL is running
  - Check if MySQL is on port 3306
  - Verify username/password in `application.properties`

### ❌ Access Denied
- **Problem:** MySQL authentication failed
- **Solution:**
  - Check username and password
  - Verify user has privileges: `GRANT ALL ON cvbuilder.* TO 'root'@'localhost';`

### ❌ Database doesn't exist
- **Problem:** `cvbuilder` database not found
- **Solution:**
  - Create it manually in phpMyAdmin
  - Or the `createDatabaseIfNotExist=true` in URL should create it automatically

### ❌ Tables not created
- **Problem:** No tables in database
- **Solution:**
  - Check `spring.jpa.hibernate.ddl-auto=update` is set
  - Look for errors in Spring Boot console
  - Check if JPA entities are correct

### ❌ CORS Error
- **Problem:** Frontend can't call backend
- **Solution:**
  - Verify CORS config in `CorsConfig.java`
  - Check `application.properties` CORS settings
  - Make sure frontend is on `http://localhost:4200`

## Success Indicators ✅

You'll know everything is working when:
1. ✅ Spring Boot starts without errors
2. ✅ Tables appear in phpMyAdmin
3. ✅ API endpoints return data (not errors)
4. ✅ Data persists after restarting Spring Boot
5. ✅ Frontend can save/load resumes from backend

