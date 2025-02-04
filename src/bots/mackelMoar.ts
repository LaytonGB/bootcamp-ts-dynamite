import { BotSelection, Gamestate, Round } from '../models/gamestate';

const randInt = (numberOfStates) => {
    return Math.floor(Math.random() * numberOfStates);
};

class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        let n = gamestate.rounds.length;
        
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

        const [spamLength, p2SpamSelection] = this.p2GetRepeatitionDetails(gamestate.rounds);
        if (spamLength > 1 && p2SpamSelection === 'D' && theirBombs > 0) {
            return this.getCounterMove(p2SpamSelection);
        } else if (spamLength > 4 && p2SpamSelection !== 'D') {
            return this.getCounterMove(p2SpamSelection);
        }

        if (myBombs > 0) {
            if (n === 1 && gamestate.rounds[n-1].p1 === 'D' || n >= 2 && gamestate.rounds[n-1].p1 === 'D' && gamestate.rounds[n-2].p1 !== "D") {
                if (randInt(2) === 1) {
                    return "D";
                }
            }

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

    p1DidWin({ p1, p2 }: Round): boolean {
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

    p2GetRepeatitionDetails(rounds: Round[]): [number, BotSelection | null] {
        const n = rounds.length;

        if (n === 0) {
            return [0, null];
        }

        const spamValue = rounds[n - 1].p2;

        if (spamValue === 'W') {
            return [0, null];
        }

        let spamLength = 1;
        for (let i = n - 2; i >= 0; i--) {
            if (rounds[i].p2 === spamValue) {
                spamLength += 1;
            } else {
                break;
            }
        }
        return [spamLength, spamValue];
    }

    getCounterMove(action: BotSelection): BotSelection {
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
