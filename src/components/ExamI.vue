<template>
  <div class="exam-i-container">
    <div class="exam-header">
      <h2><i class="fas fa-graduation-cap"></i> Exam I - Fundamentals</h2>
      <div class="exam-stats">
        <div class="stat-box">
          <span class="stat-label">Total Score</span>
          <span class="stat-value">{{ totalScore }}/100</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Exam II Level</span>
          <span class="stat-value" :class="placementClass">{{ placement }}</span>
        </div>
      </div>
    </div>

    <div class="drills-grid">
      <div v-for="(drill, index) in drills" :key="index" class="drill-card">
        <div class="drill-header">
          <h3>{{ drill.code }} - {{ drill.name }}</h3>
          <div class="drill-center">
            <button class="reset-drill-btn" @click="resetDrill(index)">Reset</button>
          </div>
          <span class="drill-score">{{ drill.score }}/{{ drill.maxScore }}</span>
        </div>
        <!-- Figure with special overlay for F6 (Potting) -->
        <div v-if="getFigure(drill.code)" class="drill-figure-wrap">
          <template v-if="drill.code === 'F6'">
            <div class="figure-with-overlay">
              <div class="figure-image-wrap">
                <img :src="getFigure(drill.code).src" :alt="drill.code + ' figure'" class="drill-figure" />
                <div
                  class="potting-overlay"
                  role="group"
                  :aria-label="'F6 potting shots for ' + (student.name || 'student')"
                >
                  <button
                    v-for="(c, i) in pottingCoords"
                    :key="i"
                    class="potting-hotspot"
                    :class="{
                      success: drill.shots && drill.shots[i],
                      attemptedMiss: drill.attempted && drill.attempted[i] && !(drill.shots && drill.shots[i]),
                      editing: hotspotTuner.activeIndex === index
                    }"
                    :style="hotspotStyle(index, i, c)"
                    @click="togglePotting(index, i)"
                    @keydown.space.prevent="togglePotting(index, i)"
                    @keydown.enter.prevent="togglePotting(index, i)"
                    :aria-pressed="drill.shots && drill.shots[i] ? 'true' : 'false'"
                    :aria-label="'Shot ' + (i + 1)"
                    tabindex="0"
                    @mousedown.prevent="hotspotTuner.activeIndex === index ? startDrag($event, index, i) : null"
                    @touchstart.prevent="hotspotTuner.activeIndex === index ? startDrag($event.touches[0], index, i) : null"
                  >
                    <span v-if="!(drill.attempted && drill.attempted[i])" class="hotspot-label">{{ i + 1 }}</span>
                    <span v-else-if="drill.shots && drill.shots[i]" class="hotspot-symbol success">✓</span>
                    <span v-else class="hotspot-symbol miss">x</span>
                  </button>
                </div>
              </div>

              <div class="potting-controls">
                <div class="potting-score">F6 Score: {{ drill.score }} / {{ drill.maxScore }}</div>
                <div class="potting-buttons">
                  <!-- Reset handled by the drill-level Reset button (header) -->
                </div>

                <div v-if="hotspotTuner.available" class="hotspot-tuner-wrap">
                  <button class="btn btn-secondary" @click="toggleHotspotTuner(index)">
                    {{ hotspotTuner.activeIndex === index ? 'Close Hotspot Tuner' : 'Edit Hotspots (dev)' }}
                  </button>

                  <div v-if="hotspotTuner.activeIndex === index" class="hotspot-tuner">
                    <div class="tuner-row" v-for="(c, i) in hotspotTuner.tempCoords" :key="i">
                      <div class="tuner-label">Shot {{ i + 1 }}</div>
                      <div class="tuner-controls">
                        <button class="small" @click="adjustHotspotTemp(i, -1, 0)" title="Left -1">←</button>
                        <input v-model="hotspotTuner.tempCoords[i].left" />
                        <button class="small" @click="adjustHotspotTemp(i, 1, 0)" title="Left +1">→</button>

                        <button class="small" @click="adjustHotspotTemp(i, 0, -1)" title="Top -1">↑</button>
                        <input v-model="hotspotTuner.tempCoords[i].top" />
                        <button class="small" @click="adjustHotspotTemp(i, 0, 1)" title="Top +1">↓</button>

                        <span class="drag-hint">(Drag on image to move)</span>
                      </div>
                    </div>

                    <div class="tuner-actions">
                      <button class="btn btn-success" @click="saveHotspotTuner(index)">Save</button>
                      <button class="btn btn-secondary" @click="cancelHotspotTuner">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="drill-figure-caption">{{ getFigure(drill.code).caption }}</div>
          </template>

          <template v-else>
            <img :src="getFigure(drill.code).src" :alt="drill.code + ' figure'" class="drill-figure" />
            <div class="drill-figure-caption">{{ getFigure(drill.code).caption }}</div>
          </template>
        </div>

        <div v-if="drill.type === 'position'" class="drill-content">
          <div class="shots-grid" :class="{ horizontal: isHorizontal(drill) }">
            <div v-for="i in 10" :key="i" class="shot-cell">
              <label class="shot-label">Shot {{ i }}</label>
              <div class="shot-controls">
                <div class="target-display">
                  <span class="shot-input readonly" aria-readonly="true">{{
                    Number(drill.shots[i - 1]) || 4
                  }}</span>
                </div>
                <div class="checkbox-column">
                  <label class="success-label" title="Success">
                    <input
                      v-model="drill.successes[i - 1]"
                      type="checkbox"
                      class="small-checkbox"
                      :disabled="
                        (drill.locked && drill.locked[i - 1]) ||
                        (i > 1 && !(drill.successes[i - 2] || drill.loses[i - 2]))
                      "
                      @change="toggleShotSuccess(index, i - 1)"
                    />
                    <span class="check-letter">S</span>
                  </label>

                  <label class="lose-label" title="Lose">
                    <input
                      v-model="drill.loses[i - 1]"
                      type="checkbox"
                      class="small-checkbox"
                      :disabled="
                        (drill.locked && drill.locked[i - 1]) ||
                        (i > 1 && !(drill.successes[i - 2] || drill.loses[i - 2]))
                      "
                      @change="toggleShotLose(index, i - 1)"
                    />
                    <span class="check-letter">L</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="bonus-info">
            <i class="fas fa-star"></i> Bonus: {{ drill.bonus }} successes at 7
          </div>
          <div class="calc-note">Le calcul sera effectué après le dernier shot.</div>
        </div>

        <div v-else class="drill-content">
          <p class="instructions">{{ drill.instructions }}</p>
          <div class="counter-controls">
            <template v-if="drill.code !== 'F6'">
              <button :disabled="drill.score <= 0" class="counter-btn" @click="decrementScore(index)" title="Decrement">
                <i class="fas fa-minus"></i>
              </button>
              <div class="counter-display">
                <span class="counter-value">{{ drill.score }}</span>
                <span class="counter-max">/{{ drill.maxScore }}</span>
              </div>
              <button :disabled="drill.score >= drill.maxScore" class="counter-btn" @click="incrementScore(index)" title="Increment">
                <i class="fas fa-plus"></i>
              </button>
            </template>
            <template v-else>
              <div class="counter-display">
                <span class="counter-value">{{ drill.score }}</span>
                <span class="counter-max">/{{ drill.maxScore }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="exam-summary">
      <h3><i class="fas fa-chart-pie"></i> Exam I Summary</h3>

      <div class="score-breakdown">
        <div v-for="(drill, index) in drills" :key="index" class="breakdown-item">
          <span class="breakdown-label">{{ drill.code }}</span>
          <div class="breakdown-bar">
            <div
              class="breakdown-fill"
              :style="{ width: (drill.score / drill.maxScore) * 100 + '%' }"
              :class="getScoreColor(drill.score, drill.maxScore)"
            ></div>
          </div>
          <span class="breakdown-value">{{ drill.score }}/{{ drill.maxScore }}</span>
        </div>
      </div>

      <div class="placement-info">
        <div v-for="level in placementLevels" :key="level.name" class="placement-card">
          <div class="placement-level" :class="level.class">
            {{ level.name }}
          </div>
          <div class="placement-range">{{ level.range }}</div>
          <div class="placement-desc">{{ level.desc }}</div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn btn-success" @click="saveExamI">
        <i class="fas fa-save"></i> Save Exam I Score
      </button>
      <button class="btn btn-secondary" @click="resetExamI">
        <i class="fas fa-redo"></i> Reset Exam I
      </button>
      <button class="btn btn-info" @click="autoFill">
        <i class="fas fa-magic"></i> Auto-fill Sample
      </button>
    </div>

    <div class="figures-section">
      <h3><i class="fas fa-image"></i> Figures & Explanations</h3>
      <p class="fig-note">
        Images intégrées depuis <strong>BU_Exam-I_Fundamentals_BW.pdf</strong>. Légendes
        paraphrasées; source attribuée à l'auteur.
      </p>
      <div class="figures-grid">
        <div v-for="(f, i) in figures" :key="i" class="figure-card">
          <img :src="f.src" :alt="`Figure ${i + 1}`" />
          <div class="figure-caption">
            <strong>{{ f.caption }}</strong>
            <div class="figure-attrib">
              Source: BU_Exam-I_Fundamentals_BW.pdf — David Alciatore (2018)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useExamsStore } from "../store/useExamsStore";
