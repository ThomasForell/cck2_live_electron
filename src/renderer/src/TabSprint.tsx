import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function TabSprint() {
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Sprint-Turnier</Typography>
                    <Button onClick={() => { }} disabled variant="contained">Speichern</Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default TabSprint;