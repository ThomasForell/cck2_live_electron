import './App.css';

import { useEffect, useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { useForm } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Socket } from 'socket.io-client';

import Dropzone from 'react-dropzone';

import {ConfigValues} from '../cck2_live_interface/ConfigValues';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";

function TimeSelect(control: Control, name: string, label: string, value: number)
{
  return (
    <FormControl key={name + "_fc_" + value.toString()} sx={{ m: 1, minWidth: 120 }}>
      <InputLabel key={name + "_il_" + value.toString()}>{label}</InputLabel>
        <Controller key={name + "_c_" + value.toString()} control={control} name={name} defaultValue={value} render={({ field }) => (
          <Select key={name + "_s_" + value.toString()} {...field} label={label} variant={variant}>
            <MenuItem key={name + "_i_0_" + value.toString()} value={0}>0s</MenuItem>
            <MenuItem key={name + "_i_5_" + value.toString()} value={5}>5s</MenuItem>
            <MenuItem key={name + "_i_10_" + value.toString()} value={10}>10s</MenuItem>
            <MenuItem key={name + "_i_20_" + value.toString()} value={20}>20s</MenuItem>
            <MenuItem key={name + "_i_30_" + value.toString()} value={30}>30s</MenuItem>
            <MenuItem key={name + "_i_45_" + value.toString()} value={45}>45s</MenuItem>
            <MenuItem key={name + "_i_60_" + value.toString()} value={60}>60s</MenuItem>
          </Select>)}/>
    </FormControl>
  );
}

function CreateTimeSelect(control: any, name: string, setup: ConfigValues["setup"]) {
  let t = [];
  for (let i = 0; i < setup.output_name.length; ++i) {
    t.push(TimeSelect(control, name + "." + i.toString(), "Zeit " + setup.output_name[i], 0));
  }
  return (<>{t}</>)
}

function ComponentAdd(reference: string) {
  let tmp = {...watchedValues};
  const numTimeEntries = tmp.setup.output_name.length;
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    tmp.setup.output_name.splice(i, 0, "Stream");
    tmp.setup.type.splice(i, 0, "Stream");
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

function ComponentDelete(reference: string) {
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

function ComponentUp(reference: string) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    for (const v of Object.values(tmp.setup)) {
      if (Array.isArray(v)) { 
        [v[i], v[i - 1]] = [v[i - 1], v[i]];
      }
    }
    setValueFunc("setup", tmp.setup);
  }
  else if (component === "team") {
    for (const v of Object.values(tmp.team)) {
      [v[i], v[i - 1]] = [v[i - 1], v[i]];
    }
    setValueFunc("team", tmp.team);
  }
  else if (component === "adv") {
    for (const v of Object.values(tmp.adv)) {
      [v[i], v[i - 1]] = [v[i - 1], v[i]];
    }
    setValueFunc("adv", tmp.adv);
  }
}

function ComponentDown(reference: string) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    for (const v of Object.values(tmp.setup)) {
      if (Array.isArray(v)) { 
        [v[i], v[i + 1]] = [v[i + 1], v[i]];
      }
    }
    setValueFunc("setup", tmp.setup);
  }
  else if (component === "team") {
    for (const v of Object.values(tmp.team)) {
      [v[i], v[i + 1]] = [v[i + 1], v[i]];
    }
    setValueFunc("team", tmp.team);
  }
  else if (component === "adv") {
    for (const v of Object.values(tmp.adv)) {
      [v[i], v[i + 1]] = [v[i + 1], v[i]];
    }
    setValueFunc("adv", tmp.adv);
  }
}

function NavigationButtons({callback_id, disableDelete=false, disableUp=false, disableDown=false}: {callback_id: string, disableDelete: boolean, 
  disableUp: boolean, disableDown: boolean}
  ) {
  return (        
    <ButtonGroup variant="outlined" size="small">
      <Button onClick={() => ComponentAdd(callback_id)}><AddIcon/></Button>
      <Button disabled={disableDelete} onClick={() => ComponentDelete(callback_id)}><DeleteForeverIcon/></Button>
      <Button disabled={disableUp} onClick={() => ComponentUp(callback_id)}><ArrowCircleUpIcon/></Button>
      <Button disabled={disableDown} onClick={() => ComponentDown(callback_id)}><ArrowCircleDownIcon/></Button>
    </ButtonGroup>  
  )
}

