import * as fs from 'fs'
import * as path from 'path'

import Player from './Player'
import { Cck2Result } from './Player'
import { PlayerCompare } from './Player'

import { SingleConfig } from '../renderer/src/cck2_live_interface/LiveConfig'

class PlayerProcessing {
    private resultDB = ''
    private players = new Map<string, Player>()
    private cck2File = ''
    private resultOutputPath = ''

    constructor(playerSetup: SingleConfig) {
        this.resultOutputPath = playerSetup.data_path
        this.resultDB = path.join(playerSetup.data_path, 'result.csv')
        this.cck2File = playerSetup.cck2_output_files

        this.readResultDB()
        this.readPlayerDB(path.join(playerSetup.data_path, playerSetup.player_data)) // add data of remaining players
    }

    do(): void {
        const cck2Result = this.readCck2Result()
        this.updateResult(cck2Result)

        this.writeResultDB()
        this.writeSingleResult()
    }

    private readPlayerDB(playerDB: string): void {
        const buf = fs.readFileSync(playerDB, 'utf-8')
        const lines = buf.split('\n')
        lines.forEach((l) => {
            const ll = l.replace('\r', '')
            if (ll.search(';') >= 0) {
                const p = new Player(ll)
                if (!this.players.has(p.id)) {
                    this.players.set(p.id, p)
                }
            }
        })
    }

    private readResultDB(): void {
        const buf = fs.readFileSync(this.resultDB, 'utf-8')
        const lines = buf.split('\n')
        lines.forEach((l) => {
            const ll = l.replace('\r', '')
            if (ll.search(';') >= 0) {
                const p = new Player(ll)
                this.players.set(p.id, p)
            }
        })
    }

    private readCck2Result(): any {
        try {
            let buf = fs.readFileSync(this.cck2File, 'utf-8')
            if (buf.charCodeAt(0) === 0xfeff) {
                buf = buf.substring(1)
            }
            return JSON.parse(buf)
        } catch (e) {
            console.log(e)
        }
    }

    private updateResult(data: any): void {
        this.players.forEach((p) => {
            p.active = false
        })

        data.bahn.forEach((p) => {
            if (p.id_aw != '') {
                const player = this.players.get(p.id_aw)
                const result = Cck2Result(p, 4)
                if (player != null) {
                    player.updateResult(0, 4, result)
                    player.substitute = 'e'
                    const pid = this.players.get(p.id)
                    if (pid) {
                        pid.substitute = 'a'
                        player.substractPlayer(pid)
                    }
                }
            } else if (p.id != '') {
                const result = Cck2Result(p, 4)
                const pid = this.players.get(p.id)
                if (pid) {
                    pid.updateResult(0, 4, result)
                }
            }
        })
    }

    private writeResultDB(): void {
        let out = ''
        this.players.forEach((p) => {
            out += p.toCsvLine() + '\n'
        })
        fs.writeFileSync(this.resultDB, out)
    }

    private writeSingleResult(): void {
        const groups = new Map<string, Array<Player>>()

        // split by group
        this.players.forEach((p) => {
            if (!groups.has(p.group)) {
                groups.set(p.group, [p])
            } else {
                const group = groups.get(p.group)
                if (group) {
                    group.push(p)
                }
            }
        })

        // sort and write
        groups.forEach((group, groupName) => {
            group.sort(PlayerCompare)
            fs.writeFileSync(
                path.join(this.resultOutputPath, 'single_' + groupName + '.json'),
                JSON.stringify(group)
            )
        })
    }
}

export default PlayerProcessing
