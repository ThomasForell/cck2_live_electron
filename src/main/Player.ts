export class Result {
    all: number
    clear: number
    fault: number
    total: number
    setPoint: number
    suddenVictory: number

    constructor(all = 0, clear = 0, fault = 0, total = 0, setPoint = 0, suddenVictory = 0) {
        this.all = all
        this.clear = clear
        this.fault = fault
        this.total = total
        this.setPoint = setPoint
        this.suddenVictory = suddenVictory
    }

    add(v: Result): void {
        this.all += v.all
        this.clear += v.clear
        this.fault += v.fault
        this.total += v.total
        this.setPoint += v.setPoint
    }

    toCsvLine(): string {
        return (
            this.all +
            ';' +
            this.clear +
            ';' +
            this.fault +
            ';' +
            this.total +
            ';' +
            this.setPoint +
            ';' +
            this.suddenVictory
        )
    }
}

export class Extra {
    total: number
    comment: string

    constructor(total = 0, comment = '') {
        this.total = total
        this.comment = comment
    }
}

export interface Cck2Player {
    mannschaft: string
    spielername: string
    id: string
    spielername_aw: string
    id_aw: string
    sp: string
    wurf: string
    gesamt: string
    durchgang_wurf: string
    durchgang_gesamt: string
    volle: Array<string>
    abr: Array<string>
    fehlwurf: Array<string>
}

export default class Player {
    id: string = ''
    name: string = ''
    substitute: string = ''
    team: string = ''
    group: string = ''
    active: boolean = false
    extras: Extra[] = []
    private results: Result[] = []
    team_pos: number = -1

    constructor(csvLine: string) {
        const csvLineSplit = csvLine.split(RegExp('[;,]'))
        if (csvLineSplit.length == 4 || csvLineSplit.length == 5) {
            this.id = csvLineSplit[0]
            this.name = csvLineSplit[1]
            this.team = csvLineSplit[2]
            this.group = csvLineSplit[3]
            if (csvLineSplit.length == 5) {
                this.team_pos = Number(csvLineSplit[4])
                if (isNaN(this.team_pos)) {
                    this.team_pos = -1
                }
            }
        } else {
            this.id = csvLineSplit[0]
            this.name = csvLineSplit[1]
            this.team = csvLineSplit[2]
            this.group = csvLineSplit[3]
            this.substitute = csvLineSplit[4]
            this.team_pos = Number(csvLineSplit[5])
            for (let i = 6; i < csvLineSplit.length; i += 6) {
                this.results.push(
                    new Result(
                        Number(csvLineSplit[i]),
                        Number(csvLineSplit[i + 1]),
                        Number(csvLineSplit[i + 2]),
                        Number(csvLineSplit[i + 3]),
                        Number(csvLineSplit[i + 4]),
                        Number(csvLineSplit[i + 5])
                    )
                )
            }
        }
    }

    setExtra(extras: Array<Extra>): void {
        this.extras = extras
    }

    toCsvLine(): string {
        let v =
            this.id +
            ';' +
            this.name +
            ';' +
            this.team +
            ';' +
            this.group +
            ';' +
            String(this.substitute) +
            ';' +
            this.team_pos
        this.results.forEach((r) => {
            v += ';' + r.toCsvLine()
        })
        return v
    }

    updateResult(match: number, setsPerMatch: number, r: Array<Result>): void {
        this.active = true
        if (match * setsPerMatch >= this.results.length) {
            for (let i = this.results.length; i < (match + 1) * setsPerMatch; ++i) {
                const v = new Result()
                Object.assign(v, r[i])
                this.results.push(v)
            }
        } else {
            for (let i = 0; i < setsPerMatch; ++i) {
                Object.assign(this.results[match * setsPerMatch + i], r[i])
            }
        }
    }

    substractPlayer(player: Player): void {
        this.results.forEach((r, i) => {
            r.all -= player.results[i].all
            r.clear -= player.results[i].clear
            r.fault -= player.results[i].fault
            r.total -= player.results[i].total
        })
    }

    getResultSet(match: number, set: number, setsPerMatch: number): Result {
        const idx = match * setsPerMatch + set
        return this.results[idx]
    }

    getResultMatch(match: number, setsPerMatch: number): Result {
        const r = new Result()
        for (let i = 0; i < setsPerMatch; ++i) {
            r.add(this.results[match * setsPerMatch + i])
        }
        return r
    }

    getResultMatchAll(setsPerMatch: number): Result[] {
        const numMatches = this.results.length / setsPerMatch
        const rs: Result[] = []
        for (let i = 0; i < numMatches; ++i) {
            rs.push(this.getResultMatch(i, setsPerMatch))
        }
        return rs
    }

    getResultTotal(): Result {
        const r = new Result()
        this.results.forEach((v) => {
            r.add(v)
        })
        return r
    }

    getExtraTotal(): number {
        let r = 0
        this.extras.forEach((e) => {
            r += e.total
        })
        return r
    }

    getResultTotalWithExtra(): Result {
        const r = this.getResultTotal()
        if (this.substitute != '') {
            r.total += this.getExtraTotal() * 0.5
        } else {
            r.total += this.getExtraTotal()
        }
        return r
    }
}

export function PlayerCompare(a: Player, b: Player): number {
    const aTotal = a.getResultTotal()
    const aExtra = a.getExtraTotal()
    const bTotal = b.getResultTotal()
    const bExtra = b.getExtraTotal()

    if (aTotal.total + aExtra > bTotal.total + bExtra) {
        return -1
    } else if (aTotal.total + aExtra == bTotal.total + bExtra) {
        if (aTotal.clear > bTotal.clear) {
            return -1
        }
        if (aTotal.clear == bTotal.clear) {
            if (aTotal.fault < bTotal.fault) {
                return -1
            }
            if (aTotal.fault == bTotal.fault) {
                return 0
            }
        }
    }

    return 1
}

export function Cck2Result(cck2: Cck2Player, setsPerMatch: number): Array<Result> {
    const v = [] as Array<Result>
    for (let i = 0; i < setsPerMatch; ++i) {
        const all = Number(cck2.volle[i])
        const clear = Number(cck2.abr[i])
        const fault = Number(cck2.fehlwurf[i])
        v.push(new Result(all, clear, fault, all + clear))
    }
    return v
}
