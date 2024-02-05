import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import { variant } from './App'

function DirectorySelectorElectron({
    register,
    registerName,
    getValues,
    setValue,
    defaultValue = 'c:\\users\\[Benutzername]\\Documents\\Veranstaltung',
    label = ''
}: {
    register: any
    registerName: string
    getValues: Function
    setValue: Function
    defaultValue: string
    label: string
}) {
    return (
        <Stack spacing={2} direction="row">
            <TextField
                fullWidth
                key={registerName + '_tf'}
                label={label}
                variant={variant}
                defaultValue={defaultValue}
                {...register(registerName)}
            />
            <Button
                key={registerName + '_btn'}
                variant="contained"
                onClick={async () => {
                    ;(window as any).electronAPI
                        .selectDirectory(getValues(registerName))
                        .then((result: { canceled: boolean; filePaths: string[] }) => {
                            if (!result.canceled && result.filePaths.length > 0) {
                                setValue(registerName, result.filePaths[0], { shouldDirty: true })
                            }
                        })
                }}
            >
                {' '}
                <MoreHorizIcon />{' '}
            </Button>
        </Stack>
    )
}

export default DirectorySelectorElectron
