import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { FormControl } from '@mui/material'

import { useForm, useFormState, Controller } from 'react-hook-form'

import DirectorySelectorElectron from './DirectorySelectorElectron'

import { variant } from './App'
import { SingleConfig } from './cck2_live_interface/LiveConfig'

function TabSingle({ config }: { config: null | SingleConfig }): JSX.Element {
    const { control, register, watch, reset, setValue, getValues } = useForm()
    const { isDirty } = useFormState({ control })
    const watchedValues = watch()
    const [active, setActive] = useState(false)

    useEffect(() => {
        if (config == null) {
            ;(window as any).electronAPI.loadSingleSetup().then((data: null | SingleConfig) => {
                if (data != null) {
                    reset(data)
                    config = { ...data }
                }
            })
        } else {
            reset(config)
        }
        return () => {}
    }, [reset])

    useEffect(() => {
        config = { ...(watchedValues as SingleConfig) }
        return () => {}
    }, [watchedValues])

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={25} direction="row" justifyContent="space-between">
                    <Typography component="div" variant="h3">
                        Einzel-Turnier
                    </Typography>
                    <Button
                        onClick={() => {
                            reset(watchedValues)
                            ;(window as any).electronAPI.saveSingleSetup(watchedValues)
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
                            key="single_match_day"
                            label="Spieltag"
                            variant={variant}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            {...register('match_day')}
                            defaultValue={1}
                        />
                        <TextField
                            key="single_num_match_days"
                            label="Anzahl Spieltage"
                            variant={variant}
                            type="number"
                            {...register('num_match_days')}
                            defaultValue={2}
                        />
                    </Stack>
                    <TextField
                        key="single_cck2_output_files"
                        label="CCK2 Ausgabedateien, mehrere Dateien mit Komma trennen"
                        variant={variant}
                        {...register('cck2_output_files')}
                        defaultValue="result.json"
                    />
                    <DirectorySelectorElectron
                        key="tab_single_data_dse"
                        register={register}
                        registerName="data_path"
                        setValue={setValue}
                        getValues={getValues}
                        defaultValue="c:\users\[Benutzername]\Documents\Veranstaltung"
                        label="Datenverzeichnis – Ein- und Ausgabe für das Turnier"
                    />
                    <TextField
                        key="single_player_data"
                        label="Spielerliste (Spieler ID,Name,Mannschaft,Gruppe,Kommentar) im CSV-Format"
                        variant={variant}
                        {...register('player_data')}
                        defaultValue="spieler.csv"
                    />
                    <FormControl>
                        <FormLabel>Ergebnis Ausgabe</FormLabel>
                        <FormGroup>
                            <Controller
                                control={control}
                                name={'result_single_groups'}
                                defaultValue={false}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Einzel nach Gruppe"
                                        control={<Checkbox checked={value} onChange={onChange} />}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={'result_single_combined'}
                                defaultValue={false}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Einzel Gesamtwertung"
                                        control={<Checkbox checked={value} onChange={onChange} />}
                                    />
                                )}
                            />
                        </FormGroup>
                    </FormControl>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActive(false)
                                ;(window as any).electronAPI.singleProcessingStop()
                            }}
                            disabled={!active}
                        >
                            Ausgabe Pausieren
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActive(true)
                                ;(window as any).electronAPI.singleProcessingStart()
                            }}
                            disabled={active}
                        >
                            Lesen und Fortsetzen
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}

export default TabSingle
