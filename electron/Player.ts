
export class Result {
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

    toCsvLine(): string {
        return this.all + ";" + this.clear + ";" + this.fault + ";" + this.total + ";" + this.setPoint + ";" + this.suddenVictory;  
    }
 };

export class Extra {
    total: number;
    comment: string;

    constructor(total = 0, comment = "") {
        this.total = total;
        this.comment = comment;
    }
};

export default class Player {
    private id: string = "";
    private name: string = "";
    private substitute: boolean = false;
    private team: string = "";
    private group: string = "";
    active: boolean = false;
    private results: Array<Result> = [];
    private extras: Array<Extra> = [];

    constructor(csvLine: string) {
        const csvLineSplit = csvLine.split(";");
        this.id = csvLineSplit[0];
        this.name = csvLineSplit[1];
        this.substitute = csvLineSplit[2] == String(true);
        this.team = csvLineSplit[3];
        this.group = csvLineSplit[4];
        for (let i = 5; i < csvLineSplit.length; i += 6) {
            this.results.push(new Result(Number(csvLineSplit[i]), Number(csvLineSplit[i + 1]), Number(csvLineSplit[i + 2]), 
                Number(csvLineSplit[i + 3]), Number(csvLineSplit[i + 4]), Number(csvLineSplit[i + 5])));
        }       
    }

    addExtra(csvLine: string): void {
        const csvLineSplit = csvLine.split(";");
        this.extras.push(new Extra(Number(csvLineSplit[0]), csvLineSplit[1]));
    }

    toCsvLine(): string {
        let v = this.id + ";" + this.name + ";" + String(this.substitute) + ";" + this.team + ";" + this.group;
        this.results.forEach((r) => { v += ";" + r.toCsvLine(); }); 
        return v;
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
        this.extras.forEach((e) => { r += e.total; });
        return r;
    }

    getResultTotalWithExtra(): Result {
        let r = this.getResultTotal();
        if (this.substitute) {
            r.total += this.getExtraTotal() * 0.5;
        }
        else {
            r.total += this.getExtraTotal();
        }
        return r;
    }
}

export function PlayerCompare(a: Player, b: Player): number {
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

export function Cck2Result(cck2Result: any, setsPerMatch: number): Array<Result> {
    let v = [] as Array<Result>;
    for (let i = 0; i < setsPerMatch; ++i) {
        const all = Number(cck2Result.volle[i]);
        const clear = Number(cck2Result.abr[i]);
        const fault = Number(cck2Result.fehlwurf[i]);
        v.push(new Result(all, clear, fault, all + clear));
    }
    return v;
}