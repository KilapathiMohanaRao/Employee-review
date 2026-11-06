package com.employee360.config;

import com.employee360.entity.*;
import com.employee360.repository.*;
import com.employee360.service.CalculationEngineService;
import com.employee360.service.FeedbackQuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeRepository employeeRepository;
    private final ReportingRelationshipRepository reportingRepository;
    private final CompetencyRepository competencyRepository;
    private final BehaviourRepository behaviourRepository;
    private final RatingRepository ratingRepository;
    private final AssessmentCycleRepository cycleRepository;
    private final AssessmentAssignmentRepository assignmentRepository;
    private final ReviewerRelationshipRepository reviewerRelationshipRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final DevelopmentPlanRepository developmentPlanRepository;
    private final DevelopmentActionRepository developmentActionRepository;
    private final ProgressCheckinRepository progressCheckinRepository;
    private final NotificationRepository notificationRepository;
    private final CalculationEngineService calculationEngineService;
    private final PasswordEncoder passwordEncoder;
    private final FeedbackCampaignRepository feedbackCampaignRepository;
    private final FeedbackQuestionRepository feedbackQuestionRepository;
    private final FeedbackInvitationRepository feedbackInvitationRepository;
    private final FeedbackSubmissionRepository feedbackSubmissionRepository;
    private final FeedbackSubmissionItemRepository feedbackSubmissionItemRepository;
    private final EmailLogRepository emailLogRepository;
    private final FeedbackQuestionService feedbackQuestionService;
    private final SmtpConfigRepository smtpConfigRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DataLoader(RoleRepository roleRepository,
                      UserRepository userRepository,
                      DepartmentRepository departmentRepository,
                      DesignationRepository designationRepository,
                      EmployeeRepository employeeRepository,
                      ReportingRelationshipRepository reportingRepository,
                      CompetencyRepository competencyRepository,
                      BehaviourRepository behaviourRepository,
                      RatingRepository ratingRepository,
                      AssessmentCycleRepository cycleRepository,
                      AssessmentAssignmentRepository assignmentRepository,
                      ReviewerRelationshipRepository reviewerRelationshipRepository,
                      AssessmentRepository assessmentRepository,
                      AssessmentResponseRepository responseRepository,
                      DevelopmentPlanRepository developmentPlanRepository,
                      DevelopmentActionRepository developmentActionRepository,
                      ProgressCheckinRepository progressCheckinRepository,
                      NotificationRepository notificationRepository,
                      CalculationEngineService calculationEngineService,
                      PasswordEncoder passwordEncoder,
                      FeedbackCampaignRepository feedbackCampaignRepository,
                      FeedbackQuestionRepository feedbackQuestionRepository,
                      FeedbackInvitationRepository feedbackInvitationRepository,
                      FeedbackSubmissionRepository feedbackSubmissionRepository,
                      FeedbackSubmissionItemRepository feedbackSubmissionItemRepository,
                      EmailLogRepository emailLogRepository,
                      FeedbackQuestionService feedbackQuestionService,
                      SmtpConfigRepository smtpConfigRepository,
                      org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.employeeRepository = employeeRepository;
        this.reportingRepository = reportingRepository;
        this.competencyRepository = competencyRepository;
        this.behaviourRepository = behaviourRepository;
        this.ratingRepository = ratingRepository;
        this.cycleRepository = cycleRepository;
        this.assignmentRepository = assignmentRepository;
        this.reviewerRelationshipRepository = reviewerRelationshipRepository;
        this.assessmentRepository = assessmentRepository;
        this.responseRepository = responseRepository;
        this.developmentPlanRepository = developmentPlanRepository;
        this.developmentActionRepository = developmentActionRepository;
        this.progressCheckinRepository = progressCheckinRepository;
        this.notificationRepository = notificationRepository;
        this.calculationEngineService = calculationEngineService;
        this.passwordEncoder = passwordEncoder;
        this.feedbackCampaignRepository = feedbackCampaignRepository;
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackInvitationRepository = feedbackInvitationRepository;
        this.feedbackSubmissionRepository = feedbackSubmissionRepository;
        this.feedbackSubmissionItemRepository = feedbackSubmissionItemRepository;
        this.emailLogRepository = emailLogRepository;
        this.feedbackQuestionService = feedbackQuestionService;
        this.smtpConfigRepository = smtpConfigRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        ensureSchemaUpToDate();

        if (roleRepository.count() > 0) {
            log.info("Database already seeded. Checking competencies and behaviours alignment...");
            syncSingleBehaviourPerCompetency();
            seedInitialReviewsIfEmpty();
            seedFeedbackSystemIfEmpty();
            return;
        }

        log.info("Starting Enterprise 360 Database Seeding...");

        // 1. Roles
        Role superAdminRole = roleRepository.save(new Role("SUPER_ADMIN", "Full system administrator"));
        Role hrAdminRole = roleRepository.save(new Role("HR_ADMIN", "Human Resources administrator"));
        Role managerRole = roleRepository.save(new Role("MANAGER", "People and engineering manager"));
        Role employeeRole = roleRepository.save(new Role("EMPLOYEE", "Individual contributor employee"));
        Role peerRole = roleRepository.save(new Role("PEER", "Colleague reviewer"));
        Role directReportRole = roleRepository.save(new Role("DIRECT_REPORT", "Subordinate reviewer"));
        Role crossFunctionalRole = roleRepository.save(new Role("CROSS_FUNCTIONAL_PARTNER", "Cross-department collaborator"));

        // 2. Ratings Scale (1 to 5)
        ratingRepository.save(new Rating(1, "Rarely", "Demonstrates behaviour only under direct instruction or rarely"));
        ratingRepository.save(new Rating(2, "Inconsistently", "Demonstrates behaviour inconsistently or with varying quality"));
        ratingRepository.save(new Rating(3, "Effective", "Consistently meets expected standards and demonstrates competence"));
        ratingRepository.save(new Rating(4, "Strong", "Frequently exceeds expectations and models proactive excellence"));
        ratingRepository.save(new Rating(5, "Role model", "Exceptional benchmark exemplar who actively coaches and elevates others"));

        // 3. Departments
        Department engDept = departmentRepository.save(new Department("Engineering & Architecture", "ENG", "Core software platform and infrastructure"));
        Department prodDept = departmentRepository.save(new Department("Product Management", "PROD", "Product discovery, roadmaps, and UX"));
        Department qaDept = departmentRepository.save(new Department("Quality & Operations", "QA", "Automated verification and site reliability"));
        Department hrDept = departmentRepository.save(new Department("People Operations", "HR", "Talent management and development"));
        Department salesDept = departmentRepository.save(new Department("Growth & Business", "SALES", "Commercial partnerships and revenue"));

        // 4. Designations
        Designation vpEng = designationRepository.save(new Designation("VP of Engineering", "VP_ENG", "L7", engDept));
        Designation engManager = designationRepository.save(new Designation("Engineering Manager", "EM", "L6", engDept));
        Designation leadEngineer = designationRepository.save(new Designation("Lead Software Engineer", "LEAD_ENG", "L5", engDept));
        Designation seniorEngineer = designationRepository.save(new Designation("Senior Software Engineer", "SR_ENG", "L4", engDept));
        Designation prodManager = designationRepository.save(new Designation("Principal Product Manager", "PRIN_PM", "L5", prodDept));
        Designation hrManager = designationRepository.save(new Designation("Director of Talent", "DIR_TALENT", "L6", hrDept));

        // 5. Seed Users & Employees
        String defaultPassword = passwordEncoder.encode("Password@123");

        // Super Admin
        User uSuper = createUser("superadmin", "superadmin@enterprise.com", defaultPassword, Collections.singleton(superAdminRole));
        Employee empSuper = createEmployee(uSuper, "EMP-001", "Arthur", "Pendelton", "superadmin@enterprise.com", engDept, vpEng, null, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");

        // HR Admin
        User uHr = createUser("hr.admin", "hr.admin@enterprise.com", defaultPassword, Collections.singleton(hrAdminRole));
        Employee empHr = createEmployee(uHr, "EMP-002", "Elena", "Rostova", "hr.admin@enterprise.com", hrDept, hrManager, empSuper, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150");

        // Manager (Sarah Connor)
        User uManager = createUser("sarah.manager", "sarah.manager@enterprise.com", defaultPassword, Collections.singleton(managerRole));
        Employee empManager = createEmployee(uManager, "EMP-003", "Sarah", "Connor", "sarah.manager@enterprise.com", engDept, engManager, empSuper, "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150");

        // Employee (Alex Taylor - Primary Subject)
        User uEmployee = createUser("alex.employee", "alex.employee@enterprise.com", defaultPassword, Collections.singleton(employeeRole));
        Employee empAlex = createEmployee(uEmployee, "EMP-004", "Alex", "Taylor", "alex.employee@enterprise.com", engDept, leadEngineer, empManager, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

        // Peer (David Kim)
        User uPeer = createUser("david.peer", "david.peer@enterprise.com", defaultPassword, Collections.singleton(peerRole));
        Employee empPeer = createEmployee(uPeer, "EMP-005", "David", "Kim", "david.peer@enterprise.com", engDept, seniorEngineer, empManager, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");

        // Direct Report (Emma Watson)
        User uDirectReport = createUser("emma.directreport", "emma.directreport@enterprise.com", defaultPassword, Collections.singleton(directReportRole));
        Employee empDirectReport = createEmployee(uDirectReport, "EMP-006", "Emma", "Watson", "emma.directreport@enterprise.com", engDept, seniorEngineer, empAlex, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");

        // Cross-Functional Partner (Marcus Vance - PM)
        User uCrossFunctional = createUser("marcus.crossfunctional", "marcus.crossfunctional@enterprise.com", defaultPassword, Collections.singleton(crossFunctionalRole));
        Employee empCrossFunctional = createEmployee(uCrossFunctional, "EMP-007", "Marcus", "Vance", "marcus.crossfunctional@enterprise.com", prodDept, prodManager, empSuper, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");

        // 6. Seed 11 Standard Workbook Competencies (1 Consolidated Behaviour each)
        List<Competency> competencies = seedCompetenciesAndBehaviours();

        // 7. Seed Assessment Cycle
        AssessmentCycle cycle = new AssessmentCycle();
        cycle.setTitle("Annual 360° Leadership & Engineering Review 2026");
        cycle.setCode("CYCLE-2026-Q4");
        cycle.setDescription("Comprehensive 360-degree talent review benchmarking technical leadership, operational delivery, culture, and business impact.");
        cycle.setStartDate(LocalDate.now().minusDays(15));
        cycle.setEndDate(LocalDate.now().plusDays(30));
        cycle.setStatus("IN_PROGRESS");
        cycle.setAnonymousPeerFeedback(true);
        cycle.setAnonymousDirectReportFeedback(true);
        cycle.setAnonymousCrossFunctional(true);
        cycle.setWeightSelf(new BigDecimal("10.00"));
        cycle.setWeightManager(new BigDecimal("35.00"));
        cycle.setWeightPeer(new BigDecimal("25.00"));
        cycle.setWeightDirectReport(new BigDecimal("15.00"));
        cycle.setWeightCrossFunctional(new BigDecimal("15.00"));
        AssessmentCycle savedCycle = cycleRepository.save(cycle);

        // 8. Create Assessment Assignment for Alex Taylor
        AssessmentAssignment alexAssignment = new AssessmentAssignment(savedCycle, empAlex);
        alexAssignment.setStatus("IN_PROGRESS");
        AssessmentAssignment savedAssignment = assignmentRepository.save(alexAssignment);

        // 9. Assign the 5 360 Reviewers for Alex
        // Reviewer 1: Self
        ReviewerRelationship relSelf = reviewerRelationshipRepository.save(new ReviewerRelationship(savedAssignment, empAlex, "SELF", false));
        // Reviewer 2: Manager (Sarah Connor)
        ReviewerRelationship relManager = reviewerRelationshipRepository.save(new ReviewerRelationship(savedAssignment, empManager, "MANAGER", false));
        // Reviewer 3: Peer (David Kim - Anonymous)
        ReviewerRelationship relPeer = reviewerRelationshipRepository.save(new ReviewerRelationship(savedAssignment, empPeer, "PEER", true));
        // Reviewer 4: Direct Report (Emma Watson - Anonymous)
        ReviewerRelationship relDirectReport = reviewerRelationshipRepository.save(new ReviewerRelationship(savedAssignment, empDirectReport, "DIRECT_REPORT", true));
        // Reviewer 5: Cross-Functional Partner (Marcus Vance - Anonymous)
        ReviewerRelationship relCrossFunctional = reviewerRelationshipRepository.save(new ReviewerRelationship(savedAssignment, empCrossFunctional, "CROSS_FUNCTIONAL", true));

        // 10. Reviewer relationships are active and pending real user input (NO default ratings seeded).
        // All score calculations, scorecards, blind spots, hidden strengths, and development plans
        // will be dynamically performed based strictly on user-given ratings and information.

        notificationRepository.save(new Notification(
                uEmployee,
                "ASSESSMENT_ASSIGNED",
                "360° Self-Assessment Assigned",
                "Please complete your self-assessment across the 11 benchmark competencies for Annual Review 2026.",
                "/assessments"
        ));

        notificationRepository.save(new Notification(
                uManager,
                "ASSESSMENT_ASSIGNED",
                "Manager Assessment Required",
                "You are assigned to evaluate Alex Taylor as Manager for Annual Review 2026.",
                "/assessments"
        ));

        notificationRepository.save(new Notification(
                uPeer,
                "ASSESSMENT_ASSIGNED",
                "Peer Review Request",
                "Please provide confidential peer feedback for Alex Taylor.",
                "/assessments"
        ));

        notificationRepository.save(new Notification(
                uDirectReport,
                "ASSESSMENT_ASSIGNED",
                "Direct Report Feedback Request",
                "Please provide upward feedback for Alex Taylor.",
                "/assessments"
        ));

        notificationRepository.save(new Notification(
                uCrossFunctional,
                "ASSESSMENT_ASSIGNED",
                "Cross-Functional Review Request",
                "Please provide cross-functional partner feedback for Alex Taylor.",
                "/assessments"
        ));

        log.info("Enterprise 360 Database initialized with clean benchmark library (11 competencies, 1 consolidated behaviour each, 5-point rating scale). Zero default ratings seeded - awaiting user input.");
    }

    private User createUser(String username, String email, String password, Set<Role> roles) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPasswordHash(password);
        u.setActive(true);
        u.setRoles(roles);
        return userRepository.save(u);
    }

    private Employee createEmployee(User user, String code, String first, String last, String email,
                                    Department dept, Designation desig, Employee manager, String avatar) {
        Employee e = new Employee();
        e.setUser(user);
        e.setEmployeeCode(code);
        e.setFirstName(first);
        e.setLastName(last);
        e.setEmail(email);
        e.setDepartment(dept);
        e.setDesignation(desig);
        e.setManager(manager);
        e.setAvatarUrl(avatar);
        e.setJoiningDate(LocalDate.now().minusYears(2));
        e.setStatus("ACTIVE");
        return employeeRepository.save(e);
    }

    private Map<String, String[]> getSingleBehaviourDefinitions() {
        Map<String, String[]> map = new LinkedHashMap<>();
        map.put("TECH_LEAD", new String[]{
                "Provides clear technical direction and architectural oversight, balancing technical debt with delivery speed while enforcing best practices",
                "Sets clear technical vision, reviews designs, and balances speed with quality standards"
        });
        map.put("DELIV_EXEC", new String[]{
                "Predictably delivers high-impact results on schedule by establishing realistic milestones, proactively resolving bottlenecks, and holding team accountable",
                "Meets project commitments, mitigates risks, and drives team accountability"
        });
        map.put("QUAL_OPS", new String[]{
                "Safeguards production reliability and operational health through automated testing, continuous integration, active monitoring, and blameless incident root-cause analysis",
                "Upholds test coverage, error budgets, telemetry, and automated CI/CD pipelines"
        });
        map.put("PPL_DEV", new String[]{
                "Actively mentors team members, offers timely constructive feedback, and unlocks career growth through impactful stretch opportunities and skill building",
                "Coaches junior/mid-level engineers and fosters continuous learning"
        });
        map.put("TEAM_CULT", new String[]{
                "Fosters an inclusive and psychologically safe team culture, attracting top talent, recognizing achievements, and resolving conflicts with empathy",
                "Promotes diversity, celebrates contributions, and manages interpersonal friction constructively"
        });
        map.put("COMM_STAKE", new String[]{
                "Articulates complex concepts clearly to all audiences, transparently manages stakeholder expectations, and maintains high-quality documentation",
                "Translates technical intricacies, communicates risks early, and writes clear RFCs"
        });
        map.put("CROSS_FUNC", new String[]{
                "Partners seamlessly across departments (Product, Design, QA, Business), breaking down organizational silos and negotiating constructive trade-offs",
                "Aligns early with partners, shares cross-team resources, and aligns on shared goals"
        });
        map.put("STRAT_BIZ", new String[]{
                "Aligns technical roadmaps with business goals and customer needs, planning future capability runway while demonstrating measurable ROI",
                "Connects engineering investments with company growth and tracks quantifiable outcomes"
        });
        map.put("DECIS_MKG", new String[]{
                "Makes sound, timely decisions in ambiguous conditions using data and practical judgment, seeking stakeholder consensus while taking full ownership",
                "Balances metrics with experience and takes accountability for outcomes"
        });
        map.put("CHG_AGIL", new String[]{
                "Champions innovative solutions and modern tools, navigating shifting priorities with agility and encouraging calculated experimentation",
                "Introduces modern tech, adapts to changes smoothly, and eliminates legacy toil"
        });
        map.put("INTG_SELF", new String[]{
                "Exemplifies highest ethical standards, reliably follows through on commitments, remains composed under pressure, and seeks feedback for self-improvement",
                "Acts with integrity, handles crises calmly, and proactively addresses personal blind spots"
        });
        return map;
    }

    private void syncSingleBehaviourPerCompetency() {
        if (behaviourRepository.count() > 11) {
            log.info("Migrating competencies to 1 consolidated behavioural item per competency...");
            Map<String, String[]> defs = getSingleBehaviourDefinitions();
            List<Competency> competencies = competencyRepository.findAll();
            for (Competency c : competencies) {
                if (defs.containsKey(c.getCode())) {
                    String[] def = defs.get(c.getCode());
                    c.getBehaviours().clear();
                    c.addBehaviour(new Behaviour(def[0], def[1], 1));
                    competencyRepository.save(c);
                }
            }
            log.info("Competency library successfully consolidated to 1 behavioural item per competency.");
        }
    }

    private List<Competency> seedCompetenciesAndBehaviours() {
        List<Competency> list = new ArrayList<>();
        Map<String, String[]> defs = getSingleBehaviourDefinitions();

        // 1. Technical Leadership
        Competency c1 = new Competency("Technical Leadership", "TECH_LEAD", "Sets technical direction, architectural integrity, and balances scalability with speed.", "LEADERSHIP", 1);
        c1.addBehaviour(new Behaviour(defs.get("TECH_LEAD")[0], defs.get("TECH_LEAD")[1], 1));
        list.add(competencyRepository.save(c1));

        // 2. Delivery & Execution
        Competency c2 = new Competency("Delivery & Execution", "DELIV_EXEC", "Consistently executes on roadmaps, mitigates delivery risks, and drives operational velocity.", "CORE", 2);
        c2.addBehaviour(new Behaviour(defs.get("DELIV_EXEC")[0], defs.get("DELIV_EXEC")[1], 1));
        list.add(competencyRepository.save(c2));

        // 3. Quality & Operational Excellence
        Competency c3 = new Competency("Quality & Operational Excellence", "QUAL_OPS", "Upholds platform reliability, automated testing, observability, and incident resolution.", "CORE", 3);
        c3.addBehaviour(new Behaviour(defs.get("QUAL_OPS")[0], defs.get("QUAL_OPS")[1], 1));
        list.add(competencyRepository.save(c3));

        // 4. People Development & Coaching
        Competency c4 = new Competency("People Development & Coaching", "PPL_DEV", "Invests in mentoring colleagues, unlocking career growth, and delivering constructive feedback.", "LEADERSHIP", 4);
        c4.addBehaviour(new Behaviour(defs.get("PPL_DEV")[0], defs.get("PPL_DEV")[1], 1));
        list.add(competencyRepository.save(c4));

        // 5. Team Building, Hiring & Culture
        Competency c5 = new Competency("Team Building, Hiring & Culture", "TEAM_CULT", "Fosters psychological safety, diverse hiring, high morale, and constructive conflict resolution.", "BEHAVIOURAL", 5);
        c5.addBehaviour(new Behaviour(defs.get("TEAM_CULT")[0], defs.get("TEAM_CULT")[1], 1));
        list.add(competencyRepository.save(c5));

        // 6. Communication & Stakeholders
        Competency c6 = new Competency("Communication & Stakeholders", "COMM_STAKE", "Communicates complex technical concepts with clarity, transparency, and executive poise.", "CORE", 6);
        c6.addBehaviour(new Behaviour(defs.get("COMM_STAKE")[0], defs.get("COMM_STAKE")[1], 1));
        list.add(competencyRepository.save(c6));

        // 7. Cross-functional Collaboration
        Competency c7 = new Competency("Cross-functional Collaboration", "CROSS_FUNC", "Partners seamlessly across Product, Design, QA, and business functions to break down silos.", "BEHAVIOURAL", 7);
        c7.addBehaviour(new Behaviour(defs.get("CROSS_FUNC")[0], defs.get("CROSS_FUNC")[1], 1));
        list.add(competencyRepository.save(c7));

        // 8. Strategy & Business Impact
        Competency c8 = new Competency("Strategy & Business Impact", "STRAT_BIZ", "Aligns engineering strategy with company goals, user needs, and measurable business ROI.", "LEADERSHIP", 8);
        c8.addBehaviour(new Behaviour(defs.get("STRAT_BIZ")[0], defs.get("STRAT_BIZ")[1], 1));
        list.add(competencyRepository.save(c8));

        // 9. Decision Making
        Competency c9 = new Competency("Decision Making", "DECIS_MKG", "Makes timely, data-informed decisions in ambiguity with clear accountability and ownership.", "CORE", 9);
        c9.addBehaviour(new Behaviour(defs.get("DECIS_MKG")[0], defs.get("DECIS_MKG")[1], 1));
        list.add(competencyRepository.save(c9));

        // 10. Change, Agility & Innovation
        Competency c10 = new Competency("Change, Agility & Innovation", "CHG_AGIL", "Embraces change, encourages calculated experimentation, and modernizes legacy paradigms.", "BEHAVIOURAL", 10);
        c10.addBehaviour(new Behaviour(defs.get("CHG_AGIL")[0], defs.get("CHG_AGIL")[1], 1));
        list.add(competencyRepository.save(c10));

        // 11. Integrity & Self Leadership
        Competency c11 = new Competency("Integrity & Self Leadership", "INTG_SELF", "Exemplifies ethical transparency, resilience under pressure, and relentless self-improvement.", "BEHAVIOURAL", 11);
        c11.addBehaviour(new Behaviour(defs.get("INTG_SELF")[0], defs.get("INTG_SELF")[1], 1));
        list.add(competencyRepository.save(c11));

        return list;
    }

    private void seedInitialReviewsIfEmpty() {
        if (!assessmentRepository.findAllSubmittedAssessments().isEmpty()) {
            return;
        }

        List<AssessmentAssignment> assignments = assignmentRepository.findAll();
        if (assignments.isEmpty()) return;

        AssessmentAssignment assignment = assignments.get(0);
        List<ReviewerRelationship> relationships = reviewerRelationshipRepository.findByAssignmentId(assignment.getId());
        List<Competency> competencies = competencyRepository.findByActiveTrueOrderBySortOrderAsc();

        for (ReviewerRelationship rel : relationships) {
            if ("MANAGER".equals(rel.getReviewType())) {
                Assessment a = new Assessment(assignment, rel);
                a.setStatus("SUBMITTED");
                a.setLocked(true);
                a.setSubmittedAt(java.time.LocalDateTime.now().minusDays(2));
                a.setSummaryFeedback("Alex has performed exceptionally as our lead engineer, consistently maintaining high standards for code review quality and system scalability.");
                a.setKeyStrengthsComment("Deep technical architecture expertise, platform reliability dedication, and calm execution under pressure.");
                a.setDevelopmentAreasComment("Can delegate more architectural component RFCs to mid-level engineers to foster mentoring capacity.");
                Assessment saved = assessmentRepository.save(a);

                rel.setStatus("SUBMITTED");
                rel.setSubmittedAt(java.time.LocalDateTime.now().minusDays(2));
                reviewerRelationshipRepository.save(rel);

                for (Competency c : competencies) {
                    Behaviour b = c.getBehaviours().isEmpty() ? null : c.getBehaviours().get(0);
                    if (b != null) {
                        int score = "TECH_LEAD".equals(c.getCode()) || "QUAL_OPS".equals(c.getCode()) ? 5 : 4;
                        responseRepository.save(new AssessmentResponse(saved, b, score, false, "Consistent benchmark demonstration."));
                    }
                }
            } else if ("PEER".equals(rel.getReviewType())) {
                Assessment a = new Assessment(assignment, rel);
                a.setStatus("SUBMITTED");
                a.setLocked(true);
                a.setSubmittedAt(java.time.LocalDateTime.now().minusDays(1));
                a.setSummaryFeedback("Fantastic peer collaborator who is always willing to unblock teammates and provide constructive feedback.");
                a.setKeyStrengthsComment("Exemplary code reviews, cross-functional empathy, and high integrity.");
                a.setDevelopmentAreasComment("More active documentation of implicit architectural decisions.");
                Assessment saved = assessmentRepository.save(a);

                rel.setStatus("SUBMITTED");
                rel.setSubmittedAt(java.time.LocalDateTime.now().minusDays(1));
                reviewerRelationshipRepository.save(rel);

                for (Competency c : competencies) {
                    Behaviour b = c.getBehaviours().isEmpty() ? null : c.getBehaviours().get(0);
                    if (b != null) {
                        int score = "TEAM_CULT".equals(c.getCode()) || "QUAL_OPS".equals(c.getCode()) ? 5 : 4;
                        responseRepository.save(new AssessmentResponse(saved, b, score, false, "Consistently models peer excellence."));
                    }
                }
            }
        }

        try {
            calculationEngineService.calculateAssignmentSummaries(assignment.getId());
        } catch (Exception e) {
            log.warn("Could not recalculate summaries: {}", e.getMessage());
        }
        log.info("Seeded initial benchmark reviews for admin demonstration.");
    }

    @Transactional
    public void seedFeedbackSystemIfEmpty() {
        Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("SUPER_ADMIN", "Full system administrator")));

        // 1. Ensure Admin User exists for kilaparthimohan27@gmail.com (and admin@enterprise.com)
        String mohanEmail = "kilaparthimohan27@gmail.com";
        String adminPassword = passwordEncoder.encode("Naidu 1234");

        Optional<User> mohanUserOpt = userRepository.findByEmail(mohanEmail)
                .or(() -> userRepository.findByUsername(mohanEmail));
        User mohanUser;
        if (mohanUserOpt.isEmpty()) {
            mohanUser = new User();
            mohanUser.setUsername(mohanEmail);
            mohanUser.setEmail(mohanEmail);
            mohanUser.setPasswordHash(adminPassword);
            mohanUser.setActive(true);
            mohanUser.setRoles(Collections.singleton(superAdminRole));
            mohanUser = userRepository.save(mohanUser);
            log.info("Created primary admin user: {} / Naidu 1234", mohanEmail);
        } else {
            mohanUser = mohanUserOpt.get();
            mohanUser.setPasswordHash(adminPassword);
            mohanUser = userRepository.save(mohanUser);
        }

        // Also ensure username 'admin' has password 'Naidu 1234'
        userRepository.findByUsername("admin").ifPresent(u -> {
            u.setPasswordHash(adminPassword);
            userRepository.save(u);
        });
        userRepository.findByEmail("admin@enterprise.com").ifPresent(u -> {
            u.setPasswordHash(adminPassword);
            userRepository.save(u);
        });

        // Ensure Employee Profile for Mohan Kilaparthi
        Department execDept = departmentRepository.findByName("Executive Leadership")
                .orElseGet(() -> departmentRepository.save(new Department("Executive Leadership", "EXEC", "Executive Operations")));
        Designation leadAdminDesig = designationRepository.findByCode("LEAD_ADMIN")
                .orElseGet(() -> designationRepository.save(new Designation("Lead Administrator & Executive", "LEAD_ADMIN", "L7", execDept)));

        Optional<Employee> empOpt = employeeRepository.findByEmail(mohanEmail);
        if (empOpt.isEmpty()) {
            Employee emp = new Employee();
            emp.setUser(mohanUser);
            emp.setEmployeeCode("ADM-001");
            emp.setFirstName("Mohan");
            emp.setLastName("Kilaparthi");
            emp.setEmail(mohanEmail);
            emp.setDepartment(execDept);
            emp.setDesignation(leadAdminDesig);
            employeeRepository.save(emp);
        }

        // 2. Ensure Feedback Campaign evaluates Mohan Kilaparthi
        FeedbackCampaign campaign = feedbackCampaignRepository.findFirstByActiveTrueOrderByCreatedAtDesc().orElseGet(() -> {
            FeedbackCampaign c = new FeedbackCampaign(
                    "2026 Admin 360° Comprehensive Leadership & Performance Review",
                    "Mohan Kilaparthi",
                    "Administrator & Executive Leader",
                    mohanEmail,
                    "Confidential 360-degree feedback collection evaluating leadership, communication, problem solving, decision making, and team collaboration."
            );
            return feedbackCampaignRepository.save(c);
        });
        campaign.setAdminName("Mohan Kilaparthi");
        campaign.setAdminEmail(mohanEmail);
        campaign.setAdminTitle("Administrator & Executive Leader");

        String envAppBaseUrl = getEnvOrDotEnv("APP_BASE_URL");
        if (envAppBaseUrl != null && !envAppBaseUrl.isBlank() && !envAppBaseUrl.contains("enterprise.com")) {
            campaign.setPublicBaseUrl(envAppBaseUrl.trim());
        } else if (campaign.getPublicBaseUrl() == null || campaign.getPublicBaseUrl().isBlank() || campaign.getPublicBaseUrl().contains("enterprise.com")) {
            campaign.setPublicBaseUrl("http://localhost:5173");
        }
        feedbackCampaignRepository.save(campaign);

        // Synchronize any invitations with obsolete or dummy domains to the active publicBaseUrl
        if (campaign.getPublicBaseUrl() != null && !campaign.getPublicBaseUrl().isBlank()) {
            try {
                jdbcTemplate.update(
                    "UPDATE feedback_invitations SET public_feedback_url = CONCAT(?, '/feedback/', token) " +
                    "WHERE public_feedback_url IS NULL OR public_feedback_url NOT LIKE CONCAT(?, '%')",
                    campaign.getPublicBaseUrl().trim(),
                    campaign.getPublicBaseUrl().trim()
                );
            } catch (Exception ignored) {}
        }

        // 3. Ensure Default Questions exist
        feedbackQuestionService.seedDefaultQuestionsIfEmpty(campaign);

        // 4. Pre-configure SMTP Config for kilaparthimohan27@gmail.com with environment variables support
        String envHost = getEnvOrDotEnv("SMTP_HOST");
        String envPort = getEnvOrDotEnv("SMTP_PORT");
        String envUser = getEnvOrDotEnv("SMTP_USER");
        String envPass = getEnvOrDotEnv("SMTP_PASSWORD");
        String envFrom = getEnvOrDotEnv("EMAIL_FROM");
        String envFromName = getEnvOrDotEnv("EMAIL_FROM_NAME");
        String envResendKey = getEnvOrDotEnv("RESEND_API_KEY");

        SmtpConfig smtpCfg = smtpConfigRepository.findFirstByOrderByIdAsc().orElseGet(SmtpConfig::new);
        smtpCfg.setHost(envHost != null && !envHost.isBlank() ? envHost.trim() : "smtp.gmail.com");
        if (envPort != null && !envPort.isBlank()) {
            try { smtpCfg.setPort(Integer.parseInt(envPort.trim())); } catch (NumberFormatException ignored) {}
        } else if (smtpCfg.getPort() <= 0) {
            smtpCfg.setPort(587);
        }
        smtpCfg.setUsername(envUser != null && !envUser.isBlank() ? envUser.trim() : mohanEmail);

        if (envPass != null && !envPass.isBlank()) {
            smtpCfg.setPassword(envPass.trim());
        }
        // If password is already set in DB from Admin UI, DO NOT OVERWRITE with hardcoded plain text

        smtpCfg.setFromEmail(envFrom != null && !envFrom.isBlank() ? envFrom.trim() : mohanEmail);
        smtpCfg.setFromName(envFromName != null && !envFromName.isBlank() ? envFromName.trim() : "Mohan Kilaparthi");
        if (envResendKey != null && !envResendKey.isBlank()) {
            smtpCfg.setApiKey(envResendKey.trim());
            smtpCfg.setProviderType("RESEND");
        }
        smtpCfg.setAuthEnabled(true);
        smtpCfg.setStartTlsEnabled(true);
        smtpCfg.setActive(true);
        smtpConfigRepository.save(smtpCfg);

        log.info("Initialized Admin 360 Feedback System: Evaluating Mohan Kilaparthi ({}) with real email dispatch pipeline (Host: {}, Port: {}, Base URL: {}).",
                mohanEmail, smtpCfg.getHost(), smtpCfg.getPort(), campaign.getPublicBaseUrl());
    }

    private void ensureSchemaUpToDate() {
        try {
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0");
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS public_feedback_url VARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS email_delivery_status VARCHAR(32) DEFAULT 'PENDING'");
            jdbcTemplate.execute("ALTER TABLE feedback_invitations ADD COLUMN IF NOT EXISTS email_delivery_error TEXT");
            jdbcTemplate.execute("ALTER TABLE feedback_campaigns ADD COLUMN IF NOT EXISTS public_base_url VARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE smtp_configs ADD COLUMN IF NOT EXISTS provider_type VARCHAR(32) DEFAULT 'SMTP'");
            jdbcTemplate.execute("ALTER TABLE smtp_configs ADD COLUMN IF NOT EXISTS api_key VARCHAR(500)");
            log.info("Database schema columns verified and up-to-date for Cross-Device Feedback Links & Email Delivery.");
        } catch (Exception e) {
            log.warn("Schema check warning: {}", e.getMessage());
        }
    }

    private String getEnvOrDotEnv(String key) {
        String val = System.getProperty(key, System.getenv(key));
        if (val != null && !val.isBlank()) {
            return val.trim();
        }
        for (String p : Arrays.asList(".env", "../.env", "d:/Spring/Employee 360  Review/.env")) {
            java.io.File f = new java.io.File(p);
            if (f.exists() && f.isFile()) {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(f))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.startsWith(key + "=")) {
                            return line.substring((key + "=").length()).trim();
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        return null;
    }
}
