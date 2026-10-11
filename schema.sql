PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS learners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admission_no TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS strands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_area_id INTEGER NOT NULL,
    strand_name TEXT NOT NULL,
    FOREIGN KEY (learning_area_id) REFERENCES learning_areas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sub_strands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strand_id INTEGER NOT NULL,
    sub_strand_name TEXT NOT NULL,
    learning_outcome TEXT,
    FOREIGN KEY (strand_id) REFERENCES strands(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner_id INTEGER NOT NULL,
    sub_strand_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 4) NOT NULL,
    rubric_level TEXT CHECK(rubric_level IN ('EE', 'ME', 'AE', 'BE')) NOT NULL,
    remarks TEXT,
    assessment_date DATE DEFAULT (DATE('now')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_strand_id) REFERENCES sub_strands(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assessment_learner ON assessments(learner_id);
CREATE INDEX IF NOT EXISTS idx_sub_strand_strand ON sub_strands(strand_id);
