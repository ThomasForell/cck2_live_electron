function GenerateSprintResultTableTwo(offset1, offset2) {
    return '<table class="tg">'
  + '<tr>'
  + '  <td class="label"><div class="block-cap">Team</div></td>'
  + '  <td class="label"><div class="block-num">Wurf</div></td>'
  + '  <td class="label"><div class="block-num">Satz 1</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 1</div></td>'
  + '  <td class="label"><div class="block-num">Satz 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV</div></td>'
  + '  <td class="free"></td>'
  + '  <td class="label"><div class="block-cap">Team</div></td>'
  + '  <td class="label"><div class="block-num">Wurf</div></td>'
  + '  <td class="label"><div class="block-num">Satz 1</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 1</div></td>'
  + '  <td class="label"><div class="block-num">Satz 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV</div></td>'
  + ' </tr>'
  + ' <tr>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset1 + '_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset1 + '_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_0_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_0_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_1_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_1_0"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset1 + '_0"></div></td>'
  + '  <td class="free"></td>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset2 + '_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset2 + '_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset2 + '_0_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset2 + '_0_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_ '+ offset2 + '_1_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset2 + '_1_0"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset2 + '_0"></div></td>'
  + ' </tr>'
  + ' <tr>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset1 + '_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset1 + '_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_0_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_0_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_1_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_1_1"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset1 + '_1"></div></td>'
  + '  <td class="free"></td>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset2 + '_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset2 + '_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset2 + '_0_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset2 + '_0_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_ '+ offset2 + '_1_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset2 + '_1_1"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset2 + '_1"></div></td>'
  + '</tr>'
  + '</table>'
    }

function GenerateSprintResultTable(offset1) {
    return '<table class="tg" align="center">'
  + '<tr>'
  + '  <td class="label"><div class="block-cap">Team</div></td>'
  + '  <td class="label"><div class="block-num">Wurf</div></td>'
  + '  <td class="label"><div class="block-num">Satz 1</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 1</div></td>'
  + '  <td class="label"><div class="block-num">Satz 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV 2</div></td>'
  + '  <td class="label"><div class="block-num-sv">SV</div></td>'
  + ' </tr>'
  + ' <tr>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset1 + '_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset1 + '_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_0_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_0_0"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_'+ offset1 + '_1_0">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_1_0"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset1 + '_0"></div></td>'
  + ' </tr>'
  + ' <tr>'
  + '  <td class="data"><div class="block-cap" id="spieler_' + offset1 + '_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="wurf_' + offset1 + '_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_' + offset1 + '_0_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_0_1"></div></td>'
  + '  <td class="data-num"><div class="block-num" id="satz_'+ offset1 + '_1_1">0</div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="satz_sv_' + offset1 + '_1_1"></div></td>'
  + '  <td class="data-num"><div class="block-num-sv" id="sv_' + offset1 + '_1"></div></td>'
  + '</tr>'
  + '</table>'
    }

async function showData(configSrc, mode) {
    try {
        const config = null
        const requestURL = configSrc + "?" + Date.now().toString();
        fetch(requestURL)
            .then((response) => { return response.text(); })
            .then((decoded) => {
                if (decoded.charCodeAt(0) === 0xFEFF) {
                    decoded = decoded.substring(1);
                }
                const config = JSON.parse(decoded)
                
                let current_pos = document.getElementById("title")
                if (current_pos.innerHTML !== config.title) {
                    current_pos.innerHTML = config.title
                    if (mode === "display") {
                        numGames = config.num_matches_show
                        current_pos = document.getElementById("table")
                        current_pos.innerHTML = ""
                        if (numGames > 8) {
                            for (let i = 0; i < numGames / 2 - 1; ++i)
                                current_pos.innerHTML += GenerateSprintResultTableTwo(i, i + numGames / 2) + "<p></p>"
                            current_pos.innerHTML += GenerateSprintResultTableTwo(numGames / 2 - 1, numGames - 1)
                        } else {
                            for (let i = 0; i < numGames - 1; ++i)
                                current_pos.innerHTML += GenerateSprintResultTable(i) + "<p></p>"
                            current_pos.innerHTML += GenerateSprintResultTable(numGames - 1)
                        }
                    } else {
                        let numGames = config.num_matches_show 
                        current_pos = document.getElementById("table")
                        current_pos.innerHTML = ""
                        if (numGames > 1) {
                            for (let i = 0; i < numGames / 2 - 1; i += 2)
                                current_pos.innerHTML += GenerateSprintResultTableTwo(i, i + 1) + "<p></p>"
                            current_pos.innerHTML += GenerateSprintResultTableTwo(numGames - 2, numGames - 1)
                        }
                        else 
                            current_pos.innerHTML += GenerateSprintResultTable(0)
                    }
                }

                fetch(config.result_file + "?" + Date.now().toString()) 
                fetch("result.json" + "?" + Date.now().toString()) 
                    .then((response) => { return response.text(); })        
                    .then((decoded) => {
                        if (decoded.charCodeAt(0) === 0xFEFF) {
                            decoded = decoded.substring(1);
                        }
                        const results = JSON.parse(decoded);
                        fetch(config.result_file_sv + "?" + Date.now().toString()
                        ).then((response) => { return response.text(); }
                        ).then((decoded_sv) => {
                            if (decoded_sv.charCodeAt(0) === 0xFEFF) {
                                decoded_sv = decoded_sv.substring(1);
                            }
                            const sv = JSON.parse(decoded_sv);
                        
                            if (typeof sv === 'string' || sv instanceof String) {
                                // no extra sv file -> use sv data from results
                                showSprintData(config, results, results);
                            } else {
                                showSprintData(config, results, sv);
                            }
                        })
                    })
            })
    } catch (ex) {
        console.error("showData", ex.message);
    }
}

