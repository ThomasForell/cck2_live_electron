import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm, useFormState } from 'react-hook-form';

import DirectorySelectorElectron from './DirectorySelectorElectron'

import { variant } from './App'; 

function TabTeam() {
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
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Team-Turnier</Typography>
                    <Button onClick={() => { 
                        reset(watchedValues); 
                        (window as any).electronAPI.saveTeamSetup(watchedValues); }} disabled={!isDirty} variant="contained">Speichern</Button>
                </Stack>
                <Stack spacing={2} direction="column">
                    <TextField key="team_cck2_output_files" label="CCK2 Ausgabedateien, mehrere Dateien mit Komma trennen" variant={variant}  
                        {...register("cck2_output_files")} defaultValue="result.json" />
                    <DirectorySelectorElectron key="tab_team_data_dse" register={register} registerName="data_path" setValue={setValue} getValues={getValues}
                        defaultValue="c:\\users\\[Benutzername]\\Documents\\Veranstaltung" label="Datenverzeichnis"/>
                    <TextField key="team_player_data" label="Spielerliste (Spieler ID,Name,Mannschaft,Gruppe) im CSV-Format" variant={variant} 
                        {...register("player_data")} defaultValue="spieler.csv"/>
                    <TextField key="team_additional_data" label="Zusätzliche Punkte (Spieler ID,Punkte,Kommentar) im CSV-Format, mehrere Dateien mit Komma trennen" 
                        {...register("additional_data")} variant={variant} defaultValue=" " />
                    <Stack spacing={2} direction="row">
                        <TextField key="team_output_game_data" label="Spielstand Ausgabedatei im CSV-Format" variant={variant} defaultValue="ergebnis.csv" 
                            {...register("output_game_data")} fullWidth/>
                        <Button variant="contained" onClick={() => { setActive(false); (window as any).electronAPI.teamProcessingStop(); }} 
                            disabled={!active}>Ausgabe Pausieren</Button>
                        <Button variant="contained" onClick={() => { setActive(true); (window as any).electronAPI.teamProcessingStart(); }} 
                            disabled={active}>Lesen und Fortsetzen</Button>
                    </Stack>                    
                </Stack>
            </Stack>
        </Box>
    );
}

export default TabTeam;