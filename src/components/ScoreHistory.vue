<template>
  <div class="score-history">
    <div class="history-header">
      <h2><i class="fas fa-history"></i> Score History</h2>
      <div class="history-stats">
        <div class="stat-card">
          <i class="fas fa-clipboard-list"></i>
          <div class="stat-content">
            <div class="stat-label">Total Exams</div>
            <div class="stat-value">{{ totalExams }}</div>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-chart-line"></i>
          <div class="stat-content">
            <div class="stat-label">Best Exam I</div>
            <div class="stat-value">{{ bestExamI }}</div>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-trophy"></i>
          <div class="stat-content">
            <div class="stat-label">Best Exam II</div>
            <div class="stat-value">{{ bestExamII }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i> {{ tab.label }}
      </button>
    </div>

    <div class="history-content">
      <!-- Exam I History -->
      <div v-show="activeTab === 'exam1'" class="tab-content">
        <div class="table-container">
          <table v-if="examIHistory.length > 0" class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th v-for="drill in examIDrills" :key="drill">{{ drill }}</th>
                <th>Total</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in examIHistory" :key="index">
                <td>{{ formatDate(entry.date) }}</td>
                <td>{{ entry.studentName || "Unknown" }}</td>
                <td
                  v-for="(score, i) in entry.scores"
                  :key="i"
                  :class="getScoreClass(score, examIMaxScores[i])"
                >
                  {{ score }}
                </td>
                <td class="total-cell">
                  <strong>{{ entry.total }}</strong>
                </td>
                <td>
                  <span class="level-badge" :class="getLevelClass(entry.level)">
                    {{ entry.level }}
                  </span>
                </td>
                <td class="action-cell">
                  <button
                    class="action-btn view-btn"
                    title="View Details"
                    @click="viewExamIDetails(entry)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="action-btn delete-btn"
                    title="Delete"
                    @click="deleteExamIEntry(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            <i class="fas fa-clipboard"></i>
            <h3>No Exam I History</h3>
            <p>Complete and save Exam I scores to see history here.</p>
          </div>
        </div>

        <div v-if="examIHistory.length > 0" class="history-summary">
          <h3><i class="fas fa-chart-bar"></i> Exam I Statistics</h3>
          <div class="stats-grid">
            <div class="summary-card">
              <h4>Average Score</h4>
              <div class="summary-value">{{ averageExamI }}</div>
              <div class="summary-sub">/100</div>
            </div>
            <div class="summary-card">
              <h4>Highest Score</h4>
              <div class="summary-value" style="color: #27ae60">{{ bestExamI }}</div>
              <div class="summary-sub">/100</div>
            </div>
            <div class="summary-card">
              <h4>Lowest Score</h4>
              <div class="summary-value" style="color: #e74c3c">{{ worstExamI }}</div>
              <div class="summary-sub">/100</div>
            </div>
            <div class="summary-card">
              <h4>Exams Taken</h4>
              <div class="summary-value">{{ examIHistory.length }}</div>
              <div class="summary-sub">total</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam II History -->
      <div v-show="activeTab === 'exam2'" class="tab-content">
        <div class="table-container">
          <table v-if="examIIHistory.length > 0" class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Level</th>
                <th v-for="skill in examIISkills" :key="skill">{{ skill }}</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in examIIHistory" :key="index">
                <td>{{ formatDate(entry.date) }}</td>
                <td>{{ entry.studentName || "Unknown" }}</td>
                <td>
                  <span class="level-badge" :class="getLevelClass(entry.level)">
                    {{ entry.level }}
                  </span>
                </td>
                <td
                  v-for="(score, i) in entry.scores"
                  :key="i"
                  :class="getScoreClass(score, examIIMaxScores[entry.level]?.[i] || 0)"
                >
                  {{ score }}
                </td>
                <td class="total-cell">
                  <strong>{{ entry.total }}</strong>
                </td>
                <td class="action-cell">
                  <button
                    class="action-btn view-btn"
                    title="View Details"
                    @click="viewExamIIDetails(entry)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="action-btn delete-btn"
                    title="Delete"
                    @click="deleteExamIIEntry(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            <i class="fas fa-chart-line"></i>
            <h3>No Exam II History</h3>
            <p>Complete and save Exam II scores to see history here.</p>
          </div>
        </div>

        <div v-if="examIIHistory.length > 0" class="history-summary">
          <h3><i class="fas fa-chart-pie"></i> Exam II Statistics</h3>
          <div class="stats-grid">
            <div class="summary-card">
              <h4>By Level</h4>
              <div class="level-breakdown">
                <div v-for="level in levelBreakdown" :key="level.name" class="level-item">
                  <span class="level-name">{{ level.name }}</span>
                  <span class="level-count">{{ level.count }}</span>
                </div>
              </div>
            </div>
            <div class="summary-card">
              <h4>Average Score</h4>
              <div class="summary-value">{{ averageExamII }}</div>
              <div class="summary-sub">/{{ maxExamII }}</div>
            </div>
            <div class="summary-card">
              <h4>Highest Score</h4>
              <div class="summary-value" style="color: #27ae60">{{ bestExamII }}</div>
              <div class="summary-sub">/{{ maxExamII }}</div>
            </div>
            <div class="summary-card">
              <h4>Progress</h4>
              <div class="progress-chart">
                <div v-for="level in progressData" :key="level.name" class="progress-item">
                  <span class="progress-label">{{ level.name }}</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: level.percentage + '%' }"></div>
                  </div>
                  <span class="progress-value">{{ level.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Combined History -->
      <div v-show="activeTab === 'combined'" class="tab-content">
        <div class="combined-stats">
          <h3><i class="fas fa-star"></i> Overall Performance</h3>

          <div class="combined-grid">
            <div class="combined-card rating-card">
              <h4><i class="fas fa-medal"></i> Current Rating</h4>
              <div class="rating-value" :class="currentRatingClass">
                {{ currentRating }}
              </div>
              <div class="rating-description">Based on combined scores</div>
            </div>

            <div class="combined-card progress-card">
              <h4><i class="fas fa-trend-up"></i> Progress Over Time</h4>
              <div class="progress-chart-simple">
                <div
                  v-for="(point, index) in progressChart"
                  :key="index"
                  class="progress-point"
                  :style="{ height: point.height + '%' }"
                  :title="`Score: ${point.score}`"
                ></div>
              </div>
              <div class="progress-labels">
                <span>First</span>
                <span>Latest</span>
              </div>
            </div>

            <div class="combined-card diploma-card">
              <h4><i class="fas fa-graduation-cap"></i> Highest Diploma</h4>
              <div class="diploma-value" :class="highestDiplomaClass">
                {{ highestDiploma || "None yet" }}
              </div>
              <div class="diploma-requirements">Requirements based on total score</div>
            </div>
          </div>

          <div class="timeline-section">
            <h4><i class="fas fa-timeline"></i> Timeline</h4>
            <div class="timeline">
              <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-event">
                <div class="event-date">{{ formatDate(event.date) }}</div>
                <div class="event-dot"></div>
                <div class="event-content">
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-description">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-actions">
      <button class="btn btn-primary" @click="exportHistory">
        <i class="fas fa-download"></i> Export History
      </button>
      <button class="btn btn-secondary" @click="clearHistory">
        <i class="fas fa-trash-alt"></i> Clear History
      </button>
      <button class="btn btn-info" @click="printHistory">
        <i class="fas fa-print"></i> Print Report
      </button>
    </div>
  </div>
</template>

<script>
import { useExamsStore } from "../store/useExamsStore";
import { computed, ref } from "vue";

export default {
  name: "ScoreHistory",
  setup() {
    const store = useExamsStore();
    const activeTab = ref("exam1");

    const tabs = [
      { id: "exam1", label: "Exam I", icon: "fas fa-list-ol" },
      { id: "exam2", label: "Exam II", icon: "fas fa-chart-line" },
      { id: "combined", label: "Combined", icon: "fas fa-star" },
    ];

    const examIHistory = computed(() => store.history.examI);
    const examIIHistory = computed(() => store.history.examII);

    const examIDrills = computed(() => ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"]);
    const examIISkills = computed(() => [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5",
      "S6",
      "S7",
      "S8",
      "S9",
      "S10",
    ]);

    // Max scores per skill/level for Exam II
    const examIIMaxScores = {
      Bachelors: [4, 7, 10, 10, 6, 3, 3, 3, 3, 5],
      Masters: [7, 11, 12, 12, 10, 5, 5, 5, 5, 5],
      Doctorate: [10, 15, 14, 14, 14, 7, 7, 7, 7, 5],
    };

    // Derived max scores for Exam I drills (from store) to avoid undefined access
    const examIMaxScores = computed(() => {
      const drills = store.examI && store.examI.drills ? store.examI.drills : [];
      return drills.map((d) => (d && d.maxScore ? d.maxScore : 0));
    });

    // Statistics
    const totalExams = computed(() => examIHistory.value.length + examIIHistory.value.length);

    const bestExamI = computed(() => {
      if (examIHistory.value.length === 0) return 0;
      return Math.max(...examIHistory.value.map((e) => e.total));
    });

    const worstExamI = computed(() => {
      if (examIHistory.value.length === 0) return 0;
      return Math.min(...examIHistory.value.map((e) => e.total));
    });

    const averageExamI = computed(() => {
      if (examIHistory.value.length === 0) return 0;
      const sum = examIHistory.value.reduce((acc, e) => acc + e.total, 0);
      return Math.round(sum / examIHistory.value.length);
    });

    const bestExamII = computed(() => {
      if (examIIHistory.value.length === 0) return 0;
      return Math.max(...examIIHistory.value.map((e) => e.total));
    });

    const averageExamII = computed(() => {
      if (examIIHistory.value.length === 0) return 0;
      const sum = examIIHistory.value.reduce((acc, e) => acc + e.total, 0);
      return Math.round(sum / examIIHistory.value.length);
    });

    const maxExamII = computed(() => {
      if (examIIHistory.value.length === 0) return 0;
      const lastEntry = examIIHistory.value[examIIHistory.value.length - 1];
      return examIIMaxScores[lastEntry.level]?.reduce((a, b) => a + b, 0) || 0;
    });

    const levelBreakdown = computed(() => {
      const levels = {};
      examIIHistory.value.forEach((entry) => {
        levels[entry.level] = (levels[entry.level] || 0) + 1;
      });

      return Object.entries(levels).map(([name, count]) => ({
        name,
        count,
        color: getLevelColor(name),
      }));
    });

    const progressData = computed(() => {
      const data = levelBreakdown.value;
      const total = data.reduce((sum, item) => sum + item.count, 0);

      return data.map((item) => ({
        ...item,
        percentage: total > 0 ? (item.count / total) * 100 : 0,
      }));
    });

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

    const progressChart = computed(() => {
      const allScores = [
        ...examIHistory.value.map((e) => e.total),
        ...examIIHistory.value.map((e) => e.total),
      ];
      if (allScores.length === 0) return [];

      const maxScore = Math.max(...allScores);
      const minScore = Math.min(...allScores);
      const range = maxScore - minScore || 1;

      return allScores.map((score) => ({
        score,
        height: ((score - minScore) / range) * 80 + 20,
      }));
    });

    const timelineEvents = computed(() => {
      const events = [];

      // Add Exam I events
      examIHistory.value.forEach((entry) => {
        events.push({
          date: entry.date,
          title: `Exam I - Score: ${entry.total}/100`,
          description: `${entry.level} level - ${entry.studentName || "Student"}`,
        });
      });

      // Add Exam II events
      examIIHistory.value.forEach((entry) => {
        events.push({
          date: entry.date,
          title: `Exam II - ${entry.level} - Score: ${entry.total}`,
          description: `${entry.studentName || "Student"}`,
        });
      });

      // Sort by date
      return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    });

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getScoreClass = (score, max) => {
      // guard against undefined or zero max
      const m = Number(max) || 1;
      const percentage = (score / m) * 100;
      if (percentage >= 90) return "score-excellent";
      if (percentage >= 70) return "score-good";
      if (percentage >= 50) return "score-average";
      return "score-poor";
    };

    const getLevelClass = (level) => {
      return `level-${level.toLowerCase()}`;
    };

    const getLevelColor = (level) => {
      switch (level) {
        case "Bachelors":
          return "#3498db";
        case "Masters":
          return "#f39c12";
        case "Doctorate":
          return "#e74c3c";
        default:
          return "#95a5a6";
      }
    };

    const viewExamIDetails = (entry) => {
      alert(
        `Exam I Details:\nDate: ${formatDate(entry.date)}\nTotal: ${entry.total}/100\nLevel: ${entry.level}\nScores: ${entry.scores.join(", ")}`
      );
    };

    const viewExamIIDetails = (entry) => {
      alert(
        `Exam II Details:\nDate: ${formatDate(entry.date)}\nLevel: ${entry.level}\nTotal: ${entry.total}\nScores: ${entry.scores.join(", ")}`
      );
    };

    const deleteExamIEntry = (index) => {
      if (confirm("Delete this Exam I entry?")) {
        store.history.examI.splice(index, 1);
        store.saveToLocalStorage();
      }
    };

    const deleteExamIIEntry = (index) => {
      if (confirm("Delete this Exam II entry?")) {
        store.history.examII.splice(index, 1);
        store.saveToLocalStorage();
      }
    };

    const exportHistory = () => {
      const data = {
        examIHistory: examIHistory.value,
        examIIHistory: examIIHistory.value,
        statistics: {
          totalExams: totalExams.value,
          bestExamI: bestExamI.value,
          averageExamI: averageExamI.value,
          bestExamII: bestExamII.value,
          averageExamII: averageExamII.value,
          currentRating: currentRating.value,
          highestDiploma: highestDiploma.value,
        },
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute(
        "download",
        `billiard-history-${new Date().toISOString().split("T")[0]}.json`
      );
      linkElement.click();

      alert("History exported successfully!");
    };

    const clearHistory = () => {
      if (confirm("Clear all history? This cannot be undone.")) {
        store.history.examI = [];
        store.history.examII = [];
        store.saveToLocalStorage();
      }
    };

    const printHistory = () => {
      window.print();
    };

    return {
      activeTab,
      tabs,
      examIHistory,
      examIIHistory,
      examIDrills,
      examIISkills,
      examIMaxScores,
      totalExams,
      bestExamI,
      worstExamI,
      averageExamI,
      bestExamII,
      averageExamII,
      maxExamII,
      levelBreakdown,
      progressData,
      currentRating,
      currentRatingClass,
      highestDiploma,
      highestDiplomaClass,
      progressChart,
      timelineEvents,
      formatDate,
      getScoreClass,
      getLevelClass,
      viewExamIDetails,
      viewExamIIDetails,
      deleteExamIEntry,
      deleteExamIIEntry,
      exportHistory,
      clearHistory,
      printHistory,
    };
  },
};
</script>

<style scoped>
.score-history {
  padding: 1rem;
}

.history-header {
  margin-bottom: 2rem;
}

.history-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card i {
  font-size: 2rem;
  color: #3498db;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.history-tabs {
  display: flex;
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  margin-bottom: 0;
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  background: #f5f5f5;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tab-btn:hover {
  background: #e8e8e8;
}

.tab-btn.active {
  background: white;
  color: #2c3e50;
  font-weight: 600;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.history-content {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.history-table th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.history-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.history-table tbody tr:hover {
  background: #f8f9fa;
}

.total-cell {
  font-weight: bold;
  color: #2c3e50;
}

.score-excellent {
  color: #27ae60;
  font-weight: bold;
}

.score-good {
  color: #f39c12;
  font-weight: bold;
}

.score-average {
  color: #3498db;
}

.score-poor {
  color: #e74c3c;
}

.level-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.level-bachelors {
  background: #e3f2fd;
  color: #1976d2;
}

.level-masters {
  background: #fff3e0;
  color: #f57c00;
}

.level-doctorate {
  background: #fce4ec;
  color: #c2185b;
}

.action-cell {
  white-space: nowrap;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 2px;
}

.view-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.view-btn:hover {
  background: #bbdefb;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #ffcdd2;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.empty-state p {
  color: #6c757d;
}

.history-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.history-summary h3 {
  color: #495057;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.summary-card h4 {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 1rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.summary-sub {
  font-size: 0.9rem;
  color: #6c757d;
}

.level-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.level-name {
  font-weight: 600;
  color: #495057;
}

.level-count {
  font-weight: bold;
  color: #2c3e50;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
}

.progress-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-label {
  min-width: 80px;
  font-size: 0.9rem;
  color: #495057;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 4px;
}

.progress-value {
  min-width: 30px;
  text-align: right;
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

/* Combined Stats */
.combined-stats {
  padding: 1rem;
}

.combined-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.combined-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.rating-card {
  text-align: center;
}

.rating-value {
  font-size: 2.5rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.rating-beginner {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
}

.rating-intermediate {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #f57c00;
}

.rating-advanced {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #7b1fa2;
}

.rating-expert {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #333;
}

.rating-description {
  color: #6c757d;
  font-size: 0.9rem;
}

.progress-card {
  display: flex;
  flex-direction: column;
}

.progress-chart-simple {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 150px;
  margin: 1rem 0;
}

.progress-point {
  flex: 1;
  background: linear-gradient(to top, #3498db, #2980b9);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: all 0.3s;
}

.progress-point:hover {
  opacity: 0.8;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  color: #6c757d;
  font-size: 0.9rem;
}

.diploma-value {
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.diploma-bachelors {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
}

.diploma-masters {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #f57c00;
}

.diploma-doctorate {
  background: linear-gradient(135deg, #fce4ec, #f8bbd0);
  color: #c2185b;
}

.diploma-requirements {
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
}

.timeline-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.timeline-section h4 {
  color: #495057;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
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

.event-description {
  font-size: 0.9rem;
  color: #6c757d;
}

.history-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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

.btn-secondary {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #7f8c8d, #6c7b7d);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

.btn-info {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #27ae60, #219653);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

@media (max-width: 768px) {
  .history-stats {
    grid-template-columns: 1fr;
  }

  .history-tabs {
    flex-direction: column;
  }

  .tab-btn {
    justify-content: flex-start;
  }

  .history-table {
    font-size: 0.8rem;
  }

  .history-table th,
  .history-table td {
    padding: 0.5rem;
  }

  .combined-grid {
    grid-template-columns: 1fr;
  }

  .history-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media print {
  .history-actions,
  .action-cell {
    display: none !important;
  }

  .history-table {
    font-size: 10pt;
  }
}
</style>
