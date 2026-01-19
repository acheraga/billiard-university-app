<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1><i class="fas fa-trophy"></i> Billiard University Scoring System</h1>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="app-content">
          <StudentInfo />

          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i> {{ tab.label }}
            </button>
          </div>

          <div class="tab-content">
            <div v-show="activeTab === 'exam1'" class="tab-pane active">
              <ExamI />
            </div>

            <div v-show="activeTab === 'exam2'" class="tab-pane">
              <ExamII />
            </div>

            <div v-show="activeTab === 'history'" class="tab-pane">
              <ScoreHistory />
            </div>

            <div v-show="activeTab === 'reports'" class="tab-pane">
              <Reports />
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>BilliardUniversity.org • Vue.js Scoring System v1.0</p>
        <p class="footer-links">
          <a href="#" @click.prevent="exportData"><i class="fas fa-download"></i> Export Data</a>
          <a href="#" @click.prevent="printReport"><i class="fas fa-print"></i> Print</a>
          <a href="#" @click.prevent="resetAll"><i class="fas fa-redo"></i> Reset All</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import StudentInfo from "./components/StudentInfo.vue";
import ExamI from "./components/ExamI.vue";
import ExamII from "./components/ExamII.vue";
import ScoreHistory from "./components/ScoreHistory.vue";
import Reports from "./components/Reports.vue";
import { useExamsStore } from "./store/useExamsStore";

export default {
  name: "App",
  components: {
    StudentInfo,
    ExamI,
    ExamII,
    ScoreHistory,
    Reports,
  },
  data() {
    return {
      activeTab: "exam1",
      tabs: [
        { id: "exam1", label: "Exam I", icon: "fas fa-list-ol" },
        { id: "exam2", label: "Exam II", icon: "fas fa-chart-line" },
        { id: "history", label: "History", icon: "fas fa-history" },
        { id: "reports", label: "Reports", icon: "fas fa-chart-bar" },
      ],
    };
  },
  methods: {
    exportData() {
      const store = useExamsStore();
      store.exportToExcel();
    },
    printReport() {
      window.print();
    },
    resetAll() {
      if (confirm("Reset all data? This cannot be undone.")) {
        const store = useExamsStore();
        store.resetAll();
      }
    },
  },
};
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #2c3e50 0%, #4a6491 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 300;
}

.subtitle {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.app-main {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tabs {
  display: flex;
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  margin-top: 2rem;
}

.tab-button {
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

.tab-button:hover {
  background: #e8e8e8;
}

.tab-button.active {
  background: white;
  color: #2c3e50;
  font-weight: 600;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.tab-content {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-pane {
  animation: fadeIn 0.3s ease-in;
}

.app-footer {
  background: #34495e;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
}

.footer-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .tab-button {
    justify-content: flex-start;
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 1.8rem;
  }
}
</style>
