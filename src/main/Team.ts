import Player from './Player'
import { Result } from './Player'

export default class Team {
    private player: Array<Player> = []
    private result: Result = new Result()

    addPlayer(p: Player): void {
        this.player.push(p)
        this.player.sort((a: Player, b: Player): number => {
            if (a.id < b.id) {
                return -1
            } else if (a.id > b.id) {
                return 1
            }
            return 0
        })

        this.result.add(p.getResultTotalWithExtra())
    }

    getResult(): Result {
        return this.result
    }
}

export function TeamCompare(a: Team, b: Team): number {
    const aTotal = a.getResult()
    const bTotal = b.getResult()
    if (aTotal.total > bTotal.total) {
        return 1
    } else if (aTotal.total == bTotal.total) {
        if (aTotal.clear > bTotal.clear) {
            return 1
        }
        if (aTotal.clear == bTotal.clear) {
            if (aTotal.fault > bTotal.fault) {
                return 1
            }
            if (aTotal.fault == bTotal.fault) {
                return 0
            }
        }
    }

    return -1
}
