import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExamsStore } from '../../src/store/useExamsStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('Exam I scoring', () => {
  it('sets final position to 7 when last shot at 6 is success', () => {
    const store = useExamsStore()
    const drill = store.examI.drills[0]
    drill.shots = Array(10).fill(4)
    drill.successes = Array(10).fill(false)
    drill.loses = Array(10).fill(false)
    drill.shots[9] = 6
    drill.successes[9] = true

    store.updateExamIDrill(0)

    expect(drill.bonus).toBe(0)
    expect(drill.score).toBe(7)
  })

  it('sets final position to 5 when last shot at 6 is miss', () => {
    const store = useExamsStore()
    const drill = store.examI.drills[0]
    drill.shots = Array(10).fill(4)
    drill.successes = Array(10).fill(false)
    drill.loses = Array(10).fill(false)
    drill.shots[9] = 6
    drill.loses[9] = true

    store.updateExamIDrill(0)

    expect(drill.bonus).toBe(0)
    expect(drill.score).toBe(5)
  })

  it('counts consecutive 7s as adjacent pairs for bonus', () => {
    const store = useExamsStore()
    const drill = store.examI.drills[0]
    drill.shots = [7,7,7,4,4,4,4,4,4,4]
    drill.successes = [true,true,true,false,false,false,false,false,false,false]
    drill.loses = Array(10).fill(false)

    store.updateExamIDrill(0)

    expect(drill.bonus).toBe(2)
    expect(drill.score).toBe(9)
  })
})
