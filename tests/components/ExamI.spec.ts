import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import ExamI from "../../src/components/ExamI.vue";
import { useExamsStore } from "../../src/store/useExamsStore";

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe("ExamI F6 potting overlay", () => {
  it("renders 10 hotspots and toggles on click", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();

    // Ensure F6 exists
    const drill = store.examI.drills[5];
    expect(drill).toBeTruthy();
    // reset F6
    store.resetPottingShots(5);
    await nextTick();

    const f6Card = wrapper.findAll('.drill-card').at(5);
    const hotspots = f6Card.findAll(".potting-shot-btn");
    expect(hotspots.length).toBe(10);

    // Click first hotspot
    await hotspots[0].trigger("click");
    await nextTick();

    expect(store.examI.drills[5].shots[0]).toBe(true);
    expect(store.examI.drills[5].score).toBe(1);
    expect(hotspots[0].classes()).toContain("success");

    // Click second hotspot
    await hotspots[1].trigger("click");
    await nextTick();

    expect(store.examI.drills[5].shots[1]).toBe(true);
    expect(store.examI.drills[5].score).toBe(2);
  });

  it("toggles hotspot via keyboard (Enter)", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    const f6Card = wrapper.findAll('.drill-card').at(5);
    const hotspots = f6Card.findAll(".potting-shot-btn");
    await hotspots[0].trigger("keydown", { key: "Enter" });
    await nextTick();

    expect(store.examI.drills[5].shots[0]).toBe(true);
    expect(store.examI.drills[5].score).toBe(1);
    expect(hotspots[0].classes()).toContain("success");
  });

  it("reset button clears pattern", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    const f6Card = wrapper.findAll('.drill-card').at(5);
    const hotspots = f6Card.findAll(".potting-shot-btn");
    await hotspots[0].trigger("click");
    await hotspots[1].trigger("click");
    await nextTick();

    expect(store.examI.drills[5].score).toBe(2);

    // use the drill-level reset button for F6 (index 5)
    const resetBtn = wrapper.findAll(".reset-drill-btn").at(5);
    const realConfirm = window.confirm;
    window.confirm = () => true;
    await resetBtn.trigger("click");
    window.confirm = realConfirm;
    await nextTick();

    expect(store.examI.drills[5].score).toBe(0);
    expect(store.examI.drills[5].shots.every((s) => s === false)).toBe(true);
    expect(store.examI.drills[5].attempted.every((a) => a === false)).toBe(true);
  });

  it("enforces sequential shots and supports marking misses", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    const hotspots = wrapper.findAll(".potting-shot-btn");

    // first shot - ok
    await hotspots[0].trigger("click");
    await nextTick();
    expect(store.examI.drills[5].attempted[0]).toBe(true);
    expect(store.examI.drills[5].shots[0]).toBe(true);

    // skipping ahead is not allowed (third shot before second) -> no change
    await hotspots[2].trigger("click");
    await nextTick();
    expect(store.examI.drills[5].attempted[2]).toBe(false);
    expect(store.examI.drills[5].shots[2]).toBe(false);

    // second shot now
    await hotspots[1].trigger("click");
    await nextTick();
    expect(store.examI.drills[5].attempted[1]).toBe(true);
    expect(store.examI.drills[5].shots[1]).toBe(true);

    // toggle second shot to mark miss
    await hotspots[1].trigger("click");
    await nextTick();
    expect(store.examI.drills[5].attempted[1]).toBe(true);
    expect(store.examI.drills[5].shots[1]).toBe(false);
    expect(hotspots[1].classes()).toContain("miss");

    // score counts only successes
    expect(store.examI.drills[5].score).toBe(1);
  });

  it("persists potting pattern to localStorage", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    store.resetPottingShots(5);
    await nextTick();

    await wrapper.findAll(".potting-shot-btn")[0].trigger("click");
    await nextTick();

    expect(store.examI.drills[5].shots[0]).toBe(true);

    // persist
    store.saveToLocalStorage();

    // simulate reload
    setActivePinia(createPinia());
    const store2 = useExamsStore();
    store2.loadFromLocalStorage();

    expect(store2.examI.drills[5].shots[0]).toBe(true);
    expect(store2.examI.drills[5].attempted[0]).toBe(true);
  });

  it("persists intermediate position drill changes to localStorage", async () => {
    const wrapper = mount(ExamI);
    const store = useExamsStore();
    await nextTick();

    // Find the first drill and the first success checkbox, then simulate a user checking it
    const firstDrill = wrapper.findAll('.drill-card').at(0);
    const firstSuccess = firstDrill.find('label.success-label input.small-checkbox');
    // mark as checked (v-model normally updates before @change handler runs)
    firstSuccess.element.checked = true;
    await firstSuccess.trigger('change');
    await nextTick();

    const savedRaw = localStorage.getItem('billiardUniversityData') || '{}';
    const saved = JSON.parse(savedRaw);
    expect(saved.examI).toBeTruthy();
    expect(saved.examI.drills[0].successes[0]).toBe(true);
  });

  it("removes increment/decrement buttons for counting drills and keeps header score", async () => {
    const wrapper = mount(ExamI);
    await nextTick();

    const drillCard = wrapper.findAll('.drill-card').at(5);
    // counter buttons should not exist for counting drills
    const buttons = drillCard.findAll('button.counter-btn');
    expect(buttons.length).toBe(0);

    // score display remains in the card header
    const headerDisplay = drillCard.find('.drill-score');
    expect(headerDisplay.exists()).toBe(true);
    expect(headerDisplay.text()).toContain('/');
  });
});
