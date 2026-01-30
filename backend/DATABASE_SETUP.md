# Database Setup Guide

## MySQL/MariaDB Setup for phpMyAdmin

### Step 1: Install MySQL or MariaDB

**Windows:**
- Download MySQL from: https://dev.mysql.com/downloads/installer/
- Or MariaDB from: https://mariadb.org/download/

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
# Or for MariaDB:
sudo apt install mariadb-server
```

**macOS:**
```bash
brew install mysql
# Or for MariaDB:
brew install mariadb
```

### Step 2: Install phpMyAdmin

**Windows (using XAMPP/WAMP):**
- Download XAMPP: https://www.apachefriends.org/
- XAMPP includes MySQL and phpMyAdmin
- Start MySQL and Apache from XAMPP Control Panel
- Access phpMyAdmin at: http://localhost/phpmyadmin

**Linux:**
```bash
sudo apt install phpmyadmin
# Follow the installation wizard
# Access at: http://localhost/phpmyadmin
```

**macOS:**
```bash
brew install phpmyadmin
# Or use MAMP: https://www.mamp.info/
```

### Step 3: Create Database

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Login with your MySQL root credentials
3. Click on "New" or "Databases" tab
4. Create a new database named: `cvbuilder`
5. Set collation to: `utf8mb4_unicode_ci` (recommended)

Or create via SQL:
```sql
CREATE DATABASE cvbuilder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 4: Configure Spring Boot

Update `backend/src/main/resources/application.properties`:

```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cvbuilder?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 5: Update MySQL User (if needed)

If you need to create a dedicated user for the application:

```sql
CREATE USER 'cvbuilder'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cvbuilder.* TO 'cvbuilder'@'localhost';
FLUSH PRIVILEGES;
```

Then update `application.properties`:
```properties
spring.datasource.username=cvbuilder
spring.datasource.password=your_password
```

### Step 6: Start Spring Boot

```bash
cd backend
mvn spring-boot:run
```

Spring Boot will automatically create the tables when it starts (because of `spring.jpa.hibernate.ddl-auto=update`).

### Step 7: Verify in phpMyAdmin

1. Open phpMyAdmin
2. Select `cvbuilder` database
3. You should see tables:
   - `resumes`
   - `education_items`
   - `experience_items`
   - `skill_items`
   - `language_items`
   - `resume_interests`
   - `experience_highlights`

## Troubleshooting

### Connection Refused
- Make sure MySQL is running
- Check if MySQL is on port 3306
- Verify firewall settings

### Access Denied
- Check username and password in `application.properties`
- Verify user has privileges on the database

### Timezone Issues
- Add `?serverTimezone=UTC` to the JDBC URL (already included)

### Character Encoding
- Make sure database uses `utf8mb4` character set
- This supports emojis and special characters

## Alternative: Use H2 (No MySQL needed)

If you don't want to install MySQL, you can use H2 database (in-memory):
- Just uncomment the H2 configuration in `application.properties`
- Comment out the MySQL configuration
- H2 has its own web console at: http://localhost:8080/h2-console

