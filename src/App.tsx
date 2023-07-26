import './App.css';

import * as React from 'react';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useForm } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/system';

import io from 'socket.io-client';

import Dropzone from 'react-dropzone';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";

function createLogoData(logoPaths: string[]) {
  let logoData: {key: string, value: string}[] = [];
  logoPaths.forEach((d) => 
    {
      let v = String(d);
      v.replaceAll("/", ".");
      v.replaceAll("\\", ".");
      v.replaceAll("_", " ");
      logoData.push({key: d, value: v})
    });
  return logoData.sort();
};

let teamLogos = [
  {key: "Default.png", value: "Default"},
  {key: "SKV_Lorsch.jpg", value: "SKV Lorsch"},
  {key: "SKV_Olympia_Mörfelden.jpg", value: "SKV Olympia Mörfelden"},
  {key: "SKG_Rossdorf.png", value: "SKG Rossdorf"},
  {key: "DJK_AN_Groß-Ostheim.jpg", value: "DJK AN Groß-Ostheim"},
  {key: "KSV_Bischofsheim.png", value: "KSV Bischofsheim"},
  {key: "SKC_Nibelungen_Lorsch.png", value: "SKC Nibelungen Lorsch"}
];

let advLogos = [
  {key: "dvag.png", value: "dvag"},
  {key: "kempa.png", value: "kempa"},
  {key: "rekorde_einzel_120.png", value: "rekorde_einzel_120"},
  {key: "rekorde_team_100.png", value: "rekorde_team_100"},
  {key: "rekorde_team_120.png", value: "rekorde_team_120"},
  {key: "rekorde_team_mixed_100.png", value: "rekorde_team_mixed_100"},
  {key: "sparkasse.png", value: "sparkasse"},
  {key: "stream-dvag.png", value: "stream-dvag"},
  {key: "stream-sparkasse.png", value: "stream-sparkasse"},
  {key: "stream-kc-lorsch.png", value: "stream-kc-lorsch"},
  {key: "stream-kempa.png", value: "stream-kempa"}
];

interface ConfigValues {
  setup: {
    output_name: Array<string>;
    output_file: Array<string>;
  };
  team: {
    name: Array<string>;
    time_values: Array<Array<number>>;
    logo_home: Array<string>;
    logo_guest: Array<string>;
    num_players: Array<string>;
    num_lanes: Array<string>;
    set_points: Array<boolean>;
    cck2_file: Array<string>;
  };
  adv: {
    name: Array<string>;
    time_values: Array<Array<number>>;
    logo: Array<string>;
  };
};

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

function ComponentAdd(reference: string, setNumEntries: any) {
  let tmp = {...watchedValues};
  const numTimeEntries = tmp.setup.output_name.length;
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    tmp.setup.output_name.splice(i, 0, "Stream");
    tmp.setup.output_file.splice(i, 0, "stream_file");
    values = {...tmp};
    setNumEntries(values.setup.output_name.length);
    }
  else if (component === "team") {
    tmp.team.name.splice(i, 0, "Mannschaft");
    tmp.team.time_values.splice(i, 0, new Array(numTimeEntries).fill(0));
    tmp.team.logo_home.splice(i, 0, "SKC_Nibelungen_Lorsch.png");
    tmp.team.logo_guest.splice(i, 0, "Default.png");
    tmp.team.num_players.splice(i, 0, "6");
    tmp.team.num_lanes.splice(i, 0, "4");
    tmp.team.set_points.splice(i, 0, true);
    tmp.team.cck2_file.splice(i, 0, "mannschaft");
    values = {...tmp};
    setNumEntries(values.team.name.length);
    }
  else if (component === "adv") {
    tmp.adv.name.splice(i, 0, "Werbung");
    tmp.adv.time_values.splice(i, 0, new Array(numTimeEntries).fill(0));
    tmp.adv.logo.splice(i, 0, "");
    values = {...tmp};
    setNumEntries(values.adv.name.length);
    }
}

