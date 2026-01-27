import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import ExamI from "../../src/components/ExamI.vue";
import { useExamsStore } from "../../src/store/useExamsStore";
import { isCountingDrill } from "../../src/types/exams";

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe("ExamI F6 potting overlay", () => {
  it("renders 10 hotspots and toggles on click", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();

    // reset F6
    store.resetPottingShots(5);
    await nextTick();

    // navigate to F6 (index 5) using carousel next button
    const nextBtn = wrapper.find(".next-btn");
    for (let i = 0; i < 5; i++) {
      await nextBtn.trigger("click");
      await nextTick();
    }
    const f6Card = wrapper.find(".drill-card");
    if (!f6Card.exists()) throw new Error("Expected F6 drill card to exist");
    const hotspots = f6Card.findAll(".potting-shot-btn");
    expect(hotspots.length).toBe(10);

    // ensure drill is counting type and alias it
    const drill = store.examI.drills[5];
    if (!isCountingDrill(drill)) throw new Error("Expected F6 to be a counting drill");
    const f6 = drill;
    // ensure arrays are present
    if (!f6.shots || !f6.attempted)
      throw new Error("Expected shots and attempted arrays to be present on F6");

    // Click first hotspot
    await hotspots[0].trigger("click");
    await nextTick();
    await nextTick();

    expect(f6.shots[0]).toBe(true);
    expect(f6.score).toBe(1);
    expect(hotspots[0].classes()).toContain("success");

    // Click second hotspot
    await hotspots[1].trigger("click");
    await nextTick();
    await nextTick();

    expect(f6.shots[1]).toBe(true);
    expect(f6.score).toBe(2);
  });

  it("toggles hotspot via keyboard (Enter)", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    // show F6 directly in the test
    (wrapper.vm as any).currentDrillIndex = 5;
    await nextTick();
    const f6Card = wrapper.find(".drill-card");
    if (!f6Card.exists()) throw new Error("Expected F6 drill card to exist");
    const hotspots = f6Card.findAll(".potting-shot-btn");
    await hotspots[0].trigger("keydown", { key: "Enter" });
    await nextTick();

    const drill = store.examI.drills[5];
    if (!isCountingDrill(drill)) throw new Error("Expected F6 to be a counting drill");
    const f6 = drill;
    if (!f6.shots || !f6.attempted)
      throw new Error("Expected shots and attempted arrays to be present on F6");

    expect(f6.shots[0]).toBe(true);
    expect(f6.score).toBe(1);
    expect(hotspots[0].classes()).toContain("success");
  });

  it("reset button clears pattern", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    // navigate to F6 (index 5) using carousel next button
    const nextBtn = wrapper.find(".next-btn");
    for (let i = 0; i < 5; i++) {
      await nextBtn.trigger("click");
      await nextTick();
    }
    const f6Card = wrapper.find(".drill-card");
    if (!f6Card.exists()) throw new Error("Expected F6 drill card to exist");
    const hotspots = f6Card.findAll(".potting-shot-btn");
    await hotspots[0].trigger("click");
    await hotspots[1].trigger("click");
    await nextTick();
    await nextTick();

    const drill = store.examI.drills[5];
    if (!isCountingDrill(drill)) throw new Error("Expected F6 to be a counting drill");
    const f6 = drill;

    expect(f6.score).toBe(2);

    // use the drill-level reset button for F6 (index 5)
    const resetBtn = wrapper.find(".reset-drill-btn");
    if (!resetBtn.exists()) throw new Error("Expected reset button for F6 to exist");
    const realConfirm = window.confirm;
    window.confirm = () => true;
    await resetBtn.trigger("click");
    window.confirm = realConfirm;
    await nextTick();
    await nextTick();

    expect(f6.score).toBe(0);
    // ensure arrays are present after reset
    if (!f6.shots || !f6.attempted)
      throw new Error("Expected shots and attempted arrays to be present on F6 after reset");
    const shotsAfter = f6.shots;
    const attemptedAfter = f6.attempted;
    expect(shotsAfter.every((s) => s === false)).toBe(true);
    expect(attemptedAfter.every((a) => a === false)).toBe(true);
  });

  it("enforces sequential shots and supports marking misses", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    // show F6 directly in the test
    (wrapper.vm as any).currentDrillIndex = 5;
    await nextTick();
    const hotspots = wrapper.findAll(".potting-shot-btn");

    const drill = store.examI.drills[5];
    if (!isCountingDrill(drill)) throw new Error("Expected F6 to be a counting drill");
    const f6 = drill;
    // ensure arrays are present
    if (!f6.shots || !f6.attempted)
      throw new Error("Expected shots and attempted arrays to be present on F6");

    // first shot - ok
    await hotspots[0].trigger("click");
    await nextTick();
    await nextTick();
    expect(f6.attempted[0]).toBe(true);
    expect(f6.shots[0]).toBe(true);

    // skipping ahead is not allowed (third shot before second) -> no change
    await hotspots[2].trigger("click");
    await nextTick();
    await nextTick();
    expect(f6.attempted[2]).toBe(false);
    expect(f6.shots[2]).toBe(false);

    // second shot now
    await hotspots[1].trigger("click");
    await nextTick();
    await nextTick();
    expect(f6.attempted[1]).toBe(true);
    expect(f6.shots[1]).toBe(true);

    // toggle second shot to mark miss
    await hotspots[1].trigger("click");
    await nextTick();
    await nextTick();
    expect(f6.attempted[1]).toBe(true);
    expect(f6.shots[1]).toBe(false);
    expect(hotspots[1].classes()).toContain("miss");

    // score counts only successes
    expect(f6.score).toBe(1);
  });

  it("persists potting pattern to localStorage", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    // show F6 directly in the test
    (wrapper.vm as any).currentDrillIndex = 5;
    await nextTick();
    await wrapper.findAll(".potting-shot-btn")[0].trigger("click");
    await nextTick();
    await nextTick();

    const drill = store.examI.drills[5];
    if (!isCountingDrill(drill)) throw new Error("Expected F6 to be a counting drill");
    if (!drill.shots) throw new Error("Expected shots array to be present on F6");
    expect(drill.shots[0]).toBe(true);

    // persist
    store.saveToLocalStorage();

    // simulate reload
    setActivePinia(createPinia());
    const store2 = useExamsStore();
    store2.loadFromLocalStorage();

    const drill2 = store2.examI.drills[5];
    if (!isCountingDrill(drill2)) throw new Error("Expected F6 to be a counting drill");
    if (!drill2.shots) throw new Error("Expected shots array to be present on F6 after load");
    const shots2 = drill2.shots;
    expect(shots2[0]).toBe(true);
    if (!drill2.attempted)
      throw new Error("Expected attempted array to be present on F6 after load");
    const attempted2 = drill2.attempted;
    expect(attempted2[0]).toBe(true);
  });

  it("persists intermediate position drill changes to localStorage", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    await nextTick();

    // Find the first drill and the first success checkbox, then simulate a user checking it
    const firstDrill = wrapper.findAll(".drill-card").at(0);
    if (!firstDrill) throw new Error("Expected first drill card to exist");
    const firstSuccess = firstDrill.find("label.success-label input.small-checkbox");
    if (!firstSuccess || !firstSuccess.exists())
      throw new Error("Expected success checkbox in first drill");
    // mark as checked (v-model normally updates before @change handler runs)
    (firstSuccess.element as HTMLInputElement).checked = true;
    await firstSuccess.trigger("change");
    await nextTick();

    const savedRaw = localStorage.getItem("billiardUniversityData") || "{}";
    const saved = JSON.parse(savedRaw);
    expect(saved.examI).toBeTruthy();
    expect(saved.examI.drills[0].successes[0]).toBe(true);
  });

  it("removes increment/decrement buttons for counting drills and keeps header score", async () => {
    const wrapper = mount(ExamI);
    await nextTick();

    // show F6 directly in the test
    (wrapper.vm as any).currentDrillIndex = 5;
    await nextTick();
    const drillCard = wrapper.find(".drill-card");
    if (!drillCard.exists()) throw new Error("Expected F6 drill card to exist");
    // counter buttons should not exist for counting drills
    const buttons = drillCard.findAll("button.counter-btn");
    expect(buttons.length).toBe(0);

    // score display remains in the card header
    const headerDisplay = drillCard.find(".drill-score");
    expect(headerDisplay.exists()).toBe(true);
    expect(headerDisplay.text()).toContain("/");
  });
});
