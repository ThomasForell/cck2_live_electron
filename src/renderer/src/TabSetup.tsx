import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Controller, useForm, useFormState } from 'react-hook-form'
import { JSX, useEffect } from 'react'

import { ConfigValues } from './cck2_live_interface/ConfigValues'
import { AdvConfig, Team4Config } from './cck2_live_interface/LiveConfig'
import NavigationButtons from './NavigationButtons'
import DirectorySelectorElectron from './DirectorySelectorElectron'

import { variant } from './App'

function SetupSettings({
    register,
    control,
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
    count: number
    disableDelete: boolean
    disableUp: boolean
    disableDown: boolean
    swapElement: (id: number, offset: number) => void
    deleteElement: (id: number) => void
    addElement: (id: number) => void
}): JSX.Element {
    return (
        <Stack spacing={4} direction="row" alignItems="center">
            <TextField
                label="Ausgabe Name"
                variant={variant}
                defaultValue="TV oder Stream"
                {...register('setup.output_name.' + count.toString())}
            />
            <FormControl sx={{ m: 1, minWidth: 90 }}>
                <InputLabel>Anzeigetyp</InputLabel>
                <Controller
                    control={control}
                    name={'setup.type.' + count.toString()}
                    defaultValue={'stream'}
                    render={({ field }) => (
                        <Select
                            key={'setup.type.' + count.toString()}
                            {...field}
                            label={'Anzeigetyp'}
                            variant={variant}
                        >
                            <MenuItem key={'setup.type.stream.' + count.toString()} value="stream">
                                Stream
                            </MenuItem>
                            <MenuItem
                                key={'setup.type.display.' + count.toString()}
                                value="display"
                            >
                                Display
                            </MenuItem>
                        </Select>
                    )}
                />
            </FormControl>
            <Controller
                control={control}
                name={'setup.lanes.' + count.toString()}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                        label="Bahnanzeige"
                        control={
                            <Checkbox
                                checked={value}
                                onChange={onChange}
                                key={'setup.laneoutput.' + count.toString()}
                            />
                        }
                    />
                )}
            />
            <Controller
                control={control}
                name={'setup.adv.' + count.toString()}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                        label="Werbung"
                        control={
                            <Checkbox
                                checked={value}
                                onChange={onChange}
                                key={'setup.adv.' + count.toString()}
                            />
                        }
                    />
                )}
            />

            <NavigationButtons
                count={count}
                disableDelete={disableDelete}
                disableUp={disableUp}
                disableDown={disableDown}
                swapElement={swapElement}
                addElement={addElement}
                deleteElement={deleteElement}
            />
        </Stack>
    )
}