function ComponentDelete(reference: string, setNumEntries: any) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    tmp.setup.output_name.splice(i, 1);
    tmp.setup.output_file.splice(i, 1);
    values = {...tmp};
    setNumEntries(values.setup.output_name.length);
  }
  else if (component === "team") {
    tmp.team.name.splice(i, 1);
    tmp.team.time_values.splice(i, 1);
    tmp.team.logo_home.splice(i, 1);
    tmp.team.logo_guest.splice(i, 1);
    tmp.team.num_players.splice(i, 1);
    tmp.team.num_lanes.splice(i, 1);
    tmp.team.set_points.splice(i, 1);
    tmp.team.cck2_file.splice(i, 1);
    values = {...tmp};
    setNumEntries(values.team.name.length);
  }
  else if (component === "adv") {
    tmp.adv.name.splice(i, 1);
    tmp.adv.time_values.splice(i, 1);
    tmp.adv.logo.splice(i, 1);
    values = {...tmp};
    setNumEntries(values.adv.name.length);
  }
}

function ComponentUp(reference: string) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    [tmp.setup.output_name[i], tmp.setup.output_name[i - 1]] = [tmp.setup.output_name[i - 1], tmp.setup.output_name[i]];
    [tmp.setup.output_file[i], tmp.setup.output_file[i - 1]] = [tmp.setup.output_file[i - 1], tmp.setup.output_file[i]];
    values = {...tmp};
    orderTimeChanged(values.setup);
  }
  else if (component === "team") {
    [tmp.team.name[i], tmp.team.name[i - 1]] = [tmp.team.name[i - 1], tmp.team.name[i]];
    [tmp.team.time_values[i], tmp.team.time_values[i - 1]] = [tmp.team.time_values[i - 1], tmp.team.time_values[i]];
    [tmp.team.logo_home[i], tmp.team.logo_home[i - 1]] = [tmp.team.logo_home[i - 1], tmp.team.logo_home[i]];
    [tmp.team.logo_guest[i], tmp.team.logo_guest[i - 1]] = [tmp.team.logo_guest[i - 1], tmp.team.logo_guest[i]];
    [tmp.team.num_players[i], tmp.team.num_players[i - 1]] = [tmp.team.num_players[i - 1], tmp.team.num_players[i]];
    [tmp.team.num_lanes[i], tmp.team.num_lanes[i - 1]] = [tmp.team.num_lanes[i - 1], tmp.team.num_lanes[i]];
    [tmp.team.set_points[i], tmp.team.set_points[i - 1]] = [tmp.team.set_points[i - 1], tmp.team.set_points[i]];
    [tmp.team.cck2_file[i], tmp.team.cck2_file[i - 1]] = [tmp.team.cck2_file[i - 1], tmp.team.cck2_file[i]];
    values = {...tmp};
    setValueFunc("team", values.team);
  }
  else if (component === "adv") {
    [tmp.adv.name[i], tmp.adv.name[i - 1]] = [tmp.adv.name[i - 1], tmp.adv.name[i]];
    [tmp.adv.time_values[i], tmp.adv.time_values[i - 1]] = [tmp.adv.time_values[i - 1], tmp.adv.time_values[i]];
    [tmp.adv.logo[i], tmp.adv.logo[i - 1]] = [tmp.adv.logo[i - 1], tmp.adv.logo[i]];
    values = {...tmp};
    setValueFunc("adv", values.adv);
  }
}

