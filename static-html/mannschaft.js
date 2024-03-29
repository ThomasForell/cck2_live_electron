
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
        showTeam(config.teams, reducedOutput);
        showAdv(config.werbung);
      });
  } catch (ex) {
    console.error("showData", ex.message);
  }
}

async function showTeam(configTeams, reducedOutput) {
  var timeTotalTeams = 0;
  for (var i = 0; i < configTeams.length; ++i) {
    timeTotalTeams += configTeams[i].anzeigedauer_s;
  }
  var timeCurrent = Math.trunc(Date.now() / 1000) % timeTotalTeams;
  // find team to load
  var timeCounter = 0;
  for (var i = 0; i < configTeams.length; ++i) {
    if (timeCurrent >= timeCounter && timeCurrent < timeCounter + configTeams[i].anzeigedauer_s) {
      const requestURL = configTeams[i].token_datei + "?" + Date.now().toString();
      fetch(requestURL)
        .then((response) => { return response.text(); })
        .then((decoded) => {
          if (decoded.charCodeAt(0) === 0xFEFF) {
            decoded = decoded.substring(1);
          }
          const data = JSON.parse(decoded);
            
          showTeamData(data.mannschaft, configTeams[i].anzahl_spieler, configTeams[i].anzahl_saetze, 
            configTeams[i].satzpunkte_anzeigen == "ja", reducedOutput);          
          showTeamLogos(configTeams[i].bild_heim, configTeams[i].bild_gast);
          showLaneData(data.bahn, configTeams[i].bahn_anzeigen, configTeams[i].anzahl_bahnen, configTeams[i].satzpunkte_anzeigen == "ja");
        });
      break;  
    }  
    timeCounter += configTeams[i].anzeigedauer_s;
  }
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

function showTeamData(teams, teamSize, setCount, displaySP, reducedOutput) {
  try {
    var team = teams[0];
    var el = document.getElementById("mannschaft0");
    var gesamt_diff = teams[0].gesamt - teams[1].gesamt;
    if (gesamt_diff >= 0)
      el.innerHTML = team.name + " (+" + gesamt_diff + ")";
    else
      el.innerHTML = team.name;
    el = document.getElementById("gesamt0");
    if (!reducedOutput)
    {
      el.innerHTML = team.volle;
      el = el.parentElement.nextElementSibling.firstChild;
      el.innerHTML = team.abr;
      el = el.parentElement.nextElementSibling.firstChild;
      el.innerHTML = team.f;
      el = el.parentElement.nextElementSibling.firstChild;
    }
    el.innerHTML = team.gesamt;
    el = el.parentElement.nextElementSibling.firstChild;
    if (displaySP)
      el.innerHTML = team.mp;
    else
      el.innerHTML = "";

    el = document.getElementById("mp_center");
    if (el != null) {
      if (displaySP) 
        el.innerHTML = teams[0].mp + " : " + teams[1].mp
      else
        el.innerHTML = ""
    }

    var spielerArray = team.spieler;
    for (var i = 0; i < teamSize; i++) {
      var spieler = spielerArray[i];
      el = document.getElementById("spieler0" + i.toString());
      if (spieler.spielername_aw === "") {
        el.innerHTML = spieler.spielername;
      }
      else {
        el.innerHTML = reducePlayerName(spieler.spielername) + " | " + reducePlayerName(spieler.spielername_aw);
      }
      el = el.parentElement.nextElementSibling.firstChild;
      if (!reducedOutput)
      {
        el.innerHTML = spieler.wurf;
        el = el.parentElement.nextElementSibling.firstChild;
      }      
      var satzArray = spieler.satz;
      for (var j = 0; j < setCount; j++) {
        el.innerHTML = satzArray[j];
        el = el.parentElement.nextElementSibling.firstChild;
      }
      for (var j = setCount; j < 4; ++j)
      {
        el.innerHTML = "";
        el = el.parentElement.nextElementSibling.firstChild;
      }
      el.innerHTML = spieler.gesamt;
      el = el.parentElement.nextElementSibling.firstChild;
      if (displaySP) 
        el.innerHTML = spieler.sp;
      else
        el.innerHTML = "";
    }

    team = teams[1];
    el = document.getElementById("mannschaft1");
    if (gesamt_diff <= 0)
      el.innerHTML = "(+" + (-gesamt_diff) + ") " + team.name;
    else
      el.innerHTML = team.name;
    el = document.getElementById("gesamt1");
    if (!reducedOutput)
    {
      el.innerHTML = team.volle;
      el = el.parentElement.previousElementSibling.firstChild;
      el.innerHTML = team.abr;
      el = el.parentElement.previousElementSibling.firstChild;
      el.innerHTML = team.f;
      el = el.parentElement.previousElementSibling.firstChild;
    }
    el.innerHTML = team.gesamt;
    el = el.parentElement.previousElementSibling.firstChild;
    if (displaySP)
      el.innerHTML = team.mp;
    else
      el.innerHTML = "";
    spielerArray = team.spieler;
    for (var i = 0; i < teamSize; i++) {
      var spieler = spielerArray[i];
      el = document.getElementById("spieler1" + i.toString());
      if (spieler.spielername_aw === "") {
        el.innerHTML = spieler.spielername;
      }
      else {
        el.innerHTML = reducePlayerName(spieler.spielername) + " | " + reducePlayerName(spieler.spielername_aw);
      }
      el = el.parentElement.previousElementSibling.firstChild;
      if (!reducedOutput)
      {      
        el.innerHTML = spieler.wurf;
        el = el.parentElement.previousElementSibling.firstChild;
      }      
      var satzArray = spieler.satz;
      for (var j = 0; j < setCount; j++) {
        el.innerHTML = satzArray[j];
        el = el.parentElement.previousElementSibling.firstChild;
      }
      for (var j = setCount; j < 4; ++j) {
        el.innerHTML = "";
        el = el.parentElement.previousElementSibling.firstChild;
      }
      el.innerHTML = spieler.gesamt;
        el = el.parentElement.previousElementSibling.firstChild;
      if (displaySP)
        el.innerHTML = spieler.sp;
      else
        el.innerHTML = "";
    }

    // clear rows
    var columnCount = 7;
    if (!reducedOutput)
      ++columnCount;
    for (var i = teamSize; i < 6; ++i) {
      el = document.getElementById("spieler0" + i.toString());
      for (var j = 0; j < columnCount * 2 - 1; ++j, el = el.parentElement.nextElementSibling.firstChild) 
        el.innerHTML = "";  
      el.innerHTML = "";
    }
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

function showLaneData(lane, showLanes, numLanes, showSetPoints) {
  try {
    var el = document.getElementById("display4lanes");
    if (el != null) {
      el.hidden = (numLanes != 4 || !showLanes);
    }
    var el = document.getElementById("display6lanes");
    if (el != null) {
      el.hidden = (numLanes != 6  || !showLanes);
    }
    if (!showLanes) {
      return;
    }

    var el = document.getElementById("name" + numLanes + "lanes");
    for (laneCnt = 0; laneCnt < numLanes; laneCnt++) {
      var spieler = lane[laneCnt].spielername;
      if (showSetPoints) {
        spieler += " (" + lane[laneCnt].sp + ")";
      }
      el.innerHTML = spieler;
      if (laneCnt < numLanes -1) {
        el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
      }
    }

    var el = document.getElementById("team" + numLanes + "lanes");
    for (laneCnt = 0; laneCnt < numLanes; laneCnt++) {
      el.innerHTML = lane[laneCnt].mannschaft;
      if (laneCnt < numLanes -1) {
        el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
      }
    }

    var el = document.getElementById("total" + numLanes + "lanes");
    for (laneCnt = 0; laneCnt < numLanes; laneCnt++) {
      el.innerHTML = lane[laneCnt].wurf;
      el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
      el.innerHTML = lane[laneCnt].gesamt;
      if (laneCnt < numLanes -1) {
        el = el.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstChild;
      }
    }

    var el = document.getElementById("heat" + numLanes + "lanes");
    for (laneCnt = 0; laneCnt < numLanes; laneCnt++) {
      el.innerHTML = lane[laneCnt].durchgang_wurf;
      el = el.parentElement.nextElementSibling.nextElementSibling.firstChild;
      el.innerHTML = lane[laneCnt].durchgang_gesamt;
      if (laneCnt < numLanes -1) {
        el = el.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstChild;
      }
    }
  } catch (ex) {
    console.error("writeBahn", ex.message);
  }
}
