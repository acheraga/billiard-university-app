<template>
  <div class="student-info">
    <div class="info-card">
      <h3><i class="fas fa-user-graduate"></i> Student Information</h3>

      <div class="form-grid">
        <div class="form-group">
          <label for="studentName"><i class="fas fa-user"></i> Student Name</label>
          <input
            id="studentName"
            v-model="student.name"
            type="text"
            placeholder="Enter student name"
            @input="saveStudent"
          />
        </div>

        <div class="form-group">
          <label for="examDate"><i class="fas fa-calendar-alt"></i> Date</label>
          <input id="examDate" v-model="student.date" type="date" @change="saveStudent" />
        </div>

        <div class="form-group">
          <label><i class="fas fa-chart-line"></i> Current Exam I Score</label>
          <div class="score-display">{{ student.examIScore || 0 }}/100</div>
        </div>

        <div class="form-group">
          <label><i class="fas fa-level-up-alt"></i> Recommended Exam II Level</label>
          <div
            class="level-display"
            :class="{
              'level-bachelors': student.examIILevel === 'Bachelors',
              'level-masters': student.examIILevel === 'Masters',
              'level-doctorate': student.examIILevel === 'Doctorate',
            }"
          >
            {{ student.examIILevel || "Complete Exam I" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useExamsStore } from "../store/useExamsStore";
import { ref, watch } from "vue";

export default {
  name: "StudentInfo",
  setup() {
    const store = useExamsStore();
    const student = ref({ ...store.student });

    watch(
      () => store.student,
      (newVal) => {
        student.value = { ...newVal };
      },
      { deep: true }
    );

    const saveStudent = () => {
      store.saveStudentInfo(student.value);
    };

    return {
      student,
      saveStudent,
    };
  },
};
</script>

<style scoped>
.student-info {
  margin-bottom: 2rem;
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  margin-top: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.score-display {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.level-display {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  font-size: 1.1rem;
}

.level-bachelors {
  background: #e3f2fd;
  color: #1976d2;
  border: 2px solid #bbdefb;
}

.level-masters {
  background: #fff3e0;
  color: #f57c00;
  border: 2px solid #ffe0b2;
}

.level-doctorate {
  background: #fce4ec;
  color: #c2185b;
  border: 2px solid #f8bbd0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