function ComponentDown(reference: string) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    [tmp.setup.output_name[i], tmp.setup.output_name[i + 1]] = [tmp.setup.output_name[i + 1], tmp.setup.output_name[i]];
    [tmp.setup.output_file[i], tmp.setup.output_file[i + 1]] = [tmp.setup.output_file[i + 1], tmp.setup.output_file[i]];
    values = {...tmp};
    orderTimeChanged(values.setup);
  }
  else if (component === "team") {
    [tmp.team.name[i], tmp.team.name[i + 1]] = [tmp.team.name[i + 1], tmp.team.name[i]];
    [tmp.team.time_values[i], tmp.team.time_values[i + 1]] = [tmp.team.time_values[i + 1], tmp.team.time_values[i]];
    [tmp.team.logo_home[i], tmp.team.logo_home[i + 1]] = [tmp.team.logo_home[i + 1], tmp.team.logo_home[i]];
    [tmp.team.logo_guest[i], tmp.team.logo_guest[i + 1]] = [tmp.team.logo_guest[i + 1], tmp.team.logo_guest[i]];
    [tmp.team.num_players[i], tmp.team.num_players[i + 1]] = [tmp.team.num_players[i + 1], tmp.team.num_players[i]];
    [tmp.team.num_lanes[i], tmp.team.num_lanes[i + 1]] = [tmp.team.num_lanes[i + 1], tmp.team.num_lanes[i]];
    [tmp.team.set_points[i], tmp.team.set_points[i + 1]] = [tmp.team.set_points[i + 1], tmp.team.set_points[i]];
    [tmp.team.cck2_file[i], tmp.team.cck2_file[i + 1]] = [tmp.team.cck2_file[i + 1], tmp.team.cck2_file[i]];
    values = {...tmp};
    setValueFunc("team", values.team);
  }
  else if (component === "adv") {
    [tmp.adv.name[i], tmp.adv.name[i + 1]] = [tmp.adv.name[i + 1], tmp.adv.name[i]];
    [tmp.adv.time_values[i], tmp.adv.time_values[i + 1]] = [tmp.adv.time_values[i + 1], tmp.adv.time_values[i]];
    [tmp.adv.logo[i], tmp.adv.logo[i + 1]] = [tmp.adv.logo[i + 1], tmp.adv.logo[i]];
    values = {...tmp};
    setValueFunc("adv", values.adv);
  }
}

function NavigationButtons({callback_id, disableDelete=false, disableUp=false, disableDown=false, setNumEntries=""}: {callback_id: string, disableDelete: boolean, 
  disableUp: boolean, disableDown: boolean, setNumEntries: any}
  ) {
  return (        
    <ButtonGroup variant="outlined" size="small">
      <Button onClick={() => ComponentAdd(callback_id, setNumEntries)}><AddIcon/></Button>
      <Button disabled={disableDelete} onClick={() => ComponentDelete(callback_id, setNumEntries)}><DeleteForeverIcon/></Button>
      <Button disabled={disableUp} onClick={() => ComponentUp(callback_id)}><ArrowCircleUpIcon/></Button>
      <Button disabled={disableDown} onClick={() => ComponentDown(callback_id)}><ArrowCircleDownIcon/></Button>
    </ButtonGroup>  
  )
}

function SetupSettings({register, count, disableDelete, disableUp, disableDown, setNumSetupEntries}: 
  {register: any, count: number, disableDelete:boolean, disableUp: boolean, disableDown: boolean, setNumSetupEntries: any}) {
  return ( 
      <Stack spacing={4} direction="row" alignItems="center">
        <TextField label="Ausgabe Name" variant={variant} defaultValue="TV oder Stream" {...register("setup.output_name." + count.toString())}/>
        <TextField label="Ausgabe Datei" variant={variant} defaultValue="stream" {...register("setup.output_file." + count.toString())}/>
        <NavigationButtons callback_id={"setup." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} setNumEntries={setNumSetupEntries}/>
      </Stack>
  )
}

function CreateSetupSettings({register, settings, setNumSetupEntries}: {register: any, settings: ConfigValues["setup"], setNumSetupEntries: any}) {
  let s = [];
  for (let i = 0; i < settings.output_name.length; ++i) {
    s.push(<SetupSettings key={"CreateSetupSettings" + i.toString()} register={register} count={i} disableDelete={settings.output_name.length === 1}
      disableUp={i === 0} disableDown={i === settings.output_name.length - 1} setNumSetupEntries={setNumSetupEntries} />);
  }
  return (<>{s}</>)
}

