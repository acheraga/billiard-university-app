import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useExamsStore } from '@/store/useExamsStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('Exam I store behaviours', () => {
  it('togglePottingShot enforces sequential attempts and updates score', () => {
    const store = useExamsStore();

    // ensure F6 exists
    const f6Index = 5;
    const f6: any = store.examI.drills[f6Index];
    f6.code = 'F6';
    f6.maxScore = 10;

    // Can't attempt shot 1 before shot 0
    expect(store.togglePottingShot(f6Index, 1)).toBe(false);

    // Attempt first shot: should succeed and increment score
    expect(store.togglePottingShot(f6Index, 0)).toBe(true);
    expect(f6.attempted[0]).toBe(true);
    expect(f6.shots[0]).toBe(true);
    expect(f6.score).toBe(1);

    // Toggle same shot to miss (attempt remains true but success toggles)
    expect(store.togglePottingShot(f6Index, 0)).toBe(true);
    expect(f6.attempted[0]).toBe(true);
    expect(f6.shots[0]).toBe(false);
    expect(f6.score).toBe(0);
  });

  it('updateExamIDrill calculates last position and bonus correctly', () => {
    const store = useExamsStore();
    const idx = 0; // F1 position drill
    const d: any = store.examI.drills[idx];

    // Prepare a specific pattern: four successes at target 7
    d.shots = [7, 7, 7, 7, 6, 6, 5, 4, 3, 2];
    d.successes = [true, true, true, true, false, false, false, false, false, false];
    d.loses = Array(10).fill(false);

    store.updateExamIDrill(idx);

    // lastAttemptIndex = 3, target=7, success-> lastPosition = min(7, 7+1)=7
    // bonus = number of successes at 7 = 4 -> score = min(maxScore(10), 7+4) = 10
    expect(d.score).toBe(10);
  });
});
