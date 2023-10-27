import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm, useFormState } from 'react-hook-form';

import { variant } from './App'; 

function TabTeam() {
    const { control, register, watch, reset } = useForm();
    const { isDirty } = useFormState( {control} );
    const watchedValues = watch();

    useEffect(
        () => {
            (window as any).electronAPI.loadTeamSetup().then((data: any) => {
                if (data != null)
                    reset(data);
            });
            return () => { };
        }, []);

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
                    <TextField key="team_data_path" label="Datenverzeichnis" variant={variant} defaultValue="c:\\users\\[Benutzername]\\Documents\\Veranstaltung" 
                        {...register("data_path")} />
                    <TextField key="team_player_data" label="Spielerliste (Spieler ID,Vorname,Nachname,Gruppe,Kommentar) im CSV-Format" variant={variant} 
                        {...register("player_data")} />
                    <TextField key="team_additional_data" label="Zusätzliche Punkte (Spieler ID,Punkte,Kommentar) im CSV-Format, mehrere Dateien mit Komma trennen" 
                        {...register("additional_data")} variant={variant} defaultValue=" " />
                    <Stack spacing={2} direction="row">
                        <TextField key="team_output_game_data" label="Spielstand Ausgabedatei im CSV-Format" variant={variant} defaultValue="ergebnis.csv" 
                            {...register("output_game_data")} fullWidth/>
                        <Button variant="contained">Ausgabe Pausieren</Button>
                        <Button variant="contained">Lesen und Fortsetzen</Button>
                    </Stack>                    
                </Stack>
            </Stack>
        </Box>
    );
}

export default TabTeam;