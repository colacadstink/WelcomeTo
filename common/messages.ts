import {WelcomeToCard, WelcomeToCityPlan} from "./cards";

export type WelcomeToMessage =
  CreateRoom |
  JoinRoom |
  StartGame |
  RoomState |
  Rename |
  ReadyUpdate |
  DoNextDeal |
  ClaimPlan |
  ErrorMessage;

export type ErrorMessage = {
  method: 'error',
  message: string
}

export type CreateRoom = {
  method: 'createRoom',
  id: string
}

export type JoinRoom = {
  method: 'joinRoom',
  id: string
}

export type StartGame = {
  method: 'startGame',
  seed?: string,
}

export type RoomState = {
  method: 'roomState',
  id: string,
  me: {
    name: string,
    ready: boolean,
    uuid: string,
  }
  players: {
    name: string,
    ready: boolean,
  }[]
  valueCards: WelcomeToCard[],
  suitCards: WelcomeToCard[],
  plans: WelcomeToCityPlan[],
  shuffleImminent: boolean,
}

export type Rename = {
  method: 'rename',
  newName: string
}

export type ReadyUpdate = {
  method: 'readyUpdate',
  ready: boolean
}

export type DoNextDeal = {
  method: 'doNextDeal'
}

export type ClaimPlan = {
  method: 'claimPlan',
  planNumber: 1 | 2 | 3,
  shuffleRequested: boolean,
}

