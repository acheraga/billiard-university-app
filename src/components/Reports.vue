<template>
  <div class="reports-container">
    <div class="reports-header">
      <h2><i class="fas fa-chart-bar"></i> Reports & Analysis</h2>
      <p class="reports-subtitle">Detailed performance analysis and statistics</p>
    </div>

    <div class="reports-grid">
      <!-- Current Student Report -->
      <div class="report-card student-report">
        <div class="report-header">
          <h3><i class="fas fa-user-graduate"></i> Current Student Report</h3>
          <span class="report-date">{{ currentDate }}</span>
        </div>

        <div class="student-info-grid">
          <div class="info-item">
            <label>Student Name:</label>
            <div class="info-value">{{ student.name || "Not set" }}</div>
          </div>
          <div class="info-item">
            <label>Exam I Score:</label>
            <div class="info-value score-value">{{ student.examIScore || 0 }}/100</div>
          </div>
          <div class="info-item">
            <label>Exam II Level:</label>
            <div class="info-value level-value" :class="student.examIILevel?.toLowerCase() || ''">
              {{ student.examIILevel || "Not determined" }}
            </div>
          </div>
          <div class="info-item">
            <label>Current Rating:</label>
            <div class="info-value rating-value" :class="currentRatingClass">
              {{ currentRating }}
            </div>
          </div>
        </div>

        <div class="progress-summary">
          <div class="progress-item">
            <div class="progress-label">Exam I Progress</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: examIProgress + '%' }"></div>
            </div>
            <div class="progress-value">{{ student.examIScore || 0 }}%</div>
          </div>

          <div class="progress-item">
            <div class="progress-label">Overall Rating</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: ratingProgress + '%' }"></div>
            </div>
            <div class="progress-value">{{ ratingProgress }}%</div>
          </div>
        </div>
      </div>

      <!-- Performance Statistics -->
      <div class="report-card stats-report">
        <div class="report-header">
          <h3><i class="fas fa-chart-line"></i> Performance Statistics</h3>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">Total Exams Taken</div>
              <div class="stat-value">{{ totalExams }}</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">Best Exam I Score</div>
              <div class="stat-value">{{ bestExamI }}/100</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">Average Exam I</div>
              <div class="stat-value">{{ averageExamI }}/100</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-medal"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">Highest Diploma</div>
              <div class="stat-value diploma-value" :class="highestDiplomaClass">
                {{ highestDiploma || "None" }}
              </div>
            </div>
          </div>
        </div>

        <div class="performance-chart">
          <h4>Score Distribution</h4>
          <div class="chart-bars">
            <div v-for="range in scoreRanges" :key="range.label" class="chart-bar">
              <div class="bar-label">{{ range.label }}</div>
              <div class="bar-container">
                <div
                  class="bar-fill"
                  :style="{ height: range.percentage + '%' }"
                  :title="`${range.count} exams`"
                ></div>
              </div>
              <div class="bar-value">{{ range.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skill Analysis -->
      <div class="report-card skills-report">
        <div class="report-header">
          <h3><i class="fas fa-cogs"></i> Skill Analysis</h3>
          <select v-model="selectedLevel" class="level-select">
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="Doctorate">Doctorate</option>
          </select>
        </div>

        <div class="skills-breakdown">
          <div v-for="(skill, index) in skillsAnalysis" :key="index" class="skill-item">
            <div class="skill-info">
              <div class="skill-name">{{ skill.code }} - {{ skill.name }}</div>
              <div class="skill-score">{{ skill.averageScore }}/{{ skill.maxScore }}</div>
            </div>
            <div class="skill-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: skill.percentage + '%' }"
                  :class="getSkillClass(skill.percentage)"
                ></div>
              </div>
              <div class="skill-percentage">{{ Math.round(skill.percentage) }}%</div>
            </div>
          </div>
        </div>

        <div class="skills-summary">
          <div class="summary-item">
            <label>Strongest Skill:</label>
            <div class="summary-value">{{ strongestSkill }}</div>
          </div>
          <div class="summary-item">
            <label>Weakest Skill:</label>
            <div class="summary-value">{{ weakestSkill }}</div>
          </div>
          <div class="summary-item">
            <label>Average Score:</label>
            <div class="summary-value">{{ skillsAverage }}/{{ skillsMax }}</div>
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="report-card timeline-report">
        <div class="report-header">
          <h3><i class="fas fa-timeline"></i> Progress Timeline</h3>
        </div>

        <div class="timeline">
          <div v-for="(event, index) in timeline" :key="index" class="timeline-event">
            <div class="event-date">{{ event.date }}</div>
            <div class="event-dot" :class="event.type"></div>
            <div class="event-content">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-details">{{ event.details }}</div>
              <div v-if="event.score" class="event-score">{{ event.score }}</div>
            </div>
          </div>

          <div v-if="timeline.length === 0" class="empty-timeline">
            <i class="fas fa-history"></i>
            <p>No progress history yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Actions -->
    <div class="report-actions">
      <div class="action-buttons">
        <button class="btn btn-primary" @click="generateReport">
          <i class="fas fa-file-pdf"></i> Generate PDF Report
        </button>
        <button class="btn btn-success" @click="exportData">
          <i class="fas fa-file-excel"></i> Export to Excel
        </button>
        <button class="btn btn-info" @click="printReport">
          <i class="fas fa-print"></i> Print Report
        </button>
        <button class="btn btn-secondary" @click="shareReport">
          <i class="fas fa-share"></i> Share Report
        </button>
      </div>

      <div class="report-options">
        <div class="option-group">
          <label> <input v-model="includeCharts" type="checkbox" /> Include Charts </label>
          <label> <input v-model="includeDetails" type="checkbox" /> Include Details </label>
          <label> <input v-model="includeHistory" type="checkbox" /> Include History </label>
        </div>

        <div class="date-range">
          <label>Date Range:</label>
          <input v-model="startDate" type="date" />
          <span>to</span>
          <input v-model="endDate" type="date" />
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <h3><i class="fas fa-bolt"></i> Quick Stats</h3>
      <div class="stats-cards">
        <div v-for="stat in quickStats" :key="stat.label" class="stat-card">
          <div class="stat-icon" :style="{ color: stat.color }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-details">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-trend" :class="stat.trend">
              <i :class="stat.trendIcon"></i> {{ stat.trendValue }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useExamsStore } from "../store/useExamsStore";
import { computed, ref } from "vue";

export default {
  name: "ReportsView",
  setup() {
    const store = useExamsStore();
    const selectedLevel = ref("Bachelors");
    const includeCharts = ref(true);
    const includeDetails = ref(true);
    const includeHistory = ref(false);
    const startDate = ref("");
    const endDate = ref("");

    // Current Date
    const currentDate = computed(() => {
      return new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    // Student Info
    const student = computed(() => store.student);

    // Current Rating
    const currentRating = computed(() => {
      const totalScore = store.getTotalScore;

      if (totalScore < 20) return "beg-0";
      if (totalScore < 30) return "beg-1";
      if (totalScore < 40) return "beg-2";
      if (totalScore < 55) return "beg-3";
      if (totalScore < 70) return "int-1";
      if (totalScore < 95) return "int-2";
      if (totalScore < 110) return "int-3";
      if (totalScore < 125) return "adv-1";
      if (totalScore < 140) return "adv-2";
      if (totalScore < 160) return "adv-3";
      if (totalScore < 180) return "semi pro";
      return "pro";
    });

    const currentRatingClass = computed(() => {
      const score = store.getTotalScore;
      if (score < 55) return "rating-beginner";
      if (score < 95) return "rating-intermediate";
      if (score < 125) return "rating-advanced";
      return "rating-expert";
    });

    const examIProgress = computed(() => student.value.examIScore || 0);

    const ratingProgress = computed(() => {
      const score = store.getTotalScore;
      if (score >= 180) return 100;
      return Math.min(100, (score / 180) * 100);
    });

    // Statistics
    const totalExams = computed(() => {
      return store.history.examI.length + store.history.examII.length;
    });

    const bestExamI = computed(() => {
      if (store.history.examI.length === 0) return 0;
      return Math.max(...store.history.examI.map((e) => e.total));
    });

    const averageExamI = computed(() => {
      if (store.history.examI.length === 0) return 0;
      const sum = store.history.examI.reduce((acc, e) => acc + e.total, 0);
      return Math.round(sum / store.history.examI.length);
    });

    const highestDiploma = computed(() => {
      const totalScore = store.getTotalScore;

      if (totalScore < 55) return "";
      if (totalScore < 85) return "Bachelors";
      if (totalScore < 100) return "Bachelors w/ Honors";
      if (totalScore < 125) return "Masters";
      if (totalScore < 140) return "Masters w/ Honors";
      if (totalScore < 180) return "Doctorate";
      return "Doctorate w/ Honors";
    });

    const highestDiplomaClass = computed(() => {
      if (!highestDiploma.value) return "";
      if (highestDiploma.value.includes("Bachelors")) return "diploma-bachelors";
      if (highestDiploma.value.includes("Masters")) return "diploma-masters";
      return "diploma-doctorate";
    });

    // Score Distribution
    const scoreRanges = computed(() => {
      const ranges = [
        { label: "0-49", min: 0, max: 49, count: 0 },
        { label: "50-69", min: 50, max: 69, count: 0 },
        { label: "70-84", min: 70, max: 84, count: 0 },
        { label: "85-99", min: 85, max: 99, count: 0 },
        { label: "100", min: 100, max: 100, count: 0 },
      ];

      // Count Exam I scores
      store.history.examI.forEach((entry) => {
        const score = entry.total;
        const range = ranges.find((r) => score >= r.min && score <= r.max);
        if (range) range.count++;
      });

      // Count Exam II scores (normalized to 100)
      store.history.examII.forEach((entry) => {
        const maxScores = {
          Bachelors: 54,
          Masters: 77,
          Doctorate: 100,
        };
        const max = maxScores[entry.level] || 100;
        const normalized = Math.round((entry.total / max) * 100);
        const range = ranges.find((r) => normalized >= r.min && normalized <= r.max);
        if (range) range.count++;
      });

      const total = ranges.reduce((sum, r) => sum + r.count, 0);

      return ranges.map((range) => ({
        ...range,
        percentage: total > 0 ? (range.count / total) * 100 : 0,
      }));
    });

    // Skills Analysis
    const skillsAnalysis = computed(() => {
      const level = selectedLevel.value;
      const skills = store.examII.skills[level] || [];

      // Get history for this level
      const levelHistory = store.history.examII.filter((e) => e.level === level);

      return skills.map((skill, index) => {
        // Calculate average score for this skill
        let totalScore = 0;
        let count = 0;

        levelHistory.forEach((entry) => {
          if (entry.scores[index] !== undefined) {
            totalScore += entry.scores[index];
            count++;
          }
        });

        const averageScore = count > 0 ? Math.round(totalScore / count) : 0;
        const percentage = skill.maxScore > 0 ? (averageScore / skill.maxScore) * 100 : 0;

        return {
          code: skill.code,
          name: skill.name,
          maxScore: skill.maxScore,
          averageScore,
          percentage,
        };
      });
    });

    const strongestSkill = computed(() => {
      if (skillsAnalysis.value.length === 0) return "N/A";
      const strongest = skillsAnalysis.value.reduce((prev, current) =>
        prev.percentage > current.percentage ? prev : current
      );
      return strongest.code;
    });

    const weakestSkill = computed(() => {
      if (skillsAnalysis.value.length === 0) return "N/A";
      const weakest = skillsAnalysis.value.reduce((prev, current) =>
        prev.percentage < current.percentage ? prev : current
      );
      return weakest.code;
    });

    const skillsAverage = computed(() => {
      if (skillsAnalysis.value.length === 0) return 0;
      const sum = skillsAnalysis.value.reduce((acc, skill) => acc + skill.averageScore, 0);
      return Math.round(sum / skillsAnalysis.value.length);
    });

    const skillsMax = computed(() => {
      if (skillsAnalysis.value.length === 0) return 0;
      const maxScores = {
        Bachelors: 54,
        Masters: 77,
        Doctorate: 100,
      };
      return maxScores[selectedLevel.value] || 0;
    });

    // Timeline
    const timeline = computed(() => {
      const events: Array<{
        date: string;
        type: string;
        title: string;
        details: string;
        score?: string;
      }> = [];

      // Add Exam I events
      store.history.examI.forEach((entry) => {
        events.push({
          date: formatDate(entry.date),
          type: "exam1",
          title: "Exam I Completed",
          details: `${entry.level} level`,
          score: `${entry.total}/100`,
        });
      });

      // Add Exam II events
      store.history.examII.forEach((entry) => {
        events.push({
          date: formatDate(entry.date),
          type: "exam2",
          title: `Exam II - ${entry.level}`,
          details: `${entry.scores.length} skills assessed`,
          score: `${entry.total} points`,
        });
      });

      // Sort by date (newest first)
      return events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });

    // Quick Stats
    const quickStats = computed(() => {
      const totalScore = store.getTotalScore;
      const progress = Math.min(100, (totalScore / 180) * 100);

      return [
        {
          label: "Total Score",
          value: totalScore,
          icon: "fas fa-chart-line",
          color: "#3498db",
          trend: totalScore > 100 ? "up" : "stable",
          trendIcon: totalScore > 100 ? "fas fa-arrow-up" : "fas fa-minus",
          trendValue: totalScore > 100 ? "+12%" : "0%",
        },
        {
          label: "Progress",
          value: `${Math.round(progress)}%`,
          icon: "fas fa-tasks",
          color: "#2ecc71",
          trend: "up",
          trendIcon: "fas fa-arrow-up",
          trendValue: "+5%",
        },
        {
          label: "Exams Taken",
          value: totalExams.value,
          icon: "fas fa-clipboard-list",
          color: "#9b59b6",
          trend: totalExams.value > 0 ? "up" : "stable",
          trendIcon: totalExams.value > 0 ? "fas fa-plus" : "fas fa-minus",
          trendValue: totalExams.value > 0 ? "New" : "None",
        },
        {
          label: "Success Rate",
          value: `${Math.round((averageExamI.value / 100) * 100)}%`,
          icon: "fas fa-percentage",
          color: "#e74c3c",
          trend: averageExamI.value > 70 ? "up" : "down",
          trendIcon: averageExamI.value > 70 ? "fas fa-arrow-up" : "fas fa-arrow-down",
          trendValue: averageExamI.value > 70 ? "High" : "Low",
        },
      ];
    });

    // Helper Functions
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      });
    };

    const getSkillClass = (percentage) => {
      if (percentage >= 80) return "skill-excellent";
      if (percentage >= 60) return "skill-good";
      if (percentage >= 40) return "skill-average";
      return "skill-poor";
    };

    // Actions
    const generateReport = () => {
      alert("PDF report generation would be implemented here. This is a demo.");
    };

    const exportData = () => {
      store.exportToExcel();
    };

    const printReport = () => {
      window.print();
    };

    const shareReport = () => {
      if (navigator.share) {
        navigator.share({
          title: "Billiard University Report",
          text: `My Billiard University progress: ${currentRating.value} rating, ${student.value.examIScore || 0}/100 Exam I`,
          url: window.location.href,
        });
      } else {
        alert("Share functionality is not available in this browser.");
      }
    };

    return {
      selectedLevel,
      includeCharts,
      includeDetails,
      includeHistory,
      startDate,
      endDate,
      currentDate,
      student,
      currentRating,
      currentRatingClass,
      examIProgress,
      ratingProgress,
      totalExams,
      bestExamI,
      averageExamI,
      highestDiploma,
      highestDiplomaClass,
      scoreRanges,
      skillsAnalysis,
      strongestSkill,
      weakestSkill,
      skillsAverage,
      skillsMax,
      timeline,
      quickStats,
      getSkillClass,
      generateReport,
      exportData,
      printReport,
      shareReport,
    };
  },
};
</script>

<style scoped>
.reports-container {
  padding: 1rem;
}

.reports-header {
  margin-bottom: 2rem;
  text-align: center;
}

.reports-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.reports-subtitle {
  color: #6c757d;
  font-size: 1rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.report-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.report-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.student-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 600;
  color: #2c3e50;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.score-value {
  color: #27ae60;
  font-weight: bold;
}

.level-value {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.level-value.bachelors {
  background: #e3f2fd;
  color: #1976d2;
}

.level-value.masters {
  background: #fff3e0;
  color: #f57c00;
}

.level-value.doctorate {
  background: #fce4ec;
  color: #c2185b;
}

.rating-value {
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
}

.rating-beginner {
  background: #e3f2fd;
  color: #1976d2;
}

.rating-intermediate {
  background: #fff3e0;
  color: #f57c00;
}

.rating-advanced {
  background: #f3e5f5;
  color: #7b1fa2;
}

.rating-expert {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #333;
}

.progress-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-label {
  min-width: 120px;
  font-size: 0.9rem;
  color: #495057;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  transition: width 0.5s ease;
}

.progress-value {
  min-width: 50px;
  text-align: right;
  font-weight: bold;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  font-size: 1.5rem;
  color: #3498db;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.diploma-value {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.diploma-bachelors {
  background: #e3f2fd;
  color: #1976d2;
}

.diploma-masters {
  background: #fff3e0;
  color: #f57c00;
}

.diploma-doctorate {
  background: #fce4ec;
  color: #c2185b;
}

.performance-chart {
  margin-top: 1.5rem;
}

.performance-chart h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 200px;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3498db, #2980b9);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  min-height: 5px;
}

.bar-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 0.5rem;
}

