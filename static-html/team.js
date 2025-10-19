async function showTeam() {
    // load configuration
    const requestURL = window.location.pathname.slice(0, -4) + 'json' + '?' + Date.now().toString()
    fetch(requestURL)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            const data = JSON.parse(decoded)
            showData(data)
        })
}

async function showTeamCompetition() {
    // load configuration
    const requestURL = window.location.pathname.slice(0, -4) + 'json' + '?' + Date.now().toString()
    fetch(requestURL)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            const data = JSON.parse(decoded)
            showDataCompetition(data)
        })
}

async function showDataCompetition(data) {
    fetch(data[0])
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xfeff) {
                decoded = decoded.substring(1)
            }
            const teamData = JSON.parse(decoded)
            fetch(data[1])
                .then((response) => {
                    return response.text()
                })
                .then((decoded) => {
                    if (decoded.charCodeAt(0) === 0xfeff) {
                        decoded = decoded.substring(1)
                    }
                    const singleData = JSON.parse(decoded)
                    showCompetition(teamData, singleData)
                })
        })
}

async function showCompetition(teamData, singleData) {
    const timeTotalTeams = teamData.time * teamData.files.length
    const timeTotalSingle = singleData.time * singleData.files.length

    const timeCurrent = Math.trunc(Date.now() / 1000) % (timeTotalTeams + timeTotalSingle)
    // find team or single to load
    if (timeCurrent < timeTotalTeams) {
        const id = Math.trunc(timeCurrent / teamData.time)
        const requestURL = teamData.files[id] + '?' + Date.now().toString()
        fetch(requestURL)
            .then((response) => {
                return response.text()
            })
            .then((decoded) => {
                if (decoded.charCodeAt(0) === 0xfeff) {
                    decoded = decoded.substring(1)
                }
                const data = JSON.parse(decoded)
                showTeamCompetitionData(data, teamData.group_names[id])
            })
    } else 
    {
        const id = Math.trunc((timeCurrent - timeTotalTeams) / singleData.time)
        const requestURL = singleData.files[id] + '?' + Date.now().toString()
        fetch(requestURL)
            .then((response) => {
                return response.text()
            })
            .then((decoded) => {
                if (decoded.charCodeAt(0) === 0xfeff) {
                    decoded = decoded.substring(1)
                }
                const data = JSON.parse(decoded)
                showSingleCompetitionData(data, singleData.group_names[id])
            })  
    }
}

async function showTeamCompetitionData(data, group) {
    let el = document.getElementById('table-single')
    if (el != null) {
        el.hidden = true
    }
    el = document.getElementById('table-team')
    if (el != null) {
        el.hidden = false
    }
    el = document.getElementById('title')
    if (el != null) {
        el.innerHTML = group
    }   
    
    data.forEach((t, i) => {
        el = document.getElementById('team' + i.toString())
        if (el != null) { 
            el.innerHTML = t.players[0].team
        }
        el = document.getElementById('team' + i.toString() + '_img')
        if (el != null) {
            el.src = 'logos/team/' + t.players[0].team + '.png?' + Date.now().toString()
        } 
        t.players.forEach((p, j) => {
            el = document.getElementById('spieler' + i.toString() + '' + j.toString())
            if (el != null) {
                el.innerHTML = p.name
            }
            el = document.getElementById('spieler' + i.toString() + '' + j.toString() + 'r')
            if (el != null) {
                let tot = 0;
                p.results.forEach((res) => {
                    tot += res.total
                })
                el.innerHTML = tot.toString();
            }
        })
        // clear remaining players
        if (t.players.length < 8) {
            for (let j = t.players.length; j < 8; ++j) {
                el = document.getElementById('spieler' + i.toString() + '' + j.toString())
                if (el != null) {
                    el.innerHTML = ''
                }
                el = document.getElementById('spieler' + i.toString() + '' + j.toString() + 'r')
                if (el != null) {
                    el.innerHTML = '0'
                }
            }
        }
        el = document.getElementById('team_total_' + i.toString())
        if (el != null) {
            el.innerHTML = t.result.total.toString()
        }
    })
    for (let i = data.length; i < 12; ++i) {
        el = document.getElementById('team' + i.toString())
        if (el != null) { 
            el.innerHTML = ''
        }
        el = document.getElementById('team' + i.toString() + '_img')
        if (el != null) {
            el.src = 'logos/team/Default.png?' + Date.now().toString()
        } 
        for (let j = 0; j < 8; ++j) {
            el = document.getElementById('spieler' + i.toString() + '' + j.toString())
            if (el != null) {
                el.innerHTML = ''
            }
            el = document.getElementById('spieler' + i.toString() + '' + j.toString() + 'r')
            if (el != null) {
                el.innerHTML = '0'
            }
        }
        el = document.getElementById('team_total_' + i.toString())
        if (el != null) {
            el.innerHTML = '0'
        }
    }   
}

