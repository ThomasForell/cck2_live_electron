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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const variant = "standard";

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

function ComponentAdd(reference: string) {
  let tmp = {...watchedValues};
  const numTimeEntries = tmp.setup.output_name.length;
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    tmp.setup.output_name.splice(i, 0, "Stream");
    tmp.setup.output_file.splice(i, 0, "stream_file");
    values = {...tmp};
    setStateUpdate(values);
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
    setStateUpdate(values);
    }
  else if (component === "adv") {
    tmp.adv.name.splice(i, 0, "Werbung");
    tmp.adv.time_values.splice(i, 0, new Array(numTimeEntries).fill(0));
    tmp.adv.logo.splice(i, 0, "");
    values = {...tmp};
    setStateUpdate(values);
    }
}

function ComponentDelete(reference: string) {
  let tmp = {...watchedValues};
  const [component, id] = reference.split(".");
  const i = Number(id);
  if (component === "setup") {
    tmp.setup.output_name.splice(i, 1);
    tmp.setup.output_file.splice(i, 1);
    values = {...tmp};
    setStateUpdate(values);
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
    setStateUpdate(values);
  }
  else if (component === "adv") {
    tmp.adv.name.splice(i, 1);
    tmp.adv.time_values.splice(i, 1);
    tmp.adv.logo.splice(i, 1);
    values = {...tmp};
    setStateUpdate(values);
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
    setValueFunc("setup", values.setup);
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
    setValueFunc("setup", values.setup);
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

function SetupSettings({register, count, disableDelete, disableUp, disableDown}: 
  {register: any, count: number, disableDelete:boolean, disableUp: boolean, disableDown: boolean}) {
  return ( 
      <Stack spacing={4} direction="row" alignItems="center">
        <TextField label="Ausgabe Name" variant={variant} defaultValue="TV oder Stream" 
          {...register("setup.output_name." + count.toString())}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            values = {...watchedValues};   
            if (event.target){
              values.setup.output_name[count] = ((event.target) as HTMLInputElement).value;
              setStateUpdate(values);
            }
          }}/>
        <TextField label="Ausgabe Datei" variant={variant} defaultValue="stream" {...register("setup.output_file." + count.toString())}/>
        <NavigationButtons callback_id={"setup." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown}/>
      </Stack>
  )
}

function CreateSetupSettings({register, settings}: {register: any, settings: ConfigValues["setup"]}) {
  let s = [];
  for (let i = 0; i < settings.output_name.length; ++i) {
    s.push(<SetupSettings key={"CreateSetupSettings" + i.toString()} register={register} count={i} disableDelete={settings.output_name.length === 1}
      disableUp={i === 0} disableDown={i === settings.output_name.length - 1} />);
  }
  return (<>{s}</>)
}

function LogoDropzone({label, name, value, control}: {label: string, name: string, value: string, control: Control}) {
  let source = "";
  if (name.startsWith("adv")) {
    source = "logos/adv/" + value;
  }
  else {
    source = "logos/team/" + value;
  }
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box sx={{ height: 120, width: 120}}>
        <div style={{textAlign: "start"}}> 
          {label} 
        </div>
      </Box>
      <Box sx={{ height: 120, width: 175}}>
        <div style={{textAlign: "center"}}> 
          <img id={name} src={source} alt="" height="120" width="auto" /> 
        </div>
      </Box>
      <Controller control={control} name={name}
        render={({ field: {onChange, value} }) =>           
          <Dropzone 
            noClick noKeyboard
            accept={{'image/*': ['.jpeg', '.png']}}
            multiple={false}
            onDrop={(acceptedFiles: File[]) => {
              onChange(acceptedFiles[0].name);
              let element = document.getElementById(name) as HTMLImageElement;
              if (name.startsWith("adv")) {
                element.src = "logos/adv/" + acceptedFiles[0].name;
              }
              else {
                element.src = "logos/team/" + acceptedFiles[0].name;
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
              <NavigationButtons callback_id={"team." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"teamDetails." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Heim" name={"team.logo_home." + count.toString()} value={team.logo_home[count]} control={control} />
            <LogoDropzone label="Logo Gast" name={"team.logo_guest." + count.toString()} value={team.logo_guest[count]} control={control} />
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
  for (let i = 0; i < props.team.name.length; ++i) {
    t.push(<TeamSettings {...props}  count={i} disableDelete={props.team.name.length === 1} disableUp={i === 0} disableDown={i === props.team.name.length - 1} />);
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
              <NavigationButtons callback_id={"adv." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails key={"advDetail." + count.toString()}>
          <Stack spacing={2} direction="column">
            <LogoDropzone label="Logo Werbung" name={"adv.logo." + count.toString()} value={adv.logo[count]} control={control} />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function CreateAdvSettings(props: {register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"]}) {
  let a = [];
  for (let i = 0; i < props.adv.name.length; ++i) {
    a.push(<AdvSettings  {...props} count={i} disableDelete={props.adv.name.length === 1} disableUp={i === 0} disableDown={i === props.adv.name.length - 1} />);
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
let setStateUpdate: any;

function App({socket}: {socket: Socket}) {
  const { control, register, watch, setValue } = useForm<ConfigValues>({defaultValues: {...values}});
  watchedValues = watch();
  setValueFunc = setValue;

  let stateUpdate: ConfigValues;
  [stateUpdate, setStateUpdate] = useState(values);

  useEffect(() => {
    setValue("setup", stateUpdate.setup);
    setValue("team", stateUpdate.team);
    setValue("adv", stateUpdate.adv);
  }, [stateUpdate]);

  socket.on("load return", (data: ConfigValues) => {
    values = {...data}; 
    setValue("setup", values.setup);
    setValue("team", values.team);
    setValue("adv", values.adv);
    console.log("load return");
  });

  useEffect(
    () => {socket.emit("load", "hello!")}, []
  );

  const [valuePanel, setValuePanel] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValuePanel(newValue);
  };

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
            <Stack component="div" spacing={4} direction="column">
              <Stack spacing={2} direction="row" alignItems="left">
                <Typography component='div' variant="h3">Team Konfiguration</Typography>
                <Button onClick={() => {console.log(watchedValues.team); socket.emit("save_team", watchedValues.team);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <CreateTeamSettings register={register} control={control} team={values.team} setup={values.setup} />
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={valuePanel} index={1}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row" alignItems="left">
              <Typography component='div' variant="h3">Werbung Konfiguration</Typography>
                <Button onClick={() => {console.log(watchedValues.adv); socket.emit("save_adv", watchedValues.adv);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
                <CreateAdvSettings register={register} control={control} adv={values.adv} setup={values.setup} />
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={valuePanel} index={2}>
            <Stack spacing={4} direction="column">
              <Stack spacing={2} direction="row" alignItems="left">
                <Typography component='div' variant="h3">Setup</Typography>
                <Button onClick={() => {console.log(watchedValues.setup); socket.emit("save_setup", watchedValues.setup);}} variant="contained">Speichern</Button>
              </Stack>
              <Stack spacing={2} direction="column" alignItems="left">
                <CreateSetupSettings register={register} settings={values.setup} />
              </Stack>
            </Stack>
          </TabPanel>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;