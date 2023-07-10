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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useForm } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";

let teamLogos = [
  {key: "default.png", value: "default"},
  {key: "SKV_Lorsch.png", value: "SKV Lorsch"},
  {key: "SKV_Olympia_Mörfelden.jpg", value: "SKV Olympia Mörfelden"},
  {key: "SKG_Rossdorf.png", value: "SKG Rossdorf"},
  {key: "DJK_AN_Groß_Ostheim.jpg", value: "DJK AN Groß Ostheim"},
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
    set_points: Array<string>;
    cck2_file: Array<string>;
  };
  adv: {
    name: Array<string>;
    time_values: Array<Array<number>>;
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
    t.push(TimeSelect(control, name + "_" + i.toString(), "Zeit " + setup.output_name[i], 0));
  }
  return (<>{t}</>)
}

function ComponentAdd(reference: string) {
  console.log("Add " + reference);
}

function ComponentDelete(reference: string) {
  console.log("Delete " + reference);
}

function ComponentUp(reference: string) {
  console.log("Up " + reference);
}

function ComponentDown(reference: string) {
  console.log("Down " + reference);
}

function NavigationButtons({callback_id}: {callback_id: string}) {
  return (        
    <ButtonGroup variant="outlined" size="small">
      <Button onClick={() => ComponentAdd(callback_id)}><AddIcon/></Button>
      <Button onClick={() => ComponentDelete(callback_id)}><DeleteForeverIcon/></Button>
      <Button onClick={() => ComponentUp(callback_id)}><ArrowCircleUpIcon/></Button>
      <Button onClick={() => ComponentDown(callback_id)}><ArrowCircleDownIcon/></Button>
    </ButtonGroup>  
  )
}

function SetupSettings(register: any, count: number) {
  return (
      <Stack spacing={4} direction="row" alignItems="center">
        <TextField label="Ausgabe Name" variant={variant} defaultValue="TV oder Stream" {...register("setup.output_name." + count.toString())}/>
        <TextField label="Ausgabe Datei" variant={variant} defaultValue="stream" {...register("setup.output_file." + count.toString())}/>
        <NavigationButtons callback_id={"setup." + count.toString()}/>
      </Stack>
  )
}

function CreateSetupSettings(register: any, settings: ConfigValues["setup"]) {
  let s = [];
  for (let i = 0; i < settings.output_name.length; ++i) {
    s.push(SetupSettings(register, i));
  }
  return (<>{s}</>)
}