async function showSingleCompetitionData(players, group) {
    let el = document.getElementById('table-team')
    if (el != null) {
        el.hidden = true
    }
    el = document.getElementById('table-single')
    if (el != null) {
        el.hidden = false
    }
    el = document.getElementById('title')
    if (el != null) {
        el.innerHTML = group
    }   

    players.forEach((p, i) => {
        let color = "#FFFFFF"
        if (p.active) {
            color = "#50C878"
        }
        el = document.getElementById('single_spieler_' + i.toString())
        if (el != null) {
            el.innerHTML = p.name
            el.style.backgroundColor = color
        }
        el = document.getElementById('single_mannschaft_' + i.toString())
        if (el != null) {
            el.innerHTML = p.mannschaft
            el.style.backgroundColor = color
        }
        el = document.getElementById('single_gesamt_' + i.toString())
        if (el != null) {
            el.innerHTML = p.gesamt
            el.style.backgroundColor = color
        }
    }) 
    for (let i = players.length; i < 50; ++i) {
        el = document.getElementById('single_spieler_' + i.toString())
        if (el != null) {
            el.innerHTML = ''
            el.style.backgroundColor = "#FFFFFF"
        }
        el = document.getElementById('single_mannschaft_' + i.toString())
        if (el != null) {
            el.innerHTML = ''
            el.style.backgroundColor = "#FFFFFF"
        }
        el = document.getElementById('single_gesamt_' + i.toString())
        if (el != null) {
            el.innerHTML = 0
            el.style.backgroundColor = "#FFFFFF"
        }
    }
}