.level-select {
  padding: 0.5rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.skills-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skill-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.skill-name {
  font-weight: 600;
  color: #2c3e50;
}

.skill-score {
  font-weight: bold;
  color: #27ae60;
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-progress .progress-bar {
  flex: 1;
  height: 8px;
}

.skill-percentage {
  min-width: 50px;
  text-align: right;
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

.skill-excellent {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}
.skill-good {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
}
.skill-average {
  background: linear-gradient(90deg, #3498db, #2980b9);
}
.skill-poor {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.skills-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-item label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.summary-item .summary-value {
  font-weight: bold;
  color: #2c3e50;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  width: 100%;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #dee2e6;
}

.timeline-event {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
}

.event-date {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.event-dot {
  position: absolute;
  left: -1.5rem;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #3498db;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #3498db;
}

.event-dot.exam1 {
  background: #2ecc71;
  box-shadow: 0 0 0 2px #2ecc71;
}

.event-dot.exam2 {
  background: #9b59b6;
  box-shadow: 0 0 0 2px #9b59b6;
}

.event-content {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.event-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.event-details {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.event-score {
  font-weight: bold;
  color: #27ae60;
  font-size: 0.9rem;
}

.empty-timeline {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-timeline i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.report-actions {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9, #1c6ea4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #27ae60, #219653);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.btn-info {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #8e44ad, #7d3c98);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #7f8c8d, #6c7b7d);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

.report-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.option-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.option-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
}

.option-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.date-range label {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
}

.date-range input[type="date"] {
  padding: 0.5rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
}

.date-range span {
  color: #6c757d;
}

.quick-stats {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-stats h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-details {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-trend.up {
  color: #27ae60;
}

.stat-trend.down {
  color: #e74c3c;
}

.stat-trend.stable {
  color: #f39c12;
}

@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }

  .student-info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .skills-summary {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .report-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-range {
    width: 100%;
    justify-content: space-between;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media print {
  .report-actions,
  .action-buttons,
  .report-options {
    display: none !important;
  }

  .report-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
