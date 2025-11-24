-- Insert sample users
INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, role, "isEmailVerified", "isVerified", "createdAt", "updatedAt") VALUES
('user1', 'user1@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Rajesh', 'Kumar', '+919876543210', 'USER', true, true, NOW(), NOW()),
('user2', 'user2@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Priya', 'Sharma', '+919876543211', 'USER', true, true, NOW(), NOW()),
('pandit1', 'pandit1@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Swami', 'Vishnu', '+919876543212', 'PANDIT', true, true, NOW(), NOW()),
('pandit2', 'pandit2@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Acharya', 'Ram', '+919876543213', 'PANDIT', true, true, NOW(), NOW()),
('pandit3', 'pandit3@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Pandit', 'Krishna', '+919876543214', 'PANDIT', true, true, NOW(), NOW()),
('pandit4', 'pandit4@example.com', '$2b$10$rQZ8K9vX7wE2nF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF', 'Maharishi', 'Shiva', '+919876543215', 'PANDIT', true, true, NOW(), NOW());

-- Insert pandit profiles
INSERT INTO pandits (id, "userId", "certificationNumber", "experienceYears", specialization, "languagesSpoken", "serviceAreas", "hourlyRate", rating, "totalBookings", "isVerified", "isAvailable", bio, education, achievements, "createdAt", "updatedAt") VALUES
('pandit_profile1', 'pandit1', 'PANDIT001', 15, '["Vedic Puja", "Astrology", "Grih Pravesh"]', '["Hindi", "English", "Sanskrit"]', '["Delhi", "Mumbai", "Bangalore"]', 2500, 4.8, 156, true, true, 'Experienced Vedic scholar with 15 years of practice in traditional Hindu rituals and astrology.', 'Master of Sanskrit, Vedic Studies', '["Best Pandit Award 2023", "Certified Astrologer", "Vedic Scholar Recognition"]', NOW(), NOW()),
('pandit_profile2', 'pandit2', 'PANDIT002', 12, '["Satyanarayan Puja", "Havan", "Rudrabhishek"]', '["Hindi", "English", "Tamil"]', '["Chennai", "Hyderabad", "Pune"]', 2000, 4.6, 98, true, true, 'Devoted priest specializing in Satyanarayan Puja and Havan ceremonies.', 'Bachelor of Sanskrit, Religious Studies', '["Satyanarayan Puja Expert", "Community Service Award"]', NOW(), NOW()),
('pandit_profile3', 'pandit3', 'PANDIT003', 20, '["Marriage Ceremonies", "Naming Ceremony", "Annaprashan"]', '["Hindi", "English", "Bengali"]', '["Kolkata", "Delhi", "Gujarat"]', 3000, 4.9, 234, true, true, 'Senior priest with 20 years of experience in conducting marriage ceremonies and family rituals.', 'PhD in Religious Studies, Vedic Literature', '["Senior Priest Certification", "Marriage Ceremony Expert", "Cultural Heritage Award"]', NOW(), NOW()),
('pandit_profile4', 'pandit4', 'PANDIT004', 8, '["Online Puja", "Virtual Consultations", "Astrology"]', '["Hindi", "English", "Telugu"]', '["Online", "Hyderabad", "Bangalore"]', 1500, 4.4, 67, true, true, 'Modern pandit offering online puja services and virtual consultations.', 'Bachelor of Technology, Vedic Studies', '["Digital Puja Pioneer", "Online Consultation Expert"]', NOW(), NOW());

