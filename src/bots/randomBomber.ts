import { BotSelection, Gamestate, Round } from '../models/gamestate';

const randInt = (max) => {
    return Math.floor(Math.random() * max);
};

class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        const wins = gamestate.rounds.reduce((w, r) => w + (this.p1DidWin(r) ? 1 : 0), 0);
        const remainingRounds = gamestate.rounds.length - wins;
        const { myBombs, theirBombs } = gamestate.rounds.reduce(
            (b, { p1, p2 }) => {
                b.myBombs -= p1 === "D" ? 1 : 0;
                b.theirBombs -= p2 === "D" ? 1 : 0;
                return b;
            },
            { myBombs: 100, theirBombs: 100 }
        );

        if (theirBombs > 0 && this.p2IsSpamming(gamestate)) {
            return "W";
        }

        const randBomb = randInt(remainingRounds);
        if (randBomb > myBombs) {
            return "D";
        }

        const randAction = randInt(3);
        switch (randAction) {
            case 0: return "R";
            case 1: return "P";
            default: return "S"; 
        }
    }

    p1DidWin(round: Round): boolean {
        const { p1, p2 } = round;
        if (
            p1 === "D" && p2 !== "W" && p2 !== "D"
            || p1 !== "D" && p1 !== "W" && p2 === "W"
            || p1 === "W" && p2 === "D"
            || p1 === "R" && p2 === "S"
            || p1 === "P" && p2 === "R"
            || p1 === "S" && p2 === "P"
        ) {
            return true;
        }
        return false;
    }

    p2IsSpamming(gamestate: Gamestate): boolean {
        const n = gamestate.rounds.length;
        return n >= 3
            && gamestate.rounds[n-1].p2 === "D"
            && gamestate.rounds[n-2].p2 === "D";
    }
}

export = new Bot();
