import Player from './Player';
import { Result } from './Player';

export default class Team {
    private player: Array<Player> = [];
    private result: Result = null;
    private extra: Array<number> = [];

    constructor() { 
    }

    addPlayer(p: Player): void {
        this.player.push(p);
        this.player.sort((a: Player, b: Player): number => { 
            if (a.id < b.id) {
                return -1;
            } 
            else if (a.id > b.id) {
                return 1;
            } 
            return 0;
        });

        this.result = new Result();
        this.extra = [];
        this.player.forEach((p) => { 
            this.result.add(p.getResultTotal());
            p.extras.forEach((v, i) => {
                if (this.extra.length == i) {
                    this.extra.push(0);
                }
                if (p.substitute != "") {
                    this.extra[i] += v.total * 0.5;
                } 
                else {
                    this.extra[i] += v.total;
                }
            })});        
    }

    getResult(): Result {
        let r = new Result();
        this.player.forEach((p) => { r.add(p.getResultTotalWithExtra()); });

        return r;
    }
}

export function TeamCompare(a: Team, b: Team): number {
    const aTotal = a.getResult();
    const bTotal = b.getResult();
    if (aTotal.total > bTotal.total) {
        return 1;
    }
    else if (aTotal.total == bTotal.total) {
        if (aTotal.clear > bTotal.clear) {
            return 1;
        }
        if (aTotal.clear == bTotal.clear) {
            if (aTotal.fault > bTotal.fault) {
                return 1;
            }
            if (aTotal.fault == bTotal.fault) {
                return 0;
            }
        }
    }

    return -1;
}
