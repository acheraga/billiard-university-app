import { defineStore } from "pinia";

export const useExamsStore = defineStore("exams", {
  state: () => ({
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
        },
        {
          code: "F7",
          name: "Wagon Wheel",
          type: "counting",
          score: 0,
          maxScore: 20,
          instructions: "Number of hits (max 20)",
        },
        {
          code: "F8",
          name: "Targets",
          type: "counting",
          score: 0,
          maxScore: 20,
          instructions: "Number of hits (max 20)",
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
          { code: "S5", name: "Safe", type: "sum", scores: Array(6).fill(0), maxScore: 6 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(3).fill(0), maxScore: 3 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(3).fill(0), maxScore: 3 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(3).fill(0), maxScore: 3 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(3).fill(0), maxScore: 3 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(0), Array(5).fill(0), Array(5).fill(0)],
            maxScore: 5,
          },
        ],
        Masters: [
          { code: "S1", name: "Line", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 7 },
          { code: "S2", name: "Rail", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 11 },
          { code: "S3", name: "9-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 12 },
          { code: "S4", name: "8-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 12 },
          { code: "S5", name: "Safe", type: "sum", scores: Array(10).fill(0), maxScore: 10 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(5).fill(0), maxScore: 5 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(5).fill(0), maxScore: 5 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(5).fill(0), maxScore: 5 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(5).fill(0), maxScore: 5 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(0), Array(5).fill(0), Array(5).fill(0)],
            maxScore: 5,
          },
        ],
        Doctorate: [
          { code: "S1", name: "Line", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 10 },
          { code: "S2", name: "Rail", type: "bestOfTwo", attempt1: 0, attempt2: 0, maxScore: 15 },
          { code: "S3", name: "9-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 14 },
          { code: "S4", name: "8-ball", type: "lowestTwoOfThree", scores: [0, 0, 0], maxScore: 14 },
          { code: "S5", name: "Safe", type: "sum", scores: Array(14).fill(0), maxScore: 14 },
          { code: "S6", name: "Kick", type: "sum", scores: Array(7).fill(0), maxScore: 7 },
          { code: "S7", name: "Bank", type: "sum", scores: Array(7).fill(0), maxScore: 7 },
          { code: "S8", name: "Elevated", type: "sum", scores: Array(7).fill(0), maxScore: 7 },
          { code: "S9", name: "Jump/Masse", type: "sum", scores: Array(7).fill(0), maxScore: 7 },
          {
            code: "S10",
            name: "Break",
            type: "median",
            breakScores: [Array(5).fill(0), Array(5).fill(0), Array(5).fill(0)],
            maxScore: 5,
          },
        ],
      },
      currentScore: 0,
    },
    history: {
      examI: [],
      examII: [],
    },
    // Multi-user persistence (stored in localStorage under 'billiardUniversityUsers')
    users: {}, // { userId: { student, examI, examII, history, lastSaved } }
    currentUserId: null,
  }),

  getters: {
    getCurrentLevelSkills: (state) => {
      return state.examII.skills[state.examII.currentLevel] || [];
    },
    getTotalScore: (state) => {
      return (state.student.examIScore || 0) + state.examII.currentScore;
    },
  },

  actions: {
    updateExamIDrill(index) {
      const drill = this.examI.drills[index];

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

    incrementDrillScore(index) {
      const drill = this.examI.drills[index];
      if (drill.score < drill.maxScore) {
        drill.score++;
        this.calculateExamIScore();
      }
    },

    decrementDrillScore(index) {
      const drill = this.examI.drills[index];
      if (drill.score > 0) {
        drill.score--;
        this.calculateExamIScore();
      }
    },

    calculateExamIScore() {
      let total = 0;

      // F1-F5: Position drills with bonus
      for (let i = 0; i < 5; i++) {
        const drill = this.examI.drills[i];
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

    getExamIILevel(score) {
      if (score < 50) return "Bachelors";
      if (score < 70) return "Masters";
      return "Doctorate";
    },

    updateExamIISkill(skillIndex, data) {
      const skills = this.examII.skills[this.examII.currentLevel];
      Object.assign(skills[skillIndex], data);
      this.calculateExamIIScore();
    },

    calculateExamIIScore() {
      const skills = this.examII.skills[this.examII.currentLevel];
      let total = 0;

      skills.forEach((skill) => {
        const score = this.calculateSkillScore(skill);
        total += score;
      });

      this.examII.currentScore = total;
      this.saveToLocalStorage();
    },

    calculateSkillScore(skill) {
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
          const sum = (skill.scores || []).reduce((total, score) => total + (score || 0), 0);
          return Math.min(skill.maxScore, sum);
        }

        case "median": {
          const breakSums = (skill.breakScores || [[], [], []]).map((arr) =>
            arr.reduce((total, score) => total + (score || 0), 0)
          );
          breakSums.sort((a, b) => a - b);
          return Math.min(5, breakSums[1] || 0);
        }

        default:
          return 0;
      }
    },

    setExamIILevel(level) {
      this.examII.currentLevel = level;
      this.calculateExamIIScore();
    },

    saveExamI() {
      const entry = {
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

    saveExamII() {
      const skills = this.examII.skills[this.examII.currentLevel];
      const entry = {
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
    resetExamIDrill(index) {
      const drill = this.examI.drills[index];
      if (!drill) return;

      if (drill.type === "position") {
        drill.shots = Array(10).fill(4);
        drill.successes = Array(10).fill(false);
        drill.loses = Array(10).fill(false);
        drill.locked = Array(10).fill(false);
        drill.score = 0;
        drill.bonus = 0;
      } else if (drill.code === "F6") {
        // Reset potting shots specifically
        drill.shots = Array(10).fill(false);
        drill.attempted = Array(10).fill(false);
        drill.score = 0;
      } else {
        drill.score = 0;
      }

      this.calculateExamIScore();
    },



    // Reset potting shots (F6) and attempted flags
    resetPottingShots(drillIndex) {
      const d = this.examI.drills[drillIndex];
      if (!d || d.code !== "F6") return false;
      d.shots = Array(10).fill(false);
      d.attempted = Array(10).fill(false);
      d.score = 0;
      this.calculateExamIScore();
      this.saveToLocalStorage();
      return true;
    },

    // Toggle potting shot success for F6 with sequential enforcement
    togglePottingShot(drillIndex, shotIndex) {
      const d = this.examI.drills[drillIndex];
      if (!d || d.code !== "F6") return false;
      if (!Array.isArray(d.shots)) d.shots = Array(10).fill(false);
      if (!Array.isArray(d.attempted)) d.attempted = Array(10).fill(false);

      // enforce sequence: previous shot must have been attempted
      if (shotIndex > 0 && !d.attempted[shotIndex - 1]) return false;

      if (!d.attempted[shotIndex]) {
        // first time attempt -> mark attempted + success
        d.attempted[shotIndex] = true;
        d.shots[shotIndex] = true;
      } else {
        // already attempted -> toggle between success and miss
        d.shots[shotIndex] = !d.shots[shotIndex];
      }

      // Recalculate potting score
      d.score = Math.min(d.maxScore || 10, d.shots.reduce((s, v) => s + (v ? 1 : 0), 0));
      this.calculateExamIScore();
      this.saveToLocalStorage();
      return true;
    },


    saveStudentInfo(studentData) {
      Object.assign(this.student, studentData);
      this.saveToLocalStorage();
    },

    resetExamI() {
      this.examI.drills.forEach((drill) => {
        if (drill.type === "position") {
          drill.shots = Array(10).fill(4);
          drill.successes = Array(10).fill(false);
          drill.loses = Array(10).fill(false);
          drill.locked = Array(10).fill(false);
        }
        drill.score = 0;
        drill.bonus = 0;
      });
      this.calculateExamIScore();
    },

    resetExamII() {
      const level = this.examII.currentLevel;
      this.examII.skills[level].forEach((skill) => {
        if (skill.type === "bestOfTwo") {
          skill.attempt1 = 0;
          skill.attempt2 = 0;
        } else if (skill.type === "lowestTwoOfThree" || skill.type === "sum") {
          skill.scores = skill.scores.map(() => 0);
        } else if (skill.type === "median") {
          skill.breakScores = [Array(5).fill(0), Array(5).fill(0), Array(5).fill(0)];
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

    loadSampleExamI() {
      // basic student info
      this.student.name = "Sample Student";
      this.student.date = new Date().toISOString().split("T")[0];

      // F1-F5: position drills — ensure 10 shots, valid targets 1..7 and accompanying arrays
      for (let i = 0; i < 5; i++) {
        const d = this.examI.drills[i];
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
      this.examI.drills[0].shots = [7, 7, 7, 7, 6, 6, 5, 4, 3, 2];
      this.examI.drills[0].successes = [
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
      this.examI.drills[1].shots = [6, 6, 6, 5, 5, 4, 4, 4, 3, 2];
      this.examI.drills[1].successes = [
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
      this.examI.drills[2].shots = [7, 7, 6, 6, 5, 5, 4, 4, 4, 3];
      this.examI.drills[2].successes = [
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
      this.examI.drills[3].shots = [5, 5, 4, 4, 4, 3, 3, 3, 2, 1];
      this.examI.drills[3].successes = [
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
      this.examI.drills[4].shots = [7, 7, 7, 6, 6, 5, 4, 4, 4, 4];
      this.examI.drills[4].successes = [
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
      this.examI.drills[6].score = 18; // Wagon wheel max 20
      this.examI.drills[7].score = 15; // Targets max 20

      // Recalculate composite scores/placements
      this.calculateExamIScore();
    },

    loadSampleExamII() {
      // Fill sample data for all levels, respecting maxScore and array lengths
      this.student.name = this.student.name || "Sample Student";
      this.student.date = new Date().toISOString().split("T")[0];

      // Bachelors
      const bachelors = this.examII.skills["Bachelors"];
      bachelors[0].attempt1 = 3;
      bachelors[0].attempt2 = 4;
      bachelors[1].attempt1 = 5;
      bachelors[1].attempt2 = 6;
      bachelors[2].scores = [4, 3, 5];
      bachelors[3].scores = [4, 4, 4];
      bachelors[4].scores = [1, 1, 0, 1, 0, 1];
      bachelors[5].scores = [1, 0, 1];
      bachelors[6].scores = [1, 1, 0];
      bachelors[7].scores = [1, 0, 1];
      bachelors[8].scores = [1, 0, 0];
      bachelors[9].breakScores = [
        [1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0],
      ];

      // Masters
      const masters = this.examII.skills["Masters"];
      masters[0].attempt1 = 6;
      masters[0].attempt2 = 7;
      masters[1].attempt1 = 9;
      masters[1].attempt2 = 10;
      masters[2].scores = [8, 9, 7];
      masters[3].scores = [9, 8, 10];
      masters[4].scores = Array(10).fill(1);
      masters[5].scores = [1, 1, 1, 1, 0];
      masters[6].scores = [1, 1, 1, 0, 0];
      masters[7].scores = [1, 1, 0, 0, 0];
      masters[8].scores = [1, 0, 0, 0, 0];
      masters[9].breakScores = [
        [1, 1, 0, 1, 0],
        [1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1],
      ];

      // Doctorate
      const doctorate = this.examII.skills["Doctorate"];
      doctorate[0].attempt1 = 9;
      doctorate[0].attempt2 = 10;
      doctorate[1].attempt1 = 12;
      doctorate[1].attempt2 = 13;
      doctorate[2].scores = [10, 9, 8];
      doctorate[3].scores = [11, 12, 10];
      doctorate[4].scores = Array(14).fill(1);
      doctorate[5].scores = Array(7).fill(1);
      doctorate[6].scores = Array(7).fill(1);
      doctorate[7].scores = Array(7).fill(1);
      doctorate[8].scores = Array(7).fill(1);
      doctorate[9].breakScores = [Array(5).fill(1), Array(5).fill(1), Array(5).fill(1)];

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
          Object.assign(this.examI, data.examI || {});
          Object.assign(this.examII, data.examII || {});
          Object.assign(this.history, data.history || {});
          this.calculateExamIScore();
          this.calculateExamIIScore();
        } catch (e) {
          console.error("Error loading saved data:", e);
        }
      }
    },

    // Multi-user management
    createUser(name) {
      const id = Date.now().toString();
      const profile = {
        student: { ...this.student, name: name || this.student.name || `User ${id}` },
        examI: JSON.parse(JSON.stringify(this.examI)),
        examII: JSON.parse(JSON.stringify(this.examII)),
        history: JSON.parse(JSON.stringify(this.history)),
        lastSaved: new Date().toISOString(),
      };
      this.users = this.users || {};
      this.users[id] = profile;
      this.currentUserId = id;
      localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      this.saveToLocalStorage();
      return id;
    },

    listUsers() {
      return Object.keys(this.users || {}).map((id) => ({ id, name: this.users[id].student?.name || `User ${id}` }));
    },

    switchUser(id) {
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
      return true;
    },

    saveCurrentUser() {
      if (!this.currentUserId) return false;
      this.users = this.users || {};
      this.users[this.currentUserId] = {
        student: JSON.parse(JSON.stringify(this.student)),
        examI: JSON.parse(JSON.stringify(this.examI)),
        examII: JSON.parse(JSON.stringify(this.examII)),
        history: JSON.parse(JSON.stringify(this.history)),
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem("billiardUniversityUsers", JSON.stringify(this.users));
      localStorage.setItem("billiardUniversityLastActive", this.currentUserId);
      return true;
    },

    deleteUser(id) {
      console.log("deleteUser called for id:", id, "current users:", Object.keys(this.users || {}));
      if (!this.users || !this.users[id]) return false;
      // create a new users object without the target id to ensure clean removal
      const newUsers = {};
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