function LogoDropzone({onChange, value}: {onChange: any, value: string}) {
  return (
    <Dropzone 
      noClick noKeyboard
      onDrop={(acceptedFiles: File[]) => {
        console.log(acceptedFiles); 
        console.log(value); 
        onChange(acceptedFiles[0].name);
        console.log(watchedValues);
        setValueFunc("team.logo_home.0", acceptedFiles[0].name);
        console.log(watchedValues);}}>
      {({getRootProps, getInputProps, open}) => (
        <Box sx={{ height: 120, width: 250, borderRadius: 2, border: "2px dashed"}}>
          <div {...getRootProps()} style={{textAlign: "center"}}>
            <input {...getInputProps()} />
            <p>Logo in diesen Bereich ziehen</p>
            <Button onClick={open} variant="contained" >Logo Auswählen</Button>
          </div>
        </Box>
      )} 
    </Dropzone>
  )
}


function TeamSettings(register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"], count: number, 
  disableDelete:boolean, disableUp:boolean, disableDown:boolean, setNumTeamEntries:any, tl: string[]) {
  return (
    <div>
      <Accordion>
        <AccordionSummary key={"teamSummary." + count.toString()} expandIcon={<ExpandMoreIcon />}>
            <Stack spacing={2} direction="row" alignItems="center"  onClick={(event: any) => event.stopPropagation()}>
              <TextField key="team_name" label="Teamname" variant={variant} defaultValue={team.name[count]} {...register("team.name." + count.toString())}/>
              {CreateTimeSelect(control, "team.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"team." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} 
                setNumEntries={setNumTeamEntries}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"teamDetails." + count.toString()}>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={2}>Logo Heim</Grid>
              <Grid xs={3}>
                <Box sx={{ height: 120, width: 175}}>
                  <div style={{textAlign: "center"}}> 
                    <img src={"logos/team/" + team.logo_home[count]} alt="" height="120" width="auto" id={"home" + count.toString()}/> 
                  </div>
                </Box>
              </Grid>
              <Grid xs={4}>
                <Controller control={control} name={"team.logo_home." + count.toString()} 
                  render={({ field: {onChange, value} }) => <LogoDropzone onChange={onChange} value={value}/>} />
              </Grid>
              <Grid xs={3}/>
              <Grid xs={2}>Logo Gast</Grid>
              <Grid xs={3}>
                <div style={{textAlign: "center"}}> 
                  <Box sx={{ height: 120, width: 175}}> 
                    <img src={"logos/team/" + team.logo_guest[count]} alt="" height="120" width="auto" id={"guest" + count.toString()}/> 
                  </Box>
                </div>
              </Grid>
              <Grid xs={4}>
                <Controller control={control} name={"team.logo_guest." + count.toString()}
                  render={({ field: {onChange, value} }) => <LogoDropzone onChange={onChange} value={value}/>} />
              </Grid>
              <Grid xs={3}/>
            </Grid>

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

function CreateTeamSettings(register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"], setNumTeamEntries: any, teamLogos: string[]) {
  let t = [];
  for (let i = 0; i < team.name.length; ++i) {
    t.push(TeamSettings(register, control, team, setup, i, team.name.length === 1, i === 0, i === team.name.length - 1, setNumTeamEntries, teamLogos));
  }
  return (<>{t}</>)
}

function AdvSettings(register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], count: number,
  disableDelete:boolean, disableUp:boolean, disableDown:boolean, setNumAdvEntries:any){

  return (
    <>
      <Accordion>
        <AccordionSummary key={"advSummary." + count.toString()}
          expandIcon={<ExpandMoreIcon />}> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue={adv.logo[count]} {...register("adv.name." + count.toString())}/>
              {CreateTimeSelect(control, "adv.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"adv." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} 
                setNumEntries={setNumAdvEntries}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"advDetail." + count.toString()}>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={2}>Logo Werbung</Grid>
              <Grid xs={3}>
                <Box sx={{ height: 120, width: 175}}>
                  <div style={{textAlign: "center"}}> 
                    <img id={"adv" + count.toString()} src={"logos/adv/" + adv.logo[count]} alt="" height="120" width="auto"/> 
                  </div>
                </Box>
              </Grid>
              <Grid xs={4}>
                <Controller control={control} name={"adv.logo." + count.toString()}
                  render={({ field: {onChange, value} }) => <LogoDropzone onChange={onChange} value={value}/>} />
              </Grid>
              <Grid xs={3}/>
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function CreateAdvSettings(register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], setNumAdvEntries: any) {
  let a = [];
  for (let i = 0; i < adv.name.length; ++i) {
    a.push(AdvSettings(register, control, adv, setup, i, adv.name.length === 1, i === 0, i === adv.name.length - 1, setNumAdvEntries));
  }
  return (<>{a}</>)
}

let watchedValues: ConfigValues;
let values = { setup: {
  output_name: ["Livestream", "TV Links", "TV Rechts"], 
  output_file: ["livestream.json", "tvlinks.json", "tvrechts.json"]
},
team: { 
  name: ["1. Mannschaft", "2. Mannschaft"],
  time_values: [[30, 20, 10], [5, 10, 20]],
  logo_home: ["SKC_Nibelungen_Lorsch.png", "SKC_Nibelungen_Lorsch.png"],
  logo_guest: ["Default.png", "SKV_Lorsch.jpg"],
  num_players: ["6", "4"],
  num_lanes: ["6", "4"],
  set_points: [true, true],                      
  cck2_file: ["mannschaft1.json", "mannschaft2.json"]
},
adv: {
  name: ["Werbung"],
  logo: ["sparkasse.png"],
  time_values: [[0, 0, 0]],
} } as ConfigValues;

let setValueFunc: any;
let orderTimeChanged: any;

function App({socket}: {socket: any}) {
  const { control, register, watch, setValue } = useForm<ConfigValues>({defaultValues: {...values}});
  watchedValues = watch();
  setValueFunc = setValue;

  const [, setNumSetupEntries] = React.useState(values.setup.output_name.length);
  const [, setNumTeamEntries] = React.useState(values.team.name.length);
  const [, setNumAdvEntries] = React.useState(values.adv.name.length);
  const [teamLogos, setTeamLogos] = React.useState([""]);
  const [advLogos, setAdvLogos] = React.useState([""]);
  [, orderTimeChanged] = React.useState(values.setup);

  React.useEffect(() => { 
    setValue("setup", values.setup);
    setValue("team", values.team);
    setValue("adv", values.adv);
  }, [setValue, values]);

//  socket.on("load return", (data: ConfigValues, dataTeamLogos: string[], dataAdvLogos: string[]) => {
//    values = {...data}; 
//    setNumSetupEntries(values.setup.output_name.length); 
//    setNumTeamEntries(values.team.name.length);
//    setNumAdvEntries(values.adv.name.length);
//    setTeamLogos(dataTeamLogos);
//    setAdvLogos(dataAdvLogos);
//    console.log("load return");
//  });

  socket.emit("load", "hello!")

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Accordion key="setup">
        <AccordionSummary key="setup_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Setup</h1>
            <Button onClick={() => {console.log(watchedValues.setup); socket.emit("save_setup", watchedValues.setup);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="setup_details">
          <Stack spacing={2} direction="column" alignItems="left">
            <CreateSetupSettings register={register} settings={values.setup} setNumSetupEntries={setNumSetupEntries} />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion key="team">
        <AccordionSummary key="team_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Team Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.team); socket.emit("save_team", watchedValues.team);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="team_detail">
          <Stack spacing={2} direction="column" alignItems="left">
            {CreateTeamSettings(register, control, values.team, values.setup, setNumTeamEntries, teamLogos)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion key="adv">
        <AccordionSummary key="adv_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Werbung Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.adv); socket.emit("save_adv", watchedValues.adv);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="adv_details">
          <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
            {CreateAdvSettings(register, control, values.adv, values.setup, setNumAdvEntries)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      { /* <Button onClick={() => { setValue("setup.output_name.0", "Livestream"); setValue("setup.output_name.1", "TV Links"); 
        setValue("setup.output_name.2", "TV Rechts"); setValue("team.time_values.0.0", 60)}}>Test Values</Button> */ }
      </ThemeProvider>
    </>
  );
}

export default App;