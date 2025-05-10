-- Insert admin user if it doesn't exist
INSERT INTO users (username, password, role, first_name, last_name, deleted)
SELECT 'admin', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'ADMIN', 'Admin', 'User', false
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert sample users if they don't exist
INSERT INTO users (username, password, role, first_name, last_name, deleted)
SELECT username, password, role, first_name, last_name, deleted
FROM (VALUES
    ('sarah_m', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'MANAGER', 'Sarah', 'Miller', false),
    ('john_doe', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'USER', 'John', 'Doe', false),
    ('emma_s', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'MANAGER', 'Emma', 'Smith', false),
    ('alex_t', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'USER', 'Alex', 'Taylor', false),
    ('maria_g', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'ADMIN', 'Maria', 'Garcia', false),
    ('david_k', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'USER', 'David', 'Kim', false),
    ('sophie_l', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'MANAGER', 'Sophie', 'Lee', false),
    ('james_w', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'USER', 'James', 'Wilson', false),
    ('lisa_m', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'MANAGER', 'Lisa', 'Martin', false),
    ('robert_p', '$2a$10$ckC0Cxs4YFqZfISGfk1Lz.B8kF8krt.6ux6xmB0HGHLe3wZuu8NYu', 'USER', 'Robert', 'Parker', false)
) AS new_users(username, password, role, first_name, last_name, deleted)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.username = new_users.username);

-- Insert formations data if not exists
INSERT INTO formations (title, domain, start_date, end_date, budget, lieu, time)
SELECT title, domain, start_date, end_date, budget, lieu, time
FROM (VALUES
    ('Spring Boot Advanced', 'IT', '2025-05-01', '2025-05-15', 2500.00, 'Online', 'Full-time'),
    ('Data Science Fundamentals', 'Data Analytics', '2025-06-01', '2025-06-30', 3000.00, 'Paris', 'Part-time'),
    ('Cloud Architecture', 'IT', '2025-07-01', '2025-07-15', 2800.00, 'London', 'Full-time'),
    ('Project Management Professional', 'Management', '2025-08-01', '2025-08-30', 2000.00, 'Berlin', 'Part-time'),
    ('Digital Marketing Strategy', 'Marketing', '2025-09-01', '2025-09-15', 1800.00, 'Madrid', 'Full-time'),
    ('Cybersecurity Essentials', 'IT', '2025-10-01', '2025-10-30', 3500.00, 'Online', 'Part-time'),
    ('Agile Development', 'IT', '2025-11-01', '2025-11-15', 2200.00, 'Amsterdam', 'Full-time'),
    ('Business Analytics', 'Business', '2025-12-01', '2025-12-15', 2400.00, 'Rome', 'Full-time'),
    ('AI and Machine Learning', 'IT', '2026-01-01', '2026-01-30', 4000.00, 'Online', 'Part-time'),
    ('Leadership Skills', 'Management', '2026-02-01', '2026-02-15', 1900.00, 'Vienna', 'Full-time')
) AS new_formations(title, domain, start_date, end_date, budget, lieu, time)
WHERE NOT EXISTS (SELECT 1 FROM formations WHERE formations.title = new_formations.title);

-- Insert participants data if not exists
INSERT INTO participants (first_name, last_name, email, telephone, structure, profile, deleted)
SELECT first_name, last_name, email, telephone, structure, profile, deleted
FROM (VALUES
    ('Jean', 'Dupont', 'jean.dupont@email.com', '+33123456789', 'IT Department', 'Developer', false),
    ('Marie', 'Laurent', 'marie.laurent@email.com', '+33234567890', 'Marketing', 'Manager', false),
    ('Pierre', 'Martin', 'pierre.martin@email.com', '+33345678901', 'HR', 'Specialist', false),
    ('Sophie', 'Bernard', 'sophie.bernard@email.com', '+33456789012', 'Sales', 'Executive', false),
    ('Lucas', 'Petit', 'lucas.petit@email.com', '+33567890123', 'IT Department', 'Engineer', false),
    ('Emma', 'Garcia', 'emma.garcia@email.com', '+33678901234', 'Finance', 'Analyst', false),
    ('Thomas', 'Roux', 'thomas.roux@email.com', '+33789012345', 'Operations', 'Director', false),
    ('Julie', 'Leroy', 'julie.leroy@email.com', '+33890123456', 'Marketing', 'Coordinator', false),
    ('Nicolas', 'Moreau', 'nicolas.moreau@email.com', '+33901234567', 'IT Department', 'Architect', false),
    ('Claire', 'Simon', 'claire.simon@email.com', '+33012345678', 'HR', 'Manager', false)
) AS new_participants(first_name, last_name, email, telephone, structure, profile, deleted)
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE participants.email = new_participants.email);

-- Insert participant-formation relationships if not exists
INSERT INTO participant_formations (participant_id, formation_id)
SELECT p.id, f.id 
FROM participants p 
CROSS JOIN formations f 
WHERE (p.email, f.title) IN (
    ('jean.dupont@email.com', 'Spring Boot Advanced'),
    ('jean.dupont@email.com', 'Cloud Architecture'),
    ('jean.dupont@email.com', 'Cybersecurity Essentials'),
    ('marie.laurent@email.com', 'Digital Marketing Strategy'),
    ('marie.laurent@email.com', 'Business Analytics'),
    ('pierre.martin@email.com', 'Project Management Professional'),
    ('pierre.martin@email.com', 'Leadership Skills'),
    ('sophie.bernard@email.com', 'Project Management Professional'),
    ('sophie.bernard@email.com', 'Business Analytics'),
    ('lucas.petit@email.com', 'Spring Boot Advanced'),
    ('lucas.petit@email.com', 'Agile Development'),
    ('lucas.petit@email.com', 'AI and Machine Learning'),
    ('emma.garcia@email.com', 'Data Science Fundamentals'),
    ('emma.garcia@email.com', 'Business Analytics'),
    ('thomas.roux@email.com', 'Project Management Professional'),
    ('thomas.roux@email.com', 'Leadership Skills'),
    ('julie.leroy@email.com', 'Digital Marketing Strategy'),
    ('nicolas.moreau@email.com', 'Spring Boot Advanced'),
    ('nicolas.moreau@email.com', 'Cloud Architecture'),
    ('nicolas.moreau@email.com', 'Cybersecurity Essentials'),
    ('claire.simon@email.com', 'Project Management Professional'),
    ('claire.simon@email.com', 'Leadership Skills')
)
AND NOT EXISTS (
    SELECT 1 FROM participant_formations pf 
    WHERE pf.participant_id = p.id AND pf.formation_id = f.id
);