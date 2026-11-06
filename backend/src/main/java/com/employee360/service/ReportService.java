package com.employee360.service;

import com.employee360.dto.*;
import com.employee360.entity.*;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final AssessmentAssignmentRepository assignmentRepository;
    private final AssessmentRepository assessmentRepository;
    private final ReviewerRelationshipRepository reviewerRelationshipRepository;
    private final FeedbackCommentRepository commentRepository;
    private final CompetencySummaryRepository summaryRepository;
    private final EmployeeRepository employeeRepository;
    private final CompetencyRepository competencyRepository;
    private final CalculationEngineService calculationEngineService;

    public ReportService(AssessmentAssignmentRepository assignmentRepository,
                         AssessmentRepository assessmentRepository,
                         ReviewerRelationshipRepository reviewerRelationshipRepository,
                         FeedbackCommentRepository commentRepository,
                         CompetencySummaryRepository summaryRepository,
                         EmployeeRepository employeeRepository,
                         CompetencyRepository competencyRepository,
                         CalculationEngineService calculationEngineService) {
        this.assignmentRepository = assignmentRepository;
        this.assessmentRepository = assessmentRepository;
        this.reviewerRelationshipRepository = reviewerRelationshipRepository;
        this.commentRepository = commentRepository;
        this.summaryRepository = summaryRepository;
        this.employeeRepository = employeeRepository;
        this.competencyRepository = competencyRepository;
        this.calculationEngineService = calculationEngineService;
    }

    @Transactional
    public Employee360ReportDto getEmployee360Report(Long employeeId, Long cycleId) {
        List<AssessmentAssignment> assignments = assignmentRepository.findByEmployeeId(employeeId);
        if (assignments.isEmpty()) {
            Employee emp = employeeRepository.findById(employeeId).orElse(null);
            if (emp == null) {
                List<AssessmentAssignment> all = assignmentRepository.findAll();
                if (!all.isEmpty()) {
                    return getEmployee360Report(all.get(0).getEmployee().getId(), cycleId);
                }
                throw new ResourceNotFoundException("Employee not found: " + employeeId);
            }

            Employee360ReportDto emptyReport = new Employee360ReportDto();
            emptyReport.setEmployeeId(emp.getId());
            emptyReport.setEmployeeName(emp.getFullName());
            emptyReport.setEmployeeCode(emp.getEmployeeCode());
            emptyReport.setDepartmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : "");
            emptyReport.setDesignationTitle(emp.getDesignation() != null ? emp.getDesignation().getTitle() : "");
            emptyReport.setManagerName(emp.getManager() != null ? emp.getManager().getFullName() : "N/A");
            emptyReport.setAvatarUrl(emp.getAvatarUrl());
            emptyReport.setStatus("NOT_ASSIGNED");
            emptyReport.setCycleTitle("No Active Review Cycle Assigned");
            emptyReport.setCompletedReviews(0);
            emptyReport.setTotalReviewers(0);

            List<Competency> comps = competencyRepository.findByActiveTrueOrderBySortOrderAsc();
            emptyReport.setScorecards(comps.stream().map(c -> {
                CompetencyScorecardDto sc = new CompetencyScorecardDto();
                sc.setCompetencyId(c.getId());
                sc.setCompetencyName(c.getName());
                sc.setCompetencyCode(c.getCode());
                sc.setCategory(c.getCategory());
                sc.setItemCount(c.getBehaviours() != null ? c.getBehaviours().size() : 4);
                sc.setPerformanceInsight("AWAITING_REVIEWS");
                return sc;
            }).collect(Collectors.toList()));

            emptyReport.setTopStrengths(Collections.emptyList());
            emptyReport.setTopDevelopmentAreas(Collections.emptyList());
            emptyReport.setBlindSpots(Collections.emptyList());
            emptyReport.setHiddenStrengths(Collections.emptyList());
            emptyReport.setQualitativeStrengths(Collections.emptyList());
            emptyReport.setQualitativeDevelopmentAreas(Collections.emptyList());
            emptyReport.setGeneralFeedback(Collections.emptyList());
            return emptyReport;
        }

        AssessmentAssignment assignment;
        if (cycleId != null) {
            assignment = assignments.stream()
                    .filter(a -> a.getCycle().getId().equals(cycleId))
                    .findFirst()
                    .orElse(assignments.get(0));
        } else {
            assignment = assignments.get(assignments.size() - 1); // Latest
        }

        // Ensure calculation is fresh
        List<CompetencySummary> summaries = summaryRepository.findByAssignmentIdOrderByCompetencyRankAsc(assignment.getId());
        if (summaries.isEmpty()) {
            summaries = calculationEngineService.calculateAssignmentSummaries(assignment.getId());
        }

        Employee emp = assignment.getEmployee();
        Employee360ReportDto report = new Employee360ReportDto();
        report.setEmployeeId(emp.getId());
        report.setEmployeeName(emp.getFullName());
        report.setEmployeeCode(emp.getEmployeeCode());
        report.setDepartmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : "");
        report.setDesignationTitle(emp.getDesignation() != null ? emp.getDesignation().getTitle() : "");
        report.setManagerName(emp.getManager() != null ? emp.getManager().getFullName() : "N/A");
        report.setAvatarUrl(emp.getAvatarUrl());

        report.setCycleId(assignment.getCycle().getId());
        report.setCycleTitle(assignment.getCycle().getTitle());
        report.setStatus(assignment.getStatus());
        report.setOverallScore(assignment.getOverallScore());

        List<Assessment> assessments = assessmentRepository.findByAssignmentId(assignment.getId());
        int assignedCount = reviewerRelationshipRepository.findByAssignmentId(assignment.getId()).size();
        report.setTotalReviewers(assignedCount > 0 ? assignedCount : assessments.size());
        report.setCompletedReviews((int) assessments.stream().filter(a -> "SUBMITTED".equals(a.getStatus())).count());

        // Scorecards
        report.setScorecards(summaries.stream().map(s -> {
            CompetencyScorecardDto sc = new CompetencyScorecardDto();
            sc.setCompetencyId(s.getCompetency().getId());
            sc.setCompetencyName(s.getCompetency().getName());
            sc.setCompetencyCode(s.getCompetency().getCode());
            sc.setCategory(s.getCompetency().getCategory());
            sc.setItemCount(s.getItemCount());
            sc.setSelfScore(s.getSelfScore());
            sc.setManagerScore(s.getManagerScore());
            sc.setPeerScore(s.getPeerScore());
            sc.setDirectReportScore(s.getDirectReportScore());
            sc.setCrossFunctionalScore(s.getCrossFunctionalScore());
            sc.setOtherStakeholderScore(s.getOtherStakeholderScore());
            sc.setOthersAverage(s.getOthersAverage());
            sc.setGapScore(s.getGapScore());
            sc.setRanking(s.getCompetencyRank());
            sc.setPerformanceInsight(s.getPerformanceInsight());
            return sc;
        }).collect(Collectors.toList()));

        // Strengths & Development areas
        report.setTopStrengths(calculationEngineService.calculateTopStrengths(assignment.getId()));
        report.setTopDevelopmentAreas(calculationEngineService.calculateTopDevelopmentAreas(assignment.getId()));

        // Blind Spots & Hidden Strengths
        report.setBlindSpots(calculationEngineService.calculateBlindSpots(assignment.getId()));
        report.setHiddenStrengths(calculationEngineService.calculateHiddenStrengths(assignment.getId()));

        // Qualitative Comments (ANONYMIZED: identities never returned)
        List<String> strengths = new ArrayList<>();
        List<String> development = new ArrayList<>();
        List<String> general = new ArrayList<>();

        for (Assessment a : assessments) {
            if (a.getKeyStrengthsComment() != null && !a.getKeyStrengthsComment().trim().isEmpty()) {
                strengths.add(a.getKeyStrengthsComment().trim());
            }
            if (a.getDevelopmentAreasComment() != null && !a.getDevelopmentAreasComment().trim().isEmpty()) {
                development.add(a.getDevelopmentAreasComment().trim());
            }
            if (a.getSummaryFeedback() != null && !a.getSummaryFeedback().trim().isEmpty()) {
                general.add(a.getSummaryFeedback().trim());
            }
        }

        // Add feedback comments from comment repository
        List<FeedbackComment> comments = commentRepository.findVisibleCommentsForAssignment(assignment.getId());
        for (FeedbackComment fc : comments) {
            if ("STRENGTH".equalsIgnoreCase(fc.getCommentType())) {
                strengths.add(fc.getContent());
            } else if ("IMPROVEMENT".equalsIgnoreCase(fc.getCommentType())) {
                development.add(fc.getContent());
            } else {
                general.add(fc.getContent());
            }
        }

        report.setQualitativeStrengths(strengths);
        report.setQualitativeDevelopmentAreas(development);
        report.setGeneralFeedback(general);

        return report;
    }
}
