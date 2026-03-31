export function createLaneTable(numLanes) {
    if (numLanes == 4) {
        return ` 
            <table class="result-tg" align="center">
                <tr>
                <td class="result-data" colspan="4"><div class="result-block-cap" id="name4lanes"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                </tr>
                <tr>
                <td class="result-data" colspan="4"><div class="result-block-cap" id="team4lanes"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                </tr>
                <tr>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num" id="total4lanes"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                </tr>
                <tr>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num" id="heat4lanes"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                </tr>
            </table>`
    } else if (numLanes == 6) {
        return `
            <table class="result-tg" align="center">
                <tr>
                <td class="result-data" colspan="4"><div class="result-block-cap" id="name6lanes"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                </tr>
                <tr>
                <td class="result-data" colspan="4"><div class="result-block-cap" id="team6lanes"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                <td class="free"></td>
                <td class="result-data" colspan="4"><div class="result-block-cap"></div></td>
                </tr>
                <tr>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num" id="total6lanes"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Gesamt.png" alt="Wurf Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Gesamt.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                </tr>
                <tr>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num" id="heat6lanes"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="free"></td>
                <td class="result-label-num"><img src="Wurf_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                <td class="result-label-num"><img src="Holz_Durchgang.png" alt="Holz Gesamt" height="20px" width="auto"/></td>
                <td class="result-data-num"><div class="result-block-num"></div></td>
                </tr>
            </table>`  
    }
}

export function showLaneData(lane, showLanes, numLanes, showSetPoints) {
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
