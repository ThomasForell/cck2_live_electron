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
                    showTeamData(data.mannschaft)
                    showTeamLogos(teamData[i].logo)
                    showLaneData(data.bahn, teamData[i].num_lanes)
                })
            break
        }
        timeCounter += teamData[i].time_values[0]
    }
}

function showTeamData(teams) {
    try {
        teams.forEach((t, i) => {
            let el = document.getElementById('team' + i)
            el.innerHTML = t.name
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
                let id = 'spieler' + i + '' + j + 'r'
                el = document.getElementById(id)
                if (el != null) {
                    el.innerHTML = t.spieler[j].gesamt
                }
            }
            el = document.getElementById('team_total_' + i)
            el.innerHTML = t.gesamt
        })
    } catch (ex) {
        console.error('showTeamData', ex.message)
    }
}

function showTeamLogos(logos) {
    logos.forEach((logo, i) => {
        const el = document.getElementById('team' + i + '_img')
        el.src = 'logos/team/' + logo + '?' + Date.now().toString()
    })
}

function showLaneData(lane, nLanes) {
    const right = nLanes == 8 && window.location.pathname.search('Rechts') >= 0
    const offset = right ? 4 : 0
    const numLanesShow = 4
    try {
        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_name_' + (laneCnt - offset))
            var spieler = lane[laneCnt].spielername
            if (lane[laneCnt].spielername_aw) {
                spieler = lane[laneCnt].spielername_aw
            }
            el.innerHTML = spieler
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_team_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].mannschaft
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_total_w_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].wurf
            el = document.getElementById('lane_total_g_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].gesamt
        }

        for (let laneCnt = offset; laneCnt < numLanesShow + offset; laneCnt++) {
            let el = document.getElementById('lane_heat_w_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].durchgang_wurf
            el = document.getElementById('lane_heat_g_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].durchgang_gesamt
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
