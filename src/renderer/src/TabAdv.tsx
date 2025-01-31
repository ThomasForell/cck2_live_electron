import { JSX, useEffect } from 'react'

//import { Controller } from 'react-hook-form'
import { useForm, useFormState } from 'react-hook-form'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import NavigationButtons from './NavigationButtons'
import TimeSelect from './TimeSelect'
import LogoDropzone from './LogoDropzone'

import { AdvConfig, DefaultAdvConfig, SetupConfig } from './cck2_live_interface/LiveConfig'

import { variant } from './App'

function AdvSettings({
    register,
    control,
    adv,
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
    adv: AdvConfig
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
        <>
            <Accordion>
                <AccordionSummary
                    key={'advSummary.' + count.toString()}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Stack
                        spacing={4}
                        direction="row"
                        alignItems="center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <TextField
                            id="standard-basic"
                            label="Werbung"
                            variant={variant}
                            defaultValue={adv.logo}
                            {...register('adv.' + count.toString() + '.name')}
                        />
                        <TimeSelect
                            control={control}
                            name={'adv.' + count.toString() + '.time_values'}
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
                <AccordionDetails key={'advDetail.' + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone
                            label="Logo Werbung"
                            name={'adv.'+ count.toString() +'.logo' }
                            value={adv.logo}
                            control={control}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

function CreateAdvSettings(props: {
    register: any
    control: any
    adv: AdvConfig[]
    setup: SetupConfig
    swapElement: (id: number, offset: number) => void
    deleteElement: (id: number) => void
    addElement: (id: number) => void
}): JSX.Element {
    const a: JSX.Element[] = []
    if (props.adv == null) {
        return (<></>)
    }
    props.adv.forEach( (ac: AdvConfig, i: number) => {
        a.push(
            <AdvSettings
                key={'adv_settings_' + i.toString()}
                register={props.register}
                control={props.control}
                setup={props.setup}
                adv={ac}
                count={i}
                disableDelete={props.adv.length === 1}
                disableUp={i === 0}
                disableDown={i === props.adv.length - 1}
                swapElement={props.swapElement}
                addElement={props.addElement}
                deleteElement={props.deleteElement}

            />
        )
    })
    return <>{a}</>
}

function TabAdv(): JSX.Element {
    const { control, reset, register, watch, setValue } = useForm<{
        adv: AdvConfig[]
        setup: SetupConfig
    }>()
    const { isDirty } = useFormState({ control })
    const data =  watch()
    useEffect(() => {
        window.cck2live
            .loadAdvSetup()
            .then((data: null | { adv: AdvConfig[]; setup: SetupConfig }) => {
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
                    Werbung Konfiguration
                </Typography>
                <Button
                    onClick={ () => {
                        reset(data)
                        window.cck2live.saveAdvSetup(data.adv)
                    }}
                    variant="contained"
                    disabled={!isDirty}
                >
                    Speichern
                </Button>
            </Stack>
            <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
                <CreateAdvSettings
                    key="create_adv_settings"
                    register={register}
                    control={control}
                    adv={data.adv}
                    setup={data.setup}
                    swapElement={(id: number, offset: number) => {
                        let a: AdvConfig[] = data.adv.slice();
                        [a[id], a[id + offset]] = [a[id + offset], a[id]]
                        setValue('adv', a, {shouldDirty: true})
                    }}
                    deleteElement={(id: number) => {
                        let a: AdvConfig[] = data.adv.slice()
                        a.splice(id, 1)
                        setValue('adv', a, {shouldDirty: true})
                    }}
                    addElement={(id: number) => {
                        let a: AdvConfig[] = data.adv.slice()
                        a.splice(id, 0, DefaultAdvConfig)
                        setValue('adv', a, {shouldDirty: true})
                    }}
                />
            </Stack>
        </Stack>
    )
}

export default TabAdv