package com.employee360.service;

import com.employee360.dto.CompetencyScorecardDto;
import com.employee360.dto.DevelopmentPlanDto;
import com.employee360.dto.Employee360ReportDto;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportService {

    private final ReportService reportService;
    private final DevelopmentPlanService developmentPlanService;

    public ExportService(ReportService reportService, DevelopmentPlanService developmentPlanService) {
        this.reportService = reportService;
        this.developmentPlanService = developmentPlanService;
    }

    public byte[] generate360ScorecardCsv(Long employeeId, Long cycleId) {
        Employee360ReportDto report = reportService.getEmployee360Report(employeeId, cycleId);

        StringBuilder sb = new StringBuilder();
        sb.append("360-DEGREE PERFORMANCE ASSESSMENT SCORECARD\n");
        sb.append("Employee:,").append(escapeCsv(report.getEmployeeName())).append("\n");
        sb.append("Employee Code:,").append(escapeCsv(report.getEmployeeCode())).append("\n");
        sb.append("Department:,").append(escapeCsv(report.getDepartmentName())).append("\n");
        sb.append("Designation:,").append(escapeCsv(report.getDesignationTitle())).append("\n");
        sb.append("Cycle:,").append(escapeCsv(report.getCycleTitle())).append("\n");
        sb.append("Overall Score:,").append(report.getOverallScore() != null ? report.getOverallScore() : "N/A").append("\n\n");

        sb.append("Competency,Category,Items,Self,Manager,Peer,Direct Report,Cross-Functional,Others Avg,Gap,Rank,Insight\n");

        for (CompetencyScorecardDto s : report.getScorecards()) {
            sb.append(escapeCsv(s.getCompetencyName())).append(",");
            sb.append(escapeCsv(s.getCategory())).append(",");
            sb.append(s.getItemCount()).append(",");
            sb.append(s.getSelfScore() != null ? s.getSelfScore() : "").append(",");
            sb.append(s.getManagerScore() != null ? s.getManagerScore() : "").append(",");
            sb.append(s.getPeerScore() != null ? s.getPeerScore() : "").append(",");
            sb.append(s.getDirectReportScore() != null ? s.getDirectReportScore() : "").append(",");
            sb.append(s.getCrossFunctionalScore() != null ? s.getCrossFunctionalScore() : "").append(",");
            sb.append(s.getOthersAverage() != null ? s.getOthersAverage() : "").append(",");
            sb.append(s.getGapScore() != null ? s.getGapScore() : "").append(",");
            sb.append(s.getRanking() != null ? s.getRanking() : "").append(",");
            sb.append(escapeCsv(s.getPerformanceInsight() != null ? s.getPerformanceInsight() : "")).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] generateDevelopmentPlansCsv(Long employeeId) {
        List<DevelopmentPlanDto> plans = developmentPlanService.getEmployeePlans(employeeId);

        StringBuilder sb = new StringBuilder();
        sb.append("INDIVIDUAL DEVELOPMENT PLANS (IDP) - 70/20/10 FRAMEWORK\n\n");
        sb.append("ID,Employee,Focus Competency,SMART Goal,Mentor/Support,Target Date,Progress %,Status\n");

        for (DevelopmentPlanDto p : plans) {
            sb.append(p.getId()).append(",");
            sb.append(escapeCsv(p.getEmployeeName())).append(",");
            sb.append(escapeCsv(p.getFocusCompetencyName())).append(",");
            sb.append(escapeCsv(p.getSmartGoal())).append(",");
            sb.append(escapeCsv(p.getMentorOrSupport() != null ? p.getMentorOrSupport() : "")).append(",");
            sb.append(p.getTargetDate()).append(",");
            sb.append(p.getOverallProgress()).append("%,");
            sb.append(escapeCsv(p.getStatus())).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
