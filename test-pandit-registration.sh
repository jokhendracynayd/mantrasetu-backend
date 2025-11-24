#!/bin/bash

# Test Pandit Registration API
# Make sure to replace the file paths with actual files on your system

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
--form 'specialization="[\"वैदिक अनुष्ठान (Vedic Rituals)\",\"ज्योतिष (Astrology)\"]"' \
--form 'languagesSpoken="[\"Hindi\",\"Sanskrit\",\"English\"]"' \
--form 'serviceAreas="[\"Delhi NCR\",\"Mumbai\"]"' \
--form 'availability="Both"' \
--form 'bio="Test bio for pandit registration"' \
--form 'education="Bachelor of Sanskrit"' \
--form 'achievements="[\"Test Achievement 1\",\"Test Achievement 2\"]"' \
--form 'certificate=@"path/to/certificate.pdf"' \
--form 'idProof=@"path/to/idproof.jpg"' \
--form 'photo=@"path/to/photo.jpg"'

echo ""
echo ""
echo "Note: Replace the file paths (path/to/certificate.pdf, etc.) with actual file paths"
echo "Make sure files are under 2MB each for images, 5MB for PDFs"

