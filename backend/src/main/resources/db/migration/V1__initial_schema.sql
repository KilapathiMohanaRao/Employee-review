-- ====================================================================
-- 360-DEGREE EMPLOYEE PERFORMANCE ASSESSMENT & TALENT PLATFORM
-- V1 INITIAL RELATIONAL DATABASE SCHEMA (22 Core Enterprise Tables)
-- ====================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ROLE_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. USER_ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 6. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    head_employee_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. DESIGNATIONS TABLE
CREATE TABLE IF NOT EXISTS designations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    level_grade VARCHAR(20),
    department_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_desig_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

-- 8. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    department_id BIGINT,
    designation_id BIGINT,
    manager_id BIGINT,
    joining_date DATE,
    avatar_url VARCHAR(255),
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, RESIGNED, SUSPENDED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_desig FOREIGN KEY (designation_id) REFERENCES designations (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_manager FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE SET NULL
);

CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_emp_manager ON employees(manager_id);
CREATE INDEX idx_emp_email ON employees(email);

-- 9. REPORTING_RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS reporting_relationships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    manager_id BIGINT NOT NULL,
    relationship_type VARCHAR(50) DEFAULT 'PRIMARY', -- PRIMARY, DOTTED_LINE, FUNCTIONAL
    start_date DATE NOT NULL,
    end_date DATE,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_rr_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_rr_mgr FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE CASCADE
);

-- 10. ASSESSMENT_CYCLES TABLE
CREATE TABLE IF NOT EXISTS assessment_cycles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'CREATED', -- CREATED, CONFIGURED, IN_PROGRESS, SUBMITTED, REVIEW_VALIDATION, PUBLISHED, CLOSED
    anonymous_peer_feedback BOOLEAN DEFAULT TRUE,
    anonymous_direct_report_feedback BOOLEAN DEFAULT TRUE,
    anonymous_cross_functional BOOLEAN DEFAULT TRUE,
    weight_self DECIMAL(5,2) DEFAULT 10.00,
    weight_manager DECIMAL(5,2) DEFAULT 35.00,
    weight_peer DECIMAL(5,2) DEFAULT 25.00,
    weight_direct_report DECIMAL(5,2) DEFAULT 15.00,
    weight_cross_functional DECIMAL(5,2) DEFAULT 15.00,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS competencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) DEFAULT 'CORE', -- LEADERSHIP, CORE, FUNCTIONAL, BEHAVIOURAL
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. BEHAVIOURS TABLE
CREATE TABLE IF NOT EXISTS behaviours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    competency_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_beh_competency FOREIGN KEY (competency_id) REFERENCES competencies (id) ON DELETE CASCADE
);

CREATE INDEX idx_beh_comp ON behaviours(competency_id);

-- 13. ASSESSMENT_ASSIGNMENTS TABLE (links employee to cycle)
CREATE TABLE IF NOT EXISTS assessment_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cycle_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'ASSIGNED', -- ASSIGNED, IN_PROGRESS, SUBMITTED, PUBLISHED, COMPLETED
    overall_score DECIMAL(4,2),
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cycle_employee UNIQUE (cycle_id, employee_id),
    CONSTRAINT fk_assign_cycle FOREIGN KEY (cycle_id) REFERENCES assessment_cycles (id) ON DELETE CASCADE,
    CONSTRAINT fk_assign_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);

-- 14. REVIEWER_RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS reviewer_relationships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    review_type VARCHAR(50) NOT NULL, -- SELF, MANAGER, PEER, DIRECT_REPORT, CROSS_FUNCTIONAL, OTHER_STAKEHOLDER
    is_anonymous BOOLEAN DEFAULT FALSE,
    weight DECIMAL(5,2) DEFAULT 1.00,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, DRAFT, SUBMITTED, DECLINED, EXPIRED
    assigned_by BIGINT,
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_assign_reviewer UNIQUE (assignment_id, reviewer_id, review_type),
    CONSTRAINT fk_rr_assign FOREIGN KEY (assignment_id) REFERENCES assessment_assignments (id) ON DELETE CASCADE,
    CONSTRAINT fk_rr_reviewer FOREIGN KEY (reviewer_id) REFERENCES employees (id) ON DELETE CASCADE
);

CREATE INDEX idx_rr_reviewer ON reviewer_relationships(reviewer_id);

-- 15. ASSESSMENTS TABLE (Assessment Instance per reviewer per assignment)
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    reviewer_relationship_id BIGINT NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, LOCKED, REOPENED
    submitted_at TIMESTAMP NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    summary_feedback TEXT,
    key_strengths_comment TEXT,
    development_areas_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assess_assignment FOREIGN KEY (assignment_id) REFERENCES assessment_assignments (id) ON DELETE CASCADE,
    CONSTRAINT fk_assess_rel FOREIGN KEY (reviewer_relationship_id) REFERENCES reviewer_relationships (id) ON DELETE CASCADE
);

-- 16. RATINGS TABLE (Predefined 5-point rating scale)
CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    score INT NOT NULL UNIQUE,
    label VARCHAR(50) NOT NULL, -- 1: Rarely, 2: Inconsistently, 3: Effective, 4: Strong, 5: Role Model
    description VARCHAR(255)
);

