import { Controller } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox'

import { ConfigValues } from './cck2_live_interface/ConfigValues'
import NavigationButtons from './NavigationButtons'
import TimeSelect from './TimeSelect'
import LogoDropzone from './LogoDropzone'
import { TeamConfig } from './cck2_live_interface/LiveConfig'

import { variant } from './App'

function TeamSettings({
    register,
    control,
    team,
    setup,
    count,
    disableDelete,
    disableUp,
    disableDown
}: {
    register: any
    control: any
    team: ConfigValues['team']
    setup: ConfigValues['setup']
    count: number
    disableDelete: boolean
    disableUp: boolean
    disableDown: boolean
}): JSX.Element {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    key={'teamSummary.' + count.toString()}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Stack
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        onClick={(event: any) => event.stopPropagation()}
                    >
                        <TextField
                            key="team_name"
                            label="Teamname"
                            variant={variant}
                            defaultValue={team.name[count]}
                            {...register('team.name.' + count.toString())}
                        />
                        <TimeSelect
                            control={control}
                            name={'team.time_values.' + count.toString()}
                            setup={setup}
                        />
                        <NavigationButtons
                            callback_id={'team.' + count.toString()}
                            disableDelete={disableDelete}
                            disableUp={disableUp}
                            disableDown={disableDown}
                        />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={'teamDetails.' + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone
                            label="Logo Heim"
                            name={'team.logo_home.' + count.toString()}
                            value={team.logo_home[count]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Gast"
                            name={'team.logo_guest.' + count.toString()}
                            value={team.logo_guest[count]}
                            control={control}
                        />
                        <Stack spacing={4} direction="row">
                            <FormControl>
                                <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
                                <Controller
                                    defaultValue="4"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel
                                                value="4"
                                                control={<Radio />}
                                                label="4"
                                                key={'player_' + count.toString() + '_4'}
                                            />
                                            <FormControlLabel
                                                value="6"
                                                control={<Radio />}
                                                label="6"
                                                key={'player_' + count.toString() + '_6'}
                                            />
                                        </RadioGroup>
                                    )}
                                    name={'team.num_players.' + count.toString()}
                                    control={control}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
                                <Controller
                                    defaultValue="6"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel
                                                value="4"
                                                control={<Radio />}
                                                label="4"
                                                key={'lanes_' + count.toString() + '_4'}
                                            />
                                            <FormControlLabel
                                                value="6"
                                                control={<Radio />}
                                                label="6"
                                                key={'lanes_' + count.toString() + '_6'}
                                            />
                                        </RadioGroup>
                                    )}
                                    name={'team.num_lanes.' + count.toString()}
                                    control={control}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name={'team.set_points.' + count.toString()}
                                defaultValue={true}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Satzpunkte"
                                        control={<Checkbox checked={value} onChange={onChange} />}
                                    />
                                )}
                            />
                        </Stack>
                        <TextField
                            id="cck2_data_file"
                            label="CCK2 Daten Team"
                            variant={variant}
                            defaultValue="mannschaft.json"
                            {...register('team.cck2_file.' + count.toString())}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

function CreateTeamsSettings(props: {
    register: any
    control: any
    team: ConfigValues['team']
    setup: ConfigValues['setup']
}): JSX.Element {
    const t: JSX.Element[] = []
    for (let i = 0; props.team && i < props.team.name.length; ++i) {
        t.push(
            <TeamSettings
                key={'team_settings_' + i.toString()}
                {...props}
                count={i}
                disableDelete={props.team.name.length === 1}
                disableUp={i === 0}
                disableDown={i === props.team.name.length - 1}
            />
        )
    }
    return <>{t}</>
}

function TabTeam4() : JSX.Element {
    const { control, register, watch, setValue, getValues } = useForm<ConfigValues>()
    let team : TeamConfig = {
        cck2_file: ['test_file'],
        logo_guest: [''],
        logo_home: [''],
        name: ['Anonyme Hacker'],
        time_values: [[5,10]],
        num_players: ['4'],
        num_lanes: ['4'],
        set_points: [false]
    }
    let setup : SetupConfig = {
        output_name: [''],
        output_file: [''],
        type: ['type'],
        lanes: [false],
        adv: [false],
        cck2_output_path: 'bbb',
        active_output: 'ccc'
    }
    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={2} direction="row" justifyContent="space-between">
                <Typography component="div" variant="h3">
                    Teams Konfiguration
                </Typography>
                <Button
//                    onClick={() => {
//                        window.cck2live.saveLeagueTeam(watchedValues.team)
//                    }}
                    variant="contained"
                >
                    Speichern
                </Button>
            </Stack>
            <Stack spacing={2} direction="column" alignItems="left">
                <CreateTeamsSettings
                    key="create_team_settings"
                    register={register}
                    control={control}
                    team={team}
                    setup={setup}
                />
            </Stack>
        </Stack>
    )
} 
export default TabTeam4
