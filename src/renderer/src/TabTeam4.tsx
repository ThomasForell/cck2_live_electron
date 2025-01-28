import { JSX, useEffect } from 'react'

import { Controller } from 'react-hook-form'
import { useForm, useFormState } from 'react-hook-form'

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

import NavigationButtons from './NavigationButtons'
import TimeSelect from './TimeSelect'
import LogoDropzone from './LogoDropzone'
import { Team4Config, SetupConfig } from './cck2_live_interface/LiveConfig'

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
    team: Team4Config
    setup: SetupConfig
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
                            defaultValue={team.name}
                            {...register('team.' + count.toString() + '.name')}
                        />
                        <TimeSelect
                            control={control}
                            name={'team.' + count.toString() + '.time_values'}
                            setup={setup}
                        />
                        <NavigationButtons 
                            callback_id={'ttt'}
                            disableDelete={disableDelete}
                            disableDown={disableDown}
                            disableUp={disableUp}
                        />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={'teamDetails.' + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone
                            label="Logo Team 1"
                            name={'team.' + count.toString() + '.logo.0'}
                            value={team.logo[0]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 2"
                            name={'team.' + count.toString() + '.logo.1'}
                            value={team.logo[1]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 3"
                            name={'team.' + count.toString() + '.logo.2'}
                            value={team.logo[2]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Team 4"
                            name={'team.' + count.toString() + '.logo.3'}
                            value={team.logo[3]}
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
                                    name={'team.' + count.toString() + '.num_players'}
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
                                    name={'team.' + count.toString() + '.num_lanes'}
                                    control={control}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name={'team.' + count.toString() + '.set_points'}
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
                            {...register('team.' + count.toString() + '.cck2_file')}
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
    team: Team4Config[]
}): JSX.Element {
    const t: JSX.Element[] = []
    for (let i = 0; props.team && i < props.team.length; ++i) {
        t.push(
            <TeamSettings
                key={'team_settings_' + i.toString()}
                register={props.register}
                control={props.control}
                setup={props.setup}
                team={props.team[i]}
                count={i}
                disableDelete={props.team.length === 1}
                disableUp={i === 0}
                disableDown={i === props.team.length - 1}
            />
        )
    }
    return <>{t}</>
}

function TabTeam4(): JSX.Element {
    const { control, reset, register, watch } = useForm<{
        team: Team4Config[]
        setup: SetupConfig
    }>()
    const { isDirty } = useFormState({ control })
    const data = watch()

    useEffect(() => {
        window.cck2live
            .loadTeam4Setup()
            .then((data: null | { team: Team4Config[]; setup: SetupConfig }) => {
                if (data != null) {
                    reset(data)
                }
            })
        return () => {}
    }, [reset])

    return (
        <Stack spacing={4} direction="column">
            <Stack spacing={2} direction="row" justifyContent="space-between">
                <Typography component="div" variant="h3">
                    4 Teams Konfiguration
                </Typography>
                <Button
                    onClick={() => {
                        reset(data)
                        window.cck2live.saveTeam4Setup(data.team)
                    }}
                    disabled={!isDirty}
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
                    team={data.team}
                    setup={data.setup}
                />
            </Stack>
        </Stack>
    )
}
export default TabTeam4