-- 17. ASSESSMENT_RESPONSES TABLE (Individual behaviour rating)
CREATE TABLE IF NOT EXISTS assessment_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    behaviour_id BIGINT NOT NULL,
    score INT, -- 1 to 5, or NULL for "Not Observed"
    is_not_observed BOOLEAN DEFAULT FALSE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_assess_beh UNIQUE (assessment_id, behaviour_id),
    CONSTRAINT fk_resp_assess FOREIGN KEY (assessment_id) REFERENCES assessments (id) ON DELETE CASCADE,
    CONSTRAINT fk_resp_beh FOREIGN KEY (behaviour_id) REFERENCES behaviours (id) ON DELETE CASCADE
);

CREATE INDEX idx_resp_assess ON assessment_responses(assessment_id);

-- 18. FEEDBACK_COMMENTS TABLE (Written commentary per competency or general)
CREATE TABLE IF NOT EXISTS feedback_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    competency_id BIGINT,
    comment_type VARCHAR(50) DEFAULT 'GENERAL', -- GENERAL, STRENGTH, IMPROVEMENT, CONFIDENTIAL_HR
    content TEXT NOT NULL,
    is_confidential_to_hr BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fc_assess FOREIGN KEY (assessment_id) REFERENCES assessments (id) ON DELETE CASCADE,
    CONSTRAINT fk_fc_comp FOREIGN KEY (competency_id) REFERENCES competencies (id) ON DELETE SET NULL
);

-- 19. COMPETENCY_SUMMARIES TABLE (Precalculated scores for 360 Scorecard)
CREATE TABLE IF NOT EXISTS competency_summaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    competency_id BIGINT NOT NULL,
    item_count INT DEFAULT 0,
    self_score DECIMAL(4,2),
    manager_score DECIMAL(4,2),
    peer_score DECIMAL(4,2),
    direct_report_score DECIMAL(4,2),
    cross_functional_score DECIMAL(4,2),
    other_stakeholder_score DECIMAL(4,2),
    others_average DECIMAL(4,2),
    gap_score DECIMAL(4,2), -- self_score - others_average
    competency_rank INT,
    performance_insight VARCHAR(100), -- ON_TRACK, NEEDS_IMPROVEMENT, INSUFFICIENT_FEEDBACK, BLIND_SPOT, HIDDEN_STRENGTH
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_assign_comp UNIQUE (assignment_id, competency_id),
    CONSTRAINT fk_cs_assign FOREIGN KEY (assignment_id) REFERENCES assessment_assignments (id) ON DELETE CASCADE,
    CONSTRAINT fk_cs_comp FOREIGN KEY (competency_id) REFERENCES competencies (id) ON DELETE CASCADE
);

CREATE INDEX idx_cs_assign ON competency_summaries(assignment_id);

-- 20. DEVELOPMENT_PLANS TABLE (IDP)
CREATE TABLE IF NOT EXISTS development_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    assignment_id BIGINT,
    focus_competency_id BIGINT NOT NULL,
    others_average DECIMAL(4,2),
    self_vs_others_gap DECIMAL(4,2),
    insight_summary VARCHAR(255),
    feedback_evidence TEXT,
    smart_goal TEXT NOT NULL,
    mentor_or_support VARCHAR(150),
    success_measurement TEXT,
    target_date DATE NOT NULL,
    overall_progress INT DEFAULT 0, -- 0 to 100%
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, ACTIVE, IN_REVIEW, COMPLETED, CANCELLED
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dp_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_dp_assign FOREIGN KEY (assignment_id) REFERENCES assessment_assignments (id) ON DELETE SET NULL,
    CONSTRAINT fk_dp_comp FOREIGN KEY (focus_competency_id) REFERENCES competencies (id) ON DELETE CASCADE
);

-- 21. DEVELOPMENT_ACTIONS TABLE (70-20-10 approach)
CREATE TABLE IF NOT EXISTS development_actions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    development_plan_id BIGINT NOT NULL,
    framework_type VARCHAR(20) NOT NULL, -- EXPERIENTIAL_70, EXPOSURE_20, EDUCATION_10
    action_title VARCHAR(255) NOT NULL,
    action_description TEXT,
    target_completion_date DATE,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED, DELAYED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_da_dp FOREIGN KEY (development_plan_id) REFERENCES development_plans (id) ON DELETE CASCADE
);

-- 22. PROGRESS_CHECKINS TABLE (4-6 week cadence)
CREATE TABLE IF NOT EXISTS progress_checkins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    development_plan_id BIGINT NOT NULL,
    checkin_date DATE NOT NULL,
    checkin_type VARCHAR(50) DEFAULT 'FOUR_WEEK', -- FOUR_WEEK, SIX_WEEK, QUARTERLY, AD_HOC
    employee_notes TEXT,
    manager_feedback TEXT,
    progress_percentage INT,
    status_assessment VARCHAR(50), -- ON_TRACK, AT_RISK, COMPLETED, NEEDS_SUPPORT
    conducted_by_manager_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pc_dp FOREIGN KEY (development_plan_id) REFERENCES development_plans (id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_mgr FOREIGN KEY (conducted_by_manager_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- 23. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- ASSESSMENT_ASSIGNED, DEADLINE_APPROACHING, ASSESSMENT_SUBMITTED, MANAGER_REVIEW_REQUIRED, IDP_CHECKIN_DUE, CYCLE_PUBLISHED
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (recipient_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_notif_user ON notifications(recipient_user_id);

-- 24. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_time ON audit_logs(timestamp);