async function showData(teamData) {
    let timeTotalTeams = 0;
    for (let i = 0; i < teamData.length; ++i) {
        timeTotalTeams += teamData[i].time_values[0]
    }
    const timeCurrent = Math.trunc(Date.now() / 1000) % timeTotalTeams
    // find team to load
    let timeCounter = 0;
    for (let i = 0; i < teamData.length; ++i) {
        if (timeCurrent >= timeCounter && timeCurrent < timeCounter + teamData[i].time_values[0]) {
            // show table caption
            let el = document.getElementById('title')
            if (el != null) {
                el.innerHTML = teamData[i].name
            }

            const requestURL = teamData[i].cck2_file + '?' + Date.now().toString()
            fetch(requestURL)
                .then((response) => {
                    return response.text()
                })
                .then((decoded) => {
                    if (decoded.charCodeAt(0) === 0xfeff) {
                        decoded = decoded.substring(1)
                    }
                    const data = JSON.parse(decoded)
                    if (teamData[i].set_points) {
                        // compute points for each team and player
                        for (let team = 0; team < 4; ++team) {
                            data.mannschaft[team].mp = 0
                            for (let player = 0; player < teamData[i].num_players; ++player) {
                                data.mannschaft[team].spieler[player].sp = [0, 0, 0, 0]
                                for (let set = 0; set < 4; ++set) {
                                    for (let opponent = 0; opponent < 4; ++opponent) {
                                        if (parseInt(data.mannschaft[team].spieler[player].satz[set]) 
                                            == parseInt(data.mannschaft[opponent].spieler[player].satz[set])
                                            && parseInt(data.mannschaft[team].spieler[player].satz[set]) != 0) {
                                            data.mannschaft[team].spieler[player].sp[set] += 0.5
                                        }
                                        if (parseInt(data.mannschaft[team].spieler[player].satz[set])
                                            > parseInt(data.mannschaft[opponent].spieler[player].satz[set])) {
                                                data.mannschaft[team].spieler[player].sp[set] += 1
                                        }
                                    }
                                    // add 0.5 point for compaison with oneself -> at least one point per set
                                    if (data.mannschaft[team].spieler[player].sp[set] > 0) {
                                        data.mannschaft[team].spieler[player].sp[set] += 0.5
                                    }
                                }
                                data.mannschaft[team].spieler[player].sp.forEach((sp) => {
                                    data.mannschaft[team].mp += sp
                                })
                            }
                        }

                        // compute ranking
                        for (let team = 0; team < 4; ++team) {
                            data.mannschaft[team].rank = 5
                            data.mannschaft[team].diff = 0
                            for (let opponent = 0; opponent < 4; ++opponent) {
                                data.mannschaft[team].diff = Math.min(data.mannschaft[team].diff, data.mannschaft[team].mp - data.mannschaft[opponent].mp)
                                if (data.mannschaft[team].mp > data.mannschaft[opponent].mp) {
                                    data.mannschaft[team].rank -= 1
                                }
                                else if (data.mannschaft[team].mp == data.mannschaft[opponent].mp) {
                                    if (data.mannschaft[team].gesamt > data.mannschaft[opponent].gesamt) {
                                        data.mannschaft[team].rank -= 1
                                    } else if (data.mannschaft[team].gesamt == data.mannschaft[opponent].gesamt) { 
                                        if (data.mannschaft[team].abr > data.mannschaft[opponent].abr) {
                                            data.mannschaft[team].rank -= 1
                                        }
                                        else if (data.mannschaft[team].abr == data.mannschaft[opponent].abr) {
                                            // shared rank (also with oneself -> start ranking at 5)
                                            data.mannschaft[team].rank -= 1
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // compute ranking
                        for (let team = 0; team < 4; ++team) {
                            data.mannschaft[team].rank = 5
                            data.mannschaft[team].diff = 0
                            for (let opponent = 0; opponent < 4; ++opponent) {
                                data.mannschaft[team].diff = Math.min(data.mannschaft[team].diff, data.mannschaft[team].gesamt - data.mannschaft[opponent].gesamt)
                                if (data.mannschaft[team].gesamt >= data.mannschaft[opponent].gesamt) {
                                    data.mannschaft[team].rank -= 1
                                }
                            }
                        }
                    }

                    showTeamData(data.mannschaft, teamData[i].set_points)
                    showTeamLogos(teamData[i].logo)
                    showLaneData(data.bahn, teamData[i].num_lanes)
                })
            break
        }
        timeCounter += teamData[i].time_values[0]
    }
}

function showTeamData(teams, set_points) {
    try {
        teams.forEach((t, i) => {
            let el = document.getElementById('team' + i)
            if (el != null) {
                el.innerHTML = t.name + ' - Platz ' + t.rank
                if (t.rank > 1) {
                    el.innerHTML += ' (' + t.diff + ')'
                }
            }
            for (let j = 0; j < t.spieler.length; ++j) {
                el = document.getElementById('spieler' + i + '' + j)
                if (el != null) {
                    if (t.spieler[j].spielername_aw === '') {
                        el.innerHTML = t.spieler[j].spielername
                    } else {
                        el.innerHTML =
                            reducePlayerName(t.spieler[j].spielername) +
                            ' | ' +
                            reducePlayerName(t.spieler[j].spielername_aw)
                    }
                }
                for (let k = 0; k < 4; ++k) {
                    let id = 'spieler' + i + '' + j + '' + k + 'r'
                    let el = document.getElementById(id)
                    if (el != null) {
                        el.innerHTML = t.spieler[j].satz[k]
                        if (set_points) {
                            el.innerHTML += ' | ' + t.spieler[j].sp[k]
                        }
                    }
                }
                let id = 'spieler' + i + '' + j + 'r'
                el = document.getElementById(id)
                if (el != null) {
                    el.innerHTML = t.spieler[j].gesamt
                    if (set_points) {
                        el.innerHTML += ' | ' + (t.spieler[j].sp[0] + t.spieler[j].sp[1] + t.spieler[j].sp[2] + t.spieler[j].sp[3])
                    }
                }
            }
            el = document.getElementById('team_total_' + i)
            if (el != null) {
                el.innerHTML = t.gesamt
                if (set_points) {
                    el.innerHTML += ' | ' + t.mp
                }
            }
        })
    } catch (ex) {
        console.error('showTeamData', ex.message)
    }
}

function showTeamLogos(logos) {
    logos.forEach((logo, i) => {
        const el = document.getElementById('team' + i + '_img')
        if (el != null) {
            el.src = 'logos/team/' + logo + '?' + Date.now().toString()
        }
    })
}

function showLaneData(lane, nLanes) {
    const right = nLanes == 8 && window.location.pathname.search('Rechts') >= 0
    const offset = right ? 4 : 0
    const numLanesShow = 4
    try {
        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_name_' + (laneCnt - offset))
            if (el != null) {
                var spieler = lane[laneCnt].spielername
                if (lane[laneCnt].spielername_aw) {
                    spieler = lane[laneCnt].spielername_aw
                }
                el.innerHTML = spieler
            }
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_team_' + (laneCnt - offset))
            if (el != null) {
                el.innerHTML = lane[laneCnt].mannschaft
            }
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_total_w_' + (laneCnt - offset))
            if (el != null) {
                el.innerHTML = lane[laneCnt].wurf
            }
            el = document.getElementById('lane_total_g_' + (laneCnt - offset))
            if (el != null) {
                el.innerHTML = lane[laneCnt].gesamt
            }
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_heat_w_' + (laneCnt - offset))
            if (el != null) {
                el.innerHTML = lane[laneCnt].durchgang_wurf
            }
            el = document.getElementById('lane_heat_g_' + (laneCnt - offset))
            if (el != null) {
                el.innerHTML = lane[laneCnt].durchgang_gesamt
            }
        }
    } catch (ex) {
        console.error('writeBahn', ex.message)
    }
}

function reducePlayerName(name) {
    const posCommaSpace = name.search(', ')
    if (posCommaSpace > 0) {
        // Bavarian name notation
        return name.slice(0, posCommaSpace) // return first part of name
    }
    const posSpace = name.search(' ')
    if (posSpace > 0) {
        return name.slice(posSpace + 1) // return second part of name
    }
    return name
}

async function showTeamCompetitionStream() {
    // load configuration
    const requestURL = window.location.pathname.slice(0, -4) + 'json' + '?' + Date.now().toString()
    fetch(requestURL)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xfeff) {
                decoded = decoded.substring(1)
            }
            const data = JSON.parse(decoded)
            showDataCompetitionStream(data[0])
        })
    fetch('result.json?' + Date.now().toString())
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xfeff) {
                decoded = decoded.substring(1)
            }
            const data = JSON.parse(decoded)
            showLaneData(data.bahn, 8)
        })
 } 

