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

function TimeSelect(props: any)
{
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
    <InputLabel>{props.label}</InputLabel>
    <Select {...props}>
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

interface ConfigValues {
  team: {
    name: Array<string>;
    time_values: Array<Array<string>>;
    logo_home: Array<string>;
    logo_guest: Array<string>;
    num_players: Array<string>;
    num_lanes: Array<string>;
    set_points: Array<string>;
    cck2_file:Array<string>;
  };
  adv: {
    name: Array<string>;
    time_values: Array<Array<string>>;
  };
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
              <TextField id="team_name" label="Teamname" variant={variant} defaultValue="1. Mannschaft" {...register("team.name." + count.toString())}/>
              <TimeSelect label="Zeit Livestream" defaultValue="0s" variant={variant} {...register("team.time_values." + count.toString() + ".0")}/>
              <TimeSelect label="Zeit TV Links" defaultValue="5s" variant={variant} {...register("team.time_values." + count.toString() + ".1")}/>
              <TimeSelect label="Zeit TV Rechts" defaultValue="10s" variant={variant} {...register("team.time_values." + count.toString() + ".2")}/>
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
                    {...register("team.logo_home." + count.toString())}>
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
                    {...register("team.logo_guest." + count.toString())}>
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
              >
                <FormControlLabel value="4" control={<Radio />} label="4" {...register("team.num_players." + count.toString())}/>
                <FormControlLabel value="6" control={<Radio />} label="6" {...register("team.num_players." + count.toString())}/>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
              <RadioGroup
                row
                aria-labelledby="num_lanes_label_aria"
              >
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

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue="Kempa" {...register("adv.name." + count.toString())}/>
                <TimeSelect label="Zeit Livestream" defaultValue="0s" variant={variant} {...register("adv.time_values." + count.toString() + ".0")}/>
                <TimeSelect label="Zeit TV Links" defaultValue="5s" variant={variant} {...register("adv.time_values." + count.toString() + ".1")}/>
                <TimeSelect label="Zeit TV Rechts" defaultValue="10s" variant={variant} {...register("adv.time_values." + count.toString() + ".2")}/>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                <Button onClick={() => {}} ><AddIcon/></Button>
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
  
  const { register, watch } = useForm<ConfigValues>();
  let watchedValues = watch();

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <h1>Team Konfiguration</h1>
      <p>
        {TeamSettings(register, 0)}
        {TeamSettings(register, 1)}
        <Button onClick={() => {console.log(watchedValues.team);}} variant="contained">Speichern</Button>
      </p>
      <h1>Werbung Konfiguration</h1>
      <p>
        {AdvSettings(register, 0)}
        <Button onClick={() => {console.log(watchedValues.adv);}} variant="contained">Speichern</Button>
      </p>
      </ThemeProvider>
    </>
  );
}

export default App;
