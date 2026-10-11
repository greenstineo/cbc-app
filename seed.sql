INSERT INTO learning_areas (code, name) VALUES 
('MATH', 'Mathematics'),
('SNE_ART', 'Creative Arts & Sports'),
('SCI', 'Science & Technology');

INSERT INTO strands (learning_area_id, strand_name) VALUES 
(1, 'Numbers'),
(1, 'Measurement');

INSERT INTO sub_strands (strand_id, sub_strand_name, learning_outcome) VALUES 
(1, 'Whole Numbers', 'Count, read and write whole numbers up to 10,000'),
(1, 'Fractions', 'Identify and represent proper fractions');

INSERT INTO learners (admission_no, full_name, grade_level, gender) VALUES 
('ADM-001', 'Emmanuel Ogesa', 'Grade 4', 'Male'),
('ADM-002', 'Achieng Barasa', 'Grade 4', 'Female');

INSERT INTO assessments (learner_id, sub_strand_id, rating, rubric_level, remarks) VALUES 
(1, 1, 8, 'EE1', 'Exceeds expectations consistently with complete independence.');
