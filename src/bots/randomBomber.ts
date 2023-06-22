import { BotSelection, Gamestate, Round } from '../models/gamestate';

const randInt = (max) => {
    return Math.floor(Math.random() * max);
};

class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        const wins = gamestate.rounds.reduce((w, r) => w + (this.p1DidWin(r) ? 1 : 0), 0);
        const remainingRounds = 1000 - wins;
        const { myBombs, theirBombs } = gamestate.rounds.reduce(
            (b, { p1, p2 }) => {
                b.myBombs -= p1 === "D" ? 1 : 0;
                b.theirBombs -= p2 === "D" ? 1 : 0;
                return b;
            },
            { myBombs: 100, theirBombs: 100 }
        );

        const [p2Spamming, p2SpamSelection] = this.p2IsSpamming(gamestate);
        if (p2Spamming) {
            if (p2SpamSelection !== 'D' || theirBombs <= 0) {
                return this.getCounter(p2SpamSelection);
            }
        }

        if (myBombs > 0) {
            const randBomb = randInt(remainingRounds);
            if (randBomb < myBombs) {
                return "D";
            }
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

    p2IsSpamming(gamestate: Gamestate): [boolean, BotSelection | null] {
        const n = gamestate.rounds.length;
        const isSpamming = n >= 3
            && gamestate.rounds[n-1].p2 === gamestate.rounds[n-2].p2;
        return [isSpamming, isSpamming ? gamestate.rounds[n-1].p2 : null];
    }

    getCounter(action: BotSelection): BotSelection {
        switch (action) {
            case "D": return "W";
            case "R": return "P";
            case "P": return "S";
            case "S": return "R";
            default: throw new Error("No such counter move exists");
        }
    }
}

export = new Bot();