function TeamSettings(register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"], count: number) {
  return (
    <div>
      <Accordion>
        <AccordionSummary key={"teamSummary." + count.toString()} expandIcon={<ExpandMoreIcon />}>
            <Stack spacing={2} direction="row" alignItems="center"  onClick={(event: any) => event.stopPropagation()}>
              <TextField id="team_name" label="Teamname" variant={variant} defaultValue="1. Mannschaft" {...register("team.name." + count.toString())}/>
              {CreateTimeSelect(control, "team.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"team." + count.toString()}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"teamDetails." + count.toString()}>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={3}>
                <FormControl>
                  <InputLabel>Logo Heim</InputLabel>
                  <Controller control={control} name={"team.logo_home." + count.toString()} defaultValue="SKV_Lorsch.png" render={({ field }) => (
                    <Select {...field} variant={variant} label="Logo Heim">
                      {teamLogos.map(({key, value}) => (<MenuItem value={key} key={"home_" + count.toString() + "_" + key}>{value}</MenuItem>))}
                    </Select>)}/>
                </FormControl>
              </Grid>
              <Grid xs={9}>
                <Box sx={{ height: 120, width: 250}}> <img src="SKC_Nibelungen_Lorsch.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
              <Grid xs={3}>
                <FormControl>
                  <InputLabel>Logo Gast</InputLabel>
                  <Controller control={control} name={"team.logo_guest." + count.toString()} defaultValue="SKV_Lorsch.png" render={({ field }) => (
                    <Select {...field} variant={variant} label="Logo Guest">
                      {teamLogos.map(({key, value}) => (<MenuItem value={key} key={"guest_" + count.toString() + "_" + key}>{value}</MenuItem>))}
                    </Select>)}/>
                </FormControl>
              </Grid>
              <Grid xs={9}>
                <Box sx={{ height: 120}}> <img src="KSC_Groß-Zimmern.jpg" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>
          <Stack spacing={4} direction="row">
            <FormControl>
              <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="4" control={<Radio />} label="4" key={"player_" + count.toString() + "_4"} {...register("team.num_players." + count.toString())}/>
                <FormControlLabel value="6" control={<Radio />} label="6" key={"player_" + count.toString() + "_6"} {...register("team.num_players." + count.toString())}/>
              </RadioGroup>1
            </FormControl>
            <FormControl>
              <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="4" control={<Radio />} label="4" key={"lanes_" + count.toString() + "_4"} {...register("team.num_lanes." + count.toString())}/>
                <FormControlLabel value="6" control={<Radio />} label="6" key={"lanes_" + count.toString() + "_6"} {...register("team.num_lanes." + count.toString())}/>
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox defaultChecked {...register("team_set_points." + count.toString())}/>} label="Satzpunkte" />
          </Stack>
          <TextField id="cck2_data_file" label="CCK2 Daten Team" variant={variant} defaultValue="mannschaft.json" {...register("team.cck2_file." + count.toString())}/>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function CreateTeamSettings(register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"]) {
  let t = [];
  for (let i = 0; i < team.name.length; ++i) {
    t.push(TeamSettings(register, control, team, setup, i));
  }
  return (<>{t}</>)
}

function AdvSettings(register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], count: number){

  return (
    <>
      <Accordion>
        <AccordionSummary key={"advSummary." + count.toString()}
          expandIcon={<ExpandMoreIcon />}> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue="Kempa" {...register("adv.name." + count.toString())}/>
              {CreateTimeSelect(control, "adv.time_values." + count.toString(), setup)}
              <NavigationButtons callback_id={"adv." + count.toString()}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"advDetail." + count.toString()}>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={4}>
                <FormControl style={{minWidth: 200}}>
                  <InputLabel>Werbung</InputLabel>
                  <Controller control={control} name={"adv.logo." + count.toString()} defaultValue={advLogos[0].key} render={({ field }) => (
                    <Select {...field} variant={variant} label="Logo Heim">
                      {advLogos.map(({key, value}) => (<MenuItem value={key} key={"adv_" + count.toString() + "_" + key}>{value}</MenuItem>))}
                    </Select>)}/>
                </FormControl>
              </Grid>
              <Grid xs={8}>
                <Box sx={{ height: 120, width: 250}}> <img  src="rekorde_einzel_120.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function CreateAdvSettings(register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"]) {
  let a = [];
  for (let i = 0; i < adv.name.length; ++i) {
    a.push(AdvSettings(register, control, adv, setup, i));
  }
  return (<>{a}</>)
}

function App() {

  const { control, register, watch, setValue } = useForm<ConfigValues>();
  let watchedValues = watch();

  let defaultValues = { setup: {
                          output_name: ["Livestream", "TV Links", "TV Rechts"], 
                          output_file: ["livestream.json", "tvlinks.json", "tvrechts.json"]
                        },
                        team: { 
                          name: ["1. Mannschaft", "2. Mannschaft"],
                          time_values: [[30, 20, 10], [5, 10, 20]],
                          logo_home: ["skc_nibelungen_lorsch.png", "skc_nibelungen_lorsch.png"],
                          logo_guest: ["default.png", "SKV_Lorsch.png"],
                          num_players: ["6", "4"],
                          num_lanes: ["6", "4"],
                          set_points: ["true", "true"],                      
                          cck2_file: ["mannschaft1.json", "mannschaft2.json"]
                        },
                        adv: {
                          name: ["Werbung!"],
                          logo: ["sparkasse.png"],
                          time_values: [[0]],
                        } } as ConfigValues;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Accordion key="setup">
        <AccordionSummary key="setup_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Setup</h1>
            <Button onClick={() => {console.log(watchedValues.setup);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="setup_details">
          <Stack spacing={2} direction="column" alignItems="left">
            { CreateSetupSettings(register, defaultValues.setup) }
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion key="team">
        <AccordionSummary key="team_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Team Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.team);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="team_detail">
          <Stack spacing={2} direction="column" alignItems="left">
            {CreateTeamSettings(register, control, defaultValues.team, defaultValues.setup)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion key="adv">
        <AccordionSummary key="adv_summary" expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Werbung Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.adv);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails key="adv_details">
          <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
            {CreateAdvSettings(register, control, defaultValues.adv, defaultValues.setup)}
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