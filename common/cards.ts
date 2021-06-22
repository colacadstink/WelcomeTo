export type WelcomeToCard = {
  value: number,
  suit: WelcomeToSuit,
}

export type WelcomeToSuit = 'pool' | 'temp' | 'bis' | 'landscape' | 'fence' | 'real-estate';

export const SuitToFontAwesome: Record<WelcomeToSuit, string> = {
  fence: 'fa-house-user',
  'real-estate': 'fa-chart-line',
  landscape: 'fa-tree',
  pool: 'fa-swimming-pool',
  temp: 'fa-toolbox',
  bis: 'fa-envelope-open-text',
}

export type WelcomeToCityPlan = {
  planNumber: 1 | 2 | 3;
  estates: number[],
  points: [number, number]
  claimed: boolean
}
