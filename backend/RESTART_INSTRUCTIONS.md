# How to Restart Spring Boot Application

## Step 1: Stop the Current Application

### If running in terminal:
1. Find the terminal where Spring Boot is running
2. Press `Ctrl + C` to stop it
3. Wait for it to fully stop

### If you can't find the terminal:
1. Open Task Manager (Ctrl + Shift + Esc)
2. Find Java process (javaw.exe or java.exe)
3. End the process
4. Or use this command:
   ```powershell
   taskkill /F /PID 8852
   ```
   (Replace 8852 with the actual process ID from netstat)

## Step 2: Clean and Rebuild

```bash
cd backend
mvn clean package
```

## Step 3: Start Fresh

```bash
mvn spring-boot:run
```

## Step 4: Watch for Success Messages

Look for these in the console:
- ✅ "Started CvBuilderApplication"
- ✅ "Tomcat started on port(s): 8080"
- ✅ No error messages about controllers

## Step 5: Test

Open browser and try:
- http://localhost:8080/
- http://localhost:8080/health
- http://localhost:8080/api/resumes

## Alternative: Use IDE to Run

If using IntelliJ IDEA or Eclipse:
1. Right-click on `CvBuilderApplication.java`
2. Select "Run" or "Debug"
3. This will automatically restart with new changes

