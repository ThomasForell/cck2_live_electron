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
    <InputLabel id="time_label">{props.label}</InputLabel>
    <Select labelId="time_select_label"
      id={props.id}
      defaultValue={props.defaultValue}
      label={props.label}
      variant={variant}>
        <MenuItem value="0">0</MenuItem>
        <MenuItem value="5">5</MenuItem>
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="20">20</MenuItem>
        <MenuItem value="30">30</MenuItem>
        <MenuItem value="45">45</MenuItem>
        <MenuItem value="60">60</MenuItem>
    </Select>
  </FormControl>
  );
}

interface TeamValues {
  team_name: string;
  time_livestream: string;
  time_tv_links: string;
  time_tv_rechts: string;
  cck2_file:string;
};

function TeamSettings() {

  const { register } = useForm<TeamValues>();

  let logoHome = 0;
  let logoGuest = 0;
  
   return (
  
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls=""
          id="team_settings"> 
            <Stack spacing={4} direction="row" alignItems="center"  onClick={(event) => event.stopPropagation()}>
              <TextField id="team_name" label="Teamname" variant={variant} defaultValue="1. Mannschaft" {...register("team_name")}/>
              <TimeSelect label="Zeit Livestream" defaultValue="60" id="ts1" {...register("time_livestream")}/>
              <TimeSelect label="Zeit TV Links" defaultValue="20" id="ts2" {...register("time_tv_links")}/>
              <TimeSelect label="Zeit TV Rechts" defaultValue="45" id="ts3" {...register("time_tv_rechts")}/>
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
                    label="Logo Heim">
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
                    label="Logo Gast">
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
                name="num_player_label_group"
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
                name="num_lanes_label_group"
              >
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="6" control={<Radio />} label="6" />
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Satzpunkte" />
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

  var timeTVLinks = 0;
  var timeTVRechts = 0;
  var timeLivestream = 0;

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
              <TimeSelect label="Zeit Livestream" value={timeLivestream} />
              <TimeSelect label="Zeit TV Links" value={timeTVLinks} />
              <TimeSelect label="Zeit TV Rechts" value={timeTVRechts} />
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
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <h1>Team Konfiguration</h1>
      <p>
        {TeamSettings()}
      </p>
      <h1>Werbung Konfiguration</h1>
      <p>
        {AdvSettings()}
      </p>
      </ThemeProvider>
    </div>
  );
}

export default App;
