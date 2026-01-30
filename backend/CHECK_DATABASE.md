# Database Insert Troubleshooting

## Step 1: Verify MySQL is Running

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Login with:
   - Username: `root`
   - Password: `daruom`
3. Check if `cvbuilder` database exists
4. If not, create it:
   ```sql
   CREATE DATABASE cvbuilder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Step 2: Check if Tables Exist

In phpMyAdmin, select `cvbuilder` database and check for these tables:
- ✅ `resumes`
- ✅ `education_items`
- ✅ `experience_items`
- ✅ `skill_items`
- ✅ `language_items`
- ✅ `resume_interests`
- ✅ `experience_highlights`

**If tables don't exist:**
- Check Spring Boot console for errors
- Look for SQL errors or connection issues
- Verify `spring.jpa.hibernate.ddl-auto=update` is set

## Step 3: Test Database Insert

### Option A: Use the test script
```bash
cd backend
test-insert.bat
```

### Option B: Manual POST request
Use Postman or curl:

**POST** `http://localhost:8080/api/resumes`
**Body (JSON):**
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
  "education": [
    {
      "school": "University of Technology",
      "degree": "Bachelor of Science",
      "startDate": "2020",
      "endDate": "2024"
    }
  ],
  "experience": [
    {
      "company": "Tech Solutions Inc.",
      "role": "Software Engineer",
      "startDate": "2024",
      "endDate": "Present"
    }
  ],
  "skills": [
    {
      "name": "Java",
      "level": "Expert"
    }
  ],
  "languages": [
    {
      "name": "English",
      "level": "Natif"
    }
  ],
  "interests": ["Reading", "Coding"]
}
```

## Step 4: Check Spring Boot Console

When you POST a resume, watch the Spring Boot console for:
- ✅ SQL INSERT statements (because `spring.jpa.show-sql=true`)
- ❌ Any error messages
- ❌ Connection errors

## Step 5: Verify in phpMyAdmin

After POST request:
1. Open phpMyAdmin
2. Select `cvbuilder` database
3. Click on `resumes` table
4. Click "Browse" tab
5. You should see the inserted data!

## Common Issues

### Issue 1: MySQL Not Running
**Symptom:** Spring Boot fails to start or shows connection errors
**Solution:** 
- Start MySQL service
- Check XAMPP/WAMP control panel
- Verify MySQL is running on port 3306

### Issue 2: Wrong Password
**Symptom:** "Access denied for user 'root'@'localhost'"
**Solution:**
- Check password in `application.properties` (line 14)
- Verify password in phpMyAdmin login

### Issue 3: Database Doesn't Exist
**Symptom:** "Unknown database 'cvbuilder'"
**Solution:**
- Create database manually in phpMyAdmin
- Or verify `createDatabaseIfNotExist=true` in connection URL

### Issue 4: Tables Not Created
**Symptom:** No tables in database
**Solution:**
- Check `spring.jpa.hibernate.ddl-auto=update` is set
- Look for errors in Spring Boot console
- Restart Spring Boot application

### Issue 5: Data Not Persisting
**Symptom:** Data appears but disappears after restart
**Solution:**
- This shouldn't happen with MySQL (only with H2 in-memory)
- Check if you're accidentally using H2 instead of MySQL
- Verify `application.properties` has MySQL config active

## Debug Steps

1. **Check Spring Boot logs** - Look for SQL statements
2. **Test connection** - Try connecting to MySQL from command line
3. **Verify credentials** - Double-check username/password
4. **Check port** - Ensure MySQL is on port 3306
5. **Test API** - Use Postman to verify POST works

