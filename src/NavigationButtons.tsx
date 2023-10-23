import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

import React, { useContext } from 'react';

import { ConfigValues } from '../cck2_live_interface/ConfigValues';

import { controlFktContext } from './App';

function ComponentAdd(reference: string, watchedValues: ConfigValues, setStateUpdate: Function) {
    let tmp = {...watchedValues};
  
    const numTimeEntries = tmp.setup.output_name.length;
    const [component, id] = reference.split(".");
    const i = Number(id);
    if (component === "setup") {
      tmp.setup.output_name.splice(i, 0, "Stream");
      tmp.setup.type.splice(i, 0, "stream");
      tmp.setup.lanes.splice(i, 0, true);
      tmp.setup.adv.splice(i, 0, true);
    }
    else if (component === "team") {
      tmp.team.name.splice(i, 0, "Mannschaft");
      tmp.team.time_values.splice(i, 0, new Array(numTimeEntries).fill(0));
      tmp.team.logo_home.splice(i, 0, "Default Heim.png");
      tmp.team.logo_guest.splice(i, 0, "Default Gast.png");
      tmp.team.num_players.splice(i, 0, "6");
      tmp.team.num_lanes.splice(i, 0, "4");
      tmp.team.set_points.splice(i, 0, true);
      tmp.team.cck2_file.splice(i, 0, "mannschaft");
    }
    else if (component === "adv") {
      tmp.adv.name.splice(i, 0, "Werbung");
      tmp.adv.time_values.splice(i, 0, new Array(numTimeEntries).fill(0));
      tmp.adv.logo.splice(i, 0, "");
    }
    setStateUpdate(tmp);
  }
  
  function ComponentDelete(reference: string, watchedValues: ConfigValues, setStateUpdate: Function) {
    let tmp = {...watchedValues};
    const [component, id] = reference.split(".");
    const i = Number(id);
    if (component === "setup") {
      for (const v of Object.values(tmp.setup)) {
        if (Array.isArray(v)) { 
          v.splice(i, 1);
        }
      }
    }
    else if (component === "team") {
      for (const v of Object.values(tmp.team)) {
        v.splice(i, 1);
      }
    }
    else if (component === "adv") {
      for (const v of Object.values(tmp.adv)) {
        v.splice(i, 1);
      }
    }
    setStateUpdate(tmp);
  }
  
  function ComponentUp(reference: string, watchedValues: ConfigValues, setValue: Function) {
    let tmp = {...watchedValues};
    const [component, id] = reference.split(".");
    const i = Number(id);
    if (component === "setup") {
      for (const v of Object.values(tmp.setup)) {
        if (Array.isArray(v)) { 
          [v[i], v[i - 1]] = [v[i - 1], v[i]];
        }
      }
      setValue("setup", tmp.setup);
    }
    else if (component === "team") {
      for (const v of Object.values(tmp.team)) {
        [v[i], v[i - 1]] = [v[i - 1], v[i]];
      }
      setValue("team", tmp.team);
    }
    else if (component === "adv") {
      for (const v of Object.values(tmp.adv)) {
        [v[i], v[i - 1]] = [v[i - 1], v[i]];
      }
      setValue("adv", tmp.adv);
    }
  }
  
  function ComponentDown(reference: string, watchedValues: ConfigValues, setValue: Function) {
    let tmp = {...watchedValues};
    const [component, id] = reference.split(".");
    const i = Number(id);
    if (component === "setup") {
      for (const v of Object.values(tmp.setup)) {
        if (Array.isArray(v)) { 
          [v[i], v[i + 1]] = [v[i + 1], v[i]];
        }
      }
      setValue("setup", tmp.setup);
    }
    else if (component === "team") {
      for (const v of Object.values(tmp.team)) {
        [v[i], v[i + 1]] = [v[i + 1], v[i]];
      }
      setValue("team", tmp.team);
    }
    else if (component === "adv") {
      for (const v of Object.values(tmp.adv)) {
        [v[i], v[i + 1]] = [v[i + 1], v[i]];
      }
      setValue("adv", tmp.adv);
    }
  }
  
function NavigationButtons({callback_id, disableDelete=false, disableUp=false, disableDown=false}: 
    {callback_id: string, disableDelete: boolean, disableUp: boolean, disableDown: boolean}) {
    let fktContext = useContext(controlFktContext);
    return (        
      <ButtonGroup variant="outlined" size="small">
        <Button onClick={() => ComponentAdd(callback_id, fktContext.watchedValues, fktContext.setStateUpdate)}><AddIcon/></Button>
        <Button disabled={disableDelete} onClick={() => ComponentDelete(callback_id, fktContext.watchedValues, fktContext.setStateUpdate)}><DeleteForeverIcon/></Button>
        <Button disabled={disableUp} onClick={() => ComponentUp(callback_id, fktContext.watchedValues, fktContext.setValue)}><ArrowCircleUpIcon/></Button>
        <Button disabled={disableDown} onClick={() => ComponentDown(callback_id, fktContext.watchedValues, fktContext.setValue)}><ArrowCircleDownIcon/></Button>
      </ButtonGroup>  
    )
  }


export default NavigationButtons;