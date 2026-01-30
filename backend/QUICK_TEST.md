# Quick Database Insert Test

## Method 1: Use the HTML Test Page

1. Open `backend/verify-database.html` in your browser
2. Click "2. Create Resume" button
3. Check the response - you should see the created resume with an ID
4. Open phpMyAdmin and check the `resumes` table

## Method 2: Use the Test Script

```bash
cd backend
test-insert.bat
```

## Method 3: Use Postman/Thunder Client

1. **Method:** POST
2. **URL:** `http://localhost:8080/api/resumes`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "templateId": "atlas",
  "personal": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  },
  "education": [],
  "experience": [],
  "skills": [],
  "languages": [],
  "interests": []
}
```

## What to Check

### 1. Spring Boot Console
When you POST, you should see SQL statements like:
```
Hibernate: insert into resumes (updated_at, template_id, ...) values (?, ?, ...)
Hibernate: insert into education_items (..., resume_id) values (..., ?)
```

### 2. phpMyAdmin
1. Open: `http://localhost/phpmyadmin`
2. Select: `cvbuilder` database
3. Click: `resumes` table
4. Click: "Browse" tab
5. You should see your data!

### 3. API Response
The POST should return:
```json
{
  "id": 1,
  "templateId": "atlas",
  "personal": { ... },
  ...
}
```

## If Still No Data

1. **Check MySQL is running** - XAMPP/WAMP control panel
2. **Check Spring Boot console** - Look for errors
3. **Verify database exists** - In phpMyAdmin
4. **Check password** - In `application.properties` line 14
5. **Restart Spring Boot** - After any config changes

