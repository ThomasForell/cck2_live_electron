import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Controller } from 'react-hook-form';
import React, { useContext } from 'react';

import { ConfigValues } from '../cck2_live_interface/ConfigValues';
import NavigationButtons from './NavigationButtons';
import DirectorySelectorElectron from './DirectorySelectorElectron';

import { variant } from './App';
import { controlFktContext } from './App';

function SetupSettings({ register, control, count, disableDelete, disableUp, disableDown }:
    { register: any, control: any, count: number, disableDelete: boolean, disableUp: boolean, disableDown: boolean }) {
    let fktContext = useContext(controlFktContext);
    return (
        <Stack spacing={4} direction="row" alignItems="center">
            <TextField label="Ausgabe Name" variant={variant} defaultValue="TV oder Stream"
                {...register("setup.output_name." + count.toString())}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    const values = { ...fktContext.watchedValues };
                    if (event.target) {
                        values.setup.output_name[count] = ((event.target) as HTMLInputElement).value;
                        fktContext.setStateUpdate(values);
                    }
                }} />
            <FormControl sx={{ m: 1, minWidth: 90 }}>
                <InputLabel>Anzeigetyp</InputLabel>
                <Controller control={control} name={"setup.type." + count.toString()} defaultValue={"stream"} render={({ field }) => (
                    <Select key={"setup.type." + count.toString()} {...field} label={"Anzeigetyp"} variant={variant}>
                        <MenuItem key={"setup.type.stream." + count.toString()} value="stream">Stream</MenuItem>
                        <MenuItem key={"setup.type.display." + count.toString()} value="display">Display</MenuItem>
                    </Select>)} />
            </FormControl>
            <Controller
                control={control}
                name={"setup.lanes." + count.toString()}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel label="Bahnanzeige"
                        control={
                            <Checkbox checked={value} onChange={onChange} key={"setup.laneoutput." + count.toString()} />
                        } />
                )} />
            <Controller
                control={control}
                name={"setup.adv." + count.toString()}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel label="Werbung"
                        control={
                            <Checkbox checked={value} onChange={onChange} key={"setup.adv." + count.toString()} />
                        } />
                )} />

            <NavigationButtons callback_id={"setup." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
        </Stack>
    )
}


function TabSetup({ register, control, settings, watchedValues, setActiveOutput, setValue, getValues }:
    { register: any, control: any, settings: ConfigValues["setup"], watchedValues: ConfigValues, setActiveOutput: Function, setValue: Function, getValues: Function }) {
    let s = [
        <FormControl key="tabssetup_fc_active_output">
            <FormLabel>Aktive Ausage</FormLabel>
            <Controller
                defaultValue={settings.active_output}
                render={({ field }) => (
                    <RadioGroup {...field} key="tabsetup_rg">
                        <FormControlLabel value="league" control={<Radio />} label="Liga" key="tabsetup_rg_active_league" />
                        <FormControlLabel value="single" control={<Radio />} label="Einzel" key="tabsetup_rg_active_single" />
                        <FormControlLabel value="sprint" control={<Radio />} label="Sprint" key="tabsetup_rg_active_sprint" />
                        <FormControlLabel value="team" control={<Radio />} label="Team" key="tabsetup_rg_active_team" />
                    </RadioGroup>)}
                name={"setup.active_output"}
                control={control}
            />
        </FormControl>
    ];

    for (let i = 0; settings && i < settings.output_name.length; ++i) {
        s.push(<SetupSettings key={"CreateSetupSettings" + i.toString()} register={register} control={control} count={i}
            disableDelete={settings.output_name.length === 1} disableUp={i === 0} disableDown={i === settings.output_name.length - 1} />);
    }
    s.push(
        <DirectorySelectorElectron key="SetupSettings_dse" register={register} registerName="setup.cck2_output_path" setValue={setValue} getValues={getValues}
            defaultValue="C:\\Users\\[Benutzername]\\Documents\\Live" label="CCK2 Ausgabeverzeichnis"/>
        );
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Setup</Typography>
                    <Button onClick={() => { (window as any).electronAPI.saveSetup(watchedValues.setup); setActiveOutput(watchedValues.setup.active_output) }} 
                        variant="contained">Speichern</Button>
                </Stack>
                <Stack spacing={2} direction="column" alignItems="left">
                    {s}
                </Stack>
            </Stack>
        </Box>
    );
};

export default TabSetup;
