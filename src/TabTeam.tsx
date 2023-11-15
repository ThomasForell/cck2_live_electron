import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';


import { useForm, useFormState, Controller } from 'react-hook-form';

import DirectorySelectorElectron from './DirectorySelectorElectron'
import LogoDropzone from './LogoDropzone';
import TabPanel from './TabPanel';

import { variant } from './App'; 
import { FormControl } from '@mui/material';

function TabTeamTurnament() {
    const { control, register, watch, reset, setValue, getValues } = useForm();
    const { isDirty } = useFormState( {control} );
    const watchedValues = watch();
    const [active, setActive] = useState(false);

    useEffect(
        () => {
            (window as any).electronAPI.loadTeamSetup().then((data: any) => {
                if (data != null)
                    reset(data);
            });
            return () => { };
        }, [reset]);

    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={25} direction="row" justifyContent="space-between">
                <Typography component='div' variant="h3">Team-Turnier</Typography>
                <Button onClick={() => { 
                    reset(watchedValues); 
                    (window as any).electronAPI.saveTeamSetup(watchedValues); }} disabled={!isDirty} variant="contained">Speichern</Button>
            </Stack>
        <Stack spacing={2} direction="column">
            <TextField key="team_cck2_output_files" label="CCK2 Ausgabedateien, mehrere Dateien mit Komma trennen" variant={variant}  
                {...register("cck2_output_files")} defaultValue="result.json" />
            <DirectorySelectorElectron key="tab_team_data_dse" register={register} registerName="data_path" setValue={setValue} getValues={getValues}
                defaultValue="c:\\users\\[Benutzername]\\Documents\\Veranstaltung" label="Datenverzeichnis – Ein- und Ausgabe für das Turnier"/>
            <TextField key="team_player_data" label="Spielerliste (Spieler ID,Name,Mannschaft,Gruppe,Kommentar) im CSV-Format" variant={variant} 
                {...register("player_data")} defaultValue="spieler.csv"/>
            <TextField key="team_additional_data" label="Zusätzliche Punkte (Spieler ID,Punkte,Kommentar) im CSV-Format, mehrere Dateien mit Komma trennen" 
                {...register("additional_data")} variant={variant} defaultValue=" " />
            <FormControl>
                <FormLabel>Ergebnis Ausgabe</FormLabel>
                <FormGroup>
                    <Controller
                        control={control} name={"result_team_groups"} defaultValue={true}
                        render={({ field: { onChange, value } }) => (
                            <FormControlLabel label="Teams nach Gruppe" control={ <Checkbox checked={value} onChange={onChange} /> } />
                        )} />
                    <Controller
                        control={control} name={"result_team_combined"} defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                            <FormControlLabel label="Team Gesamtwertung" control={ <Checkbox checked={value} onChange={onChange} /> } />
                        )} />
                    <Controller
                        control={control} name={"result_single_groups"} defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                            <FormControlLabel label="Einzel nach Gruppe" control={ <Checkbox checked={value} onChange={onChange} /> } />
                        )} />
                    <Controller
                        control={control} name={"result_single_combined"} defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                            <FormControlLabel label="Einzel Gesamtwertung" control={ <Checkbox checked={value} onChange={onChange} /> } />
                        )} />
                </FormGroup>
            </FormControl>
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => { setActive(false); (window as any).electronAPI.teamProcessingStop(); }} 
                    disabled={!active}>Ausgabe Pausieren</Button>
                <Button variant="contained" onClick={() => { setActive(true); (window as any).electronAPI.teamProcessingStart(); }} 
                    disabled={active}>Lesen und Fortsetzen</Button>
            </Stack>                    
        </Stack>
    </Stack>)
}

function TabTeamLogos() {

    const { control, register, watch, reset, setValue, getValues } = useForm();
    const { isDirty } = useFormState( {control} );
    const watchedValues = watch();
    const [active, setActive] = useState(false);

    useEffect(
        () => {
//            (window as any).electronAPI.loadTeamLogos().then((data: any) => {
//                if (data != null)
//                    reset(data);
//            });
            return () => { };
        }, [reset]);
    
    return ( 
        <Stack spacing={4} direction="column">               
            <Stack spacing={25} direction="row" justifyContent="space-between">
                <Typography component='div' variant="h3">Team-Logos</Typography>
                <Button onClick={() => { 
                    reset(watchedValues); 
                    (window as any).electronAPI.saveTeamSetup(watchedValues); }} disabled={!isDirty} variant="contained">Speichern</Button>
            </Stack>
            <LogoDropzone label="Turnier Banner" name={"teamTurnamentBanner"} value={""} control={control} />

            <LogoDropzone label="Team Nibelungen" name={"teamTurnamentLogo.0"} value={""} control={control} />
            <LogoDropzone label="Team Kriemhild" name={"teamTurnamentLogo.1"} value={""} control={control} />
            <LogoDropzone label="Team Test 2" name={"teamTurnamentLogo.2"} value={""} control={control} />
            <LogoDropzone label="Team Test 3" name={"teamTurnamentLogo.3"} value={""} control={control} />
            <LogoDropzone label="Team Test 4" name={"teamTurnamentLogo.4"} value={""} control={control} />
            <LogoDropzone label="Team Test 5" name={"teamTurnamentLogo.5"} value={""} control={control} />
        </Stack>
    );
}

function TabTeam() {
    // vertical panel
    const [teamValuePanel, setTeamValuePanel] = useState(0);
    const handleChangeTeamPanel = (event: React.SyntheticEvent, newValue: number) => {
        setTeamValuePanel(newValue);
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>            
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={teamValuePanel}
                onChange={handleChangeTeamPanel}
                aria-label="Vertical tabs"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Turnier" id="tab-team-turnament" sx={{ alignItems: 'start' }} />
                <Tab label="Logos" id="tab-team-logos" sx={{ alignItems: 'start' }} />
            </Tabs>
            <TabPanel value={teamValuePanel} index={0}>         
                <TabTeamTurnament />
            </TabPanel>
            <TabPanel value={teamValuePanel} index={1}> 
                <TabTeamLogos />
            </TabPanel>
        </Box>
    );
}

export default TabTeam;