function SetupSettings({register, control, count, disableDelete, disableUp, disableDown}: 
  {register: any, control: any, count: number, disableDelete:boolean, disableUp: boolean, disableDown: boolean}) {
  return ( 
      <Stack spacing={4} direction="row" alignItems="center">
        <TextField label="Ausgabe Name" variant={variant} defaultValue="TV oder Stream" 
          {...register("setup.output_name." + count.toString())}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            const values = {...watchedValues};   
            if (event.target){
              values.setup.output_name[count] = ((event.target) as HTMLInputElement).value;
              setStateUpdate(values);
            }
          }}/>
        <FormControl sx={{ m: 1, minWidth: 90 }}>
          <InputLabel>Anzeigetyp</InputLabel>
          <Controller control={control} name={"setup.type." + count.toString()} defaultValue={"stream"} render={({ field }) => (
            <Select key={"setup.type." + count.toString()} {...field} label={"Anzeigetyp"} variant={variant}>
              <MenuItem key={"setup.type.stream." + count.toString()} value="stream">Stream</MenuItem>
              <MenuItem key={"setup.type.display." + count.toString()} value="display">Display</MenuItem>
          </Select>)}/>
        </FormControl>  
        <Controller
          control={control}
          name={"setup.lanes." + count.toString()}
          defaultValue={true}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel label="Bahnanzeige"
              control={
                <Checkbox checked={value} onChange={onChange} />
              }/>
            )}/>
        <Controller
          control={control}
          name={"setup.adv." + count.toString()}
          defaultValue={true}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel label="Werbung"
              control={
                <Checkbox checked={value} onChange={onChange} />
              }/>
            )}/>

        <NavigationButtons callback_id={"setup." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown}/>
      </Stack>
  )
}

function CreateSetupSettings({register, control, settings}: {register: any, control: any, settings: ConfigValues["setup"]}) {
  let s = [];
  for (let i = 0; settings && i < settings.output_name.length; ++i) {
    s.push(<SetupSettings key={"CreateSetupSettings" + i.toString()} register={register} control={control} count={i} 
      disableDelete={settings.output_name.length === 1} disableUp={i === 0} disableDown={i === settings.output_name.length - 1} />);
  }
  s.push(<TextField key="cck2_output_path" label="CCK2 Ausgabeverzeichnis" variant={variant} defaultValue="" {...register("setup.cck2_output_path")}/>);
  return (<>{s}</>)
}

function LogoDropzone({label, name, value, control, socket}: {label: string, name: string, value: string, control: Control, socket: Socket}) {
  let source = "";
  if (name.startsWith("adv")) {
    source = "http://localhost/logos/adv/" + value;
  }
  else {
    source = "http://localhost/logos/team/" + value;
  }
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box sx={{ height: 120, width: 120}}>
        <div style={{textAlign: "start"}}> 
          {label} 
        </div>
      </Box>
      <Box sx={{ height: 120, width: 250}}>
        <div style={{textAlign: "center"}}> 
          <img id={name} src={source} alt=" Warte auf Logo" height="120" width="auto" /> 
        </div>
      </Box>
      <Controller control={control} name={name}
        render={({ field: {onChange, value} }) =>           
          <Dropzone 
            noClick noKeyboard
            accept={{'image/*': ['.jpeg', '.png']}}
            multiple={false}
            onDrop={(acceptedFiles: File[]) => {
              if (name.startsWith("team")) {
                socket.emit("logo", "team", acceptedFiles[0].name, acceptedFiles[0], onChange);
              }
              else {
                socket.emit("logo", "adv", acceptedFiles[0].name, acceptedFiles[0], onChange);
              }
            }}>
              {({getRootProps, getInputProps, open, isDragReject, isDragActive, isDragAccept}) => (
                <Box sx={{ height: 120, width: 250, borderRadius: 2, border: "2px dashed", 
                  ...(isDragReject && {background: "#460100"}), ...(isDragAccept && {background: "#092005"})  }}>
                  <div {...getRootProps()} style={{textAlign: "center"}}>
                    <input {...getInputProps()} />
                    {!isDragActive && (<p>Logo in diesen Bereich ziehen</p>)}
                    {isDragAccept && (<p>Logo auswählen</p>)}
                    {isDragReject && (<p>Logo muss eine Bilddatei sein</p>)}
                    <Button onClick={open} variant="contained">Logo Auswählen</Button>
                  </div>
                </Box>
              )} 
        </Dropzone>
      } /> 
    </Stack>
  )
}


