import * as seedrandom from "seedrandom";
import { v4 as uuidv4 } from 'uuid';
import {WelcomeToCard, WelcomeToCityPlan, WelcomeToSuit} from "../../common/cards";

type PartialPlan = { estates: number[]; points: number[] };

const numberDistribution: Record<number, number> = {
  1: 3,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 8,
  10: 7,
  11: 6,
  12: 5,
  13: 4,
  14: 3,
  15: 3
};

const suitDistribution: Record<WelcomeToSuit, number> = {
  pool: 9,
  temp: 9,
  bis: 9,
  landscape: 18,
  "real-estate": 18,
  fence: 18
};

const n1Plans: PartialPlan[] = [
  {
    estates: [1, 1, 1, 1, 1, 1],
    points: [8, 4],
  },{
    estates: [2, 2, 2, 2],
    points: [8, 4],
  },{
    estates: [3, 3, 3],
    points: [8, 4],
  },{
    estates: [4, 4],
    points: [6, 3],
  },{
    estates: [5, 5],
    points: [8, 4],
  },{
    estates: [6, 6],
    points: [10, 6],
  }
];

const n2Plans: PartialPlan[] = [
  {
    estates: [4, 1, 1, 1],
    points: [9, 5],
  },{
    estates: [3, 3, 4],
    points: [12, 7],
  },{
    estates: [5, 2, 2],
    points: [10, 6],
  },{
    estates: [1, 1, 1, 6],
    points: [11, 6],
  },{
    estates: [4, 5],
    points: [9, 5],
  },{
    estates: [3, 6],
    points: [8, 4],
  }
];

const n3Plans: PartialPlan[] = [
  {
    estates: [3, 4],
    points: [7, 3],
  },{
    estates: [2, 5],
    points: [7, 3],
  },{
    estates: [1, 4, 5],
    points: [13, 7],
  },{
    estates: [2, 3, 5],
    points: [13, 7],
  },{
    estates: [1, 2, 6],
    points: [12, 7],
  },{
    estates: [1, 2, 2, 3],
    points: [11, 6],
  }
];

const numbers = distributionToList(numberDistribution);
const suits = distributionToList(suitDistribution);

if(numbers.length !== suits.length) {
  console.error("ERROR: Number and suit distributions aren't equal!");
  console.error(`There are ${numbers.length} numbers and ${suits.length} suits. Fix this!`);
  process.exit(1);
}

const deckSize = numbers.length;

const plans = {
  n1: n1Plans.map(partialPlanToFull(1)),
  n2: n2Plans.map(partialPlanToFull(2)),
  n3: n3Plans.map(partialPlanToFull(3)),
}

export function generateNewGame(seed?: string) {
  if(!seed) {
    seed = uuidv4();
  }
  const generator = seedrandom(seed);
  const shuffledNumbers = shuffleList(numbers, generator);
  const shuffledSuits = shuffleList(suits, generator);
  const deck: WelcomeToCard[] = [];
  for(let i=0; i<deckSize; i++) {
    deck.push({
      suit: shuffledSuits[i],
      value: +shuffledNumbers[i],
    });
  }
  const chosenPlans: WelcomeToCityPlan[] = [];
  for(const planDeck of Object.values(plans)) {
    const index = Math.abs(generator.int32()) % planDeck.length;
    console.log(index);
    console.log(planDeck[index]);
    console.log('---');
    chosenPlans.push(planDeck[index]);
  }

  return {
    deck,
    plans: chosenPlans
  };
}

export function shuffleList<T>(list: T[], generator: {int32(): number}) {
  return list.map((item) => {
    return {item, sort: generator.int32()};
  })
    .sort((a, b) => b.sort - a.sort)
    .map((combo) => combo.item);
}

function distributionToList<T extends string>(dist: Record<T, number>) {
  const retval: T[] = [];
  for(const [key, value] of Object.entries(dist)) {
    for(let i = 0; i < value; i++) {
      retval.push(key as T);
    }
  }
  return retval;
}

function partialPlanToFull(planNumber: 1 | 2 | 3) {
  return (partialPlan) => {
    return {
      ...partialPlan,
      claimed: false,
      planNumber
    } as WelcomeToCityPlan;
  };
}
