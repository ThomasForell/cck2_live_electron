import * as fs from 'fs'
import * as path from 'path'

import { Extra } from './Player'
import Player from './Player'
import { Cck2Result } from './Player'
import { PlayerCompare } from './Player'

import Team, { TeamCompare } from './Team'

import { SingleConfig } from '../renderer/src/cck2_live_interface/LiveConfig'
import { TeamsConfig } from '../renderer/src/cck2_live_interface/LiveConfig'

export interface Bahn {
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

export interface Cck2Bahnen {
    bahn: Bahn[]
}

interface ResultDisplay {
    name: string
    mannschaft: string
    active: boolean
    durchgang: string[]
    gesamt: string
}

interface DebugInfo {
    start: number[]
    info: string
    pos?: number
    cnt?: number
}

class PlayerProcessing {
    private resultDB = ''
    private players = new Map<string, Player>()
    private cck2Files: string[] = []
    private resultOutputPath = ''
    private matchDay = 0
    private numSetsPerMatch = 4
    private extraFiles: string[] = []
    private debug: DebugInfo

    constructor(
        playerSetup: null | SingleConfig,
        teamsSetup: null | TeamsConfig,
        cck2path: string
    ) {
        this.debug = { start: [], info: '', pos: 0, cnt: 0 }
        if (playerSetup != null) {
            this.resultOutputPath = playerSetup.data_path
            this.resultDB = path.join(playerSetup.data_path, 'result.csv')

            if (playerSetup.cck2_output_files == 'r_*') {
                try {
                    const buf = fs.readFileSync(
                        path.join(playerSetup.data_path, 'info.json'),
                        'utf-8'
                    )
                    this.debug = JSON.parse(buf)
                    this.debug.cnt = 0
                    this.debug.pos = 1
                } catch (e) {
                    console.log(
                        'Failed to load debug info - is r_* the file you want to use as input file?'
                    )
                }
            }
            const cck2 = playerSetup.cck2_output_files.split(',')
            this.cck2Files = []
            for (let i = 0; i < cck2.length; ++i) {
                this.cck2Files[i] = path.join(cck2path, cck2[i].trim())
            }

            this.matchDay = playerSetup.match_day - 1

            this.readPlayerDB(path.join(playerSetup.data_path, playerSetup.player_data)) // add data of remaining players
        }
        if (teamsSetup != null) {
            this.resultOutputPath = teamsSetup.data_path
            this.resultDB = path.join(teamsSetup.data_path, 'result.csv')

            if (teamsSetup.cck2_output_files == 'r_*') {
                try {
                    const buf = fs.readFileSync(
                        path.join(teamsSetup.data_path, 'info.json'),
                        'utf-8'
                    )
                    this.debug = JSON.parse(buf)
                    this.debug.cnt = 0
                    this.debug.pos = 1
                } catch (e) {
                    console.log(
                        'Failed to load debug info - is r_* the file you want to use as input file?'
                    )
                }
            }
            const cck2 = teamsSetup.cck2_output_files.split(',')
            this.cck2Files = []
            for (let i = 0; i < cck2.length; ++i) {
                this.cck2Files[i] = path.join(cck2path, cck2[i].trim())
            }

            const extra = teamsSetup.additional_data.split(',')
            this.extraFiles = []
            for (let i = 0; i < extra.length; ++i) {
                let file = extra[i].trim()
                if (file != '') {
                    file = path.join(teamsSetup.data_path, file)
                    if (fs.existsSync(file)) {
                        this.extraFiles[i] = file
                    }
                }
            }

            this.readPlayerDB(path.join(teamsSetup.data_path, teamsSetup.player_data)) // add data of remaining players
        }

        this.readResultDB()
    }

    do(): void {
        const cck2Result: Bahn[] = this.readCck2Result()
        this.updateResult(cck2Result)
        this.updateExtra()

        this.writeResultDB()
        this.writeSingleResult()
        this.writeTeamResult()
    }

    private readPlayerDB(playerDB: string): void {
        const buf = fs.readFileSync(playerDB, 'utf-8')
        const lines = buf.split('\n')
        lines.forEach((l) => {
            const ll = l.replace('\r', '')
            if (ll.search('[;,]') >= 0) {
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
                let file = f
                if (
                    this.debug.start.length > 0 &&
                    this.debug.cnt != undefined &&
                    this.debug.pos != undefined
                ) {
                    file = f.slice(0, -1) + ('0000' + this.debug.cnt).slice(-4) + '.json'
                    // increment position by some steps to make replay fast
                    // has to stop before current start entry
                    this.debug.cnt += 50
                    if (this.debug.cnt >= this.debug.start[this.debug.pos]) {
                        this.debug.cnt = this.debug.start[this.debug.pos] - 1
                        if (this.debug.pos < this.debug.start.length - 1) {
                            this.debug.pos++
                        }
                    }
                }

                let buf = fs.readFileSync(file, 'utf-8')
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

    private writeTeamResult(): void {
        // map players into teams per group and mixed
        const teams = new Map<string, Map<string, Team>>()
        teams.set('mixed', new Map<string, Team>())
        this.players.forEach((p) => {
            const group = p.group
            const team = p.team
            if (!teams.has(group)) {
                teams.set(group, new Map<string, Team>())
            }
            const tg = teams.get(group)
            if (tg) {
                if (!tg.has(team)) {
                    tg.set(team, new Team())
                }
                const tgt = tg.get(team)
                if (tgt) {
                    tgt.addPlayer(p)
                }
            }
            const tm = teams.get('mixed')
            if (tm) {
                if (!tm.has(team)) {
                    tm.set(team, new Team())
                }
                const tmt = tm.get(team)
                if (tmt) {
                    tmt.addPlayer(p)
                }
            }
        })

        // extract teams and sort
        teams.forEach((g, key) => {
            // extract teams in group
            const teamGroup: Team[] = []
            g.forEach((t) => {
                teamGroup.push(t)
            })
            teamGroup.sort(TeamCompare)
            fs.writeFileSync(
                path.join(this.resultOutputPath, 'team_' + key + '.json'),
                JSON.stringify(teamGroup)
            )
        })
    }

    private updateExtra(): void {
        const extras = new Map<string, Extra[]>()
        try {
            this.extraFiles.forEach((extraFile) => {
                const buf = fs.readFileSync(extraFile).toString()
                const lines = buf.split('\n')
                lines.forEach((line) => {
                    if (line.search(';') >= 0) {
                        const es = line.replace('\r', '').split(';')
                        if (es.length == 3) {
                            if (!extras.has(es[0])) {
                                extras.set(es[0], [new Extra(Number(es[1]), es[2])])
                            } else {
                                const ees = extras.get(es[0])
                                if (ees) {
                                    ees.push(new Extra(Number(es[1]), es[2]))
                                }
                            }
                        } else {
                            throw 'Expecting 3 entries per row in extra file'
                        }
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
        extras.forEach((v, k) => {
            if (this.players.has(k)) {
                const pk = this.players.get(k)
                if (pk) {
                    pk.setExtra(v)
                }
            }
        })
    }
}

export default PlayerProcessing
