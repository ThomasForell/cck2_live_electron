import * as fs from 'fs'
import * as path from 'path'

import Team, { TeamCompare } from './Team'

import Player from './Player'
import { Extra } from './Player'
import { Cck2Result } from './Player'
import { PlayerCompare } from './Player'

import { TeamsConfig } from '../renderer/src/cck2_live_interface/LiveConfig'

class TeamProcessing {
    private resultDB = ''
    private players = new Map<string, Player>()
    private cck2File = ''
    private resultOutputPath = ''
    private extraFiles = new Array<string>()

    constructor(teamSetup: TeamsConfig) {
        this.resultOutputPath = teamSetup.data_path
        this.resultDB = path.join(teamSetup.data_path, 'result.csv')
        this.cck2File = teamSetup.cck2_output_files
        const extraFiles = teamSetup.additional_data.split(',')
        extraFiles.forEach((ef) => {
            this.extraFiles.push(path.join(teamSetup.data_path, ef.trim()))
        })

        this.readResultDB()
        this.readPlayerDB(path.join(teamSetup.data_path, teamSetup.player_data)) // add data of remaining players
    }

    do(): void {
        const cck2Result = this.readCck2Result()
        this.updateResult(cck2Result)
        this.updateExtra()

        this.writeResultDB()
        this.writeTeamResult()
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
        } catch {}
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

    private updateExtra(): void {
        const extras = new Map<string, Array<Extra>>()
        try {
            this.extraFiles.forEach((extraFile) => {
                const buf = fs.readFileSync(extraFile).toString()
                const lines = buf.split('\n')
                lines.forEach((line) => {
                    if (line.search(';') >= 0) {
                        const es = line.replace('\r', '').split(';')
                        if (!extras.has(es[0])) {
                            extras.set(es[0], [new Extra(Number(es[1]), es[2])])
                        } else {
                            const ees = extras.get(es[0])
                            if (ees) {
                                ees.push(new Extra(Number(es[1]), es[2]))
                            }
                        }
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
        extras.forEach((v, k) => {
            if (this.players.has(k)) {
                const pk = this.players.get(k);
                if (pk) {
                    pk.setExtra(v)
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
            const teamGroup = [] as Array<Team>
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

    private writeSingleResult(): void {
        const groups = new Map<string, Array<Player>>()

        // split by group
        this.players.forEach((p) => {
            if (!groups.has(p.group)) {
                groups.set(p.group, [p])
            } else {
                const gp = groups.get(p.group)
                if (gp) {
                    gp.push(p)
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

export default TeamProcessing
