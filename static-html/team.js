
async function showTeam() {
    // find team to load
    let right = window.location.pathname.search("Rechts") >= 0
    if (document.getElementById('lane_name_0')) {
        const requestURL = 'result.json' + '?' + Date.now().toString()
        fetch(requestURL)
            .then((response) => { return response.text(); })
            .then((decoded) => {
                if (decoded.charCodeAt(0) === 0xFEFF) {
                    decoded = decoded.substring(1);
                }
                const data = JSON.parse(decoded);

                try {
                    let offset = 0
                    if (right) {
                        offset = 4
                    }
                    showLaneData(data.bahn, offset)
                } catch (e) {
                    console.log(e)
                }
            });
    }

    let resultName = 'team_u23_w.json'
    if (right) {
        resultName = 'team_u23_m.json'
        let title = document.getElementById('title')
        if (title != null) {
            title.innerHTML = 'U23 männlich'
        }
    }
    const requestTeamURL = resultName + '?' + Date.now().toString()
    fetch(requestTeamURL)
        .then((response) => {
            return response.text()
        })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xFEFF) {
                decoded = decoded.substring(1);
            }
            const data = JSON.parse(decoded);

            try {
                showTeamData(data)
            } catch (e) {
                console.log(e)
            }
        })
}

function showTeamData(teams) {
    try {
        teams.forEach((t, i) => {
            let el = document.getElementById('team' + i)
            el.innerHTML = t.player[0].team
            el = document.getElementById('team' + i + '_img')
            if (t.player[0].team == 'Bayern') {
                el.src = 'logos/team/bayern.jpg?' + Date.now().toString()
            } else if (t.player[0].team == 'Hessen') {
                el.src = 'logos/team/hessen.jpg?' + Date.now().toString()
            } else if (t.player[0].team == 'Südbaden') {
                el.src = 'logos/team/suedbaden.jpg?' + Date.now().toString()
            } else if (t.player[0].team == 'Württemberg') {
                el.src = 'logos/team/wuerttemberg.jpg?' + Date.now().toString()
            }
            for (let j = 0; j < t.player.length; ++j) {
                el = document.getElementById('spieler' + i + '' + j)
                el.innerHTML = t.player[j].name
                let id = 'spieler' + i + '' + j + 'r'
                el = document.getElementById(id)
                if (el != null && t.player[j].results.length > 0) {
                    el.innerHTML =
                        t.player[j].results[0].total +
                        t.player[j].results[1].total +
                        t.player[j].results[2].total +
                        t.player[j].results[3].total
                }
            }
            for (let j = t.player.length; j < 8; ++j) {
                el = document.getElementById('spieler' + i + '' + j)
                el.innerHTML = ''
                el = document.getElementById('spieler' + i + '' + j + 'r')
                if (el != null) {
                    el.innerHTML = '0'
                }
            }
            el = document.getElementById('team_total_' + i)
            el.innerHTML = t.result.total
        })
    } catch (ex) {
        console.error("showTeamData", ex.message);
    }
}

function showLaneData(lane, offset) {
    const numLanes = 4
    try {
        for (let laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            let el = document.getElementById('lane_name_' + (laneCnt - offset))
            var spieler = lane[laneCnt].spielername
            if (lane[laneCnt].spielername_aw) {
                spieler = lane[laneCnt].spielername_aw
            }
            el.innerHTML = spieler
        }

        for (let laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            let el = document.getElementById('lane_team_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].mannschaft
        }

        for (let laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            let el = document.getElementById('lane_total_w_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].wurf
            el = document.getElementById('lane_total_g_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].gesamt
        }

        for (let laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            let el = document.getElementById('lane_heat_w_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].durchgang_wurf
            el = document.getElementById('lane_heat_g_' + (laneCnt - offset))
            el.innerHTML = lane[laneCnt].durchgang_gesamt
        }
    } catch (ex) {
        console.error('writeBahn', ex.message)
    }
}
