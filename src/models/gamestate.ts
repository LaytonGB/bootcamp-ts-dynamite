export type Gamestate = {
    rounds: Round[]
}

export type Round = {
    p1: BotSelection,
    p2: BotSelection, 
}

export type BotSelection = 'R' | 'P' | 'S' | 'D' | 'W';
