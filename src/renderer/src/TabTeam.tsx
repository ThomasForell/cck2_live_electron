import { JSX, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'

import { useForm, useFormState, Controller } from 'react-hook-form'

import DirectorySelectorElectron from './DirectorySelectorElectron'
import LogoDropzone from './LogoDropzone'
import TabPanel from './TabPanel'

import { variant } from './App'
import { TeamsConfig } from './cck2_live_interface/LiveConfig'

function TabTeamTurnament(): JSX.Element {
    const { control, register, watch, reset, setValue, getValues } = useForm()
    const { isDirty } = useFormState({ control })
    const watchedValues = watch()
    const [active, setActive] = useState(false)

    useEffect(() => {
        window.cck2live.loadTeamSetup().then((data: null | TeamsConfig) => {
            if (data != null) {
                reset(data)
            }
        })
        return () => {}
    }, [reset])

    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={25} direction="row" justifyContent="space-between">
                <Typography component="div" variant="h3">
                    Team-Turnier
                </Typography>
                <Button
                    onClick={() => {
                        reset(watchedValues)
                        window.cck2live.saveTeamSetup(watchedValues)
                    }}
                    disabled={!isDirty}
                    variant="contained"
                >
                    Speichern
                </Button>
            </Stack>
            <Stack spacing={2} direction="column">
                <TextField
                    key="team_cck2_output_files"
                    label="CCK2 Ausgabedateien, mehrere Dateien mit Komma trennen"
                    variant={variant}
                    {...register('cck2_output_files')}
                    defaultValue="result.json"
                />
                <DirectorySelectorElectron
                    key="tab_team_data_dse"
                    register={register}
                    registerName="data_path"
                    setValue={setValue}
                    getValues={getValues}
                    defaultValue="c:\\users\\[Benutzername]\\Documents\\Veranstaltung"
                    label="Datenverzeichnis – Ein- und Ausgabe für das Turnier"
                />
                <TextField
                    key="team_player_data"
                    label="Spielerliste (Spieler ID,Name,Mannschaft,Gruppe,Kommentar) im CSV-Format"
                    variant={variant}
                    {...register('player_data')}
                    defaultValue="spieler.csv"
                />
                <TextField
                    key="team_additional_data"
                    label="Zusätzliche Punkte (Spieler ID,Punkte,Kommentar) im CSV-Format, mehrere Dateien mit Komma trennen"
                    {...register('additional_data')}
                    variant={variant}
                    defaultValue=" "
                />
                <FormControl>
                    <FormLabel>Ergebnis Ausgabe</FormLabel>
                    <FormGroup>
                        <Controller
                            control={control}
                            name={'result_team_groups'}
                            defaultValue={true}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    label="Teams nach Gruppe"
                                    control={<Checkbox checked={value} onChange={onChange} />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={'result_team_combined'}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    label="Team Gesamtwertung"
                                    control={<Checkbox checked={value} onChange={onChange} />}
                                />
                            )}
                        />
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
                            window.cck2live.teamProcessingStop()
                        }}
                        disabled={!active}
                    >
                        Ausgabe Pausieren
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setActive(true)
                            window.cck2live.teamProcessingStart()
                        }}
                        disabled={active}
                    >
                        Lesen und Fortsetzen
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

function TabTeamLogos(): JSX.Element {
    const { control, watch, reset } = useForm()
    const { isDirty } = useFormState({ control })
    const watchedValues = watch()
    //    const [active, setActive] = useState(false)

    //    useEffect(() => {
    //        window.cck2live.getTeamLogos().then((data: Map<string, string>) => {
    //            if (data != null) {
    //                reset(data);
    //            }
    //        })
    //        return () => {}
    //    }, [reset])

    const teamLogos: Map<string, string> = new Map([
        ['Turnier Banner', ''],
        ['KV Aschaffenburg', ''],
        ['SKV Kriemhild Lorsch', ''],
        ['SKC Nibelunge Lorsch', '']
    ])

    const l: JSX.Element[] = []
    teamLogos.forEach((value: string, key: string) => {
        if (key == 'Turnier Banner') {
            l.push(
                <LogoDropzone
                    label={key}
                    name={'teamTurnamentBanner'}
                    value={value}
                    control={control}
                    dense
                />
            )
            l.push(<Divider />)
        } else {
            l.push(
                <LogoDropzone
                    label={key}
                    name={'teamTurnamentLogo.' + key}
                    value={value}
                    control={control}
                    dense
                />
            )
        }
    })
    console.log(watchedValues)
    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={25} direction="row" justifyContent="space-between">
                <Typography component="div" variant="h3">
                    Team-Logos
                </Typography>
                <Button
                    onClick={() => {
                        reset(watchedValues)
                        window.cck2live.saveTeamSetup(watchedValues)
                    }}
                    disabled={!isDirty}
                    variant="contained"
                >
                    Speichern
                </Button>
            </Stack>
            <Divider />
            {l}
        </Stack>
    )
}

function TabTeam(): JSX.Element {
    // vertical panel
    const [teamValuePanel, setTeamValuePanel] = useState(0)
    const handleChangeTeamPanel = (_, newValue: number): void => {
        setTeamValuePanel(newValue)
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
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
    )
}

export default TabTeam
