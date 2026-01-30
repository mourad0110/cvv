#!/bin/bash

echo "Testing CV Builder Backend API..."
echo ""

echo "1. Testing GET all resumes..."
curl http://localhost:8080/api/resumes
echo ""
echo ""

echo "2. Testing POST create resume..."
curl -X POST http://localhost:8080/api/resumes \
  -H "Content-Type: application/json" \
  -d '{"templateId":"atlas","personal":{"firstName":"Test","lastName":"User","email":"test@example.com"},"education":[],"experience":[],"skills":[],"languages":[],"interests":[]}'
echo ""
echo ""

echo "3. Testing GET all resumes again (should show the created resume)..."
curl http://localhost:8080/api/resumes
echo ""
echo ""

echo "Test completed! Check phpMyAdmin to see the data in the database."

