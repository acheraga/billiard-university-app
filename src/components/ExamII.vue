<template>
  <div class="exam-ii-container">
    <div class="exam-header">
      <h2><i class="fas fa-chart-line"></i> Exam II - Skills Assessment</h2>
      <div class="level-selector">
        <button
          v-for="level in levels"
          :key="level.id"
          :class="['level-btn', { active: currentLevel === level.id }]"
          :title="level.description"
          @click="setLevel(level.id)"
        >
          <i :class="level.icon"></i>
          {{ level.name }}
          <span class="level-max">(Max: {{ level.maxScore }})</span>
        </button>
      </div>
    </div>

    <div v-if="currentLevel" class="exam-content">
      <div class="level-info">
        <div class="level-badge" :class="currentLevelClass">
          <i :class="currentLevelInfo.icon"></i>
          <span>{{ currentLevelInfo.name }} Level</span>
        </div>
        <div class="level-description">{{ currentLevelInfo.description }}</div>

        <!-- Exam sheet card (PDF) -->
        <div class="exam-sheet">
          <h4>Exam Sheet</h4>
          <p class="exam-sheet-note">
            Download, open or preview the official Exam II skill sheet for this level.
          </p>
          <div class="exam-sheet-actions">
            <a :href="pdfUrl" target="_blank" rel="noopener" class="btn btn-info" v-if="pdfUrl">
              <i class="fas fa-external-link-alt"></i> Open
            </a>
            <a :href="pdfUrl" :download="pdfFilename" class="btn btn-secondary" v-if="pdfUrl">
              <i class="fas fa-download"></i> Download
            </a>
            <button class="btn btn-success" @click="togglePdfPreview" v-if="pdfUrl">
              <i class="fas" :class="showPdfPreview ? 'fa-eye-slash' : 'fa-eye'"></i>
              {{ showPdfPreview ? "Hide Preview" : "Preview" }}
            </button>
          </div>

          <div v-if="showPdfPreview" class="pdf-preview">
            <iframe :src="pdfUrl" frameborder="0" width="100%" height="480" />
          </div>
        </div>
      </div>

      <div class="skills-carousel">
        <div class="carousel-controls">
          <button class="btn btn-secondary prev-btn" @click="prevSkill">← Previous</button>
          <div class="skill-position">Skill {{ currentSkillIndex + 1 }} / {{ skills.length }}</div>
          <button class="btn btn-secondary next-btn" @click="nextSkill">Next →</button>
        </div>

        <div class="skill-card">
          <div class="skill-header">
            <h3>{{ currentSkill.code }} - {{ currentSkill.name }}</h3>
            <div class="skill-score">
              <span class="current-score">{{ calculateSkillScore(currentSkill) }}</span>
              <span class="max-score">/{{ currentSkill.maxScore }}</span>
            </div>
          </div>

          <div class="skill-figure">
            <div class="layout-images">
              <template v-for="(src, i) in getSkillFigures(currentSkill.code)" :key="i">
                <div class="layout-card">
                  <img
                    :src="src"
                    :alt="`Figure ${currentSkill.code} Layout ${i + 1}`"
                    class="clickable-layout"
                    @click="openModal(src, `${currentSkill.code} Layout ${i + 1}`)"
                  />
                  <div class="layout-label">Layout {{ i + 1 }}</div>
                </div>
              </template>
            </div>
          </div>

          <!-- Modal for enlarged figure -->
          <div v-if="showFigureModal" class="figure-modal" role="dialog" aria-modal="true">
            <div class="modal-overlay" @click="closeModal"></div>
            <div
              class="modal-content"
              :class="{ dragging: dragging }"
              :style="{ transform: dragging ? `translateY(${touchCurrentY}px)` : '' }"
              @touchstart.prevent="onTouchStart"
              @touchmove.prevent="onTouchMove"
              @touchend.prevent="onTouchEnd"
            >
              <div class="modal-drag-handle" aria-hidden="true"></div>
              <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>
              <h4 class="modal-title">{{ modalTitle }}</h4>
              <img :src="modalSrc" :alt="modalTitle" class="modal-image" />
              <p class="modal-description">{{ modalDescription }}</p>
            </div>
          </div>

          <div class="skill-content">
            <p class="skill-explanation">{{ getSkillExplanation(currentSkill.code) }}</p>

            <!-- Best of Two -->
            <div v-if="currentSkill.type === 'bestOfTwo'" class="skill-inputs">
              <div class="input-group">
                <label>Attempt 1:</label>
                <input
                  v-model.number="currentSkill.attempt1"
                  type="number"
                  min="0"
                  :max="currentSkill.maxScore"
                  @input="updateSkillScore"
                />
              </div>
              <div class="input-group">
                <label>Attempt 2:</label>
                <input
                  v-model.number="currentSkill.attempt2"
                  type="number"
                  min="0"
                  :max="currentSkill.maxScore"
                  @input="updateSkillScore"
                />
              </div>
              <div class="skill-note">Best of two attempts (2nd optional if perfect)</div>
            </div>

            <!-- Lowest Two of Three -->
            <div v-if="currentSkill.type === 'lowestTwoOfThree'" class="skill-inputs">
              <div v-for="i in 3" :key="i" class="input-group">
                <label>Attempt {{ i }}:</label>
                <input
                  v-model.number="currentSkill.scores[i - 1]"
                  type="number"
                  min="0"
                  :max="getMaxPerAttempt(currentSkill.code)"
                  @input="validateAttemptScore(i - 1)"
                />
              </div>
              <div class="skill-note">
                Sum of lowest two attempts (max {{ getMaxPerAttempt(currentSkill.code) }} per
                attempt)
              </div>
            </div>

            <!-- Sum (Click-based: Success/Missed/Empty) -->
            <div v-if="currentSkill.type === 'sum'" class="skill-inputs sum-attempts">
              <div v-for="i in currentSkill.scores.length" :key="i" class="sum-button-group">
                <button
                  class="sum-attempt-btn"
                  :class="getSumAttemptClass(currentSkill.scores[i - 1])"
                  @click="toggleSumAttempt(currentSkill, i - 1)"
                  :title="`Attempt ${i}: ${getSumAttemptStatus(currentSkill.scores[i - 1])}`"
                >
                  <span class="attempt-number">{{ i }}</span>
                  <span v-if="currentSkill.scores[i - 1] === 1" class="attempt-icon">✓</span>
                  <span v-else-if="currentSkill.scores[i - 1] === 0" class="attempt-icon">✗</span>
                </button>
              </div>
              <div class="skill-note">
                Click to toggle: Empty → Success (1pt) → Missed (0pt) → Empty
              </div>
            </div>

            <!-- Median (Break shots with buttons) -->
            <div v-if="currentSkill.type === 'median'" class="skill-inputs break-shots">
              <div v-for="attempt in 3" :key="attempt" class="break-attempt">
                <h4>
                  Break {{ attempt }} -
                  <span class="break-score-label"
                    >Score: {{ calculateBreakScore(currentSkill.breakScores[attempt - 1]) }}</span
                  >
                </h4>
                <div class="break-points-buttons">
                  <div v-for="point in 5" :key="point" class="point-button-group">
                    <button
                      class="break-point-btn"
                      :class="getSumAttemptClass(currentSkill.breakScores[attempt - 1][point - 1])"
                      @click="toggleBreakPoint(currentSkill, attempt - 1, point - 1)"
                      :title="`Point ${String.fromCharCode(96 + point)}: ${getSumAttemptStatus(currentSkill.breakScores[attempt - 1][point - 1])}`"
                    >
                      <span class="point-letter">{{ String.fromCharCode(96 + point) }}</span>
                      <span
                        v-if="currentSkill.breakScores[attempt - 1][point - 1] === 1"
                        class="point-icon"
                        >✓</span
                      >
                      <span
                        v-else-if="currentSkill.breakScores[attempt - 1][point - 1] === 0"
                        class="point-icon"
                        >✗</span
                      >
                    </button>
                  </div>
                </div>
              </div>
              <div class="skill-note">Median of three break scores</div>
            </div>
          </div>
        </div>
      </div>

      <div class="exam-summary">
        <div class="summary-grid">
          <div class="summary-card">
            <h4><i class="fas fa-calculator"></i> Exam II Score</h4>
            <div class="summary-value">{{ currentScore }}/{{ currentLevelInfo.maxScore }}</div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (currentScore / currentLevelInfo.maxScore) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <div class="summary-card">
            <h4><i class="fas fa-trophy"></i> Total Combined Score</h4>
            <div class="summary-value">{{ totalScore }}</div>
            <div class="rating-display" :class="ratingClass">
              {{ buRating }}
            </div>
          </div>

          <div class="summary-card">
            <h4><i class="fas fa-graduation-cap"></i> BU Diploma</h4>
            <div class="summary-value diploma">{{ buDiploma }}</div>
            <div v-if="buDiploma" class="diploma-note">Awarded for outstanding performance</div>
          </div>
        </div>

        <div class="score-breakdown">
          <h4><i class="fas fa-chart-bar"></i> Skills Breakdown</h4>
          <div class="breakdown-items">
            <div v-for="(skill, index) in skills" :key="index" class="breakdown-item">
              <span class="skill-label">{{ skill.code }}</span>
              <div class="skill-bar">
                <div
                  class="skill-fill"
                  :style="{ width: (calculateSkillScore(skill) / skill.maxScore) * 100 + '%' }"
                ></div>
              </div>
              <span class="skill-value">{{ calculateSkillScore(skill) }}/{{ skill.maxScore }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-success" @click="saveExamII">
          <i class="fas fa-save"></i> Save Exam II Score
        </button>
        <button class="btn btn-secondary" @click="resetExamII">
          <i class="fas fa-redo"></i> Reset Exam II
        </button>
        <button class="btn btn-info" @click="autoFill">
          <i class="fas fa-magic"></i> Auto-fill Sample
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import { useExamsStore } from "../store/useExamsStore";
import exam2Explanations from "../data/exam2_explanations";

export default {
  name: "ExamII",
  setup() {
    const store = useExamsStore();

    const levels = [
      {
        id: "Bachelors",
        name: "Bachelors",
        maxScore: 54,
        icon: "fas fa-user-graduate",
        description: "Beginner level - Recommended for Exam I scores 0-49",
      },
      {
        id: "Masters",
        name: "Masters",
        maxScore: 77,
        icon: "fas fa-user-tie",
        description: "Intermediate level - Recommended for Exam I scores 50-69",
      },
      {
        id: "Doctorate",
        name: "Doctorate",
        maxScore: 100,
        icon: "fas fa-user-md",
        description: "Advanced level - Recommended for Exam I scores 70-100",
      },
    ];

    const currentLevel = ref(store.examII.currentLevel);

    const currentLevelInfo = computed(() => {
      return levels.find((level) => level.id === currentLevel.value) || levels[0];
    });

    const currentLevelClass = computed(() => {
      return `level-${currentLevel.value.toLowerCase()}`;
    });

    const baseUrl = import.meta.env.BASE_URL || "/";
    const basePrefix = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");

    const getSkillFigures = (code: string) => {
      // Map skills to their correct image numbers
      // S3 and S4 have 3 layout images each (Layout 1..3)
      const skillToImageMap: Record<string, number[]> = {
        S1: [1],
        S2: [2],
        S3: [3, 4, 5], // 3 layouts for 9-ball
        S4: [6, 7, 8], // 3 layouts for 8-ball
        S5: [9], // Hide-Behind-Target Safety
        S6: [10], // Kick
        S7: [11], // Bank
        S8: [12], // Elevated
        S9: [13], // Jump/Masse
        S10: [14], // Break
      };

      const imageNumbers = skillToImageMap[code] || [1];
      return imageNumbers.map(
        (n) =>
          `${basePrefix}/exam2_images/${store.examII.currentLevel}/image-${String(n).padStart(3, "0")}.jpg`
      );
    };

    // PDF preview helpers
    const pdfFilename = computed(() => `BU_Exam-II_Skills-${currentLevel.value}_BW.pdf`);
    const pdfUrl = computed(() => `${basePrefix}/${pdfFilename.value}`);
    // Persisted UI state for Exam II: showPdfPreview and currentSkillIndex
    const showPdfPreview = computed({
      get: () => !!(store.ui && store.ui.examII && store.ui.examII.showPdfPreview),
      set: (v: boolean) => {
        store.ui = store.ui || {};
        store.ui.examII = store.ui.examII || {};
        store.ui.examII.showPdfPreview = !!v;
        store.saveToLocalStorage();
      },
    });
    const togglePdfPreview = () => {
      showPdfPreview.value = !showPdfPreview.value;
    };

    const currentSkillIndex = computed({
      get: () => Number((store.ui && store.ui.examII && store.ui.examII.currentSkillIndex) || 0),
      set: (v: number) => {
        store.ui = store.ui || {};
        store.ui.examII = store.ui.examII || {};
        store.ui.examII.currentSkillIndex = Number(v) || 0;
        store.saveToLocalStorage();
      },
    });

    const getSkillExplanation = (code: string) => {
      const level = store.examII.currentLevel || "Bachelors";
      return exam2Explanations[level] && exam2Explanations[level][code]
        ? exam2Explanations[level][code]
        : "No explanation available.";
    };

    // Backwards-compatible single figure getter (returns the first image)
    const getSkillFigure = (code: string) => {
      return getSkillFigures(code)[0];
    };

    const skills = computed(() => {
      return store.examII.skills[currentLevel.value] || [];
    });

    const currentSkill = computed(() => skills.value[currentSkillIndex.value]);

    const currentScore = computed(() => store.examII.currentScore);

    // navigation (wrap-around)
    const prevSkill = () => {
      if (currentSkillIndex.value > 0) {
        currentSkillIndex.value = currentSkillIndex.value - 1;
      } else {
        // wrap-around to last
        currentSkillIndex.value = Math.max(0, skills.value.length - 1);
      }
    };
    const nextSkill = () => {
      if (currentSkillIndex.value < skills.value.length - 1) {
        currentSkillIndex.value = currentSkillIndex.value + 1;
      } else {
        // wrap-around to first
        currentSkillIndex.value = 0;
      }
    };

    // reset index when level changes
    watch(currentLevel, () => (currentSkillIndex.value = 0));

    // Modal state for enlarged figures
    const showFigureModal = ref(false);
    const modalSrc = ref("");
    const modalTitle = ref("");
    const modalDescription = ref("");

    const openModal = (src: string, title: string) => {
      modalSrc.value = src;
      modalTitle.value = title;
      modalDescription.value = getSkillExplanation(title.split(" ")[0]);
      showFigureModal.value = true;
    };

    const closeModal = () => {
      showFigureModal.value = false;
      modalSrc.value = "";
      modalTitle.value = "";
      modalDescription.value = "";
    };

    // Close modal on Escape key for better UX
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    // Touch / swipe-to-close state (mobile)
    const touchStartY = ref<number | null>(null);
    const touchCurrentY = ref<number>(0);
    const dragging = ref<boolean>(false);
    const SWIPE_CLOSE_THRESHOLD = 100; // pixels

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartY.value = e.touches[0].clientY;
      touchCurrentY.value = 0;
      dragging.value = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.value || touchStartY.value === null) return;
      const y = e.touches && e.touches.length ? e.touches[0].clientY : 0;
      touchCurrentY.value = Math.max(0, y - touchStartY.value);
    };

    const onTouchEnd = () => {
      dragging.value = false;
      if ((touchCurrentY.value || 0) > SWIPE_CLOSE_THRESHOLD) {
        closeModal();
      } else {
        touchCurrentY.value = 0;
      }
      touchStartY.value = null;
    };

    watch(showFigureModal, (val) => {
      if (val) {
        window.addEventListener("keydown", onKeyDown);
      } else {
        window.removeEventListener("keydown", onKeyDown);
      }
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", onKeyDown);
    });
    const totalScore = computed(() => {
      return (store.student.examIScore || 0) + store.examII.currentScore;
    });

    const buRating = computed(() => {
      if (totalScore.value < 20) return "beg-0";
      if (totalScore.value < 30) return "beg-1";
      if (totalScore.value < 40) return "beg-2";
      if (totalScore.value < 55) return "beg-3";
      if (totalScore.value < 70) return "int-1";
      if (totalScore.value < 95) return "int-2";
      if (totalScore.value < 110) return "int-3";
      if (totalScore.value < 125) return "adv-1";
      if (totalScore.value < 140) return "adv-2";
      if (totalScore.value < 160) return "adv-3";
      if (totalScore.value < 180) return "semi pro";
      return "pro";
    });

    const ratingClass = computed(() => {
      if (totalScore.value < 55) return "rating-beginner";
      if (totalScore.value < 95) return "rating-intermediate";
      if (totalScore.value < 125) return "rating-advanced";
      return "rating-expert";
    });

    const buDiploma = computed(() => {
      if (totalScore.value < 55) return "";
      if (totalScore.value < 85) return "Bachelors";
      if (totalScore.value < 100) return "Bachelors w/ Honors";
      if (totalScore.value < 125) return "Masters";
      if (totalScore.value < 140) return "Masters w/ Honors";
      if (totalScore.value < 180) return "Doctorate";
      return "Doctorate w/ Honors";
    });

    const setLevel = (level) => {
      currentLevel.value = level;
      store.setExamIILevel(level);
    };

    const calculateSkillScore = (skill) => {
      return store.calculateSkillScore(skill);
    };

    const calculateBreakScore = (breakScores) => {
      return breakScores.reduce((sum, score) => sum + parseInt(score || 0), 0);
    };

    const updateSkillScore = () => {
      store.calculateExamIIScore();
    };

    const saveExamII = () => {
      const entry = store.saveExamII();
      alert(
        `Exam II score saved: ${entry.total}/${currentLevelInfo.value.maxScore} (${currentLevel.value} level)`
      );
    };

    const resetExamII = () => {
      if (confirm("Reset all Exam II scores for current level?")) {
        store.resetExamII();
      }
    };

    const autoFill = () => {
      if (confirm("Fill with sample data?")) {
        store.loadSampleExamII();
      }
    };

    // Get max per attempt for S3 and S4 based on level
    const getMaxPerAttempt = (skillCode: string) => {
      if (skillCode !== "S3" && skillCode !== "S4") {
        return currentSkill.value?.maxScore || 0;
      }

      const level = currentLevel.value;
      if (level === "Bachelors") return 5;
      if (level === "Masters") return 6;
      if (level === "Doctorate") return 7;
      return 0;
    };

    // Validate and clamp attempt scores for S3 and S4
    const validateAttemptScore = (attemptIndex: number) => {
      if (!currentSkill.value || currentSkill.value.type !== "lowestTwoOfThree") return;

      const maxPerAttempt = getMaxPerAttempt(currentSkill.value.code);
      const skill = currentSkill.value as any;

      if (skill.scores && skill.scores[attemptIndex] !== undefined) {
        const value = Number(skill.scores[attemptIndex]) || 0;
        if (value > maxPerAttempt) {
          skill.scores[attemptIndex] = maxPerAttempt;
        } else if (value < 0) {
          skill.scores[attemptIndex] = 0;
        }
      }

      updateSkillScore();
    };

    // Get CSS class for sum attempt button based on state
    const getSumAttemptClass = (score: any) => {
      if (score === 1) return "sum-success";
      if (score === 0) return "sum-missed";
      return "sum-empty";
    };

    // Get status text for sum attempt
    const getSumAttemptStatus = (score: any) => {
      if (score === 1) return "Success (1 point)";
      if (score === 0) return "Missed (0 points)";
      return "Not attempted";
    };

    // Toggle sum attempt between states: empty -> success -> missed -> empty
    const toggleSumAttempt = (skill: any, index: number) => {
      if (!skill || !skill.scores) return;

      const currentValue = skill.scores[index];
      if (currentValue === 1 || currentValue === "1") {
        // success -> missed
        skill.scores[index] = 0;
      } else if (currentValue === 0 || currentValue === "0") {
        // missed -> empty
        skill.scores[index] = null;
      } else {
        // empty -> success
        skill.scores[index] = 1;
      }

      updateSkillScore();
    };

    // Toggle break point between states: empty -> success -> missed -> empty
    const toggleBreakPoint = (skill: any, breakIndex: number, pointIndex: number) => {
      if (!skill || !skill.breakScores || !skill.breakScores[breakIndex]) return;

      const currentValue = skill.breakScores[breakIndex][pointIndex];
      if (currentValue === 1 || currentValue === "1") {
        // success -> missed
        skill.breakScores[breakIndex][pointIndex] = 0;
      } else if (currentValue === 0 || currentValue === "0") {
        // missed -> empty
        skill.breakScores[breakIndex][pointIndex] = null;
      } else {
        // empty -> success
        skill.breakScores[breakIndex][pointIndex] = 1;
      }

      updateSkillScore();
    };

    return {
      levels,
      currentLevel,
      currentLevelInfo,
      currentLevelClass,
      skills,
      currentSkillIndex,
      currentSkill,
      currentScore,
      totalScore,
      buRating,
      ratingClass,
      buDiploma,
      setLevel,
      prevSkill,
      nextSkill,
      getSkillFigure,
      getSkillFigures,
      getSkillExplanation,
      getMaxPerAttempt,
      validateAttemptScore,
      getSumAttemptClass,
      getSumAttemptStatus,
      toggleSumAttempt,
      toggleBreakPoint,
      calculateSkillScore,
      calculateBreakScore,
      updateSkillScore,
      saveExamII,
      resetExamII,
      autoFill,
      // PDF preview helpers
      pdfFilename,
      pdfUrl,
      showPdfPreview,
      togglePdfPreview,
      // modal
      showFigureModal,
      modalSrc,
      modalTitle,
      modalDescription,
      openModal,
      closeModal,
      // touch/swipe handlers
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      touchCurrentY,
      dragging,
    };
  },
};
</script>