const FIGS = [
  {
    src: new URL("../assets/exam1_figs/fig-000.jpg", import.meta.url).href,
    caption: "Cover / Logo: Billiard University Exam I cover image.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-001.jpg", import.meta.url).href,
    caption:
      "F1 – Cut Shot Drill: Progressive practice drill; advance or retreat cue-ball position based on success.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-002.jpg", import.meta.url).href,
    caption:
      "F2 – Stop Shot Drill: Pocket object ball and stop the cue ball overlapping the ghost-ball outline.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-003.jpg", import.meta.url).href,
    caption:
      "F3 – Follow Shot Drill: Pocket the object ball and have the cue ball finish inside the target window.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-004.jpg", import.meta.url).href,
    caption:
      "F4 – Draw Shot Drill: Pocket the object ball and draw the cue ball into the 2x1 diamond target.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-005.jpg", import.meta.url).href,
    caption:
      "F5 – Stun Shot Drill: Cue ball should head to the target area; some positions require a rail rebound.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-006.jpg", import.meta.url).href,
    caption:
      "F6 – Ball Pocketing Drill: Fixed positions, attempt the set of shots and count balls pocketed.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-007.jpg", import.meta.url).href,
    caption: "F7 – Wagon Wheel Drill: Pocket OB and contact the indicated rail target balls.",
  },
  {
    src: new URL("../assets/exam1_figs/fig-008.jpg", import.meta.url).href,
    caption: "F8 – Grid Target Drill: Pocket OB and finish with cue ball overlapping grid targets.",
  },
];

