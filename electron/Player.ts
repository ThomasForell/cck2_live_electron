
class Result {
    all: number;
    clear: number;
    fault: number;
    total: number;
    setPoint: number;
    suddenVictory: number;

    constructor(all = 0, clear = 0, fault = 0, total = 0, setPoint = 0, suddenVictory = 0) {
        this.all = all;
        this.clear = clear;
        this.fault = fault;
        this.total = total;
        this.setPoint = setPoint;
        this.suddenVictory = suddenVictory;
    }

    add(v: Result): void {
        this.all += v.all;
        this.clear += v.clear;
        this.fault += v.fault;
        this.total += v.total;
        this.setPoint += v.setPoint;
    }
};

class Extra {
    total: number;
    comment: string;

    constructor(total = 0, comment = "") {
        this.total = total;
        this.comment = comment;
    }
};

class Player {
    private id: string = "";
    private name: string = "";
    private team: string = "";
    private group: string = "";
    active: boolean = false;
    private results: Array<Result> = [];
    private extra: Array<Extra> = [];

    constructor(csvLine: string) {

    }

    addExtra(csvLine: string): void {

    }

    toCvsLine(): string {
        return "";
    }

    updateResult(match: number, setsPerMatch: number, r: Array<Result>) {
        this.active = true;
        if (match * setsPerMatch == this.results.length) {
            for (let i = 0; i < setsPerMatch; ++i) {
                let v = new Result();
                Object.assign(v, r[i]);
                this.results.push(v);
            }
        }
        else {
            for (let i = 0; i < setsPerMatch; ++i) {
                Object.assign(this.results[match * setsPerMatch + i], r[i]);
            }
        }
    }

    getResultSet(match: number, set: number, setsPerMatch: number): Result {
        const idx = match * setsPerMatch + set;
        return this.results[idx];
    }

    getResultMatch(match: number, setsPerMatch: number): Result {
        let r = new Result();
        for (let i = 0; i < setsPerMatch; ++i) {
            r.add(this.results[match * setsPerMatch + i]);
        }
        return r;
    }

    getResultTotal(): Result {
        let r = new Result();
        this.results.forEach( (v) => { r.add(v); });
        return r;
    }

    getExtraTotal(): number {
        let r = 0;
        this.extra.forEach((e) => {r += e.total;});
        return r;
    }
}

function PlayerCompare(a: Player, b: Player) {
    const aTotal = a.getResultTotal();
    const aExtra = a.getExtraTotal();
    const bTotal = b.getResultTotal();
    const bExtra = b.getExtraTotal();

    if (aTotal.total + aExtra > bTotal.total + bExtra) {
        return 1;
    }
    else if (aTotal.total + aExtra == bTotal.total + bExtra) {
        if (aTotal.clear > bTotal.clear) {
            return 1;
        }
        if (aTotal.clear == bTotal.clear) {
            if (aTotal.fault < bTotal.fault) {
                return 1;
            }
            if (aTotal.fault == bTotal.fault) {
                return 0;
            }
        }
    }

    return -1;
}

export default Player;