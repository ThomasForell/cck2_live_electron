
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
    private id: string;
    private nameGiven: string;
    private nameFamily: string;
    private team: string;
    private group: string;
    private active: boolean;
    private results: Array<Result>;
    private extra: Array<Extra>;

    constructor(csvLine: string) {

    }
}