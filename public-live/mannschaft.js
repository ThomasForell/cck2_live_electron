
function showMannschaft(configSrc, reducedOutput) {
  try {
    var requestURL = configSrc + "?" + Date.now().toString();
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'arraybuffer';
    request.onload = loadConfigAndShow.bind(null, request, reducedOutput);
    request.send();
  } catch (ex) {
    console.error("showMannschaft", ex.message);
  }
}

function loadConfigAndShow(request, reducedOutput) {
  var decoder = new TextDecoder("utf8");
  try {  
    var config = JSON.parse(decoder.decode(request.response));
    var config_teams = config.teams;
    var config_werbung = config.werbung;
    var time_total_teams = 0;
    for (var i = 0; i < config_teams.length; ++i) {
      time_total_teams += config_teams[i].anzeigedauer_s;
    }
    var timeCurrent = Math.trunc(Date.now() / 1000) % time_total_teams;

    // find team to load
    var timeCounter = 0;
    for (var i = 0; i < config_teams.length; ++i) {
      if (timeCurrent >= timeCounter && timeCurrent < timeCounter + config_teams[i].anzeigedauer_s) {
        loadBilder(config_teams[i].bild_heim, config_teams[i].bild_gast);
        loadMannschaftData(config_teams[i].token_datei, config_teams[i].anzahl_spieler, config_teams[i].anzahl_saetze, 
        config_teams[i].satzpunkte_anzeigen == "ja", reducedOutput)
        if (config_teams[i].bahn_anzeigen) {     
          var el = document.getElementById("display4lanes");
          if (el != null) {
            el.hidden = config_teams[i].anzahl_bahnen != 4;
          }
          var el = document.getElementById("display6lanes");
          if (el != null) {
            el.hidden = config_teams[i].anzahl_bahnen != 6;
          }
          loadLaneData(config_teams[i].token_datei, config_teams[i].anzahl_bahnen, config_teams[i].satzpunkte_anzeigen == "ja");
        }
        else {
          var el = document.getElementById("display4lanes");
          if (el != null) {
            el.hidden = true;
          }
          var el = document.getElementById("display6lanes");
          if (el != null) {
            el.hidden = true;
          }
        }
        break;  
      }  
      timeCounter += config_teams[i].anzeigedauer_s;
    }

    // draw advertisments
    var showAdv = false;
    if (config_werbung.length > 0) {
      showAdv = config_werbung[0].werbung_anzeigen;
    }
    var el = document.getElementById("displayAdv");
    if (el != null) {
      el.hidden = !showAdv;
    }
    if (showAdv) {
      if (config_werbung.length > 0) {
        var time_total_werbung = 0;
        for (var i = 0; i < config_werbung.length; ++i) {
          time_total_werbung += config_werbung[i].anzeigedauer_s;
        }
        var timeCurrent = Math.trunc(Date.now() / 1000) % time_total_werbung;

        // find adv to load
        var timeCounter = 0;
        for (var i = 0; i < config_werbung.length; ++i) {
          if (timeCurrent >= timeCounter && timeCurrent < timeCounter + config_werbung[i].anzeigedauer_s) {
            loadWerbung(config_werbung[i].bild, "img_center");
            loadWerbung(config_werbung[i].bild, "img_1");
            var img_2_shown = false;
            for (var j = i + 1; j < config_werbung.length && !img_2_shown; ++j) {
              if (config_werbung[j].anzeigedauer_s > 0) {
                loadWerbung(config_werbung[j].bild, "img_2");
                img_2_shown = true;
              }
            }
            for (var j = 0; j < i && !img_2_shown; ++j) {
              if (config_werbung[j].anzeigedauer_s > 0) {
                loadWerbung(config_werbung[j].bild, "img_2");
                img_2_shown = true;
              }
            }
            if (!img_2_shown) {
              loadWerbung(config_werbung[i].bild, "img_2");
            }
            break;
          }
          timeCounter += config_werbung[i].anzeigedauer_s;
        }
      }
    }
  } catch (ex) {
      console.error("loadConfigAndShow", ex.message)
  }
}

function loadBilder(imgHome, imgGuest) {
  var imgReplace = document.getElementById("img_home")
  imgReplace.src = "logos/team/" + imgHome + "?" + Date.now().toString();
  imgReplace = document.getElementById("img_guest")
  imgReplace.src = "logos/team/" + imgGuest + "?" + Date.now().toString();
}