export default {
  name: "ExamI",
  data() {
    return {
      placementLevels: [
        { name: "Bachelors", range: "0-49", desc: "Beginner Level", class: "level-bachelors" },
        { name: "Masters", range: "50-69", desc: "Intermediate Level", class: "level-masters" },
        { name: "Doctorate", range: "70-100", desc: "Advanced Level", class: "level-doctorate" },
      ],
      figures: FIGS,
      // positions for potting hotspots (left/top percentages)
      pottingCoords: [
        { left: "43%", top: "9%" },
        { left: "58%", top: "21%" },
        { left: "86%", top: "70%" },
        { left: "55%", top: "87%" },
        { left: "71%", top: "62%" },
        { left: "44%", top: "87%" },
        { left: "66%", top: "75%" },
        { left: "85%", top: "34%" },
        { left: "54%", top: "9%" },
        { left: "68%", top: "28%" },
      ],
      hotspotTuner: {
        // enabled when URL contains ?hotspot-edit (keeps dev tool off by default in production)
        available: typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('hotspot-edit'),
        activeIndex: null,
        tempCoords: null,
        dragging: null,
      }
    };
  },
  computed: {
    drills() {
      const store = useExamsStore();
      return store.examI.drills;
    },
    totalScore() {
      const store = useExamsStore();
      return store.examI.totalScore;
    },
    placement() {
      const store = useExamsStore();
      return store.examI.placement;
    },
    student() {
      const store = useExamsStore();
      return store.student;
    },
    placementClass() {
      return {
        "level-bachelors-text": this.placement === "Bachelors",
        "level-masters-text": this.placement === "Masters",
        "level-doctorate-text": this.placement === "Doctorate",
      };
    },
  },
  mounted() {
    const store = useExamsStore();
    // Ensure position drills have required arrays to avoid missing shot values
    store.examI.drills.forEach((drill) => {
      if (drill.type === "position") {
        if (!Array.isArray(drill.shots) || drill.shots.length < 10) drill.shots = Array(10).fill(4);
        if (!Array.isArray(drill.successes) || drill.successes.length < 10)
          drill.successes = Array(10).fill(false);
        if (!Array.isArray(drill.loses) || drill.loses.length < 10)
          drill.loses = Array(10).fill(false);
        if (!Array.isArray(drill.locked) || drill.locked.length < 10)
          drill.locked = Array(10).fill(false);

        // Clamp shot values to valid range 1..7 if present
        drill.shots = (drill.shots || Array(10).fill(4)).slice(0, 10).map((s) => {
          const n = Number(s) || 4;
          if (n < 1) return 1;
          if (n > 7) return 7;
          return n;
        });
      }
    });
  },
  beforeUnmount() {
    // Cleanup any event listeners used by the hotspot tuner
    window.removeEventListener('mousemove', this.onWindowMove);
    window.removeEventListener('touchmove', this.onWindowMove);
    window.removeEventListener('mouseup', this.onWindowUp);
    window.removeEventListener('touchend', this.onWindowUp);
  },
  methods: {
    getFigure(code) {
      if (!code) return null;
      const m = String(code).match(/^F(\d+)/i);
      if (!m) return null;
      const idx = Number(m[1]);
      return this.figures && this.figures[idx] ? this.figures[idx] : null;
    },
    isHorizontal(drill) {
      try {
        const codeNum = parseInt(drill && drill.code && drill.code.slice(1), 10);
        return !isNaN(codeNum) && codeNum >= 1 && codeNum <= 7;
      } catch (e) {
        return false;
      }
    },
    updateDrillScore(index, shotIndex) {
      const store = useExamsStore();
      const drill = store.examI.drills[index];
      if (!drill) return;

      // mark that calculation is pending until last shot
      if (shotIndex !== 9) {
        drill.needsCalc = true;
        return;
      }

      // last shot changed — perform calculation and clear flag
      if (drill.needsCalc) drill.needsCalc = false;
      store.updateExamIDrill(index);
    },
    toggleShotSuccess(drillIndex, shotIndex) {
      const store = useExamsStore();
      const drill = store.examI.drills[drillIndex];
      if (!drill.successes) drill.successes = Array(10).fill(false);
      const checked = !!drill.successes[shotIndex];

      // prevent toggling if previous shot not activated (except first shot)
      if (shotIndex > 0 && !(drill.successes[shotIndex - 1] || drill.loses[shotIndex - 1])) {
        // revert change and ignore
        drill.successes[shotIndex] = false;
        return;
      }

      // uncheck lose if success checked
      if (checked) {
        if (!drill.loses) drill.loses = Array(10).fill(false);
        drill.loses[shotIndex] = false;
      }

      // if success and next target exists, increment next target (max 7)
      if (checked && shotIndex + 1 < (drill.shots || []).length) {
        const currentTarget = Number(drill.shots[shotIndex] || 4);
        drill.shots[shotIndex + 1] = Math.min(7, currentTarget + 1);
      }

      // lock previous shot for drills F1..F7 to avoid accidental changes
      try {
        const codeNum = parseInt(drill.code && drill.code.slice(1), 10);
        if (!isNaN(codeNum) && codeNum <= 7 && shotIndex > 0) {
          if (!drill.locked) drill.locked = Array(10).fill(false);
          drill.locked[shotIndex - 1] = true;
        }
      } catch (e) {
        /* ignore errors when locking previous shot */
      }

      // delay calculation until last shot
      if (shotIndex !== 9) {
        drill.needsCalc = true;
        return;
      }

      if (drill.needsCalc) drill.needsCalc = false;
      store.updateExamIDrill(drillIndex);
    },
    toggleShotLose(drillIndex, shotIndex) {
      const store = useExamsStore();
      const drill = store.examI.drills[drillIndex];
      if (!drill.loses) drill.loses = Array(10).fill(false);
      const checked = !!drill.loses[shotIndex];
      drill.loses[shotIndex] = checked;

      // prevent toggling if previous shot not activated (except first shot)
      if (shotIndex > 0 && !(drill.successes[shotIndex - 1] || drill.loses[shotIndex - 1])) {
        // revert change and ignore
        drill.loses[shotIndex] = false;
        return;
      }

      // if lose checked, unset success
      if (checked) {
        if (!drill.successes) drill.successes = Array(10).fill(false);
        drill.successes[shotIndex] = false;
        // decrease next shot target by 1 (min 1)
        if (shotIndex + 1 < (drill.shots || []).length) {
          const currentTarget = Number(drill.shots[shotIndex] || 4);
          drill.shots[shotIndex + 1] = Math.max(1, currentTarget - 1);
        }
        // lock previous shot for drills F1..F7 to avoid accidental changes
        try {
          const codeNum = parseInt(drill.code && drill.code.slice(1), 10);
          if (!isNaN(codeNum) && codeNum <= 7 && shotIndex > 0) {
            if (!drill.locked) drill.locked = Array(10).fill(false);
            drill.locked[shotIndex - 1] = true;
          }
        } catch (e) {
          /* ignore errors when locking previous shot */
        }
      }

      if (shotIndex !== 9) {
        drill.needsCalc = true;
        return;
      }

      if (drill.needsCalc) drill.needsCalc = false;
      store.updateExamIDrill(drillIndex);
    },
    changeShotTarget(drillIndex, shotIndex, delta) {
      const store = useExamsStore();
      const drill = store.examI.drills[drillIndex];
      if (!drill) return;
      if (!Array.isArray(drill.shots)) drill.shots = Array(10).fill(4);

      const cur = Number(drill.shots[shotIndex] || 4);
      let next = cur + delta;
      if (next < 1) next = 1;
      if (next > 7) next = 7;
      drill.shots[shotIndex] = next;

      // if this is a lose-driven change, ensure neighbors consistent
      // do not allow manual typing; only +/- changes through these buttons

      // if not last shot, mark calc pending
      if (shotIndex !== 9) {
        drill.needsCalc = true;
        return;
      }

      if (drill.needsCalc) drill.needsCalc = false;
      store.updateExamIDrill(drillIndex);
    },
    resetDrill(index) {
      if (!confirm("Reset this drill locally?")) return;
      const store = useExamsStore();
      store.resetExamIDrill(index);
    },
    incrementScore(index) {
      const store = useExamsStore();
      store.incrementDrillScore(index);
    },
    decrementScore(index) {
      const store = useExamsStore();
      store.decrementDrillScore(index);
    },
    saveExamI() {
      const store = useExamsStore();
      store.saveExamI();
      alert(`Exam I score saved: ${this.totalScore}/100 (${this.placement} level)`);
    },
    resetExamI() {
      if (confirm("Reset all Exam I scores?")) {
        const store = useExamsStore();
        store.resetExamI();
      }
    },
    autoFill() {
      if (confirm("Fill with sample data?")) {
        const store = useExamsStore();
        store.loadSampleExamI();
      }
    },
    // F6 (potting) UI interactions
    togglePotting(drillIndex, shotIndex) {
      const store = useExamsStore();
      const ok = store.togglePottingShot(drillIndex, shotIndex);
      if (!ok) return;
      // find the drill and ensure local reactivity
      const drill = store.examI.drills[drillIndex];
    },

    // Hotspot tuner (dev-only, enabled by URL param `?hotspot-edit`)
    toggleHotspotTuner(drillIndex) {
      if (this.hotspotTuner.activeIndex === drillIndex) {
        this.cancelHotspotTuner();
        return;
      }
      this.hotspotTuner.activeIndex = drillIndex;
      // deep copy coords for editing
      this.hotspotTuner.tempCoords = (this.pottingCoords || []).map((c) => ({ left: String(c.left), top: String(c.top) }));
    },
    cancelHotspotTuner() {
      this.hotspotTuner.activeIndex = null;
      this.hotspotTuner.tempCoords = null;
      this.hotspotTuner.dragging = null;
    },
    saveHotspotTuner(drillIndex) {
      if (this.hotspotTuner.activeIndex !== drillIndex || !Array.isArray(this.hotspotTuner.tempCoords)) return;
      // sanitize and commit to pottingCoords
      this.pottingCoords = this.hotspotTuner.tempCoords.map((c) => {
        let l = String(c.left).trim();
        let t = String(c.top).trim();
        const tryNum = (s) => {
          const n = Number(String(s).replace('%', ''));
          if (!isNaN(n)) {
            const clamped = Math.max(0, Math.min(100, Math.round(n)));
            return clamped + '%';
          }
          return s;
        };
        return { left: tryNum(l), top: tryNum(t) };
      });
      this.cancelHotspotTuner();
    },
    adjustHotspotTemp(i, deltaLeft = 0, deltaTop = 0) {
      if (!this.hotspotTuner.tempCoords) return;
      const p = this.hotspotTuner.tempCoords[i];
      const parsePercent = (s) => {
        const n = Number(String(s).replace('%', '')) || 0;
        return n;
      };
      const l = Math.max(0, Math.min(100, parsePercent(p.left) + deltaLeft));
      const t = Math.max(0, Math.min(100, parsePercent(p.top) + deltaTop));
      p.left = l + '%';
      p.top = t + '%';
    },
    startDrag(evt, drillIndex, i) {
      const target = evt.target || evt.srcElement;
      const figureWrap = target.closest('.figure-image-wrap');
      if (!figureWrap) return;
      const rect = figureWrap.getBoundingClientRect();
      // store index and rect
      this.hotspotTuner.dragging = { drillIndex, i, rect };
      // attach listeners
      window.addEventListener('mousemove', this.onWindowMove);
      window.addEventListener('touchmove', this.onWindowMove, { passive: false });
      window.addEventListener('mouseup', this.onWindowUp);
      window.addEventListener('touchend', this.onWindowUp);
      // initial position
      this.onWindowMove(evt);
    },
    onWindowMove(e) {
      const d = this.hotspotTuner.dragging;
      if (!d) return;
      const clientX = e.touches ? e.touches[0].clientX : (e.clientX || 0);
      const clientY = e.touches ? e.touches[0].clientY : (e.clientY || 0);
      const rect = d.rect;
      let x = ((clientX - rect.left) / rect.width) * 100;
      let y = ((clientY - rect.top) / rect.height) * 100;
      x = Math.max(0, Math.min(100, Math.round(x)));
      y = Math.max(0, Math.min(100, Math.round(y)));
      if (this.hotspotTuner.tempCoords && this.hotspotTuner.tempCoords[d.i]) {
        this.hotspotTuner.tempCoords[d.i].left = x + '%';
        this.hotspotTuner.tempCoords[d.i].top = y + '%';
      } else if (this.hotspotTuner.tempCoords) {
        this.hotspotTuner.tempCoords[d.i] = { left: x + '%', top: y + '%' };
      }
      if (e.preventDefault) e.preventDefault();
    },
    onWindowUp() {
      window.removeEventListener('mousemove', this.onWindowMove);
      window.removeEventListener('touchmove', this.onWindowMove);
      window.removeEventListener('mouseup', this.onWindowUp);
      window.removeEventListener('touchend', this.onWindowUp);
      this.hotspotTuner.dragging = null;
    },
    hotspotStyle(drillIndex, i, c) {
      if (this.hotspotTuner.activeIndex === drillIndex && this.hotspotTuner.tempCoords && this.hotspotTuner.tempCoords[i]) {
        return { left: this.hotspotTuner.tempCoords[i].left, top: this.hotspotTuner.tempCoords[i].top };
      }
      return { left: c.left, top: c.top };
    },


    getScoreColor(score, max) {
      const percentage = (score / max) * 100;
      if (percentage >= 80) return "score-excellent";
      if (percentage >= 60) return "score-good";
      if (percentage >= 40) return "score-average";
      return "score-poor";
    },
  },
};
</script>

