import * as fs from 'fs'
import * as path from 'path'

import Player from './Player'
import { Cck2Result } from './Player'
import { PlayerCompare } from './Player'

import { SingleConfig } from '../renderer/src/cck2_live_interface/LiveConfig'

interface Bahn {
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
    volle: string[]
    abr: string[]
    fehlwurf: string[]
}

interface Cck2Bahnen {
    bahn: Bahn[]
}

interface ResultDisplay {
    name: string
    mannschaft: string
    active: boolean
    durchgang: string[]
    gesamt: string
}

class PlayerProcessing {
    private resultDB = ''
    private players = new Map<string, Player>()
    private cck2Files = ['']
    private resultOutputPath = ''
    private matchDay = 0
    private numSetsPerMatch = 4

    constructor(playerSetup: SingleConfig, cck2path: string) {
        this.resultOutputPath = playerSetup.data_path
        this.resultDB = path.join(playerSetup.data_path, 'result.csv')

        const cck2 = playerSetup.cck2_output_files.split(',')
        this.cck2Files = []
        for (let i = 0; i < cck2.length; ++i) {
            this.cck2Files[i] = path.join(cck2path, cck2[i].trim())
        }

        this.matchDay = playerSetup.match_day - 1

        this.readResultDB()
        this.readPlayerDB(path.join(playerSetup.data_path, playerSetup.player_data)) // add data of remaining players
    }

    do(): void {
        const cck2Result: Bahn[] = this.readCck2Result()
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
        try {
            const buf = fs.readFileSync(this.resultDB, 'utf-8')
            const lines = buf.split('\n')
            lines.forEach((l) => {
                const ll = l.replace('\r', '')
                if (ll.search(';') >= 0) {
                    const p = new Player(ll)
                    this.players.set(p.id, p)
                }
            })
        } catch {
            console.log('Cannot load result file')
        }
    }

    private readCck2Result(): Bahn[] {
        let results: Bahn[] = []
        try {
            this.cck2Files.forEach((f) => {
                let buf = fs.readFileSync(f, 'utf-8')
                if (buf.charCodeAt(0) === 0xfeff) {
                    buf = buf.substring(1)
                }
                const r = (JSON.parse(buf) as Cck2Bahnen).bahn
                results = results.concat(r)
            })
        } catch (e) {
            console.log(e)
        }
        return results
    }

    private updateResult(data: Bahn[]): void {
        this.players.forEach((p) => {
            p.active = false
        })

        data.forEach((p) => {
            if (p.id_aw != '') {
                const player = this.players.get(p.id_aw)
                const result = Cck2Result(p, this.numSetsPerMatch)
                if (player != null) {
                    player.updateResult(this.matchDay, this.numSetsPerMatch, result)
                    player.substitute = 'e'
                    const pid = this.players.get(p.id)
                    if (pid) {
                        pid.substitute = 'a'
                        player.substractPlayer(pid)
                    }
                }
            } else if (p.id != '') {
                const result = Cck2Result(p, this.numSetsPerMatch)
                const pid = this.players.get(p.id)
                if (pid) {
                    pid.updateResult(this.matchDay, this.numSetsPerMatch, result)
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

        // sort and output for visualization
        const config = {
            zeit: 20,
            files: [] as string[],
            group_names: [] as string[]
        }
        let idx = 0
        groups.forEach((group, groupName) => {
            group.sort(PlayerCompare)

            const groupOut: ResultDisplay[] = []
            group.forEach((p) => {
                const pOut: ResultDisplay = {
                    name: p.name,
                    mannschaft: p.team,
                    active: p.active,
                    durchgang: p.getResultMatchAll(this.numSetsPerMatch).map((r) => {
                        return r.total.toString()
                    }),
                    gesamt: p.getResultTotal().total.toString()
                }
                groupOut.push(pOut)
            })

            const fname = 'single_' + idx.toString() + '.json'
            config.files.push(fname)
            config.group_names.push(groupName)
            fs.writeFileSync(path.join(this.resultOutputPath, fname), JSON.stringify(groupOut))
            ++idx
        })

        // write config file
        fs.writeFileSync(path.join(this.resultOutputPath, 'config.json'), JSON.stringify(config))
    }
}

export default PlayerProcessing
