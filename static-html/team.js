
async function showData(configSrc, reducedOutput) {
    try {
        const requestURL = configSrc + "?" + Date.now().toString();
        fetch(requestURL)
            .then((response) => { return response.text(); })
            .then((decoded) => {
                if (decoded.charCodeAt(0) === 0xFEFF) {
                    decoded = decoded.substring(1);
                }
                const config = JSON.parse(decoded);
                showTeam();
                showAdv(config.werbung);
            });
    } catch (ex) {
        console.error("showData", ex.message);
    }
}

async function showTeam() {
    // find team to load
    const requestURL = "result.json" + "?" + Date.now().toString();
    fetch(requestURL)
        .then((response) => { return response.text(); })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xFEFF) {
                decoded = decoded.substring(1);
            }
            const data = JSON.parse(decoded);

            try {
                let offset = 0;
                if (window.location.pathname.search("Rechts") >= 0) {
                    offset = 4;
                }
                showLaneData(data.bahn, true, 4, offset, false);
            }
            catch {
                console.log(e);
            }
        });


    const requestTeamURL = "team_m.json" + "?" + Date.now().toString();
    fetch(requestTeamURL)
        .then((response) => { return response.text(); })
        .then((decoded) => {
            if (decoded.charCodeAt(0) === 0xFEFF) {
                decoded = decoded.substring(1);
            }
            const data = JSON.parse(decoded);

            try {
                showTeamData(data);
            }
            catch (e) {
                console.log(e);
            }
        });
    
}

async function showAdv(configAdv) {
    var showAdv = false;
    if (configAdv.length > 0) {
        showAdv = configAdv[0].werbung_anzeigen;
    }
    var el = document.getElementById("displayAdv");
    if (el != null) {
        el.hidden = !showAdv;
    }
    if (showAdv) {
        if (configAdv.length > 0) {
            var timeTotalWerbung = 0;
            for (var i = 0; i < configAdv.length; ++i) {
                timeTotalWerbung += configAdv[i].anzeigedauer_s;
            }
            var timeCurrent = Math.trunc(Date.now() / 1000) % timeTotalWerbung;

            // find adv to load
            var timeCounter = 0;
            for (var i = 0; i < configAdv.length; ++i) {
                if (timeCurrent >= timeCounter && timeCurrent < timeCounter + configAdv[i].anzeigedauer_s) {
                    loadWerbung(configAdv[i].bild, "img_center");
                    loadWerbung(configAdv[i].bild, "img_1");
                    // find next picture
                    var nextPic = null;
                    for (var j = i + 1; j < configAdv.length && nextPic == null; ++j) {
                        if (configAdv[j].anzeigedauer_s > 0) {
                            nextPic = configAdv[j].bild;
                        }
                    }
                    for (var j = 0; j <= i && nextPic == null; ++j) {
                        if (configAdv[j].anzeigedauer_s > 0) {
                            nextPic = configAdv[j].bild;
                        }
                    }
                    if (nextPic != null) {
                        loadWerbung(nextPic, "img_2");
                    }
                    break;
                }
                timeCounter += configAdv[i].anzeigedauer_s;
            }
        }
    }
}

function showTeamLogos(imgHome, imgGuest) {
    var imgReplace = document.getElementById("img_home")
    imgReplace.src = "logos/team/" + imgHome + "?" + Date.now().toString();
    imgReplace = document.getElementById("img_guest")
    imgReplace.src = "logos/team/" + imgGuest + "?" + Date.now().toString();
}

function reducePlayerName(name) {
    const posCommaSpace = name.search(", ");
    if (posCommaSpace > 0) {  // Bavarian name notation  
        return name.slice(0, posCommaSpace);  // return first part of name
    }
    const posSpace = name.search(" ");
    if (posSpace > 0) {
        return name.slice(posSpace + 1);  // return second part of name
    }
    return name;
}

function showTeamData(teams) {
    try {
        teams.forEach((t, i) => {
            var el = document.getElementById("team0" + Number(7-i));
            el.innerHTML = t.player[0].team;
            el = el.parentElement;
            el = el.nextElementSibling;
            el = el.firstChild;
            el.innerHTML = t.result.all;
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = t.result.clear;
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = t.result.fault;
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = t.result.total;
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = (t.extra[0]).toFixed(2);
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = (t.extra[1]).toFixed(2);
            el = el.parentElement.nextElementSibling.firstChild;
            el.innerHTML = (t.result.total + t.extra[1] + t.extra[0]).toFixed(2);
      });
    } catch (ex) {
        console.error("showTeamData", ex.message);
    }
}

function loadWerbung(img, id) {
    var imgReplace = document.getElementById(id)
    if (imgReplace) {
        imgReplace.src = "logos/adv/" + img + "?" + Date.now().toString();
    }
}

function showLaneData(lane, showLanes, numLanes, offset, showSetPoints) {
    try {
        var el = document.getElementById("display4lanes");
        if (el != null) {
            el.hidden = (numLanes != 4 || !showLanes);
        }
        if (!showLanes) {
            return;
        }

        var el = document.getElementById("name" + numLanes + "lanes");
        for (laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            var spieler = lane[laneCnt].spielername;
            if (lane[laneCnt].spielername_aw) {
                spieler = lane[laneCnt].spielername_aw
            }
            el.innerHTML = spieler;
            if (laneCnt < offset + numLanes - 1) {
                el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
            }
        }

        var el = document.getElementById("team" + numLanes + "lanes");
        for (laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            el.innerHTML = lane[laneCnt].mannschaft;
            if (laneCnt < offset + numLanes - 1) {
                el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
            }
        }

        var el = document.getElementById("total" + numLanes + "lanes");
        for (laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            el.innerHTML = lane[laneCnt].wurf;
            el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
            el.innerHTML = lane[laneCnt].gesamt;
            if (laneCnt < offset + numLanes - 1) {
                el = el.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstChild;
            }
        }

        var el = document.getElementById("heat" + numLanes + "lanes");
        for (laneCnt = offset; laneCnt < numLanes + offset; laneCnt++) {
            el.innerHTML = lane[laneCnt].durchgang_wurf;
            el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
            el.innerHTML = lane[laneCnt].durchgang_gesamt;
            if (laneCnt < offset + numLanes - 1) {
                el = el.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstChild;
            }
        }
    } catch (ex) {
        console.error("writeBahn", ex.message);
    }
}