function TeamSettings({register, control, team, setup, count, disableDelete, disableUp, disableDown, socket}: {register: any, control: any, team: ConfigValues["team"], 
  setup: ConfigValues["setup"], count: number, disableDelete:boolean, disableUp:boolean, disableDown:boolean, socket: Socket}) {
  return (
    <div>
      <Accordion>
        <AccordionSummary key={"teamSummary." + count.toString()} expandIcon={<ExpandMoreIcon />}>
            <Stack spacing={2} direction="row" alignItems="center"  onClick={(event: any) => event.stopPropagation()}>
              <TextField key="team_name" label="Teamname" variant={variant} defaultValue={team.name[count]} {...register("team.name." + count.toString())}/>
              {CreateTimeSelect(control, "team.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"team." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"teamDetails." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Heim" name={"team.logo_home." + count.toString()} value={team.logo_home[count]} control={control} socket={socket}/>
            <LogoDropzone label="Logo Gast" name={"team.logo_guest." + count.toString()} value={team.logo_guest[count]} control={control} socket={socket}/>
            <Stack spacing={4} direction="row">
              <FormControl>
                <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
                <Controller
                  defaultValue="4"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="4" control={<Radio />} label="4" key={"player_" + count.toString() + "_4"} />
                      <FormControlLabel value="6" control={<Radio />} label="6" key={"player_" + count.toString() + "_6"} />
                    </RadioGroup>)}
                  name={"team.num_players." + count.toString()}
                  control={control}
                />
              </FormControl>
              <FormControl>
                <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
                <Controller
                  defaultValue="6"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="4" control={<Radio />} label="4" key={"lanes_" + count.toString() + "_4"} />
                      <FormControlLabel value="6" control={<Radio />} label="6" key={"lanes_" + count.toString() + "_6"} />
                    </RadioGroup>)}
                  name={"team.num_lanes." + count.toString()}
                  control={control}
                />
              </FormControl>
              <Controller
                control={control}
                name={"team.set_points." + count.toString()}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel label="Satzpunkte"
                    control={
                      <Checkbox checked={value} onChange={onChange} />
                    }/>
                  )}/>
            </Stack>
            <TextField id="cck2_data_file" label="CCK2 Daten Team" variant={variant} defaultValue="mannschaft.json" {...register("team.cck2_file." + count.toString())}/>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function CreateTeamSettings(props: {register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"], socket: Socket}) {
  let t = [];
  for (let i = 0; props.team &&  i < props.team.name.length; ++i) {
    t.push(<TeamSettings key={"team_settings_" + i.toString()} {...props}  count={i} disableDelete={props.team.name.length === 1} disableUp={i === 0} disableDown={i === props.team.name.length - 1} />);
  }
  return (<>{t}</>)
}

function AdvSettings({register, control, adv, setup, count, disableDelete, disableUp, disableDown, socket}: 
  {register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], count: number,
    disableDelete:boolean, disableUp:boolean, disableDown:boolean, socket: Socket}) {

  return (
    <>
      <Accordion>
        <AccordionSummary key={"advSummary." + count.toString()}
          expandIcon={<ExpandMoreIcon />}> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue={adv.logo[count]} {...register("adv.name." + count.toString())}/>
              {CreateTimeSelect(control, "adv.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"adv." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"advDetail." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Werbung" name={"adv.logo." + count.toString()} value={adv.logo[count]} control={control} socket={socket}/>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function CreateAdvSettings(props: {register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], socket: Socket}) {
  let a = [];
  for (let i = 0; props.adv && i < props.adv.name.length; ++i) {
    a.push(<AdvSettings key={"adv_settings_" + i.toString() } {...props} count={i} disableDelete={props.adv.name.length === 1} disableUp={i === 0} disableDown={i === props.adv.name.length - 1} />);
  }
  return (<>{a}</>)
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

let watchedValues: ConfigValues;
let setValueFunc: any;
let setStateUpdate: any;

function App({socket}: {socket: Socket}) {
  const { control, register, watch, setValue } = useForm<ConfigValues>();
  watchedValues = watch();
  setValueFunc = setValue;

  let stateUpdate: ConfigValues;
  [stateUpdate, setStateUpdate] = useState(watchedValues);

  useEffect(() => {
    setValue("setup", stateUpdate.setup);
    setValue("team", stateUpdate.team);
    setValue("adv", stateUpdate.adv);
  }, [stateUpdate]);

  socket.on("load return", (data: ConfigValues) => {
    setStateUpdate(data);
    console.log("load return");
  });

  useEffect(
    () => {socket.emit("load", "hello!")}, []
  );

  const [valuePanel, setValuePanel] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValuePanel(newValue);
  };

  const values: ConfigValues = {...watchedValues};

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={valuePanel}
            onChange={handleChange}
            aria-label="Vertical tabs"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Teams" id="tab-team" sx={{alignItems:'start'}}/>
            <Tab label="Werbung" id="tab-adv" sx={{alignItems:'start'}}/>
            <Tab label="Setup" id="tab-setup" sx={{alignItems:'start'}}/>
          </Tabs>
          <TabPanel  value={valuePanel} index={0}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row" justifyContent="space-between">
                <Typography component='div' variant="h3">Team Konfiguration</Typography>
                <Button onClick={() => {console.log(watchedValues.team); socket.emit("save_team", watchedValues.team);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <CreateTeamSettings key="create_team_settings" register={register} control={control} team={values.team} setup={values.setup} socket={socket} />
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={valuePanel} index={1}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row"  justifyContent="space-between">
              <Typography component='div' variant="h3">Werbung Konfiguration</Typography>
                <Button onClick={() => {console.log(watchedValues.adv); socket.emit("save_adv", watchedValues.adv);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
                <CreateAdvSettings key="create_adv_settings" register={register} control={control} adv={values.adv} setup={values.setup} socket={socket} />
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={valuePanel} index={2}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row"  justifyContent="space-between">
                <Typography component='div' variant="h3">Setup</Typography>
                <Button onClick={() => {console.log(watchedValues.setup); socket.emit("save_setup", watchedValues.setup);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <CreateSetupSettings register={register} control={control} settings={values.setup} />
              </Stack>
            </Stack>
          </TabPanel>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;