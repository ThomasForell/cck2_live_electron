import Player from './Player'
import { Result } from './Player'

export default class Team {
    #players: Array<Player> = []
    #result: Result = new Result()
    #logo_path: string = ''

    addPlayer(p: Player): void {
        this.#players.push(p)
        this.#players.sort((a: Player, b: Player): number => {
            if (a.team_pos != b.team_pos) {
                return a.team_pos - b.team_pos
            }
            if (a.id < b.id) {
                return -1
            } else if (a.id > b.id) {
                return 1
            }
            return 0
        })

        this.#result.add(p.getResultTotalWithExtra())
    }

    get result(): Result {
        return this.#result
    }

    get logo_path(): string {
        return this.#logo_path
    }

    set logo_path(path: string) {
        this.#logo_path = path
    }
}

export function TeamCompare(a: Team, b: Team): number {
    const aTotal = a.result
    const bTotal = b.result
    if (aTotal.total < bTotal.total) {
        return 1
    } else if (aTotal.total == bTotal.total) {
        if (aTotal.clear < bTotal.clear) {
            return 1
        }
        if (aTotal.clear == bTotal.clear) {
            if (aTotal.fault < bTotal.fault) {
                return 1
            }
            if (aTotal.fault == bTotal.fault) {
                return 0
            }
        }
    }

    return -1
}
