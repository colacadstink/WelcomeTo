export type WelcomeToCard = {
  value: number,
  suit: WelcomeToSuit,
}

export type WelcomeToSuit = 'pool' | 'temp' | 'bis' | 'landscape' | 'fence' | 'real-estate';

export type WelcomeToCityPlan = {
  planNumber: 1 | 2 | 3;
  estates: number[],
  points: [number, number]
  claimed: boolean
}
