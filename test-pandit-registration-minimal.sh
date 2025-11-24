#!/bin/bash

# Minimal Test - Without Files (to test if the issue is with file uploads)
# This will help identify if the problem is with file handling or data processing

curl --location 'https://api.mantrasetu.com/api/v1/pandits/register' \
--header 'Accept: application/json' \
--header 'Content-Type: multipart/form-data' \
--form 'firstName="Test"' \
--form 'lastName="Pandit"' \
--form 'email="testpandit'$(date +%s)'@example.com"' \
--form 'phone="9876543210"' \
--form 'password="Test@123456"' \
--form 'role="PANDIT"' \
--form 'gender="Male"' \
--form 'experienceYears="5"' \
--form 'specialization="[\"Vedic Rituals\"]"' \
--form 'languagesSpoken="[\"Hindi\"]"' \
--form 'serviceAreas="[\"Delhi\"]"' \
--form 'availability="Both"' \
--form 'bio="Test bio"' \
--form 'education="Test Education"' \
--form 'achievements="[]"'

echo ""
echo "This test doesn't include files - if this works, the issue is with file uploads"
echo "If this also fails, the issue is with data processing"

