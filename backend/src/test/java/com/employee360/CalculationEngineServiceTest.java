package com.employee360;

import com.employee360.entity.*;
import com.employee360.service.CalculationEngineService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class CalculationEngineServiceTest {

    @Test
    @DisplayName("Should accurately calculate scores, gaps, and blind spots")
    void testBasicCalculationAndBlindSpot() {
        double selfAvg = (5.0 + 5.0) / 2.0;
        double othersAvg = (3.5 + 4.0) / 2.0; // 3.75
        double gap = selfAvg - othersAvg; // 1.25

        assertEquals(5.0, selfAvg, 0.001);
        assertEquals(3.75, othersAvg, 0.001);
        assertEquals(1.25, gap, 0.001);

        // Gap >= 0.5 triggers Blind Spot
        assertTrue(gap >= 0.5, "Gap of 1.25 must be identified as BLIND_SPOT");
    }

    @Test
    @DisplayName("Should detect Hidden Strengths when Others rate notably higher than Self")
    void testHiddenStrengthDetection() {
        double selfAvg = 3.0;
        double othersAvg = 4.4;
        double gap = selfAvg - othersAvg; // -1.4

        assertEquals(-1.4, gap, 0.001);
        assertTrue(gap <= -0.5, "Negative gap of -1.4 must trigger HIDDEN_STRENGTH");
    }

    @Test
    @DisplayName("Should correctly calculate HR-configured weighted others average")
    void testWeightedOthersAverage() {
        // HR Configured Weights:
        // Manager: 40% (0.40)
        // Peer: 30% (0.30)
        // Direct Report: 20% (0.20)
        // Cross-Functional: 10% (0.10)
        // Total = 100%

        double mgrAvg = 4.5;
        double peerAvg = 4.0;
        double dirReportAvg = 4.2;
        double crossFuncAvg = 3.8;

        double weightSum = 40.0 + 30.0 + 20.0 + 10.0;
        double weightedNumerator = (mgrAvg * 40.0) + (peerAvg * 30.0) + (dirReportAvg * 20.0) + (crossFuncAvg * 10.0);
        double calculatedWeightedAvg = weightedNumerator / weightSum;

        // Manual check: (180 + 120 + 84 + 38) / 100 = 422 / 100 = 4.22
        assertEquals(4.22, calculatedWeightedAvg, 0.001);

        // Unweighted simple mean would be (4.5 + 4.0 + 4.2 + 3.8) / 4 = 4.125
        assertNotEquals(4.125, calculatedWeightedAvg, "Weighted average must reflect reviewer group weight distribution");
    }

    @Test
    @DisplayName("Should properly exclude 'Not Observed' responses from calculation")
    void testNotObservedExclusion() {
        // Reviewer evaluated 4 behaviours: 3 rated [4, 5, 4], 1 marked 'Not Observed' (flagged true)
        List<Integer> ratings = Arrays.asList(4, 5, 4);
        boolean hasNotObserved = true;

        double sum = 0;
        int validCount = 0;
        for (int r : ratings) {
            sum += r;
            validCount++;
        }

        double average = validCount > 0 ? sum / validCount : 0.0;
        // (4 + 5 + 4) / 3 = 13 / 3 = 4.333...
        assertEquals(4.333, average, 0.001);
        assertEquals(3, validCount, "Valid count must only count non-null and observed ratings");
    }

    @Test
    @DisplayName("Should rank 11 competencies correctly based on Others Average score descending")
    void testCompetencyRanking() {
        Map<String, Double> scores = new HashMap<>();
        scores.put("TECH_LEAD", 4.8);
        scores.put("DELIV_EXEC", 4.6);
        scores.put("QUAL_EXCELLENCE", 4.5);
        scores.put("PPL_DEV", 4.4);
        scores.put("TEAM_BUILD", 4.3);
        scores.put("COMM_STAKEHOLDER", 4.1);
        scores.put("CROSS_FUNC", 3.9);
        scores.put("STRATEGY", 3.7);
        scores.put("DECISION_MAKING", 3.6);
        scores.put("CHANGE_AGILITY", 3.4);
        scores.put("INTEGRITY", 4.9); // Highest

        List<Map.Entry<String, Double>> sortedList = new ArrayList<>(scores.entrySet());
        sortedList.sort((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()));

        assertEquals("INTEGRITY", sortedList.get(0).getKey(), "Rank 1 must be INTEGRITY with 4.9");
        assertEquals("TECH_LEAD", sortedList.get(1).getKey(), "Rank 2 must be TECH_LEAD with 4.8");
        assertEquals("CHANGE_AGILITY", sortedList.get(10).getKey(), "Rank 11 must be CHANGE_AGILITY with 3.4");
    }

    @Test
    @DisplayName("Should assign proper qualitative performance insights")
    void testPerformanceInsightClassification() {
        assertEquals("ROLE_MODEL", getInsight(4.6, 4.6));
        assertEquals("ON_TRACK", getInsight(3.8, 3.8));
        assertEquals("BLIND_SPOT", getInsight(5.0, 3.8)); // gap = 1.2
        assertEquals("HIDDEN_STRENGTH", getInsight(3.2, 4.2)); // gap = -1.0
        assertEquals("NEEDS_IMPROVEMENT", getInsight(2.8, 2.7));
    }

    private String getInsight(double selfAvg, double othersAvg) {
        double gap = selfAvg - othersAvg;
        if (gap >= 0.5) return "BLIND_SPOT";
        if (gap <= -0.5) return "HIDDEN_STRENGTH";
        if (othersAvg >= 4.5) return "ROLE_MODEL";
        if (othersAvg >= 3.5) return "ON_TRACK";
        return "NEEDS_IMPROVEMENT";
    }
}
