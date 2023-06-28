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
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";

function TimeSelect(label: string, value: string, hook: string, register: any)
{
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
    <InputLabel>{label}</InputLabel>
    <Select 
      defaultValue={value}
      label={label}
      variant={variant}
      {...register(hook)}>
        <MenuItem value="0s">0s</MenuItem>
        <MenuItem value="5s">5s</MenuItem>
        <MenuItem value="10s">10s</MenuItem>
        <MenuItem value="20s">20s</MenuItem>
        <MenuItem value="30s">30s</MenuItem>
        <MenuItem value="45s">45s</MenuItem>
        <MenuItem value="60s">60s</MenuItem>
    </Select>
  </FormControl>
  );
}

//interface TeamConfigValues {
//  team_name: Array<string>;
//  time_values: Array<Array<string>>;
//  time_values1: Array<string>;
//  time_values2: Array<string>;
//  time_values3: Array<string>;
//  logo_home: Array<string>;
//  logo_guest: Array<string>;
//  num_players: Array<string>;
//  num_lanes: Array<string>;
//  set_points: Array<string>;
//  cck2_file:Array<string>;
//};

interface TeamConfigValues {
  team_name: string;
//  time_values: Array<Array<string>>;
  time_values1: string;
  time_values2: string;
  time_values3: string;
  logo_home: string;
  logo_guest: string;
  num_players: string;
  num_lanes: string;
  set_points: string;
  cck2_file: string;
};

function TeamSettings(register: any, count: number) {
  let logoHome = "10";
  let logoGuest = "20";
  
   return (
  
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls=""
          id="team_settings"> 
            <Stack spacing={4} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
              <TextField id="team_name" label="Teamname" variant={variant} defaultValue="1. Mannschaft" {...register("team_name")}/>
              {TimeSelect("Zeit Livestream", "0s", "time_values1", register)}
              {TimeSelect("Zeit TV Links", "5s", "time_values3", register)}
              {TimeSelect("Zeit TV Rechts", "10s", "time_values2", register)}
              <ButtonGroup variant="outlined" size="small" aria-label="">
                <Button><AddIcon/></Button>
                <Button><DeleteForeverIcon/></Button>
                <Button><ArrowCircleUpIcon/></Button>
                <Button><ArrowCircleDownIcon/></Button>
              </ButtonGroup>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl style={{minWidth: 200}}>
                  <InputLabel id="logo_home_label">Logo Heim</InputLabel>
                  <Select labelId="logo_home_select_label"
                    id="logo_home_select"
                    defaultValue={logoHome}
                    variant={variant}
                    label="Logo Heim"
                    {...register("logo_home")}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>KKV Saale Kreis</MenuItem>
                      <MenuItem value={30}>SKV Lorsch</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Box sx={{ height: 120, width: 250}}> <img src="SKC_Nibelungen_Lorsch.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
              <Grid item xs={4}>
                <FormControl style={{minWidth: 200}}>
                  <InputLabel id="logo_guest_label">Logo Gast</InputLabel>
                  <Select labelId="logo_home_select_label"
                    id="logo_guest_select"
                    defaultValue={logoGuest}
                    variant={variant}
                    label="Logo Gast"
                    {...register("logo_guest")}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>KKV Saale Kreis</MenuItem>
                      <MenuItem value={30}>SKV Lorsch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Box sx={{ height: 120}}> <img src="KSC_Groß-Zimmern.jpg" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>

          <Stack spacing={4} direction="row">
            <FormControl>
              <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
              <RadioGroup
                row
                aria-labelledby="num_player_label_aria"
                {...register("num_players")}
              >
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="6" control={<Radio />} label="6" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
              <RadioGroup
                row
                aria-labelledby="num_lanes_label_aria"
                {...register("num_lanes")}
              >
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="6" control={<Radio />} label="6" />
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox defaultChecked {...register("set_points")}/>} label="Satzpunkte" />
          </Stack>
          <TextField id="cck2_data_file" label="CCK2 Daten Team" variant={variant} defaultValue="mannschaft.json" {...register("cck2_file")}/>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

interface AdvValues {
  adv_name: string;
  adv_time_livestream: string;
  adv_time_tv_links: string;
  adv_time_tv_rechts: string;
}

function AdvSettings(){

  var timeTVLinks = "0";
  var timeTVRechts = "5";
  var timeLivestream = "10";

  const { register } = useForm<AdvValues>();
  
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue="Kempa" {...register("adv_name")}/>
              {TimeSelect("Zeit Livestream", "0s", "time_values1", register)}
              {TimeSelect("Zeit TV Links", "5s", "time_values3", register)}
              {TimeSelect("Zeit TV Rechts", "10s", "time_values2", register)}
              <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                <Button onClick={() => {alert('clicked');}} ><AddIcon/></Button>
                <Button><DeleteForeverIcon/></Button>
                <Button><ArrowCircleUpIcon/></Button>
                <Button><ArrowCircleDownIcon/></Button>
              </ButtonGroup>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">
            <Grid container spacing={2}>
              <Grid item xs={4}>
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
              <Grid item xs={8}>
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
  
  const { register, watch } = useForm<TeamConfigValues>();
  let watchedValues = watch();

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <h1>Team Konfiguration <Button onClick= {() => {console.log(watchedValues)}} >Save</Button></h1>
      <p>
        {TeamSettings(register, 0)}
      </p>
      <h1>Werbung Konfiguration</h1>
      <p>
      </p>
      </ThemeProvider>
    </div>
  );
}

export default App;
