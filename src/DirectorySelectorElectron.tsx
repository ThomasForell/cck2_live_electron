
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import { variant } from './App'

function DirectorySelectorElectron({register, registerName, getValues, setValue}: {register:any, registerName: string, getValues: Function, setValue: Function}) {
    return (
        <Stack spacing={2} direction="row">
            <TextField fullWidth key={registerName + "_tf"} label="CCK2 Ausgabeverzeichnis" variant={variant} defaultValue="" {...register(registerName)} />
            <Button key={registerName + "_btn"} variant="contained" 
                onClick={async () => {
                    (window as any).electronAPI.selectDirectory(getValues(registerName)).then((result: {canceled: boolean, filePaths: string[] }) => {
                        if (!result.canceled && result.filePaths.length > 0) {
                            setValue(registerName, result.filePaths[0]);
                        }
                    });
                }}> <MoreHorizIcon/> </Button>
        </Stack>
    )
}

export default DirectorySelectorElectron;