<style scoped>
.exam-i-container {
  padding: 1rem;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.exam-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.exam-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-box {
  text-align: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 150px;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.drills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.drill-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.drill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.drill-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.drill-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.reset-drill-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.reset-drill-btn:hover {
  opacity: 0.9;
}

.shot-input.readonly {
  display: inline-block;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  background: #f1f2f6;
  border: 1px solid #e0e0e0;
  min-width: 36px;
  text-align: center;
}

.drill-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.drill-center {
  justify-self: center;
}
.reset-drill-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.reset-drill-btn:hover {
  opacity: 0.9;
}

.drill-score {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
}

.shot-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.3rem;
}

.shot-select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background: white;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
}

.shot-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.shot-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

/* default shots grid (desktop) */
.shots-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

/* horizontal layout used for F1..F7 */
.shots-grid.horizontal {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
}

.shots-grid.horizontal .shot-cell {
  min-width: 0;
}

.shot-input {
  width: 60%;
  padding: 0.4rem;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  text-align: center;
}

.success-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #2c3e50;
}

.lose-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #c0392b;
}

.calc-note {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: #6c757d;
}

/* hide number input spin buttons */
input[type="number"].no-spin::-webkit-outer-spin-button,
input[type="number"].no-spin::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"].no-spin {
  -moz-appearance: textfield;
}