function TabSetup({setActiveOutput} : {setActiveOutput: (number) => void}): JSX.Element {
    const { control, reset, register, watch, setValue, getValues } = useForm<ConfigValues>()
    const { isDirty } = useFormState({ control })
    const data = watch()
    useEffect(() => {
        window.cck2live
            .loadSetup()
            .then((data: null | ConfigValues) => {
                if (data != null) {
                    reset(data)
                }
            })
        return () => {}
    }, [reset])

    const s: JSX.Element[] = [
        <FormControl key="tabssetup_fc_active_output">
            <FormLabel>Aktive Ausage</FormLabel>
            <Controller
                defaultValue="0"
                render={({ field }) => (
                    <RadioGroup {...field} key="tabsetup_rg">
                        <FormControlLabel
                            value="league"
                            control={<Radio />}
                            label="Liga"
                            key="tabsetup_rg_active_league"
                        />
                        <FormControlLabel
                            value="team4"
                            control={<Radio />}
                            label="4 Teams"
                            key="tabsetup_rg_active_team4"
                        />
                        <FormControlLabel
                            value="single"
                            control={<Radio />}
                            label="Einzel"
                            key="tabsetup_rg_active_single"
                        />
                        <FormControlLabel
                            value="sprint"
                            control={<Radio />}
                            label="Sprint"
                            key="tabsetup_rg_active_sprint"
                        />
                        <FormControlLabel
                            value="team"
                            control={<Radio />}
                            label="Team"
                            key="tabsetup_rg_active_team"
                        />
                    </RadioGroup>
                )}
                name={'setup.active_output'}
                control={control}
            />
        </FormControl>
    ]

    try {
        for (let i = 0; data && i < data.setup.output_name.length; ++i) {
            s.push(
                <SetupSettings
                    key={'CreateSetupSettings' + i.toString()}
                    register={register}
                    control={control}
                    count={i}
                    disableDelete={data.setup.output_name.length === 1}
                    disableUp={i === 0}
                    disableDown={i === data.setup.output_name.length - 1}
                    swapElement={(id: number, offset: number) => {
                        let a: ConfigValues = {...data}
                        a.adv.forEach((adv: AdvConfig) => {
                            [adv.time_values[id + offset], adv.time_values[id]] = [adv.time_values[id], adv.time_values[id + offset]]
                        }) 
                        a.team.forEach((team: Team4Config) => {
                            [team.time_values[id + offset], team.time_values[id]] = [team.time_values[id], team.time_values[id + offset]]
                        })
                        a.team4.forEach((team: Team4Config) => {
                            [team.time_values[id + offset], team.time_values[id]] = [team.time_values[id], team.time_values[id + offset]]
                        })
                        const tmpOutName: string = a.setup.output_name[id + offset]
                        a.setup.output_name[id + offset] = a.setup.output_name[id]
                        a.setup.output_name[id] = tmpOutName
                        const tmpType: string = a.setup.type[id + offset]
                        a.setup.type[id + offset] = a.setup.type[id]
                        a.setup.type[id] = tmpType
                        const tmpLanes: boolean = a.setup.lanes[id + offset]
                        a.setup.lanes[id + offset] = a.setup.lanes[id]
                        a.setup.lanes[id] = tmpLanes
                        const tmpAdv = a.setup.adv[id + offset]
                        a.setup.adv[id + offset] = a.setup.adv[id]
                        a.setup.adv[id] = tmpAdv
                        setValue('adv', a.adv, {shouldDirty: true})
                        setValue('team', a.team, {shouldDirty: true})
                        setValue('team4', a.team4, {shouldDirty: true})
                        setValue('setup', a.setup, {shouldDirty: true})
                    }}
                    deleteElement={(id: number) => {
                        let a: ConfigValues = {...data}
                        a.adv.forEach((adv: AdvConfig) => {adv.time_values.splice(id, 1)})
                        a.team.forEach((team: Team4Config) => {team.time_values.splice(id, 1)})
                        a.team4.forEach((team: Team4Config) => {team.time_values.splice(id, 1)})
                        a.setup.output_name.splice(id, 1)
                        a.setup.type.splice(id, 1)
                        a.setup.lanes.splice(id, 1)
                        a.setup.adv.splice(id, 1)
                        setValue('adv', a.adv, {shouldDirty: true})
                        setValue('team', a.team, {shouldDirty: true})
                        setValue('team4', a.team4, {shouldDirty: true})
                        setValue('setup', a.setup, {shouldDirty: true})
                    }}
                    addElement={(id: number) => {
                        let a: ConfigValues = {...data}
                        a.adv.forEach((adv: AdvConfig) => {adv.time_values.splice(id, 0, 0)})
                        a.team.forEach((team: Team4Config) => {team.time_values.splice(id, 0, 0)})
                        a.team4.forEach((team: Team4Config) => {team.time_values.splice(id, 0, 0)})
                        a.setup.output_name.splice(id, 0, 'Livestream')
                        a.setup.type.splice(id, 0, 'Stream')
                        a.setup.lanes.splice(id, 0, true)
                        a.setup.adv.splice(id, 0, false)
                        setValue('adv', a.adv, {shouldDirty: true})
                        setValue('team', a.team, {shouldDirty: true})
                        setValue('team4', a.team4, {shouldDirty: true})
                        setValue('setup', a.setup, {shouldDirty: true})
                    }}
                />
            )
        }
    } catch (err) {}
    s.push(
        <DirectorySelectorElectron
            key="SetupSettings_dse"
            register={register}
            registerName="setup.cck2_output_path"
            setValue={setValue}
            getValues={getValues}
            defaultValue="C:\\Users\\[Benutzername]\\Documents\\Live"
            label="CCK2 Ausgabeverzeichnis"
        />
    )
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component="div" variant="h3">
                        Setup
                    </Typography>
                    <Button
                        onClick={() => {
                            reset(data)
                            ;(window as any).cck2live.saveSetup(data.setup)
                            setActiveOutput(data.setup.active_output)
                        }}
                        variant="contained"
                        disabled={!isDirty}
                    >
                        Speichern
                    </Button>
                </Stack>
                <Stack spacing={2} direction="column" alignItems="left">
                    {s}
                </Stack>
            </Stack>
        </Box>
    )
}

export default TabSetup
