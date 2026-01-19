import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useExamsStore } from "../../src/store/useExamsStore";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Exam I scoring", () => {
  it("sets final position to 7 when last shot at 6 is success", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[0];
    drill.shots = Array(10).fill(4);
    drill.successes = Array(10).fill(false);
    drill.loses = Array(10).fill(false);
    drill.shots[9] = 6;
    drill.successes[9] = true;

    store.updateExamIDrill(0);

    expect(drill.bonus).toBe(0);
    expect(drill.score).toBe(7);
  });

  it("sets final position to 5 when last shot at 6 is miss", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[0];
    drill.shots = Array(10).fill(4);
    drill.successes = Array(10).fill(false);
    drill.loses = Array(10).fill(false);
    drill.shots[9] = 6;
    drill.loses[9] = true;

    store.updateExamIDrill(0);

    expect(drill.bonus).toBe(0);
    expect(drill.score).toBe(5);
  });

  it("counts successes at position 7 for bonus", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[0];
    drill.shots = [7, 7, 7, 4, 4, 4, 4, 4, 4, 4];
    drill.successes = [true, true, true, false, false, false, false, false, false, false];
    drill.loses = Array(10).fill(false);

    store.updateExamIDrill(0);

    expect(drill.bonus).toBe(3);
    expect(drill.score).toBe(10);
  });

  it("loadSampleExamI fills drills respecting constraints", () => {
    const store = useExamsStore();
    store.loadSampleExamI();

    // student info set
    expect(store.student.name).toBeTruthy();

    // position drills constraints
    for (let i = 0; i < 5; i++) {
      const d = store.examI.drills[i];
      expect(d.shots.length).toBe(10);
      expect(d.successes.length).toBe(10);
      expect(d.loses.length).toBe(10);
      expect(d.locked.length).toBe(10);
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(d.maxScore);
      // shots must be in valid range 1..7
      d.shots.forEach((s) => expect(s).toBeGreaterThanOrEqual(1));
      d.shots.forEach((s) => expect(s).toBeLessThanOrEqual(7));
    }

    // counting drills constraints
    expect(store.examI.drills[5].score).toBeLessThanOrEqual(10);
    expect(store.examI.drills[6].score).toBeLessThanOrEqual(20);
    expect(store.examI.drills[7].score).toBeLessThanOrEqual(20);

    expect(store.examI.totalScore).toBe(store.student.examIScore);
  });

  it("loadSampleExamII fills skills respecting constraints", () => {
    const store = useExamsStore();
    store.loadSampleExamII();

    const levels = ["Bachelors", "Masters", "Doctorate"];
    levels.forEach((level) => {
      const skills = store.examII.skills[level];
      skills.forEach((skill) => {
        const calc = store.calculateSkillScore(skill);
        expect(calc).toBeLessThanOrEqual(skill.maxScore);

        if (skill.type === "bestOfTwo") {
          expect(typeof skill.attempt1).toBe("number");
          expect(typeof skill.attempt2).toBe("number");
        } else if (skill.type === "lowestTwoOfThree" || skill.type === "sum") {
          expect(Array.isArray(skill.scores)).toBe(true);
        } else if (skill.type === "median") {
          expect(Array.isArray(skill.breakScores)).toBe(true);
          expect(skill.breakScores.length).toBe(3);
          skill.breakScores.forEach((arr) => expect(arr.length).toBe(5));
        }
      });
    });

    expect(store.examII.currentScore).toBeGreaterThanOrEqual(0);
  });
});
