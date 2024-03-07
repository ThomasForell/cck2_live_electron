import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
//import FormLabel from '@mui/material/FormLabel'
//import FormControl from '@mui/material/FormControl'

import { useForm, useFormState, Controller } from 'react-hook-form'

import { SprintConfig } from './cck2_live_interface/LiveConfig'
import { variant } from './App'
import DirectorySelectorElectron from './DirectorySelectorElectron'

function TabSprint(): JSX.Element {
    const { control, register, watch, reset, setValue, getValues } = useForm()
    const { isDirty } = useFormState({ control })
    const watchedValues = watch()
    const [active, setActive] = useState(false)

    useEffect(() => {
        window.cck2live.loadSprintSetup().then((data: null | SprintConfig) => {
            if (data != null) {
                reset(data)
            }
        })
        return () => {}
    }, [reset])
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={25} direction="row" justifyContent="space-between">
                    <Typography component="div" variant="h3">
                        Sprint-Turnier
                    </Typography>
                    <Button
                        onClick={() => {
                            reset(watchedValues)
                            window.cck2live.saveSprintSetup(watchedValues)
                        }}
                        disabled={!isDirty}
                        variant="contained"
                    >
                        Speichern
                    </Button>
                </Stack>
                <Stack spacing={2} direction="column">
                    <Stack spacing={4} direction="row">
                        <TextField
                            key="sprint_num_players"
                            label="Anzahll Spieler K.-o.-Runde"
                            variant={variant}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            {...register('num_players')}
                            defaultValue={16}
                        />
                        <TextField
                            key="sprint_num_groups"
                            label="Anzahl Gruppen"
                            variant={variant}
                            type="number"
                            {...register('num_groups')}
                            defaultValue={2}
                        />
                    </Stack>
                    <FormGroup>
                        <Controller
                            control={control}
                            name={'qualification'}
                            defaultValue={true}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    label="Qualifikation"
                                    control={<Checkbox checked={value} onChange={onChange} />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={'place_3'}
                            defaultValue={true}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    label="Spiel um Platz 3"
                                    control={<Checkbox checked={value} onChange={onChange} />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={'finale_4'}
                            defaultValue={true}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    label="4er Finale"
                                    control={<Checkbox checked={value} onChange={onChange} />}
                                />
                            )}
                        />
                    </FormGroup>
                    <TextField
                        key="sprint_cck2_output_files"
                        label="CCK2 Ausgabedateien, mehrere Dateien mit Komma trennen"
                        variant={variant}
                        {...register('cck2_output_files')}
                        defaultValue="result.json"
                    />
                    <DirectorySelectorElectron
                        key="sprint_data_dse"
                        register={register}
                        registerName="data_path"
                        setValue={setValue}
                        getValues={getValues}
                        defaultValue="c:\users\[Benutzername]\Documents\Veranstaltung"
                        label="Datenverzeichnis – Ein- und Ausgabe für das Turnier"
                    />
                    <TextField
                        key="sprint_player_data"
                        label="Spielerliste (Spieler ID,Name,Mannschaft,Gruppe,Kommentar) im CSV-Format"
                        variant={variant}
                        {...register('player_data')}
                        defaultValue="spieler.csv"
                    />
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActive(false)
                                window.cck2live.sprintProcessingStop()
                            }}
                            disabled={!active}
                        >
                            Ausgabe Pausieren
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActive(true)
                                window.cck2live.sprintProcessingStart()
                            }}
                            disabled={active}
                        >
                            Lesen und Fortsetzen
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                window.cck2live.sprintCreateSVFile()
                            }}
                        >
                            Erzeuge Sudden Victory Datei</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}

export default TabSprint
