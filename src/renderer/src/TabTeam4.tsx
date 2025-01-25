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
//import NavigationButtons from './NavigationButtons'
import TimeSelect from './TimeSelect'
import LogoDropzone from './LogoDropzone'
import { DefaultTeam4Config, Team4Config } from './cck2_live_interface/LiveConfig'

import { variant } from './App'

function TeamSettings({
    register,
    control,
    competition,
    setup,
    count,
    disableDelete,
    disableUp,
    disableDown
}: {
    register: any
    control: any
    competition: ConfigValues['team4']
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
                            label="Wettkampf"
                            variant={variant}
                            defaultValue={competition.name}
                            {...register('competition.' + count.toString() + '.name')}
                        />
                        <TimeSelect
                            control={control}
                            name={'competition.' + count.toString() + '.time_values'}
                            setup={setup}
                        />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={'teamDetails.' + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone
                            label="Logo Team 1"
                            name={'competition.' + count.toString() + '.logo.0'}
                            value={competition.logo[0]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 2"
                            name={'competition.' + count.toString() + '.logo.1'}
                            value={competition.logo[1]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 3"
                            name={'competition.' + count.toString() + '.logo.2'}
                            value={competition.logo[2]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 4"
                            name={'competition.' + count.toString() + '.logo.3'}
                            value={competition.logo[3]}
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
                                    name={'competition.' + count.toString() + '.num_players'}
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
                                            <FormControlLabel
                                                value="8"
                                                control={<Radio />}
                                                label="8"
                                                key={'lanes_' + count.toString() + '_8'}
                                            />
                                        </RadioGroup>
                                    )}
                                    name={'competition.' + count.toString() + '.num_lanes'}
                                    control={control}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name={'competition.' + count.toString() + '.set_points'}
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
                            {...register('competition.' + count.toString() + '.cck2_file')}
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
    setup: any
    competition: ConfigValues['team4'][]
}): JSX.Element {
    const t: JSX.Element[] = []
    for (let i = 0; props.competition && i < props.competition.length; ++i) {
        t.push(
            <TeamSettings
                key={'team_settings_' + i.toString()}
                register={props.register}
                control={props.control}
                setup={props.setup}
                competition={props.competition[i]}
                count={i}
                disableDelete={props.competition.length === 1}
                disableUp={i === 0}
                disableDown={i === props.competition.length - 1}
            />
        )
    }
    return <>{t}</>
}

function TabTeam4() : JSX.Element {
    const { control, register, watch, setValue, getValues } = useForm<Team4Config[]>()
    const team = [DefaultTeam4Config, DefaultTeam4Config, DefaultTeam4Config]
    let setup : SetupConfig = {
        output_name: [''],
        output_file: [''],
        type: ['type'],
        lanes: [false],
        adv: [false],
        cck2_output_path: 'bbb',
        active_output: 'ccc'
    }
    let data = watch()
    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={2} direction="row" justifyContent="space-between">
                <Typography component="div" variant="h3">
                    Teams Konfiguration
                </Typography>
                <Button
                    onClick={() => {
                        // window.cck2live.saveLeagueTeam(watchedValues.team)
                    }}
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
                    competition={team}
                    setup={setup}
                />
            </Stack>
        </Stack>
    )
}
export default TabTeam4