/* stacked small checkboxes column */
.checkbox-column {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.small-checkbox {
  transform: scale(0.9);
  margin: 0;
}

.check-letter {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #2d3436;
  background: #e9ecef;
  border: 1px solid #dfe6e9;
}

.success-label input:checked + .check-letter {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
}

.lose-label input:checked + .check-letter {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

.bonus-info {
  margin-top: 1rem;
  padding: 0.8rem;
  background: #fff8e1;
  border-radius: 5px;
  color: #ff9800;
  font-size: 0.9rem;
  text-align: center;
}

.instructions {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.counter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.counter-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: #3498db;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: scale(1.05);
}

.counter-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.counter-display {
  text-align: center;
  min-width: 80px;
}

.counter-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.counter-max {
  font-size: 1rem;
  color: #6c757d;
  margin-left: 0.3rem;
}

.exam-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.exam-summary h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.score-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.breakdown-label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 40px;
}

.breakdown-bar {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.score-excellent {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}
.score-good {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
}
.score-average {
  background: linear-gradient(90deg, #e67e22, #d35400);
}
.score-poor {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.breakdown-value {
  font-weight: bold;
  color: #2c3e50;
  min-width: 60px;
  text-align: right;
}

.placement-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.placement-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.placement-level {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
}

.level-bachelors {
  background: #3498db;
  color: white;
}
.level-masters {
  background: #f39c12;
  color: white;
}
.level-doctorate {
  background: #e74c3c;
  color: white;
}

.level-bachelors-text {
  color: #3498db;
}
.level-masters-text {
  color: #f39c12;
}
.level-doctorate-text {
  color: #e74c3c;
}

.placement-range {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.placement-desc {
  color: #6c757d;
  font-size: 0.9rem;
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
  .exam-header {
    flex-direction: column;
    text-align: center;
  }
  .exam-stats {
    width: 100%;
    justify-content: center;
  }
  .drills-grid {
    grid-template-columns: 1fr;
  }
  .drill-card {
    min-width: 0;
    width: 100%;
  }
  .shots-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.5rem;
  }
  .shot-cell {
    min-width: 0;
  }
  .drill-figure {
    max-width: 100%;
  }
  .drill-figure-caption {
    max-width: 100%;
  }
  .drills-grid,
  .shots-grid {
    overflow-x: auto;
  }
}

.figures-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1.5rem;
}
.figures-section h3 {
  margin-top: 0;
  color: #2c3e50;
}
.fig-note {
  color: #6c757d;
  margin-bottom: 0.75rem;
}
.figures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.figure-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
}
.figure-card img {
  max-width: 560px;
  width: 100%;
  height: auto;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.figure-caption {
  text-align: center;
  color: #333;
  font-size: 1rem;
}
.figure-attrib {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.35rem;
}
.drill-figure-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  margin: 0.8rem 0;
}
.drill-figure {
  max-width: 420px;
  width: 100%;
  height: auto;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}
.drill-figure-caption {
  font-size: 0.95rem;
  color: #6c757d;
  text-align: center;
  max-width: 420px;
}

/* F6 potting overlay styles */
.figure-with-overlay {
  width: 100%;
}
.figure-image-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 420px;
}
.potting-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.potting-hotspot {
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: 2px solid rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transform: translate(-50%, -50%);
  transition: transform 0.12s, background-color 0.12s, box-shadow 0.12s;
}
.potting-hotspot:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.18);
}
.potting-hotspot .hotspot-label {
  font-size: 0.75rem;
  color: #2c3e50;
  font-weight: 700;
}
.potting-hotspot .hotspot-symbol {
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
}
.potting-hotspot .hotspot-symbol.success {
  color: white;
}
.potting-hotspot .hotspot-symbol.miss {
  color: #c0392b; /* red for miss */
}
.potting-hotspot.success {
  background: #27ae60;
  color: white;
  border-color: #219653;
}
.potting-hotspot.attemptedMiss {
  background: rgba(255,255,255,0.95);
  color: #c0392b;
  border-color: #c0392b;
  box-shadow: inset 0 0 0 2px rgba(192,57,43,0.06);
}
.potting-controls {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
.potting-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.potting-hotspot.editing {
  box-shadow: 0 0 0 3px rgba(52,152,219,0.15);
  border-color: #2980b9;
}
.hotspot-tuner-wrap {
  margin-top: 0.6rem;
}
.hotspot-tuner {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border-radius: 6px;
  background: #f7f9fb;
  border: 1px solid #e0e6ea;
  width: 100%;
}
.tuner-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.4rem;
}
.tuner-label {
  width: 70px;
  font-weight: 700;
  color: #2c3e50;
}
.tuner-controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: wrap;
}
.tuner-controls input {
  width: 70px;
  padding: 0.35rem;
  border: 1px solid #dfe6e9;
  border-radius: 4px;
  text-align: center;
}
.tuner-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
}
.drag-hint {
  margin-left: 0.6rem;
  color: #6c757d;
  font-size: 0.85rem;
}
.potting-input {
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #dfe6e9;
  min-width: 160px;
}
.export-note {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .figure-card img {
    max-width: 100%;
  }
  .drill-figure {
    max-width: 280px;
  }
  .drill-figure-caption {
    max-width: 320px;
  }
}

@media (min-width: 1200px) {
  .drill-figure {
    max-width: 560px;
  }
  .figure-card img {
    max-width: 760px;
  }
  .drill-figure-caption {
    max-width: 560px;
    font-size: 1rem;
  }
}
</style>
