import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useExamsStore } from "../../src/store/useExamsStore";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Snapshots (autosave & restore)", () => {
  it("creates and restores a manual snapshot", () => {
    const store = useExamsStore();
    store.resetAll();

    store.student.name = "BeforeName";
    const snap = store.createSnapshot("manual-test");

    expect(snap).toHaveProperty("id");
    expect(store.history.snapshots && store.history.snapshots.length).toBeGreaterThan(0);

    // mutate and restore
    store.student.name = "AfterName";
    const ok = store.restoreSnapshot(snap.id);
    expect(ok).toBe(true);
    expect(store.student.name).toBe("BeforeName");
  });

  it("deletes a snapshot", () => {
    const store = useExamsStore();
    store.resetAll();

    const snap = store.createSnapshot("to-delete");
    expect(store.history.snapshots && store.history.snapshots.length).toBeGreaterThan(0);

    const deleted = store.deleteSnapshot(snap.id);
    expect(deleted).toBe(true);
    expect(
      store.history.snapshots && store.history.snapshots.find((s: any) => s.id === snap.id)
    ).toBeUndefined();
  });

  it("autosaves snapshots when enabled (debounced)", async () => {
    const store = useExamsStore();
    store.resetAll();

    // ensure clean
    store.history.snapshots = [];

    store.startRealtimeAutosave(50);

    // trigger a change
    store.saveStudentInfo({ name: "AutoSaveUser" });

    // wait longer than debounce
    await new Promise((r) => setTimeout(r, 200));

    expect(store.history.snapshots && store.history.snapshots.length).toBeGreaterThan(0);

    const latest = store.history.snapshots[0];
    expect(latest.data.student.name).toBe("AutoSaveUser");

    // stop autosave
    store.stopRealtimeAutosave();
  });
});
