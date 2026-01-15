import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore, type Round } from '../game'

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('has empty initial state', () => {
      const store = useGameStore()

      expect(store.horses).toEqual([])
      expect(store.schedule).toEqual([])
      expect(store.results).toEqual([])
      expect(store.currentRoundIndex).toBe(0)
      expect(store.isRaceRunning).toBe(false)
      expect(store.currentRacePositions).toEqual([])
    })
  })

  describe('getters', () => {
    it('currentRound returns null when no schedule', () => {
      const store = useGameStore()
      expect(store.currentRound).toBeNull()
    })

    it('currentRound returns correct round', () => {
      const store = useGameStore()
      const mockRound: Round = {
        roundId: 1,
        distance: 1200,
        horses: [{ id: 1, name: 'Horse 1', color: '#fff', condition: 50 }],
      }
      store.schedule = [mockRound]
      store.currentRoundIndex = 0

      expect(store.currentRound).toEqual(mockRound)
    })

    it('isFinished returns false when schedule is empty', () => {
      const store = useGameStore()
      expect(store.isFinished).toBe(false)
    })

    it('isFinished returns false when not all rounds completed', () => {
      const store = useGameStore()
      store.schedule = [
        { roundId: 1, distance: 1200, horses: [] },
        { roundId: 2, distance: 1400, horses: [] },
      ]
      store.currentRoundIndex = 0

      expect(store.isFinished).toBe(false)
    })

    it('isFinished returns true when all rounds completed', () => {
      const store = useGameStore()
      store.schedule = [
        { roundId: 1, distance: 1200, horses: [] },
        { roundId: 2, distance: 1400, horses: [] },
      ]
      store.currentRoundIndex = 2

      expect(store.isFinished).toBe(true)
    })
  })

  describe('generateHorses', () => {
    it('generates exactly 20 horses', () => {
      const store = useGameStore()
      store.generateHorses()

      expect(store.horses).toHaveLength(20)
    })

    it('generates horses with valid structure', () => {
      const store = useGameStore()
      store.generateHorses()

      store.horses.forEach(horse => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('condition')
        expect(typeof horse.id).toBe('number')
        expect(typeof horse.name).toBe('string')
        expect(typeof horse.color).toBe('string')
        expect(horse.color).toMatch(/^#[0-9a-f]{6}$/i)
        expect(horse.condition).toBeGreaterThanOrEqual(1)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })

    it('generates unique horse IDs', () => {
      const store = useGameStore()
      store.generateHorses()

      const ids = store.horses.map(h => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(20)
    })

    it('generates unique horse names', () => {
      const store = useGameStore()
      store.generateHorses()

      const names = store.horses.map(h => h.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(20)
    })
  })

  describe('generateSchedule', () => {
    beforeEach(() => {
      const store = useGameStore()
      store.generateHorses()
    })

    it('generates 6 rounds', () => {
      const store = useGameStore()
      store.generateSchedule()

      expect(store.schedule).toHaveLength(6)
    })

    it('generates rounds with correct distances', () => {
      const store = useGameStore()
      store.generateSchedule()

      const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
      store.schedule.forEach((round, index) => {
        expect(round.distance).toBe(expectedDistances[index])
      })
    })

    it('generates rounds with sequential roundIds', () => {
      const store = useGameStore()
      store.generateSchedule()

      store.schedule.forEach((round, index) => {
        expect(round.roundId).toBe(index + 1)
      })
    })

    it('each round has 10 horses', () => {
      const store = useGameStore()
      store.generateSchedule()

      store.schedule.forEach(round => {
        expect(round.horses).toHaveLength(10)
      })
    })

    it('resets currentRoundIndex to 0', () => {
      const store = useGameStore()
      store.currentRoundIndex = 5
      store.generateSchedule()

      expect(store.currentRoundIndex).toBe(0)
    })

    it('clears results when generating new schedule', () => {
      const store = useGameStore()
      store.results = [
        {
          roundId: 1,
          distance: 1200,
          winner: { id: 1, name: 'H1', color: '#fff', condition: 50 },
          allResults: [],
        },
      ]
      store.generateSchedule()

      expect(store.results).toEqual([])
    })

    it('requires horses to be generated first', () => {
      const store = useGameStore()
      store.horses = []

      expect(() => store.generateSchedule()).not.toThrow()
      // Schedule should still be generated but with empty horses
      expect(store.schedule).toHaveLength(6)
    })
  })

  describe('startRace', () => {
    let store: ReturnType<typeof useGameStore>

    beforeEach(() => {
      store = useGameStore()
      store.generateHorses()
      store.generateSchedule()
    })

    it('does not start if race is already running', async () => {
      store.isRaceRunning = true
      const initialPositions = store.currentRacePositions

      await store.startRace()

      expect(store.currentRacePositions).toEqual(initialPositions)
    })

    it('does not start if all rounds are completed', async () => {
      store.currentRoundIndex = store.schedule.length
      const initialPositions = store.currentRacePositions

      await store.startRace()

      expect(store.currentRacePositions).toEqual(initialPositions)
    })
  })

  describe('processRoundResults', () => {
    let store: ReturnType<typeof useGameStore>

    beforeEach(() => {
      store = useGameStore()
      store.generateHorses()
      store.generateSchedule()
    })

    it('creates result entry with correct structure', () => {
      const round = store.schedule[0]!

      const mockPositions = round.horses.map((horse, index) => ({
        id: horse.id,
        progress: 100,
        finished: true,
        time: 1000 + index * 100,
      }))

      store.processRoundResults(mockPositions)

      expect(store.results).toHaveLength(1)
      const result = store.results[0]!

      expect(result.roundId).toBe(round.roundId)
      expect(result.distance).toBe(round.distance)
      expect(result.winner).toBeDefined()
      expect(result.allResults).toHaveLength(round.horses.length)
    })

    it('selects winner as horse with fastest time', () => {
      const round = store.schedule[0]!
      const mockPositions = round.horses.map((horse, index) => ({
        id: horse.id,
        progress: 100,
        finished: true,
        time: 1000 + index * 100,
      }))

      store.processRoundResults(mockPositions)

      const result = store.results[0]!
      const fastestPosition = mockPositions.sort((a, b) => a.time - b.time)[0]!
      expect(result.winner.id).toBe(fastestPosition.id)
    })

    it('sorts allResults by finish time', () => {
      const round = store.schedule[0]!
      const mockPositions = round.horses.map((horse, index) => ({
        id: horse.id,
        progress: 100,
        finished: true,
        time: 2000 - index * 100,
      }))

      store.processRoundResults(mockPositions)

      const result = store.results[0]!
      const sortedPositions = [...mockPositions].sort((a, b) => a.time - b.time)

      result.allResults.forEach((horse, index) => {
        expect(horse.id).toBe(sortedPositions[index]!.id)
      })
    })

    it('increments currentRoundIndex', () => {
      const initialIndex = store.currentRoundIndex
      const round = store.schedule[0]!
      const mockPositions = round.horses.map(horse => ({
        id: horse.id,
        progress: 100,
        finished: true,
        time: 1000,
      }))

      store.processRoundResults(mockPositions)

      expect(store.currentRoundIndex).toBe(initialIndex + 1)
    })

    it('clears currentRacePositions', () => {
      store.currentRacePositions = [{ id: 1, progress: 50, finished: false, time: 0 }]
      const round = store.schedule[0]!
      const mockPositions = round.horses.map(horse => ({
        id: horse.id,
        progress: 100,
        finished: true,
        time: 1000,
      }))

      store.processRoundResults(mockPositions)

      expect(store.currentRacePositions).toEqual([])
    })
  })
})
