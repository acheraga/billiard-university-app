import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useExamsStore } from "../../src/store/useExamsStore";
import { isPositionDrill } from "../../src/types/exams";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Exam I scoring", () => {
  it("sets final position to 7 when last shot at 6 is success", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[0] as any;
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
    const drill = store.examI.drills[0] as any;
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
    const drill = store.examI.drills[0] as any;
    drill.shots = [7, 7, 7, 4, 4, 4, 4, 4, 4, 4];
    drill.successes = [true, true, true, false, false, false, false, false, false, false];
    drill.loses = Array(10).fill(false);

    store.updateExamIDrill(0);

    expect(drill.bonus).toBe(3);
    expect(drill.score).toBe(10);
  });

  it("sets final position to 7 when last shot at 7 is success (numeric)", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[1];
    // ensure position drill
    if (!isPositionDrill(drill)) throw new Error("Expected position drill");

    drill.shots = Array(10).fill(4);
    drill.successes = Array(10).fill(false);
    drill.loses = Array(10).fill(false);
    drill.shots[9] = 7; // numeric 7
    drill.successes[9] = true;

    store.updateExamIDrill(1);

    // bonus should count the success at 7 -> 1
    expect(drill.bonus).toBe(1);
    // lastPosition should be capped at 7, so score = lastPosition + bonus = 7 + 1 = 8
    expect(drill.score).toBe(8);
  });

  it("sets final position to 7 when last shot at '7' (string) is success", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[2];
    if (!isPositionDrill(drill)) throw new Error("Expected position drill");

    drill.shots = Array(10).fill(4);
    drill.successes = Array(10).fill(false);
    drill.loses = Array(10).fill(false);
    drill.shots[9] = 7; // previously string, use numeric 7 for typing
    drill.successes[9] = true;

    store.updateExamIDrill(2);

    expect(drill.bonus).toBe(1);
    expect(drill.score).toBe(8);
  });

  it("sets final position to 7 when last shot at '7' (string) is success", () => {
    const store = useExamsStore();
    const drill = store.examI.drills[2] as any;
    drill.shots = Array(10).fill(4);
    drill.successes = Array(10).fill(false);
    drill.loses = Array(10).fill(false);
    drill.shots[9] = "7"; // string
    drill.successes[9] = true;

    store.updateExamIDrill(2);

    expect(drill.bonus).toBe(1);
    expect(drill.score).toBe(8);
  });

  it("loadSampleExamI fills drills respecting constraints", () => {
    const store = useExamsStore();
    store.loadSampleExamI();

    // student info set
    expect(store.student.name).toBeTruthy();

    // position drills constraints
    for (let i = 0; i < 5; i++) {
      const d = store.examI.drills[i] as any;
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

  it("persists multiple users and allows switching", () => {
    const store = useExamsStore();
    // start clean
    store.resetAll();

    // Create Alice
    store.student.name = "Alice";
    store.examI.drills[5].score = 4;
    const aliceId = store.createUser("Alice");

    // Create Bob
    store.student.name = "Bob";
    store.examI.drills[5].score = 7;
    const bobId = store.createUser("Bob");

    // Simulate reload by creating a new store instance
    setActivePinia(createPinia());
    const store2 = useExamsStore();
    store2.loadFromLocalStorage();

    const users = store2.listUsers();
    expect(users.some((u) => u.name === "Alice")).toBe(true);
    expect(users.some((u) => u.name === "Bob")).toBe(true);

    // Switch to Alice and check persisted values
    expect(store2.switchUser(aliceId)).toBe(true);
    expect(store2.student.name).toBe("Alice");
    expect(store2.examI.drills[5].score).toBe(4);

    // Switch to Bob and check persisted values
    expect(store2.switchUser(bobId)).toBe(true);
    expect(store2.student.name).toBe("Bob");
    expect(store2.examI.drills[5].score).toBe(7);
  });

  it("can delete a user", () => {
    const store = useExamsStore();
    store.resetAll();
    const id = store.createUser("TempUser");
    expect(store.listUsers().some((u) => u.id === id)).toBe(true);
    expect(store.deleteUser(id)).toBe(true);
    // immediate in-memory check (debug)
    console.log("users after delete:", Object.keys(store.users || {}));
    console.log("users[id]:", store.users[id]);
    expect(store.users[id]).toBeUndefined();
    expect(store.listUsers().some((u) => u.id === id)).toBe(false);
  });
});