-- Insert services
INSERT INTO services (id, name, description, category, subcategory, "durationMinutes", "basePrice", "isVirtual", "requiresSamagri", instructions, "isActive", "imageUrl", tags, "createdAt", "updatedAt") VALUES
('service1', 'Grih Pravesh Puja', 'Sacred housewarming ceremony to bless your new home and ensure prosperity, peace, and positive energy.', 'POOJA', 'Housewarming', 120, 2500, false, true, 'Please provide the house address and preferred date. We will bring all necessary materials.', true, '/images/services/grih-pravesh.jpg', '["housewarming", "vastu", "prosperity", "new home"]', NOW(), NOW()),
('service2', 'Satyanarayan Puja', 'Sacred puja dedicated to Lord Vishnu to seek blessings for family harmony, prosperity, and fulfillment of wishes.', 'POOJA', 'Devotional', 180, 1800, true, true, 'Virtual puja will be conducted via video call. Samagri kit will be delivered to your address.', true, '/images/services/satyanarayan.jpg', '["vishnu", "family", "harmony", "prosperity"]', NOW(), NOW()),
('service3', 'Marriage Ceremony (Vivah Sanskar)', 'Complete Hindu marriage ceremony following traditional Vedic rituals. Includes all seven sacred vows, fire ceremony, and blessings.', 'POOJA', 'Marriage', 240, 5000, false, true, 'Please provide venue details and guest count. We will coordinate with your wedding planner.', true, '/images/services/marriage.jpg', '["wedding", "vivah", "sacred vows", "fire ceremony"]', NOW(), NOW()),
('service4', 'Havan (Fire Ceremony)', 'Sacred fire ritual to purify the environment and invoke divine blessings. Includes chanting of Vedic mantras and offerings to the sacred fire.', 'HAVAN', 'Purification', 90, 2200, true, true, 'Virtual havan will be conducted. We will guide you through the process and provide all necessary materials.', true, '/images/services/havan.jpg', '["fire ceremony", "purification", "vedic mantras", "blessings"]', NOW(), NOW()),
('service5', 'Astrological Consultation', 'Personalized astrological reading based on your birth chart. Includes predictions, remedies, and guidance for life decisions.', 'ASTROLOGY', 'Consultation', 60, 1200, true, false, 'Please provide your birth details (date, time, place). Consultation will be conducted via video call.', true, '/images/services/astrology.jpg', '["astrology", "birth chart", "predictions", "guidance"]', NOW(), NOW()),
('service6', 'Rudrabhishek', 'Sacred puja dedicated to Lord Shiva for removing obstacles, gaining strength, and achieving success. Powerful ritual with special offerings.', 'POOJA', 'Devotional', 150, 3000, false, true, 'Please specify if you want to perform at temple or home. Special arrangements may be needed.', true, '/images/services/rudrabhishek.jpg', '["shiva", "obstacles", "strength", "success"]', NOW(), NOW()),
('service7', 'Naming Ceremony (Namkaran)', 'Sacred ceremony to name your newborn child according to Vedic traditions. Includes horoscope preparation and blessing rituals.', 'POOJA', 'Birth Ceremony', 90, 1500, true, true, 'Please provide child''s birth details and preferred name suggestions. Ceremony will be conducted virtually.', true, '/images/services/namkaran.jpg', '["naming", "newborn", "blessings", "horoscope"]', NOW(), NOW()),
('service8', 'Annaprashan (First Rice)', 'Sacred ceremony for baby''s first solid food. Traditional ritual to bless the child with good health and prosperity.', 'POOJA', 'Birth Ceremony', 75, 1200, true, true, 'Please provide baby''s age and preferred date. We will guide you through the traditional ceremony.', true, '/images/services/annaprashan.jpg', '["baby", "first food", "health", "prosperity"]', NOW(), NOW()),
('service9', 'Ganesh Chaturthi Puja', 'Special puja dedicated to Lord Ganesha for removing obstacles and bringing success. Includes idol installation and daily rituals.', 'POOJA', 'Festival', 120, 2000, true, true, 'Festival puja will be conducted virtually. We will provide guidance for daily worship.', true, '/images/services/ganesh-chaturthi.jpg', '["ganesha", "festival", "obstacles", "success"]', NOW(), NOW()),
('service10', 'Durga Puja', 'Sacred puja dedicated to Goddess Durga for strength, protection, and victory over evil. Traditional Bengali and North Indian rituals.', 'POOJA', 'Festival', 180, 2800, true, true, 'Festival puja with traditional rituals. We will guide you through the nine-day celebration.', true, '/images/services/durga-puja.jpg', '["durga", "festival", "strength", "protection"]', NOW(), NOW());

-- Insert availability for pandits
INSERT INTO availability (id, "panditId", "dayOfWeek", "startTime", "endTime", "isActive", "createdAt", "updatedAt") VALUES
('avail1', 'pandit_profile1', 1, '09:00', '17:00', true, NOW(), NOW()),
('avail2', 'pandit_profile1', 2, '09:00', '17:00', true, NOW(), NOW()),
('avail3', 'pandit_profile1', 3, '09:00', '17:00', true, NOW(), NOW()),
('avail4', 'pandit_profile1', 4, '09:00', '17:00', true, NOW(), NOW()),
('avail5', 'pandit_profile1', 5, '09:00', '17:00', true, NOW(), NOW()),
('avail6', 'pandit_profile2', 1, '08:00', '16:00', true, NOW(), NOW()),
('avail7', 'pandit_profile2', 2, '08:00', '16:00', true, NOW(), NOW()),
('avail8', 'pandit_profile2', 3, '08:00', '16:00', true, NOW(), NOW()),
('avail9', 'pandit_profile2', 4, '08:00', '16:00', true, NOW(), NOW()),
('avail10', 'pandit_profile2', 5, '08:00', '16:00', true, NOW(), NOW()),
('avail11', 'pandit_profile3', 0, '10:00', '18:00', true, NOW(), NOW()),
('avail12', 'pandit_profile3', 1, '10:00', '18:00', true, NOW(), NOW()),
('avail13', 'pandit_profile3', 2, '10:00', '18:00', true, NOW(), NOW()),
('avail14', 'pandit_profile3', 3, '10:00', '18:00', true, NOW(), NOW()),
('avail15', 'pandit_profile3', 4, '10:00', '18:00', true, NOW(), NOW()),
('avail16', 'pandit_profile3', 5, '10:00', '18:00', true, NOW(), NOW()),
('avail17', 'pandit_profile3', 6, '10:00', '18:00', true, NOW(), NOW()),
('avail18', 'pandit_profile4', 1, '09:00', '21:00', true, NOW(), NOW()),
('avail19', 'pandit_profile4', 2, '09:00', '21:00', true, NOW(), NOW()),
('avail20', 'pandit_profile4', 3, '09:00', '21:00', true, NOW(), NOW()),
('avail21', 'pandit_profile4', 4, '09:00', '21:00', true, NOW(), NOW()),
('avail22', 'pandit_profile4', 5, '09:00', '21:00', true, NOW(), NOW()),
('avail23', 'pandit_profile4', 6, '09:00', '21:00', true, NOW(), NOW());