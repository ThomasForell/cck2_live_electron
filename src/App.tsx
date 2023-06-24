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
    <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
    <Select labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={props.value}
      label={props.label}
      variant={variant}
      onChange={props.onChange}>
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={30}>20</MenuItem>
        <MenuItem value={45}>45</MenuItem>
        <MenuItem value={60}>60</MenuItem>
    </Select>
  </FormControl>
  );
}

function TeamSettings() {
  const [age, setAge] = React.useState('');
  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  // nice trick to prevent Accordion from opening/closing when button is clicked
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();
  const InputWrapper = ({ children }: React.PropsWithChildren ) =>
  <div onClick={stopPropagation}>
    {children}
  </div>

  var timeTVLinks = 0;
  var timeTVRechts = 0;
  var timeLivestream = 0;
  
//  const teamCounter = 0;

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="accordion-summary-1-content"
          id="accordion-summary-1-header"> 
          <InputWrapper>
            <Stack spacing={4} direction="row" alignItems="center">
              <TextField id="standard-basic" label="Teamname" variant={variant} defaultValue="1. Mannschaft"/>
              <TimeSelect label="Zeit Livestream" value={timeLivestream} onChange={setAge} />
              <TimeSelect label="Zeit TV Links" value={timeTVLinks} onClick={setAge} />
              <TimeSelect label="Zeit TV Rechts" value={timeTVRechts} onClick={setAge} />
              <ButtonGroup variant="outlined" size="small" aria-label="outlined button group">
                <Button onClick={() => {alert('clicked');}} ><AddIcon/></Button>
                <Button><DeleteForeverIcon/></Button>
                <Button><ArrowCircleUpIcon/></Button>
                <Button><ArrowCircleDownIcon/></Button>
              </ButtonGroup>
            </Stack>
          </InputWrapper>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Logo Heim</InputLabel>
                  <Select labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    variant={variant}
                    label="Logo Heim"
                    onChange={handleChange}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <Box sx={{ height: 120, width: 250}}> <img  src="SKC_Nibelungen_Lorsch.png" alt="" height="120" width="auto"/> </Box>
              </Grid>
              <Grid item xs={2}>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Logo Gast</InputLabel>
                  <Select labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    variant={variant}
                    label="Logo Gast"
                    onChange={handleChange}>
                      <MenuItem value={10}>SKC Nibelungen Lorsch Nibelungen</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <Box sx={{ height: 120}}> <img  src="KSC_Groß-Zimmern.jpg" alt="" height="120" width="auto"/> </Box>
              </Grid>
            </Grid>

          <Stack spacing={4} direction="row">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Anzahl Spieler</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="6" control={<Radio />} label="6" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Anzahl Sätze</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="4" control={<Radio />} label="4" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Anzahl Bahnen</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="6" control={<Radio />} label="6" />
              </RadioGroup>
            </FormControl>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Satzpunkte" />
          </Stack>
          <TextField id="standard-basic" label="CCK2 Daten Team" variant={variant} value="mannschaft.json"/>
          <TextField id="standard-basic" label="CCK2 Daten Bahn" variant={variant} value="bahn.json"/>
        </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function AdvSettings(){
  const [age, setAge] = React.useState('');
  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  // nice trick to prevent Accordion from opening/closing when button is clicked
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();
  const InputWrapper = ({ children }: React.PropsWithChildren) =>
  <div onClick={stopPropagation}>
    {children}
  </div>

  var timeTVLinks = 0;
  var timeTVRechts = 0;
  var timeLivestream = 0;
  
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"> 
          <InputWrapper>
            <Stack spacing={4} direction="row" alignItems="center">
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue="Kempa"/>
              <TimeSelect label="Zeit Livestream" value={timeLivestream} onChange={setAge} />
              <TimeSelect label="Zeit TV Links" value={timeTVLinks} onClick={setAge} />
              <TimeSelect label="Zeit TV Rechts" value={timeTVRechts} onClick={setAge} />
              <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                <Button onClick={() => {alert('clicked');}} ><AddIcon/></Button>
                <Button><DeleteForeverIcon/></Button>
                <Button><ArrowCircleUpIcon/></Button>
                <Button><ArrowCircleDownIcon/></Button>
              </ButtonGroup>
            </Stack>
          </InputWrapper>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="column">

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Werbung</InputLabel>
                  <Select labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    variant={variant}
                    label="Werbung"
                    onChange={handleChange}>
                      <MenuItem value={10}>KV Aschaffenburg</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
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