<style scoped>
.exam-ii-container {
  padding: 1rem;
}

.exam-header {
  margin-bottom: 2rem;
}

.exam-header h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.level-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.level-btn {
  flex: 1;
  min-width: 200px;
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.level-btn:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.level-btn.active {
  border-color: #3498db;
  background: #e3f2fd;
  color: #1976d2;
}

.level-btn.active .level-max {
  color: #1976d2;
}

.level-max {
  font-size: 0.9rem;
  font-weight: normal;
  color: #6c757d;
}

.skill-figure {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.skill-figure img {
  max-width: 420px;
  width: 100%;
  height: auto;
  border: 1px solid #e8eaef;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(20, 30, 42, 0.04);
}

.layout-images {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: nowrap; /* keep items in a horizontal scroller on small screens */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
  scroll-snap-type: x proximity;
  padding: 0 0.5rem;
}

.layout-card {
  width: 420px; /* match Exam I drill figure width on desktop */
  flex: 0 0 auto;
  text-align: center;
  scroll-snap-align: center;
}

.layout-card img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  border: 1px solid #e8eaef;
  max-height: 420px; /* allow larger layouts to display like Exam I */
  object-fit: contain;
}

/* Medium desktop breakpoint (1200px) */
@media (max-width: 1200px) {
  .layout-card {
    width: 360px;
  }
  .layout-card img {
    max-height: 360px;
  }
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .layout-card {
    width: 320px;
  }
  .layout-card img {
    max-height: 320px;
  }
}

/* Mobile breakpoint */
@media (max-width: 640px) {
  .layout-images {
    gap: 0.5rem;
    padding: 0 0.5rem;
  }

  .layout-card {
    width: 80%; /* show one big card per view */
    max-width: 360px;
  }

  .layout-card img {
    max-height: 260px;
  }

  .skill-figure {
    padding: 0 0.5rem;
  }
}

.layout-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.35rem;
}