function loadMannschaftData(requestURL, teamSize, setCount, displaySP, reducedOutput) {
  try {
    var request = new XMLHttpRequest();
    request.open('GET', requestURL + "?" + Date.now().toString());
    request.responseType = 'arraybuffer';
    request.onload = writeMannschaft.bind(null, request, teamSize,
      setCount, displaySP, reducedOutput);
    request.send();
  } catch (ex) {
    console.error("loadMannschaftData", ex.message);
  }
}

function writeMannschaft(request, teamSize, setCount, displaySP, reducedOutput) {
  try {
    var decoder = new TextDecoder("utf8");
    var data = JSON.parse(decoder.decode(request.response));
    var mannschaft = data.mannschaft[0];
    var el = document.getElementById("mannschaft0");
    var gesamt_diff = data.mannschaft[0].gesamt - data.mannschaft[1].gesamt;
    if (gesamt_diff >= 0)
      el.innerHTML = mannschaft.name + " (+" + gesamt_diff + ")";
    else
      el.innerHTML = mannschaft.name;
    el = document.getElementById("gesamt0");
    if (!reducedOutput)
    {
      el.innerHTML = mannschaft.volle;
      el = el.parentElement.nextElementSibling.firstChild;
      el.innerHTML = mannschaft.abr;
      el = el.parentElement.nextElementSibling.firstChild;
      el.innerHTML = mannschaft.f;
      el = el.parentElement.nextElementSibling.firstChild;
    }
    el.innerHTML = mannschaft.gesamt;
    el = el.parentElement.nextElementSibling.firstChild;
    if (displaySP)
      el.innerHTML = mannschaft.mp;
    else
      el.innerHTML = "";

    el = document.getElementById("mp_center");
    if (el != null) {
      if (displaySP) 
        el.innerHTML = data.mannschaft[0].mp + " : " + data.mannschaft[1].mp
      else
        el.innerHTML = ""
    }


    var spielerArray = mannschaft.spieler;
    for (var i = 0; i < teamSize; i++) {
      var spieler = spielerArray[i];
      el = document.getElementById("spieler0" + i.toString());
      el.innerHTML = spieler.spielername;
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

    mannschaft = data.mannschaft[1];
    el = document.getElementById("mannschaft1");
    if (gesamt_diff <= 0)
      el.innerHTML = "(+" + (-gesamt_diff) + ") " + mannschaft.name;
    else
      el.innerHTML = mannschaft.name;
    el = document.getElementById("gesamt1");
    if (!reducedOutput)
    {
      el.innerHTML = mannschaft.volle;
      el = el.parentElement.previousElementSibling.firstChild;
      el.innerHTML = mannschaft.abr;
      el = el.parentElement.previousElementSibling.firstChild;
      el.innerHTML = mannschaft.f;
      el = el.parentElement.previousElementSibling.firstChild;
    }
    el.innerHTML = mannschaft.gesamt;
    el = el.parentElement.previousElementSibling.firstChild;
    if (displaySP)
      el.innerHTML = mannschaft.mp;
    else
      el.innerHTML = "";
    spielerArray = mannschaft.spieler;
    for (var i = 0; i < teamSize; i++) {
      var spieler = spielerArray[i];
      el = document.getElementById("spieler1" + i.toString());
      el.innerHTML = spieler.spielername;
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
    console.error("writeMannschaft", ex.message);
  }
}

function loadWerbung(img, id) {
  var imgReplace = document.getElementById(id)
  if (imgReplace) {
    imgReplace.src = "logos/adv/" + img + "?" + Date.now().toString();
  }
}

function loadLaneData(requestURL, numLanes, showSetPoints) {
  try {
    var request = new XMLHttpRequest();
    request.open('GET', requestURL + "?" +  Date.now().toString());
    request.responseType = 'arraybuffer';
    request.onload = writeLane.bind(null, request, numLanes, showSetPoints);
    request.send();
  } catch (ex) {
    console.error("loadBahnData", ex.message);
  }
}

function writeLane(request, numLanes, showSetPoints) {
  try {
    var laneCnt;
    var decoder = new TextDecoder("utf8");
    var data = JSON.parse(decoder.decode(request.response));
    var lane = data.bahn;

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
