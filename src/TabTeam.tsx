import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm } from 'react-hook-form';

import { variant } from './App'; 

function TabTeam() {
    const { control, register, watch, setValue } = useForm();
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%", width: "100%" }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Team-Turnier</Typography>
                    <Button onClick={() => { }} disabled variant="contained">Speichern</Button>
                </Stack>
                <Stack spacing={2} direction="column">
                    <TextField key="team_data_path" label="Datenverzeichnis" variant={variant} defaultValue="" {...register("team.data_path")} />
                    <TextField key="team_cck2_output_files" label="CCK2 Ausgabedateien (mehrere Dateien mit Komma trennen)" variant={variant} defaultValue="" 
                        {...register("team.cck2_output_files")} />
                    <TextField key="team_player_data" label="Spielerliste (UID,Vorname,Nachname,Gruppe,Kommentar) im CSV-Format" variant={variant} defaultValue=""
                        {...register("team.player_data")} />
                    <Stack spacing={2} direction="row">
                        <TextField key="team_output_game_data" label="Spielstand Ausgabedatei im CSV-Format"
                            variant={variant} defaultValue="" {...register("team.output_game_data")} />
                        <Button variant="contained">Ausgabe Pausieren</Button>
                        <Button variant="contained">Lesen und Fortsetzen</Button>
                    </Stack>                    
                </Stack>
            </Stack>
        </Box>
    );
}

export default TabTeam;