import { JSX } from 'react'

import { Controller, useForm, useFormState } from 'react-hook-form'

import { useEffect } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox'

import NavigationButtons from './NavigationButtons'
import TimeSelect from './TimeSelect'
import LogoDropzone from './LogoDropzone'

import { Team4Config, DefaultTeam4Config, SetupConfig } from './cck2_live_interface/LiveConfig' 

import { variant } from './App'

function TeamSettings({
    register,
    control,
    team,
    setup,
    count,
    disableDelete,
    disableUp,
    disableDown,
    swapElement,
    deleteElement,
    addElement
}: {
    register: any
    control: any
    team: Team4Config
    setup: SetupConfig
    count: number
    disableDelete: boolean
    disableUp: boolean
    disableDown: boolean
    swapElement: (id: number, offset: number) => void
    deleteElement: (id: number) => void
    addElement: (id: number) => void
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
                            defaultValue={team.name}
                            {...register('team.' + count.toString() + '.name')}
                        />
                        <TimeSelect
                            control={control}
                            name={'team' + count.toString() + '.time_values'}
                            setup={setup}
                        />
                        <NavigationButtons
                            disableDelete={disableDelete}
                            disableUp={disableUp}
                            disableDown={disableDown}
                            count={count}
                            swapElement={swapElement}
                            addElement={addElement}
                            deleteElement={deleteElement}
                        />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={'teamDetails.' + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone
                            label="Logo Heim"
                            name={'team.' + count.toString() + '.logo.0'}
                            value={team.logo[0]}
                            control={control}
                        />
                        <LogoDropzone
                            label="Logo Gast"
                            name={'team.' + count.toString() + '.logo.1'}
                            value={team.logo[1]}
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
                                    name={'team.'  + count.toString() + '.num_players'}
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
                                    name={'team.'  + count.toString() + '.num_lanes'}
                                    control={control}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name={'team.'  + count.toString() + '.set_points'}
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
                            {...register('team.'  + count.toString() + '.cck2_file')}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

function CreateTeamSettings(props: {
    register: any
    control: any
    team: Team4Config[]
    setup: SetupConfig
    swapElement: (id: number, offset: number) => void
    deleteElement: (id: number) => void
    addElement: (id: number) => void
}): JSX.Element {
    const te: JSX.Element[] = []
    if (props.team == null) {
        return (<></>)
    }    
    props.team.forEach((t: Team4Config, i: number) => {
        te.push(
            <TeamSettings
                key={'team_settings_' + i.toString()}
                register={props.register}
                control={props.control}
                team={t}
                count={i}
                setup={props.setup}
                disableDelete={props.team.length === 1}
                disableUp={i === 0}
                disableDown={i === props.team.length - 1}
                swapElement={props.swapElement}
                deleteElement={props.deleteElement}
                addElement={props.addElement}
            />
        )
    })
    return <>{te}</>
}

function TabLeague(): JSX.Element {
    const { control, reset, register, watch, setValue } = useForm<{
        team: Team4Config[]
        setup: SetupConfig
    }>()
    const { isDirty } = useFormState({ control })
    const data =  watch()
    useEffect(() => {
        window.cck2live
            .loadLeagueSetup()
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
                    Team Konfiguration
                </Typography>
                <Button
                    key="tab_league_save"
                    onClick={() => {
                        window.cck2live.saveLeagueTeam(data.team)
                        reset(data)
                    }}
                    variant="contained"
                    disabled={!isDirty}
                >
                    Speichern
                </Button>
            </Stack>
            <Stack spacing={2} direction="column" alignItems="left">
                <CreateTeamSettings
                    key="create_team_settings"
                    register={register}
                    control={control}
                    team={data.team}
                    setup={data.setup}
                    swapElement={(id: number, offset: number) => {
                        let a: Team4Config[] = data.team.slice();
                        [a[id], a[id + offset]] = [a[id + offset], a[id]]
                        setValue('team', a, {shouldDirty: true})
                    }}
                    deleteElement={(id: number) => {
                        let a: Team4Config[] = data.team.slice()
                        a.splice(id, 1)
                        setValue('team', a, {shouldDirty: true})
                    }}
                    addElement={(id: number) => {
                        let a: Team4Config[] = data.team.slice()
                        a.splice(id, 0, DefaultTeam4Config)
                        setValue('team', a, {shouldDirty: true})
                    }}
                />
            </Stack>
        </Stack>
    )
}

export default TabLeague