.level-info {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.level-badge {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-bachelors {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.level-masters {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.level-doctorate {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.level-description {
  color: #495057;
  font-size: 0.95rem;
  max-width: 600px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.skills-carousel {
  margin-bottom: 2rem;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.skill-position {
  font-weight: 700;
  color: #495057;
}

.prev-btn,
.next-btn {
  min-width: 140px;
}
.skill-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.skill-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.skill-score {
  text-align: right;
}

.current-score {
  font-size: 1.8rem;
  font-weight: bold;
  color: #27ae60;
}

.max-score {
  font-size: 1rem;
  color: #6c757d;
}

.skill-content {
  padding: 1rem 0;
}

.skill-explanation {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.skill-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-group label {
  min-width: 80px;
  font-weight: 600;
  color: #495057;
}

.input-group input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #3498db;
  border-color: #3498db;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #495057;
}

/* Sum Attempts - Click-based buttons */
.sum-attempts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 0.75rem;
}

.sum-button-group {
  display: flex;
  justify-content: center;
}

.sum-attempt-btn {
  width: 70px;
  height: 70px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
  color: #495057;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.sum-attempt-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.sum-attempt-btn:active {
  transform: translateY(0);
}

/* Empty state */
.sum-attempt-btn.sum-empty {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #6c757d;
}

.sum-attempt-btn.sum-empty:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* Success state (1 point) */
.sum-attempt-btn.sum-success {
  background: #d4edda;
  border-color: #27ae60;
  color: #27ae60;
}

.sum-attempt-btn.sum-success:hover {
  background: #c3e6cb;
  border-color: #1e8449;
  color: #1e8449;
}

.sum-attempt-btn.sum-success .attempt-icon {
  font-size: 1.8rem;
  line-height: 1;
}

/* Missed state (0 points) */
.sum-attempt-btn.sum-missed {
  background: #f8d7da;
  border-color: #e74c3c;
  color: #e74c3c;
}

.sum-attempt-btn.sum-missed:hover {
  background: #f5c6cb;
  border-color: #c0392b;
  color: #c0392b;
}

.sum-attempt-btn.sum-missed .attempt-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.attempt-number {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
}

.attempt-icon {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.break-shots {
  gap: 1.5rem;
}

.break-attempt {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.break-attempt h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
}

.break-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.point-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.point-input label {
  font-size: 0.85rem;
  color: #6c757d;
}

.point-input select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Break Points with Buttons */
.break-points-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.point-button-group {
  display: flex;
  justify-content: center;
}

.break-point-btn {
  width: 60px;
  height: 60px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #495057;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.break-point-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.break-point-btn:active {
  transform: translateY(0);
}

/* Empty state */
.break-point-btn.sum-empty {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #6c757d;
}

.break-point-btn.sum-empty:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* Success state (1 point) */
.break-point-btn.sum-success {
  background: #d4edda;
  border-color: #27ae60;
  color: #27ae60;
}

.break-point-btn.sum-success:hover {
  background: #c3e6cb;
  border-color: #1e8449;
  color: #1e8449;
}

.break-point-btn.sum-success .point-icon {
  font-size: 1.4rem;
  line-height: 1;
}

/* Missed state (0 points) */
.break-point-btn.sum-missed {
  background: #f8d7da;
  border-color: #e74c3c;
  color: #e74c3c;
}

.break-point-btn.sum-missed:hover {
  background: #f5c6cb;
  border-color: #c0392b;
  color: #c0392b;
}

.break-point-btn.sum-missed .point-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.point-letter {
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.7;
}

.point-icon {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
}

.break-score-label {
  color: #27ae60;
  font-weight: bold;
}

.attempt-score {
  text-align: center;
  font-weight: bold;
  color: #27ae60;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.skill-note {
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.figure-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.figure-modal .modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.figure-modal .modal-content {
  position: relative;
  z-index: 1001;
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  max-width: 900px;
  width: 95%;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}

.modal-drag-handle {
  width: 36px;
  height: 5px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 0 auto 0.75rem auto;
}

.figure-modal {
  animation: fadeIn 180ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.figure-modal .modal-content.dragging {
  transition: none; /* disable transition while dragging */
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-title {
  margin: 0 0 1rem 0;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e8eaef;
}

.figure-modal .modal-content {
  /* ensure content doesn't overflow the viewport and keeps close button visible */
  max-height: 90vh;
  overflow: auto;
}

.modal-description {
  color: #495057;
  margin-top: 0.75rem;
}

.exam-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.summary-card h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.summary-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
}

.diploma {
  color: #8e44ad;
  font-size: 1.8rem;
}

.progress-bar {
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  transition: width 0.5s ease;
}

.rating-display {
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1rem;
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

.diploma-note {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.score-breakdown {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
}

.score-breakdown h4 {
  margin: 0 0 1.5rem 0;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 40px;
}

.skill-bar {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  transition: width 0.5s ease;
}

.skill-value {
  font-weight: bold;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
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

.btn-success {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #219653, #27ae60);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
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
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #2980b9, #1c6ea4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .level-btn {
    min-width: 100%;
  }

  .level-info {
    flex-direction: column;
    text-align: center;
  }

  .input-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-group input {
    width: 100%;
  }

  .break-points {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