async function showDataCompetitionStream(data) {
    fetch(data)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xfeff) {
                decoded = decoded.substring(1)
            }
            const d = JSON.parse(decoded)
            showDataStream(d)
        })
}

async function showDataStream(teamData) {
    const timeTotalTeams = teamData.time * teamData.files.length

    const timeCurrent = Math.trunc(Date.now() / 1000) % timeTotalTeams
    // find team or single to load

    const id = Math.trunc(timeCurrent / teamData.time)
    const requestURL = teamData.files[id] + '?' + Date.now().toString()
    fetch(requestURL)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xfeff) {
                decoded = decoded.substring(1)
            }
            const data = JSON.parse(decoded)
            const group = teamData.group_names[id]

            el = document.getElementById('title')
            if (el != null) {
                el.innerHTML = group
            }   
            
            data.forEach((t, i) => {
                el = document.getElementById('team_' + i.toString())
                if (el != null) { 
                    el.innerHTML = t.players[0].team
                }
                el = document.getElementById('team_total_' + i.toString())
                if (el != null) {
                    el.innerHTML = t.result.total.toString()
                }
            })
            for (let i = data.length; i < 12; ++i) {
                el = document.getElementById('team_' + i.toString())
                if (el != null) { 
                    el.innerHTML = ''
                }
                el = document.getElementById('team_total_' + i.toString())
                if (el != null) {
                    el.innerHTML = '0'
                }
            }   
        })
}