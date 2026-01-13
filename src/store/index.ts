import { createStore, Store, useStore as baseUseStore } from 'vuex';
import type { InjectionKey } from 'vue';
import { z } from 'zod';


export const HorseSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  condition: z.number().min(1).max(100),
});
export type Horse = z.infer<typeof HorseSchema>;


export const RoundSchema = z.object({
  roundId: z.number(),
  distance: z.number(),
  horses: z.array(HorseSchema),
});
export type Round = z.infer<typeof RoundSchema>;


export const ResultSchema = z.object({
  roundId: z.number(),
  distance: z.number(),
  winner: HorseSchema,
  allResults: z.array(HorseSchema),
});
export type GameResult = z.infer<typeof ResultSchema>;

export interface RacePosition {
  id: number;
  progress: number;
  finished: boolean;
}

export interface State {
  horses: Horse[];
  schedule: Round[];
  results: GameResult[];
  currentRoundIndex: number;
  isRaceRunning: boolean;
  currentRacePositions: RacePosition[];
}


const randomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomColor = (): string => 
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');



export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  state: {
    horses: [],
    schedule: [],
    results: [],
    currentRoundIndex: 0,
    isRaceRunning: false,
    currentRacePositions: [],
  },
  getters: {
    currentRound(state): Round | null {
      return state.schedule[state.currentRoundIndex] || null;
    },
    isFinished(state): boolean {
      return (
        state.schedule.length > 0 &&
        state.currentRoundIndex >= state.schedule.length
      );
    },
  },
  mutations: {
    SET_HORSES(state, horses: Horse[]) {
      state.horses = horses;
    },
    SET_SCHEDULE(state, schedule: Round[]) {
      state.schedule = schedule;
      state.currentRoundIndex = 0;
      state.results = [];
    },
    SET_RACE_RUNNING(state, isRunning: boolean) {
      state.isRaceRunning = isRunning;
    },
    ADD_RESULT(state, roundResult: GameResult) {
      state.results.push(roundResult);
    },
    NEXT_ROUND(state) {
      state.currentRoundIndex++;
    },
    UPDATE_POSITIONS(state, positions: RacePosition[]) {
      state.currentRacePositions = positions;
    },
  },
  actions: {
    generateHorses({ commit }) {
      const rawHorses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Horse ${i + 1}`,
        color: randomColor(),
        condition: randomInt(1, 100),
      }));

      const horses = z.array(HorseSchema).parse(rawHorses);
      commit('SET_HORSES', horses);
    },

    generateSchedule({ state, commit }) {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200];
      
      const rawSchedule = distances.map((distance, index) => {
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random());
        const selectedHorses = shuffled.slice(0, 10);

        return {
          roundId: index + 1,
          distance,
          horses: selectedHorses,
        };
      });

      const schedule = z.array(RoundSchema).parse(rawSchedule);
      commit('SET_SCHEDULE', schedule);
    },

    async startRace({ state, commit, dispatch }) {
      if (state.isRaceRunning || state.currentRoundIndex >= state.schedule.length) return;

      commit('SET_RACE_RUNNING', true);
      const round = state.schedule[state.currentRoundIndex];

      if (!round) return;

      let positions: RacePosition[] = round.horses.map((h) => ({
        id: h.id,
        progress: 0,
        finished: false,
      }));

      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          let allFinished = true;

          positions = positions.map((pos) => {
            if (pos.finished) return pos;

            const horse = round.horses.find((h) => h.id === pos.id)!; 
            

            const speed = (horse.condition * 0.05) + Math.random() * 2;
            const distanceFactor = 1200 / round.distance;
            
            let newProgress = pos.progress + (speed * distanceFactor);

            if (newProgress >= 100) {
              newProgress = 100;
              pos.finished = true;
            } else {
              allFinished = false;
            }

            return { ...pos, progress: newProgress };
          });

          commit('UPDATE_POSITIONS', positions);

          if (allFinished) {
            clearInterval(interval);
            commit('SET_RACE_RUNNING', false);
   
            dispatch('processRoundResults', positions);
            resolve();
          }
        }, 100);
      });
    },

    processRoundResults({ state, commit }, finalPositions: RacePosition[]) {
      const currentRound = state.schedule[state.currentRoundIndex];


      const winnerId = finalPositions[0]?.id;
      const winner = currentRound?.horses.find((h) => h.id === winnerId);

      if (!winner) throw new Error('Winner not found');


      const resultEntry = ResultSchema.parse({
        roundId: currentRound?.roundId,
        distance: currentRound?.distance,
        winner: winner,
        allResults: finalPositions
            .map(p => currentRound?.horses.find(h => h.id === p.id))
            .filter((h): h is Horse => !!h)
      });

      commit('ADD_RESULT', resultEntry);
      commit('NEXT_ROUND');
      commit('UPDATE_POSITIONS', []);
    },
  },
});


export function useStore() {
  return baseUseStore(key);
}