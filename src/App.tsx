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

function TimeSelect(control: Control, name: string, label: string, value: number)
{
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
        <Controller control={control} name={name} defaultValue={value} render={({ field }) => (
          <Select {...field} label={label} variant={variant}>
            <MenuItem value={0}>0s</MenuItem>
            <MenuItem value={5}>5s</MenuItem>
            <MenuItem value={10}>10s</MenuItem>
            <MenuItem value={20}>20s</MenuItem>
            <MenuItem value={30}>30s</MenuItem>
            <MenuItem value={45}>45s</MenuItem>
            <MenuItem value={60}>60s</MenuItem>
          </Select>)}/>
    </FormControl>
  );
}

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
    cck2_file:Array<string>;
  };
  adv: {
    name: Array<string>;
    time_values: Array<Array<number>>;
  };
};

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

function CreateSettings(register: any, settings: ConfigValues["setup"]) {
  let s = [];
  for (let i = 0; i < settings.output_name.length; ++i) {
    s.push(SetupSettings(register, i));
  }
  return (<>{s}</>)
}

function TeamSettings(register: any, control: any, count: number) {
  let logoHome = "10";
  let logoGuest = "20";

  // <TimeSelect label="Zeit Livestream" defaultValue="0s" variant={variant} control={control} {...register("team.time_values." + count.toString() + ".0")}/>
  // <TimeSelect label="Zeit TV Links" defaultValue="5s" variant={variant} control={control} {...register("team.time_values." + count.toString() + ".1")}/>
  // <TimeSelect label="Zeit TV Rechts" defaultValue="10s" variant={variant} control={control} {...register("team.time_values." + count.toString() + ".2")}/>

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}>
            <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
              <TextField id="team_name" label="Teamname" variant={variant} defaultValue="1. Mannschaft" {...register("team.name." + count.toString())}/>
              {TimeSelect(control, "team.time_values." + count.toString() + ".0", "Zeit Livestream", 0)}
              <NavigationButtons callback_id={"team." + count.toString()}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={2}>
                <FormControl>
                  <InputLabel id="logo_home_label">Logo Heim</InputLabel>
                  <Select labelId="logo_home_select_label"
                    id="logo_home_select"
                    defaultValue={logoHome}
                    variant={variant}
                    label="Logo Heim"
                    {...register("team.logo_home." + count.toString())}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>KKV Saale Kreis</MenuItem>
                      <MenuItem value={30}>SKV Lorsch</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid xs={10}>
                <Box sx={{ height: 120, width: 250}}> <img src="SKC_Nibelungen_Lorsch.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
              <Grid xs={2}>
                <FormControl>
                  <InputLabel id="logo_guest_label">Logo Gast</InputLabel>
                  <Select labelId="logo_home_select_label"
                    id="logo_guest_select"
                    defaultValue={logoGuest}
                    variant={variant}
                    label="Logo Gast"
                    {...register("team.logo_guest." + count.toString())}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>KKV Saale Kreis</MenuItem>
                      <MenuItem value={30}>SKV Lorsch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={10}>
                <Box sx={{ height: 120}}> <img src="KSC_Groß-Zimmern.jpg" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>
          <Stack spacing={4} direction="row">
            <FormControl>
              <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
              <RadioGroup
                row
                aria-labelledby="num_player_label_aria">
                <FormControlLabel value="4" control={<Radio />} label="4" {...register("team.num_players." + count.toString())}/>
                <FormControlLabel value="6" control={<Radio />} label="6" {...register("team.num_players." + count.toString())}/>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
              <RadioGroup
                row
                aria-labelledby="num_lanes_label_aria">
                <FormControlLabel value="4" control={<Radio />} label="4" {...register("team.num_lanes." + count.toString())}/>
                <FormControlLabel value="6" control={<Radio />} label="6" {...register("team.num_lanes." + count.toString())}/>
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox defaultChecked {...register("team.set_points." + count.toString())}/>} label="Satzpunkte" />
          </Stack>
          <TextField id="cck2_data_file" label="CCK2 Daten Team" variant={variant} defaultValue="mannschaft.json" {...register("team.cck2_file." + count.toString())}/>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function AdvSettings(register: any, count: number){
//  <TimeSelect label="Zeit Livestream" defaultValue="0s" variant={variant} {...register("adv.time_values." + count.toString() + ".0")}/>
//  <TimeSelect label="Zeit TV Links" defaultValue="5s" variant={variant} {...register("adv.time_values." + count.toString() + ".1")}/>
//  <TimeSelect label="Zeit TV Rechts" defaultValue="10s" variant={variant} {...register("adv.time_values." + count.toString() + ".2")}/>

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue="Kempa" {...register("adv.name." + count.toString())}/>
                <NavigationButtons callback_id={"adv." + count.toString()}/>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid xs={4}>
                <FormControl style={{minWidth: 200}}>
                  <InputLabel id="demo-simple-select-label">Werbung</InputLabel>
                  <Select labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant={variant}
                    label="Werbung">
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid xs={8}>
                <Box sx={{ height: 120, width: 250}}> <img  src="rekorde_einzel_120.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function App() {

  const { control, register, watch, setValue } = useForm<ConfigValues>();
  let watchedValues = watch();

  let defaultValues = { setup: {
                          output_name: ["Livestream"], 
                          output_file: ["livestream.json"]
                        },
                        team: { 
                          name: ["1. Mannschaft", "2. Mannschaft"],
                          time_values: [[30], [5]],
                          logo_home: ["skc_nibelungen_lorsch.png", "skc_nibelungen_lorsch.png"],
                          logo_guest: ["default.png", "skv_lorsch.png"],
                          num_players: ["6", "4"],
                          num_lanes: ["6", "4"],
                          set_points: ["true", "true"],                      
                          cck2_file: ["mannschaft1.json", "mannschaft2.json"]
                        },
                        adv: {
                          name: ["Werbung!"],
                          time_values: [[0]],
                        } } as ConfigValues;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Setup</h1>
            <Button onClick={() => {console.log(watchedValues.setup);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column" alignItems="left">
            {CreateSettings(register, defaultValues.setup)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Team Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.team);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column" alignItems="left">
            {TeamSettings(register, control, 0)}
            {TeamSettings(register, control, 1)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
            <h1>Werbung Konfiguration</h1>
            <Button onClick={() => {console.log(watchedValues.adv);}} variant="contained">Speichern</Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column" alignItems="left">
            {AdvSettings(register, 0)}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Button onClick={() => { setValue("setup.output_name.0", "Livestream"); setValue("setup.output_name.1", "TV Links"); 
        setValue("setup.output_name.2", "TV Rechts"); setValue("team.time_values.0.0", 60)}}>Test Values</Button>
      </ThemeProvider>
    </>
  );
}

export default App;
