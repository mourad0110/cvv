@echo off
echo Testing Resume Insert to Database...
echo.

echo Creating a test resume...
curl -X POST http://localhost:8080/api/resumes ^
  -H "Content-Type: application/json" ^
  -d "{\"templateId\":\"atlas\",\"personal\":{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"location\":\"New York\"},\"education\":[{\"school\":\"University\",\"degree\":\"BS\",\"startDate\":\"2020\",\"endDate\":\"2024\"}],\"experience\":[{\"company\":\"Tech Corp\",\"role\":\"Developer\",\"startDate\":\"2024\",\"endDate\":\"Present\"}],\"skills\":[{\"name\":\"Java\",\"level\":\"Expert\"}],\"languages\":[{\"name\":\"English\",\"level\":\"Natif\"}],\"interests\":[\"Reading\"]}"
echo.
echo.

echo Getting all resumes...
curl http://localhost:8080/api/resumes
echo.
echo.

echo Check phpMyAdmin now - you should see data in the resumes table!
pause

