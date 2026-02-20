import type {
  BestOfTwoSkill,
  ExamIHistoryEntry,
  ExamIIHistoryEntry,
  ExamIILevel,
  ExamIISkill,
  ExamsState,
  LowestTwoOfThreeSkill,
  MedianSkill,
  PositionDrill,
  Student,
  SumSkill,
  UserListItem,
  UserProfile,
} from "@/types/exams";
import { defineStore } from "pinia";

export const useExamsStore = defineStore("exams", {
  state: (): ExamsState => ({
    student: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      examIScore: null,
      examIILevel: null,
    },
    examI: {
      drills: [
        {
          code: "F1",
          name: "Cut",
          type: "position",
          shots: Array(10).fill(4), // target values 1..7 initialized at 4
          successes: Array(10).fill(false), // success true/false per shot
          loses: Array(10).fill(false), // lose true/false per shot
          locked: Array(10).fill(false), // locked state per shot
          score: 0,
          maxScore: 10,
          bonus: 0,
        },
        {
          code: "F2",
          name: "Stop",
          type: "position",
          shots: Array(10).fill(4),
          successes: Array(10).fill(false),
          loses: Array(10).fill(false),
          locked: Array(10).fill(false),
          score: 0,
          maxScore: 10,
          bonus: 0,
        },
        {
          code: "F3",
          name: "Follow",
          type: "position",
          shots: Array(10).fill(4),
          successes: Array(10).fill(false),
          loses: Array(10).fill(false),
          locked: Array(10).fill(false),
          score: 0,
          maxScore: 10,
          bonus: 0,
        },
        {
          code: "F4",
          name: "Draw",
          type: "position",
          shots: Array(10).fill(4),
          successes: Array(10).fill(false),
          loses: Array(10).fill(false),
          locked: Array(10).fill(false),
          score: 0,
          maxScore: 10,
          bonus: 0,
        },
        {
          code: "F5",
          name: "Stun",
          type: "position",
          shots: Array(10).fill(4),
          successes: Array(10).fill(false),
          loses: Array(10).fill(false),
          locked: Array(10).fill(false),
          score: 0,
          maxScore: 10,
          bonus: 0,
        },
        {
          code: "F6",
          name: "Potting",
          type: "counting",
          score: 0,
          maxScore: 10,
          instructions: "Number of balls pocketed (max 10)",
          attempts: Array.from({ length: 10 }, () => [null]), // single attempt per target (like previous F6)
          // backward-compatible fields used by UI/tests
          shots: Array(10).fill(false),
          attempted: Array(10).fill(false),
        },
        {
          code: "F7",
          name: "Wagon Wheel",
          type: "counting",
          score: 0,
          maxScore: 20,
          instructions: "Two attempts per target (10 targets × 2 = max 20)",
          attempts: Array.from({ length: 10 }, () => Array(2).fill(null)),
        },
        {
          code: "F8",
          name: "Targets",
          type: "counting",
          score: 0,
          maxScore: 20,
          instructions: "Four attempts per target (5 targets × 4 = max 20)",
          attempts: Array.from({ length: 5 }, () => Array(4).fill(null)),
        },
      ],
      totalScore: 0,
      placement: "",
    },
    examII: {
      currentLevel: "Bachelors",
      skills: {
        Bachelors: [
          { code: "S1", name: "Line", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 4 },
          { code: "S2", name: "Rail", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 7 },
          { code: "S3", name: "9-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 10 },
          { code: "S4", name: "8-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 10 },
          { code: "S5", name: "Safe", type: "sum", scores: Array(6).fill(null), maxScore: 6 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(3).fill(null), maxScore: 3 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(3).fill(null), maxScore: 3 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(3).fill(null), maxScore: 3 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(3).fill(null), maxScore: 3 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(null), Array(5).fill(null), Array(5).fill(null)],
            maxScore: 5,
          },
        ],
        Masters: [
          { code: "S1", name: "Line", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 7 },
          { code: "S2", name: "Rail", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 11 },
          { code: "S3", name: "9-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 12 },
          { code: "S4", name: "8-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 12 },
          { code: "S5", name: "Safe", type: "sum", scores: Array(10).fill(null), maxScore: 10 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(5).fill(null), maxScore: 5 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(5).fill(null), maxScore: 5 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(5).fill(null), maxScore: 5 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(5).fill(null), maxScore: 5 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(null), Array(5).fill(null), Array(5).fill(null)],
            maxScore: 5,
          },
        ],
        Doctorate: [
          { code: "S1", name: "Line", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 10 },
          { code: "S2", name: "Rail", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 15 },
          { code: "S3", name: "9-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 14 },
          { code: "S4", name: "8-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 14 },
          { code: "S5", name: "Safe", type: "sum", scores: Array(14).fill(null), maxScore: 14 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(7).fill(null), maxScore: 7 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(7).fill(null), maxScore: 7 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(7).fill(null), maxScore: 7 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(7).fill(null), maxScore: 7 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(null), Array(5).fill(null), Array(5).fill(null)],
            maxScore: 5,
          },
        ],
      },
      currentScore: 0,
    },
    history: {
      examI: [],
      examII: [],
      snapshots: [],
    },
    ui: {
      examI: { currentDrillIndex: 0, showHotspots: false },
      examII: { currentSkillIndex: 0, showPdfPreview: false },
      history: { activeTab: "exam1", isAutosaveActive: false },
    },
    // Multi-user persistence (stored in localStorage under 'billiardUniversityUsers')
    users: {}, // { userId: { student, examI, examII, history, lastSaved } }
    currentUserId: null,
  }),

  getters: {
    getCurrentLevelSkills: (state): ExamIISkill[] => {
      return state.examII.skills[state.examII.currentLevel] || [];
    },
    getTotalScore: (state): number => {
      return (state.student.examIScore || 0) + state.examII.currentScore;
    },
  },

  actions: {
    /**
     * Recalculate the score of a position drill based on successes and failures
     * @param index - Index of the drill in examI.drills (0-7)
     */
    updateExamIDrill(index: number) {
      const drill = this.examI.drills[index] as PositionDrill;

      if (drill.type === "position") {
        // Determine final position based on last attempted shot (success => target+1, miss => target-1)
        let lastPosition = 0;
        let lastAttemptIndex = -1;
        for (let i = 0; i < (drill.successes || []).length; i++) {
          if (drill.successes[i] || (drill.loses && drill.loses[i])) {
            lastAttemptIndex = i;
          }
        }

        if (lastAttemptIndex >= 0) {
          const target = Number(drill.shots[lastAttemptIndex]) || 0;
          if (drill.successes[lastAttemptIndex]) {
            // success: advance one, cap at 7
            lastPosition = Math.min(7, target + 1);
          } else {
            // miss: drop one, min 1
            lastPosition = Math.max(1, target - 1);
          }
        } else {
          // fallback: last successful target value (older behavior)
          for (let i = 0; i < (drill.successes || []).length; i++) {
            if (drill.successes[i]) {
              lastPosition = Number(drill.shots[i]) || lastPosition;
            }
          }
        }

        // Bonus: count number of successful shots at position 7
        let bonus = 0;
        for (let i = 0; i < (drill.successes || []).length; i++) {
          if (drill.successes[i] && Number(drill.shots[i]) === 7) {
            bonus++;
          }
        }

        drill.bonus = bonus;
        // score is lastPosition + bonus, max 10
        const score = Math.min(drill.maxScore || 10, lastPosition + bonus);
        drill.score = score;
      }

      this.calculateExamIScore();
    },

    calculateExamIScore() {
      let total = 0;

      // F1-F5: Position drills with bonus
      for (let i = 0; i < 5; i++) {
        const drill = this.examI.drills[i] as PositionDrill;
        let lastPosition = 0;
        let bonus = 0;

        // Determine final position based on last attempted shot (success => target+1, miss => target-1)
        let lastAttemptIndex = -1;
        for (let j = 0; j < (drill.successes || []).length; j++) {
          if (drill.successes[j] || (drill.loses && drill.loses[j])) {
            lastAttemptIndex = j;
          }
        }

        if (lastAttemptIndex >= 0) {
          const target = Number(drill.shots[lastAttemptIndex]) || 0;
          if (drill.successes[lastAttemptIndex]) {
            lastPosition = Math.min(7, target + 1);
          } else {
            lastPosition = Math.max(1, target - 1);
          }
        } else {
          // fallback to last successful target
          for (let j = 0; j < (drill.successes || []).length; j++) {
            if (drill.successes[j]) {
              lastPosition = Number(drill.shots[j]) || lastPosition;
            }
          }
        }

        // Bonus: count number of successful shots at position 7
        bonus = 0;
        for (let j = 0; j < (drill.successes || []).length; j++) {
          if (drill.successes[j] && Number(drill.shots[j]) === 7) {
            bonus++;
          }
        }

        const score = Math.min(10, lastPosition + bonus);
        drill.score = score;
        total += score;
      }

      // F6: Potting
      this.examI.drills[5].score = Math.min(10, this.examI.drills[5].score);
      total += this.examI.drills[5].score;

      // F7: Wagon wheel
      this.examI.drills[6].score = Math.min(20, this.examI.drills[6].score);
      total += this.examI.drills[6].score;

      // F8: Targets
      this.examI.drills[7].score = Math.min(20, this.examI.drills[7].score);
      total += this.examI.drills[7].score;

      this.examI.totalScore = total;
      this.examI.placement = this.getExamIILevel(total);
      this.student.examIScore = total;
      this.student.examIILevel = this.examI.placement;
      this.saveToLocalStorage();
    },

    /**
     * Determine the Exam II level based on the Exam I score
     * @param score - Total Exam I score (0-100)
     * @returns Recommended level: Bachelors, Masters, or Doctorate
     */
    getExamIILevel(score: number): ExamIILevel {
      if (score < 50) return "Bachelors";
      if (score < 70) return "Masters";
      return "Doctorate";
    },

    updateExamIISkill(skillIndex: number, data: Partial<ExamIISkill>) {
      const skills = this.examII.skills[this.examII.currentLevel];
      Object.assign(skills[skillIndex], data);
      this.calculateExamIIScore();
    },

    calculateExamIIScore() {
      const skills = this.examII.skills[this.examII.currentLevel];
      let total = 0;

      /**
       * Calculate the score for an individual skill according to its type
       * @param skill - The skill to calculate (BestOfTwo, LowestTwoOfThree, Sum, or Median)
       * @returns Calculated score, clamped to the skill's maxScore
       */
      skills.forEach((skill) => {
        const score = this.calculateSkillScore(skill);
        total += score;
      });

      this.examII.currentScore = total;
      this.saveToLocalStorage();
    },

    calculateSkillScore(skill: ExamIISkill): number {
      if (!skill) return 0;

      switch (skill.type) {
        case "bestOfTwo": {
          const attempt1 = skill.attempt1 || 0;
          const attempt2 = skill.attempt2 || 0;
          return Math.min(skill.maxScore, Math.max(attempt1, attempt2));
        }

        case "lowestTwoOfThree": {
          const scores = [...(skill.scores || [0, 0, 0])].sort((a, b) => a - b);
          return Math.min(skill.maxScore, scores[0] + scores[1]);
        }

        case "sum": {
          const sum = (skill.scores || []).reduce(
            (total: number, score) => total + (score || 0),
            0
          );
          return Math.min(skill.maxScore, sum);
        }

        case "median": {
          const breakSums = (skill.breakScores || [[], [], []]).map((arr) =>
            arr.reduce((total: number, score) => total + (score || 0), 0)
          );
          /**
           * Change le niveau actif de l'Exam II
           * @param level - Nouveau niveau: Bachelors, Masters, ou Doctorate
           */
          breakSums.sort((a: number, b: number) => a - b);
          return Math.min(5, breakSums[1] || 0);
        }

        default:
          /**
           * Save current Exam I state to history
           * @returns The history entry created
           */
          return 0;
      }
    },

    setExamIILevel(level: ExamIILevel) {
      this.examII.currentLevel = level;
      this.calculateExamIIScore();
    },

    saveExamI(): ExamIHistoryEntry {
      const entry: ExamIHistoryEntry = {
        /**
         * Save the current Exam I state to history
         * @returns The history entry created
         */
        date: this.student.date || new Date().toISOString().split("T")[0],
        studentName: this.student.name,
        scores: this.examI.drills.map((d) => d.score),
        total: this.examI.totalScore,
        level: this.examI.placement,
      };

      this.history.examI.push(entry);
      this.saveToLocalStorage();

      return entry;
    },

    saveExamII(): ExamIIHistoryEntry {
      const skills = this.examII.skills[this.examII.currentLevel];
      const entry: ExamIIHistoryEntry = {
        date: this.student.date || new Date().toISOString().split("T")[0],
        studentName: this.student.name,
        level: this.examII.currentLevel,
        scores: skills.map((s) => this.calculateSkillScore(s)),
        total: this.examII.currentScore,
      };

      this.history.examII.push(entry);
      this.saveToLocalStorage();

      return entry;
    },

    // Reset a single drill (local reset for a fragment)
    resetExamIDrill(index: number) {
      const drill = this.examI.drills[index];
      if (!drill) return;

      // Increment reset version to force Vue re-render
      const d: any = drill;
      d._resetVersion = (d._resetVersion || 0) + 1;

      if (drill.type === "position") {
        drill.shots = Array(10).fill(4);
        drill.successes = Array(10).fill(false);
        drill.loses = Array(10).fill(false);
        drill.locked = Array(10).fill(false);
        drill.score = 0;
        drill.bonus = 0;
      } else if (drill.type === "counting") {
        const attemptsPerTarget = d.code === "F7" ? 2 : d.code === "F8" ? 4 : 1;
        const targetsCount = d.code === "F8" ? 5 : 10;

        // Create new attempts array - ensure Vue reactivity by rebuilding from scratch
        const newAttempts = Array.from({ length: targetsCount }, () =>
          Array(attemptsPerTarget).fill(null)
        );
        d.attempts = newAttempts;

        d.score = 0;
        // keep F6 compat fields reset when using drill-level reset
        if (d.code === "F6") {
          d.shots = Array(10).fill(false);
          d.attempted = Array(10).fill(false);
        }
      } else {
        (drill as any).score = 0;
      }

      this.calculateExamIScore();
      this.saveToLocalStorage();
    },

    // Reset potting shots (F6) and attempted flags
    resetPottingShots(drillIndex: number): boolean {
      // keep name for backward compat: reset any counting drill's attempts
      const d = this.examI.drills[drillIndex] as any;
      if (!d || d.type !== "counting") return false;
      const attemptsPerTarget = d.code === "F7" ? 2 : d.code === "F8" ? 4 : 1;
      const targetsCount = d.code === "F8" ? 5 : 10;
      d.attempts = Array.from({ length: targetsCount }, () => Array(attemptsPerTarget).fill(null));
      d.score = 0;
      // keep F6 compatibility
      if (d.code === "F6") {
        d.shots = Array(10).fill(false);
        d.attempted = Array(10).fill(false);
      }
      this.calculateExamIScore();
      this.saveToLocalStorage();
      return true;
    },

    // Toggle potting shot success for F6 with sequential enforcement
    togglePottingShot(drillIndex: number, shotIndex: number): boolean {
      // legacy helper for single-attempt counting drills (F6)
      return this.toggleCountingAttempt(drillIndex, shotIndex, 0);
    },

    toggleCountingAttempt(drillIndex: number, targetIndex: number, attemptIndex: number): boolean {
      const d = this.examI.drills[drillIndex] as any;
      if (!d || d.type !== "counting") return false;

      // initialize attempts matrix if missing
      if (!Array.isArray(d.attempts)) {
        const attemptsPerTarget = d.code === "F7" ? 2 : d.code === "F8" ? 4 : 1;
        const targetsCount = d.code === "F8" ? 5 : 10;
        d.attempts = Array.from({ length: targetsCount }, () =>
          Array(attemptsPerTarget).fill(null)
        );
      }

      const attempts: (boolean | null)[][] = d.attempts;
      if (
        !attempts[targetIndex] ||
        attemptIndex < 0 ||
        attemptIndex >= attempts[targetIndex].length
      )
        return false;

      // determine previous attempt (flattened sequential enforcement)
      const prev = (t: number, a: number) => {
        if (a > 0) return { t, a: a - 1 };
        if (t > 0) return { t: t - 1, a: attempts[t - 1].length - 1 };
        return null;
      };

      const p = prev(targetIndex, attemptIndex);
      if (p) {
        if (attempts[p.t][p.a] === null) return false; // previous attempt not done
      }

      if (attempts[targetIndex][attemptIndex] === null) {
        // first attempt -> mark attempted + success
        attempts[targetIndex][attemptIndex] = true;
      } else {
        // already attempted -> toggle success/miss
        attempts[targetIndex][attemptIndex] = !attempts[targetIndex][attemptIndex];
      }

      // recalculate counting score: sum of all successful attempts
      let count = 0;
      for (let t = 0; t < attempts.length; t++) {
        for (let a = 0; a < attempts[t].length; a++) {
          if (attempts[t][a]) count++;
        }
      }
      d.score = Math.min(d.maxScore || 0, count);

      // Maintain backward-compatible F6 fields if needed
      if (d.code === "F6") {
        d.shots = attempts.map((a) => a[0] === true);
        d.attempted = attempts.map((a) => a[0] !== null);
      }

      this.calculateExamIScore();
      this.saveToLocalStorage();
      return true;
    },

    saveStudentInfo(studentData: Partial<Student>) {
      Object.assign(this.student, studentData);
      this.saveToLocalStorage();
    },

    resetExamI() {
      this.examI.drills.forEach((drill) => {
        // Increment reset version to force Vue re-render
        const d: any = drill;
        d._resetVersion = (d._resetVersion || 0) + 1;

        if (drill.type === "position") {
          drill.shots = Array(10).fill(4);
          drill.successes = Array(10).fill(false);
          drill.loses = Array(10).fill(false);
          drill.locked = Array(10).fill(false);
          drill.bonus = 0;
        } else if (drill.type === "counting") {
          const attemptsPerTarget = d.code === "F7" ? 2 : d.code === "F8" ? 4 : 1;
          const targetsCount = d.code === "F8" ? 5 : 10;
          // Reset counting drill attempts with proper reactivity
          d.attempts = Array.from({ length: targetsCount }, () =>
            Array(attemptsPerTarget).fill(null)
          );
          // Reset F6 compat fields
          if (d.code === "F6") {
            d.shots = Array(10).fill(false);
            d.attempted = Array(10).fill(false);
          }
        }
        drill.score = 0;
      });
      this.calculateExamIScore();
      this.saveToLocalStorage();
    },

    resetExamII() {
      const level = this.examII.currentLevel;
      this.examII.skills[level].forEach((skill) => {
        if (skill.type === "bestOfTwo") {
          skill.attempt1 = 0;
          skill.attempt2 = 0;
        } else if (skill.type === "lowestTwoOfThree") {
          skill.scores = skill.scores.map(() => 0);
        } else if (skill.type === "sum") {
          skill.scores = skill.scores.map(() => 0);
        } else if (skill.type === "median") {
          skill.breakScores = [
            Array(5).fill(null) as (number | null)[],
            Array(5).fill(null) as (number | null)[],
            Array(5).fill(null) as (number | null)[],
          ];
        }
      });
      this.calculateExamIIScore();
    },

    resetAll() {
      this.resetExamI();
      this.resetExamII();
      this.history.examI = [];
      this.history.examII = [];
      this.student = {
        name: "",
        date: new Date().toISOString().split("T")[0],
        examIScore: null,
        examIILevel: null,
      };
      localStorage.removeItem("billiardUniversityData");
    },

    clearAllLocalStorage() {
      /**
       * Completely clear all localStorage data for this application.
       * This will remove all user profiles, exam data, and settings.
       * The page will need to be refreshed to reinitialize.
       */
      localStorage.removeItem("billiardUniversityUsers");
      localStorage.removeItem("billiardUniversityLastActive");
      localStorage.removeItem("billiardUniversityData");
      // Clear all state
      this.resetAll();
    },

    loadSampleExamI() {
      // basic student info
      this.student.name = "Sample Student";
      this.student.date = new Date().toISOString().split("T")[0];

      // F1-F5: position drills — ensure 10 shots, valid targets 1..7 and accompanying arrays
      for (let i = 0; i < 5; i++) {
        const d = this.examI.drills[i] as PositionDrill;
        if (!d) continue;

        // provide sensible default sequence if not present
        if (!Array.isArray(d.shots) || d.shots.length < 10) d.shots = Array(10).fill(4);
        if (!Array.isArray(d.successes) || d.successes.length < 10)
          d.successes = Array(10).fill(false);
        if (!Array.isArray(d.loses) || d.loses.length < 10) d.loses = Array(10).fill(false);
        if (!Array.isArray(d.locked) || d.locked.length < 10) d.locked = Array(10).fill(false);

        // clamp shot values to [1,7]
        d.shots = d.shots.slice(0, 10).map((s) => {
          const n = Number(s) || 4;
          return Math.max(1, Math.min(7, n));
        });

        // make sure booleans are booleans
        d.successes = d.successes.slice(0, 10).map((v) => !!v);
        d.loses = d.loses.slice(0, 10).map((v) => !!v);
        d.locked = d.locked.slice(0, 10).map((v) => !!v);
      }

      // Provide a concrete sample pattern for readability
      (this.examI.drills[0] as PositionDrill).shots = [7, 7, 7, 7, 6, 6, 5, 4, 3, 2];
      (this.examI.drills[0] as PositionDrill).successes = [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
      ];
      (this.examI.drills[1] as PositionDrill).shots = [6, 6, 6, 5, 5, 4, 4, 4, 3, 2];
      (this.examI.drills[1] as PositionDrill).successes = [
        true,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      (this.examI.drills[2] as PositionDrill).shots = [7, 7, 6, 6, 5, 5, 4, 4, 4, 3];
      (this.examI.drills[2] as PositionDrill).successes = [
        true,
        true,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
      ];
      (this.examI.drills[3] as PositionDrill).shots = [5, 5, 4, 4, 4, 3, 3, 3, 2, 1];
      (this.examI.drills[3] as PositionDrill).successes = [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      (this.examI.drills[4] as PositionDrill).shots = [7, 7, 7, 6, 6, 5, 4, 4, 4, 4];
      (this.examI.drills[4] as PositionDrill).successes = [
        true,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
      ];

      // F6-F8: counting drills — ensure values within max
      this.examI.drills[5].score = 10; // Potting max 10
      // keep F6 attempts/shots consistent with sample (all successes)
      const f6: any = this.examI.drills[5];
      f6.attempts = Array.from({ length: 10 }, () => [true]);
      f6.shots = Array(10).fill(true);
      f6.attempted = Array(10).fill(true);

      this.examI.drills[6].score = 18; // Wagon wheel max 20
      // sample pattern: fill some attempts for F7
      const f7: any = this.examI.drills[6];
      f7.attempts = Array.from({ length: 10 }, () => Array(2).fill(null));
      // set a couple of successes
      f7.attempts[0][0] = true;
      f7.attempts[0][1] = true;
      f7.score = f7.attempts.flat().filter(Boolean).length;

      this.examI.drills[7].score = 15; // Targets max 20
      // sample pattern for F8
      const f8: any = this.examI.drills[7];
      f8.attempts = Array.from({ length: 5 }, () => Array(4).fill(null));
      f8.attempts[0][0] = true;
      f8.attempts[0][1] = true;
      f8.attempts[0][2] = true;
      f8.attempts[0][3] = false;
      f8.score = f8.attempts.flat().filter(Boolean).length;

      // Recalculate composite scores/placements
      this.calculateExamIScore();
    },

    loadSampleExamII() {
      // Fill sample data for all levels, respecting maxScore and array lengths
      this.student.name = this.student.name || "Sample Student";
      this.student.date = new Date().toISOString().split("T")[0];

      // Bachelors
      const bachelors = this.examII.skills["Bachelors"];
      (bachelors[0] as BestOfTwoSkill).attempt1 = 3;
      (bachelors[0] as BestOfTwoSkill).attempt2 = 4;
      (bachelors[1] as BestOfTwoSkill).attempt1 = 5;
      (bachelors[1] as BestOfTwoSkill).attempt2 = 6;
      (bachelors[2] as LowestTwoOfThreeSkill).scores = [4, 3, 5];
      (bachelors[3] as LowestTwoOfThreeSkill).scores = [4, 4, 4];
      (bachelors[4] as SumSkill).scores = [1, 1, 0, 1, 0, 1];
      (bachelors[5] as SumSkill).scores = [1, 0, 1];
      (bachelors[6] as SumSkill).scores = [1, 1, 0];
      (bachelors[7] as SumSkill).scores = [1, 0, 1];
      (bachelors[8] as SumSkill).scores = [1, 0, 0];
      (bachelors[9] as MedianSkill).breakScores = [
        [1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0],
      ];

      // Masters
      const masters = this.examII.skills["Masters"];
      (masters[0] as BestOfTwoSkill).attempt1 = 6;
      (masters[0] as BestOfTwoSkill).attempt2 = 7;
      (masters[1] as BestOfTwoSkill).attempt1 = 9;
      (masters[1] as BestOfTwoSkill).attempt2 = 10;
      (masters[2] as LowestTwoOfThreeSkill).scores = [8, 9, 7];
      (masters[3] as LowestTwoOfThreeSkill).scores = [9, 8, 10];
      (masters[4] as SumSkill).scores = Array(10).fill(1);
      (masters[5] as SumSkill).scores = [1, 1, 1, 1, 0];
      (masters[6] as SumSkill).scores = [1, 1, 1, 0, 0];
      (masters[7] as SumSkill).scores = [1, 1, 0, 0, 0];
      (masters[8] as SumSkill).scores = [1, 0, 0, 0, 0];
      (masters[9] as MedianSkill).breakScores = [
        [1, 1, 0, 1, 0],
        [1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1],
      ];

      // Doctorate
      const doctorate = this.examII.skills["Doctorate"];
      (doctorate[0] as BestOfTwoSkill).attempt1 = 9;
      (doctorate[0] as BestOfTwoSkill).attempt2 = 10;
      (doctorate[1] as BestOfTwoSkill).attempt1 = 12;
      (doctorate[1] as BestOfTwoSkill).attempt2 = 13;
      (doctorate[2] as LowestTwoOfThreeSkill).scores = [10, 9, 8];
      (doctorate[3] as LowestTwoOfThreeSkill).scores = [11, 12, 10];
      (doctorate[4] as SumSkill).scores = Array(14).fill(1);
      (doctorate[5] as SumSkill).scores = Array(7).fill(1);
      (doctorate[6] as SumSkill).scores = Array(7).fill(1);
      (doctorate[7] as SumSkill).scores = Array(7).fill(1);
      (doctorate[8] as SumSkill).scores = Array(7).fill(1);
      (doctorate[9] as MedianSkill).breakScores = [
        Array(5).fill(1),
        Array(5).fill(1),
        Array(5).fill(1),
      ];

      // Default to Masters (existing behaviour) but all levels are populated
      this.setExamIILevel("Masters");

      this.calculateExamIIScore();
    },

    saveToLocalStorage() {
      const data = {
        student: this.student,
        examI: this.examI,
        examII: this.examII,
        history: this.history,
        ui: this.ui,
        lastSaved: new Date().toISOString(),
      };

      // If a current user is selected, persist into the users map
      if (this.currentUserId) {
        this.users = this.users || {};
        this.users[this.currentUserId] = JSON.parse(JSON.stringify(data));
        localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
        localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      } else {
        // legacy single-user storage (fallback)
        localStorage.setItem("billiardUniversityData", JSON.stringify(data));
      }
    },

    loadFromLocalStorage() {
      // Multi-user storage first
      const usersRaw = localStorage.getItem("billiardUniversityUsers");
      const lastActive = localStorage.getItem("billiardUniversityLastActive");
      if (usersRaw) {
        try {
          const users = JSON.parse(usersRaw) || {};
          this.users = users;

          if (lastActive && this.users[lastActive]) {
            this.currentUserId = lastActive;
            const data = this.users[lastActive];
            Object.assign(this.student, data.student || {});
            Object.assign(this.examI, data.examI || {});
            Object.assign(this.examII, data.examII || {});
            Object.assign(this.history, data.history || {});
          } else {
            const ids = Object.keys(this.users);
            if (ids.length > 0) {
              this.currentUserId = ids[0];
              const data = this.users[this.currentUserId];
              Object.assign(this.student, data.student || {});
              Object.assign(this.examI, data.examI || {});
              Object.assign(this.examII, data.examII || {});
              Object.assign(this.history, data.history || {});
            }
          }

          this.calculateExamIScore();
          this.calculateExamIIScore();
          // start realtime autosave by default when loading saved data
          try {
            this.startRealtimeAutosave();
          } catch (e) {
            /* ignore */
          }
        } catch (e) {
          console.error("Error loading saved users data:", e);
        }
        return;
      }

      // Fallback to legacy single-user storage
      const saved = localStorage.getItem("billiardUniversityData");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          Object.assign(this.student, data.student || {});
          /**
           * Crée un nouveau profil utilisateur avec les données actuelles
           * @param name - Nom de l'utilisateur (optionnel)
           * @returns ID du nouvel utilisateur créé
           */
          Object.assign(this.examI, data.examI || {});
          Object.assign(this.examII, data.examII || {});
          Object.assign(this.history, data.history || {});
          // merge or create ui state safely
          this.ui = Object.assign(this.ui || {}, data.ui || {});
          this.calculateExamIScore();
          this.calculateExamIIScore();
          // enable autosave by default for legacy loads as well or according to saved UI
          try {
            if (this.ui && this.ui.history && this.ui.history.isAutosaveActive) {
              this.startRealtimeAutosave();
            }
          } catch (e) {
            /* ignore */
          }
        } catch (e) {
          console.error("Error loading saved data:", e);
        }
      }
    },

    // Multi-user management
    createUser(name?: string): string {
      const id = Date.now().toString();
      const profile = {
        student: { ...this.student, name: name || this.student.name || `User ${id}` },
        examI: JSON.parse(JSON.stringify(this.examI)),
        /**
         * Liste tous les utilisateurs enregistrés
         * @returns Tableau d'objets contenant id et name de chaque utilisateur
         */
        examII: JSON.parse(JSON.stringify(this.examII)),
        history: JSON.parse(JSON.stringify(this.history)),
        ui: JSON.parse(JSON.stringify(this.ui || {})),
        lastSaved: new Date().toISOString(),
      };
      /**
       * Change l'utilisateur actif et charge ses données
       * @param id - ID de l'utilisateur à charger
       * @returns true si succès, false si utilisateur non trouvé
       */
      this.users = this.users || {};
      this.users[id] = profile;
      this.currentUserId = id;
      localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      this.saveToLocalStorage();
      return id;
    },

    listUsers(): UserListItem[] {
      return Object.keys(this.users || {}).map((id) => ({
        id,
        name: this.users[id].student?.name || `User ${id}`,
      }));
    },

    /**
     * Sauvegarde les données de l'utilisateur actuel dans localStorage
     * @returns true si succès, false si aucun utilisateur actif
     */
    switchUser(id: string): boolean {
      if (!this.users || !this.users[id]) return false;
      const data = this.users[id];
      this.currentUserId = id;
      Object.assign(this.student, JSON.parse(JSON.stringify(data.student || {})));
      Object.assign(this.examI, JSON.parse(JSON.stringify(data.examI || {})));
      Object.assign(this.examII, JSON.parse(JSON.stringify(data.examII || {})));
      Object.assign(this.history, JSON.parse(JSON.stringify(data.history || {})));
      localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      this.calculateExamIScore();
      this.calculateExamIIScore();
      /**
       * Supprime définitivement un utilisateur
       * Si l'utilisateur supprimé est actif, bascule vers un autre utilisateur ou réinitialise
       * @param id - ID de l'utilisateur à supprimer
       * @returns true si succès, false si utilisateur non trouvé
       */
      return true;
    },

    saveCurrentUser(): boolean {
      if (!this.currentUserId) return false;
      this.users = this.users || {};
      this.users[this.currentUserId] = {
        student: JSON.parse(JSON.stringify(this.student)),
        examI: JSON.parse(JSON.stringify(this.examI)),
        examII: JSON.parse(JSON.stringify(this.examII)),
        history: JSON.parse(JSON.stringify(this.history)),
        ui: JSON.parse(JSON.stringify(this.ui || {})),
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      return true;
    },

    deleteUser(id: string): boolean {
      console.log("deleteUser called for id:", id, "current users:", Object.keys(this.users || {}));
      if (!this.users || !this.users[id]) return false;
      // create a new users object without the target id to ensure clean removal
      const newUsers: Record<string, UserProfile> = {};
      for (const [k, v] of Object.entries(this.users)) {
        if (String(k) !== String(id)) {
          newUsers[k] = v;
        }
      }
      this.users = newUsers;
      console.log("after deletion users:", Object.keys(this.users || {}));

      // update storage; if empty, remove the key
      if (Object.keys(this.users).length === 0) {
        localStorage.removeItem("billiardUniversityUsers");
        localStorage.removeItem("billiardUniversityLastActive");
      } else {
        localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      }

      if (this.currentUserId === id) {
        const ids = Object.keys(this.users);
        if (ids.length > 0) {
          // switch to the first remaining user (this will persist the new current user)
          this.switchUser(ids[0]);
        } else {
          // clear currentUserId first to avoid re-persisting the deleted user
          this.currentUserId = null;
          this.resetAll();
        }
      }

      // Persist the change (if any remaining users, switchUser will have persisted already)
      if (Object.keys(this.users || {}).length > 0) {
        localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      } else {
        localStorage.removeItem("billiardUniversityUsers");
        localStorage.removeItem("billiardUniversityLastActive");
      }

      return true;
    },

    /**
     * Create a full snapshot of the current app state and add it to history.snapshots
     * @param label - Optional label for the snapshot
     */
    createSnapshot(label?: string) {
      const id = Date.now().toString();
      const snapshot = {
        id,
        date: new Date().toISOString(),
        label: label || `Snapshot ${new Date().toLocaleString()}`,
        version: 1,
        data: {
          student: JSON.parse(JSON.stringify(this.student)),
          examI: JSON.parse(JSON.stringify(this.examI)),
          examII: JSON.parse(JSON.stringify(this.examII)),
          history: {
            examI: JSON.parse(JSON.stringify(this.history.examI || [])),
            examII: JSON.parse(JSON.stringify(this.history.examII || [])),
          },
        },
      };

      this.history.snapshots = this.history.snapshots || [];
      // keep most recent first
      this.history.snapshots.unshift(snapshot);
      // cap snapshots to 100 entries to bound storage
      if (this.history.snapshots.length > 100) this.history.snapshots.splice(100);
      this.saveToLocalStorage();
      return snapshot;
    },

    /**
     * Restore the application state from a snapshot id
     * @param id - Snapshot id to restore
     */
    restoreSnapshot(id: string): boolean {
      if (!this.history.snapshots || this.history.snapshots.length === 0) return false;
      const snap = this.history.snapshots.find((s: any) => s.id === id);
      if (!snap) return false;

      // Replace core state with snapshot data
      Object.assign(this.student, JSON.parse(JSON.stringify(snap.data.student || {})));
      Object.assign(this.examI, JSON.parse(JSON.stringify(snap.data.examI || {})));
      Object.assign(this.examII, JSON.parse(JSON.stringify(snap.data.examII || {})));

      // Replace history entries but preserve snapshots themselves
      this.history.examI = JSON.parse(JSON.stringify(snap.data.history.examI || []));
      this.history.examII = JSON.parse(JSON.stringify(snap.data.history.examII || []));

      // Recalculate derived scores/placements
      this.calculateExamIScore();
      this.calculateExamIIScore();

      this.saveToLocalStorage();
      return true;
    },

    deleteSnapshot(id: string): boolean {
      if (!this.history.snapshots) return false;
      const idx = this.history.snapshots.findIndex((s: any) => s.id === id);
      if (idx === -1) return false;
      this.history.snapshots.splice(idx, 1);
      this.saveToLocalStorage();
      return true;
    },

    // Realtime autosave: uses Pinia $subscribe to capture state mutations and create debounced snapshots
    startRealtimeAutosave(debounceMs = 500) {
      // store unsub in a module-scoped variable so multiple calls are idempotent
      // @ts-ignore
      if ((this as any)._realtimeAutosaveUnsub) return;

      let timer: ReturnType<typeof setTimeout> | null = null;
      // @ts-ignore
      (this as any)._realtimeAutosaveUnsub = this.$subscribe(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          this.createSnapshot("Auto save");
        }, debounceMs);
      });
    },

    stopRealtimeAutosave() {
      // @ts-ignore
      const unsub = (this as any)._realtimeAutosaveUnsub;
      if (typeof unsub === "function") {
        unsub();
        // @ts-ignore
        (this as any)._realtimeAutosaveUnsub = null;
      }
    },

    manualSaveSnapshot(label?: string) {
      return this.createSnapshot(label);
    },

    exportToExcel() {
      const data = {
        student: this.student,
        examI: this.examI,
        examII: this.examII,
        history: this.history,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `billiard-university-${new Date().toISOString().split("T")[0]}.json`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      alert("Data exported as JSON. For Excel format, install xlsx library.");
    },
  },
});
