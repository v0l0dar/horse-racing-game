import { defineStore } from 'pinia'
import { z } from 'zod'

export const HorseSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  condition: z.number().min(1).max(100),
})
export type Horse = z.infer<typeof HorseSchema>

export const RoundSchema = z.object({
  roundId: z.number(),
  distance: z.number(),
  horses: z.array(HorseSchema),
})
export type Round = z.infer<typeof RoundSchema>

export const ResultSchema = z.object({
  roundId: z.number(),
  distance: z.number(),
  winner: HorseSchema,
  allResults: z.array(HorseSchema),
})
export type GameResult = z.infer<typeof ResultSchema>

export interface RacePosition {
  id: number
  progress: number
  finished: boolean
  time: number
}

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const randomColor = (): string =>
  '#' +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')

export const useGameStore = defineStore('game', {
  state: () => ({
    horses: [] as Horse[],
    schedule: [] as Round[],
    results: [] as GameResult[],
    currentRoundIndex: 0,
    isRaceRunning: false,
    currentRacePositions: [] as RacePosition[],
  }),

  getters: {
    currentRound(state): Round | null {
      return state.schedule[state.currentRoundIndex] || null
    },
    isFinished(state): boolean {
      return state.schedule.length > 0 && state.currentRoundIndex >= state.schedule.length
    },
  },

  actions: {
    generateHorses() {
      const horseNames = [
        "Thunder",
        "Blaze",
        "Shadow",
        "Storm",
        "Rocket",
        "Phantom",
        "Comet",
        "Viper",
        "Falcon",
        "Inferno",
        "Lightning",
        "Tornado",
        "Ranger",
        "Eclipse",
        "Maverick",
        "Nitro",
        "Spartan",
        "Ghost",
        "Hurricane",
        "Titan"
      ];

      const shuffledNames = [...horseNames].sort(() => Math.random() - 0.5);

      const rawHorses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i],
        color: randomColor(),
        condition: randomInt(1, 100),
      }))

      this.horses = z.array(HorseSchema).parse(rawHorses)
    },

    generateSchedule() {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200]

      const rawSchedule = distances.map((distance, index) => {
        const shuffled = [...this.horses].sort(() => 0.5 - Math.random())
        const selectedHorses = shuffled.slice(0, 10)

        return {
          roundId: index + 1,
          distance,
          horses: selectedHorses,
        }
      })

      this.schedule = z.array(RoundSchema).parse(rawSchedule)
      this.currentRoundIndex = 0
      this.results = []
    },

    async startRace() {
      const startTime = Date.now()

      if (this.isRaceRunning || this.currentRoundIndex >= this.schedule.length) return

      this.isRaceRunning = true
      const round = this.schedule[this.currentRoundIndex]

      if (!round) return

      this.currentRacePositions = round.horses.map(h => ({
        id: h.id,
        progress: 0,
        finished: false,
        time: 0,
      }))

      return new Promise<void>(resolve => {
        const interval = setInterval(() => {
          let allFinished = true

          this.currentRacePositions = this.currentRacePositions.map(pos => {
            if (pos.finished) return pos

            const horse = round.horses.find(h => h.id === pos.id)!
            const speed = 1 + horse.condition * 0.05 + Math.random() * 2
            const distanceFactor = 1200 / round.distance

            let newProgress = pos.progress + speed * distanceFactor

            if (newProgress >= 100) {
              newProgress = 100
              pos.finished = true
              pos.time = Date.now() - startTime
            } else {
              allFinished = false
            }

            return { ...pos, progress: newProgress }
          })

          if (allFinished) {
            clearInterval(interval)
            this.isRaceRunning = false
            this.processRoundResults(this.currentRacePositions)
            resolve()
          }
        }, 100)
      })
    },

    processRoundResults(finalPositions: RacePosition[]) {
      finalPositions.sort((a, b) => a.time - b.time)

      const currentRound = this.schedule[this.currentRoundIndex]
      const winnerId = finalPositions[0]?.id
      const winner = currentRound?.horses.find(h => h.id === winnerId)

      if (!winner) throw new Error('Winner not found')

      const resultEntry = ResultSchema.parse({
        roundId: currentRound?.roundId,
        distance: currentRound?.distance,
        winner: winner,
        allResults: finalPositions
          .map(p => currentRound?.horses.find(h => h.id === p.id))
          .filter((h): h is Horse => !!h),
      })

      this.results.push(resultEntry)
      this.currentRoundIndex++
      this.currentRacePositions = []
    },
  },
})