function compare2highlight(a, b)
{
    const highlight_bg = ["#FFFFFF", "#50C878", "#FFDB58"]
    if (a == b) {
        if (a == 0) {
            return highlight_bg[0]
        }
        return highlight_bg[2]
    }

    if (a < b) {
        return highlight_bg[0]
    } else {
        return highlight_bg[1]
    }
} 

async function showSprintData(config, result, sv) {
    try {
        let el = document.getElementById("title")
        if (el != null) {
            el.innerHTML = config.title;
        }
        for (let match = 0; match < config.num_matches_show; ++match) {
           const p1 = result.sprint[2 * (config.match_offset + match)]
           const p1sv = sv.sprint[2 * (config.match_offset + match)]
           const p2 = result.sprint[2 * (config.match_offset + match) + 1]
           const p2sv = sv.sprint[2 * (config.match_offset + match) + 1]
            el = document.getElementById("spieler_" + match + "_0")
            if (el != null) {
                el.innerHTML = p1.spielername + " (" + p1.verein + ")";
            }
            el = document.getElementById("wurf_" + match + "_0")
            if (el != null) {
                el.innerHTML = p1.wurf
            }
            el = document.getElementById("satz_" + match + "_0_0")
            if (el != null) {
                el.innerHTML = p1.satz[0]
                el.style.backgroundColor = compare2highlight(p1.satz[0], p2.satz[0])
            }
            el = document.getElementById("satz_sv_" + match + "_0_0")
            if (el != null) {
                el.innerHTML = p1sv.sv[0]
                el.style.backgroundColor = compare2highlight(p1sv.sv[0], p2sv.sv[0])
            }
            el = document.getElementById("satz_" + match + "_1_0")
            if (el != null) {
                el.innerHTML = p1.satz[1]
                el.style.backgroundColor = compare2highlight(p1.satz[1], p2.satz[1])
            }
            el = document.getElementById("satz_sv_" + match + "_1_0")
            if (el != null) {
                el.innerHTML = p1sv.sv[1]
                el.style.backgroundColor = compare2highlight(p1sv.sv[1], p2sv.sv[1])
            }
            el = document.getElementById("sv_" + match + "_0")
            if (el != null) {
                el.innerHTML = p1sv.sv[2]
                el.style.backgroundColor = compare2highlight(p1sv.sv[2], p2sv.sv[2])
            }

            el = document.getElementById("spieler_" + match + "_1")
            if (el != null) {
                el.innerHTML = p2.spielername + " (" + p2.verein + ")";
            }
            el = document.getElementById("wurf_" + match + "_1")
            if (el != null) {
                el.innerHTML = p2.wurf
            }
            el = document.getElementById("satz_" + match + "_0_1")
            if (el != null) {
                el.innerHTML = p2.satz[0]
                el.style.backgroundColor = compare2highlight(p2.satz[0], p1.satz[0])
            }
            el = document.getElementById("satz_sv_" + match + "_0_1")
            if (el != null) {
                el.innerHTML = p2sv.sv[0]
                el.style.backgroundColor = compare2highlight(p2sv.sv[0], p1sv.sv[0])
            }
            el = document.getElementById("satz_" + match + "_1_1")
            if (el != null) {
                el.innerHTML = p2.satz[1]
                el.style.backgroundColor = compare2highlight(p2.satz[1], p1.satz[1])
            }
            el = document.getElementById("satz_sv_" + match + "_1_1")
            if (el != null) {
                el.innerHTML = p2sv.sv[1]
                el.style.backgroundColor = compare2highlight(p2sv.sv[1], p1sv.sv[1])
            }
            el = document.getElementById("sv_" + match + "_1")
            if (el != null) {
                el.innerHTML = p2sv.sv[2]
                el.style.backgroundColor = compare2highlight(p2sv.sv[2], p1sv.sv[2])
            }
        }
    } 
    catch (e) {
        console.log(e);
    }
}
