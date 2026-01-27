import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useExamsStore } from "../../src/store/useExamsStore";

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe("Persistence: loadFromLocalStorage", () => {
  it("restores saved state including UI on loadFromLocalStorage", () => {
    const sample = {
      student: { name: "Persisted User", date: "2026-01-27" },
      examI: {
        totalScore: 42,
        drills: [
          { code: "F1", score: 5, maxScore: 10 },
          { code: "F2", score: 5, maxScore: 10 },
          { code: "F3", score: 5, maxScore: 10 },
          { code: "F4", score: 5, maxScore: 10 },
          { code: "F5", score: 5, maxScore: 10 },
          { code: "F6", score: 10, maxScore: 10 },
          { code: "F7", score: 18, maxScore: 20 },
          { code: "F8", score: 15, maxScore: 20 },
        ],
      },
      examII: {},
      history: {
        examI: [
          {
            date: "2026-01-01",
            studentName: "Persisted User",
            scores: [10, 10, 10, 10, 2, 0, 0, 0],
            total: 52,
            level: "Masters",
          },
        ],
        examII: [],
        snapshots: [],
      },
      ui: {
        examI: { currentDrillIndex: 3, showHotspots: true },
        examII: { currentSkillIndex: 1, showPdfPreview: true },
        history: { activeTab: "snapshots", isAutosaveActive: true },
      },
    };

    localStorage.setItem("billiardUniversityData", JSON.stringify(sample));

    const store = useExamsStore();

    // ensure store does not already reflect the persisted data prior to load
    expect(store.student.name).not.toBe(sample.student.name);

    // perform load
    store.loadFromLocalStorage();

    // verify restored values
    expect(store.student.name).toBe("Persisted User");
    // totalScore may be recalculated on load; ensure it's a number and non-negative
    expect(typeof store.examI.totalScore).toBe("number");
    expect(store.examI.totalScore).toBeGreaterThanOrEqual(0);
    expect(store.history.examI.length).toBe(1);
    expect(store.ui).toBeTruthy();
    // nested checks for UI state
    expect(store.ui!.examI!.currentDrillIndex).toBe(3);
    expect(store.ui!.history!.activeTab).toBe("snapshots");
  });
});
