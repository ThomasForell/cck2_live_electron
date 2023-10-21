import './App.css';

import React, { useEffect, useState, createContext } from 'react';

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
import WiFi from '@mui/icons-material/Wifi';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import Dropzone from 'react-dropzone';

import { useForm } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import {ConfigValues} from '../cck2_live_interface/ConfigValues';
import TabInfo from './TabInfo';
import TabSetup from './TabSetup';
import NavigationButtons from './NavigationButtons';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";
const controlFktContext = createContext((null as any) as {watchedValues: ConfigValues, setStateUpdate: Function, setValue: Function} );

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

function LogoDropzone({label, name, value, control}: {label: string, name: string, value: string, control: Control}) {
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
                (window as any).electronAPI.logo("team", acceptedFiles[0].name, (acceptedFiles[0] as any).path).then(
                  (filename: string|null) => { if (filename != null) { onChange(filename); } });
              }
              else {
                (window as any).electronAPI.logo("adv", acceptedFiles[0].name, (acceptedFiles[0] as any).path).then(
                  (filename: string|null) => { if (filename != null) { onChange(filename); } });
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


function TeamSettings({register, control, team, setup, count, disableDelete, disableUp, disableDown}: {register: any, control: any, team: ConfigValues["team"], 
  setup: ConfigValues["setup"], count: number, disableDelete:boolean, disableUp:boolean, disableDown:boolean}) {
  return (
    <div>
      <Accordion>
        <AccordionSummary key={"teamSummary." + count.toString()} expandIcon={<ExpandMoreIcon />}>
            <Stack spacing={2} direction="row" alignItems="center"  onClick={(event: any) => event.stopPropagation()}>
              <TextField key="team_name" label="Teamname" variant={variant} defaultValue={team.name[count]} {...register("team.name." + count.toString())}/>
              {CreateTimeSelect(control, "team.time_values." + count.toString(), setup)}
              <NavigationButtons controlFktContext={controlFktContext} callback_id={"team." + count.toString()} 
                disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"teamDetails." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Heim" name={"team.logo_home." + count.toString()} value={team.logo_home[count]} control={control}/>
            <LogoDropzone label="Logo Gast" name={"team.logo_guest." + count.toString()} value={team.logo_guest[count]} control={control}/>
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

function CreateTeamSettings(props: {register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"]}) {
  let t = [];
  for (let i = 0; props.team &&  i < props.team.name.length; ++i) {
    t.push(<TeamSettings key={"team_settings_" + i.toString()} {...props}  count={i} disableDelete={props.team.name.length === 1} disableUp={i === 0} disableDown={i === props.team.name.length - 1} />);
  }
  return (<>{t}</>)
}

function AdvSettings({register, control, adv, setup, count, disableDelete, disableUp, disableDown}: 
  {register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], count: number,
    disableDelete:boolean, disableUp:boolean, disableDown:boolean}) {

  return (
    <>
      <Accordion>
        <AccordionSummary key={"advSummary." + count.toString()}
          expandIcon={<ExpandMoreIcon />}> 
            <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
              <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue={adv.logo[count]} {...register("adv.name." + count.toString())}/>
              {CreateTimeSelect(control, "adv.time_values." + count.toString(), setup)}
              <NavigationButtons controlFktContext={controlFktContext} callback_id={"adv." + count.toString()} 
                disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"advDetail." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Werbung" name={"adv.logo." + count.toString()} value={adv.logo[count]} control={control}/>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function CreateAdvSettings(props: {register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"]}) {
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


function App() {
  let currentVersion = "";

  function setCurrentVersion(version: string) {
    currentVersion = version;
  }

  const { control, register, watch, setValue } = useForm<ConfigValues>();
  let watchedValues: ConfigValues = watch();
  let stateUpdate: ConfigValues;
  let setStateUpdate: Function;
  [stateUpdate, setStateUpdate] = useState(watchedValues);

  useEffect(() => {
    setValue("setup", stateUpdate.setup);
    setValue("team", stateUpdate.team);
    setValue("adv", stateUpdate.adv);
  }, [stateUpdate]);

  const [mainValuePanel, setMainValuePanel] = useState(0);
  const handleChangeMainMenu = (event: React.SyntheticEvent, newValue: number) => {
    setMainValuePanel(newValue);
  };

  const [leagueValuePanel, setLeagueValuePanel] = useState(0);
  const handleChangeLeaguePanel = (event: React.SyntheticEvent, newValue: number) => {
    setLeagueValuePanel(newValue);
  }

  const [activeOutput, setActiveOutput] = useState("liga");

  const values: ConfigValues = {...watchedValues};
  const dataStuff = {watchedValues: watchedValues, 
    setStateUpdate: setStateUpdate, 
    setValue: setValue
  }; 

  useEffect(
    () => {
      (window as any).electronAPI.load().then(({config: data, version: version}: {config: ConfigValues, version: string}) => {
        setStateUpdate(data);
        setCurrentVersion(version);
        setActiveOutput(data.setup.active_output);
        console.log("load return");
      }); 
      return () => { };}, [] );

  return (
    <controlFktContext.Provider value={dataStuff}>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={mainValuePanel} onChange={handleChangeMainMenu} aria-label="basic tabs example">
          <Tab icon={activeOutput === "league" ? <WiFi/> : <SignalWifiStatusbarNullIcon/>} iconPosition="start" label="Liga" id="main-panel-liga"/>
          <Tab icon={activeOutput === "single" ? <WiFi/> : <SignalWifiStatusbarNullIcon/>} iconPosition="start" label="Einzel" id="main-panel-single"/>
          <Tab icon={activeOutput === "sprint" ? <WiFi/> : <SignalWifiStatusbarNullIcon/>} iconPosition="start" label="Sprint" id="main-panel-spirnt"/>
          <Tab icon={activeOutput === "team" ? <WiFi/> : <SignalWifiStatusbarNullIcon/>} iconPosition="start" label="Team" id="main-panel-team"/>
          <Tab label="Setup" id="main-panel-2"/>
          <Tab label="Info" id="main-panel-3"/>
        </Tabs>
      </Box>
      <TabPanel value={mainValuePanel} index={0}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={leagueValuePanel}
            onChange={handleChangeLeaguePanel}
            aria-label="Vertical tabs"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Teams" id="tab-leagure-team" sx={{alignItems:'start'}}/>
            <Tab label="Werbung" id="tab-league-adv" sx={{alignItems:'start'}}/>
          </Tabs>
          <TabPanel value={leagueValuePanel} index={0}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row" justifyContent="space-between">
                <Typography component='div' variant="h3">Team Konfiguration</Typography>
                <Button onClick={() => {(window as any).electronAPI.saveTeam(watchedValues.team);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <CreateTeamSettings key="create_team_settings" register={register} control={control} team={values.team} setup={values.setup}/>
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={leagueValuePanel} index={1}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row"  justifyContent="space-between">
              <Typography component='div' variant="h3">Werbung Konfiguration</Typography>
                <Button onClick={() => {(window as any).electronAPI.saveAdv(watchedValues.adv);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
                <CreateAdvSettings key="create_adv_settings" register={register} control={control} adv={values.adv} setup={values.setup}/>
              </Stack>
            </Stack>
          </TabPanel>
        </Box>
      </TabPanel>
      <TabPanel value={mainValuePanel} index={1}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
          <h1>Einzelmeisterschaft</h1>
        </Box>
      </TabPanel>
      <TabPanel value={mainValuePanel} index={2}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
          <h1>Sprint</h1>
        </Box>
      </TabPanel>
      <TabPanel value={mainValuePanel} index={3}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
          <h1>Team</h1>
        </Box>
      </TabPanel>
      <TabPanel value={mainValuePanel} index={4}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row"  justifyContent="space-between">
                <Typography component='div' variant="h3">Setup</Typography>
                <Button onClick={() => {(window as any).electronAPI.saveSetup(watchedValues.setup); setActiveOutput(watchedValues.setup.active_output)}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <TabSetup register={register} control={control} settings={values.setup} variant={variant} controlFktContext={controlFktContext}/>
              </Stack>
            </Stack>
        </Box>
      </TabPanel>
      <TabPanel value={mainValuePanel} index={5}>
        <TabInfo version={currentVersion}/>
      </TabPanel>

      </ThemeProvider>
    </controlFktContext.Provider>
  );
}

export default App;