
import { useState } from 'react';

import { Controller } from 'react-hook-form';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';

import { ConfigValues } from '../cck2_live_interface/ConfigValues';
import NavigationButtons from './NavigationButtons';
import TimeSelect from './TimeSelect';
import LogoDropzone from './LogoDropzone';

import { variant } from './App'
import TabPanel from './TabPanel';

function TeamSettings({ register, control, team, setup, count, disableDelete, disableUp, disableDown }: {
    register: any, control: any, team: ConfigValues["team"],
    setup: ConfigValues["setup"], count: number, disableDelete: boolean, disableUp: boolean, disableDown: boolean
}) {


    return (
        <div>
            <Accordion>
                <AccordionSummary key={"teamSummary." + count.toString()} expandIcon={<ExpandMoreIcon />}>
                    <Stack spacing={2} direction="row" alignItems="center" onClick={(event: any) => event.stopPropagation()}>
                        <TextField key="team_name" label="Teamname" variant={variant} defaultValue={team.name[count]} {...register("team.name." + count.toString())} />
                        <TimeSelect control={control} name={"team.time_values." + count.toString()} setup={setup} />
                        <NavigationButtons callback_id={"team." + count.toString()}
                            disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={"teamDetails." + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone label="Logo Heim" name={"team.logo_home." + count.toString()} value={team.logo_home[count]} control={control} />
                        <LogoDropzone label="Logo Gast" name={"team.logo_guest." + count.toString()} value={team.logo_guest[count]} control={control} />
                        <Stack spacing={4} direction="row">
                            <FormControl>
                                <FormLabel id="num_player_label">Anzahl Spieler</FormLabel>
                                <Controller
                                    defaultValue="4"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel value="4" control={<Radio />} label="4" key={"player_" + count.toString() + "_4"} />
                                            <FormControlLabel value="6" control={<Radio />} label="6" key={"player_" + count.toString() + "_6"} />
                                        </RadioGroup>)}
                                    name={"team.num_players." + count.toString()}
                                    control={control}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel id="num_lanes_label">Anzahl Bahnen</FormLabel>
                                <Controller
                                    defaultValue="6"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel value="4" control={<Radio />} label="4" key={"lanes_" + count.toString() + "_4"} />
                                            <FormControlLabel value="6" control={<Radio />} label="6" key={"lanes_" + count.toString() + "_6"} />
                                        </RadioGroup>)}
                                    name={"team.num_lanes." + count.toString()}
                                    control={control}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name={"team.set_points." + count.toString()}
                                defaultValue={true}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel label="Satzpunkte"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        } />
                                )} />
                        </Stack>
                        <TextField id="cck2_data_file" label="CCK2 Daten Team" variant={variant} defaultValue="mannschaft.json" {...register("team.cck2_file." + count.toString())} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}



function CreateTeamSettings(props: { register: any, control: any, team: ConfigValues["team"], setup: ConfigValues["setup"] }) {
    let t = [];
    for (let i = 0; props.team && i < props.team.name.length; ++i) {
        t.push(<TeamSettings key={"team_settings_" + i.toString()} {...props} count={i} disableDelete={props.team.name.length === 1} disableUp={i === 0} disableDown={i === props.team.name.length - 1} />);
    }
    return (<>{t}</>)
}




function AdvSettings({ register, control, adv, setup, count, disableDelete, disableUp, disableDown }:
    {
        register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"], count: number,
        disableDelete: boolean, disableUp: boolean, disableDown: boolean
    }) {

    return (
        <>
            <Accordion>
                <AccordionSummary key={"advSummary." + count.toString()}
                    expandIcon={<ExpandMoreIcon />}>
                    <Stack spacing={4} direction="row" alignItems="center" onClick={(event) => event.stopPropagation()}>
                        <TextField id="standard-basic" label="Werbung" variant={variant} defaultValue={adv.logo[count]} {...register("adv.name." + count.toString())} />
                        <TimeSelect control={control} name={"adv.time_values." + count.toString()} setup={setup} />
                        <NavigationButtons callback_id={"adv." + count.toString()} disableDelete={disableDelete} disableUp={disableUp} disableDown={disableDown} />
                    </Stack>
                </AccordionSummary>
                <AccordionDetails key={"advDetail." + count.toString()}>
                    <Stack spacing={2} direction="column">
                        <LogoDropzone label="Logo Werbung" name={"adv.logo." + count.toString()} value={adv.logo[count]} control={control} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    );
}


function CreateAdvSettings(props: { register: any, control: any, adv: ConfigValues["adv"], setup: ConfigValues["setup"] }) {
    let a = [];
    for (let i = 0; props.adv && i < props.adv.name.length; ++i) {
        a.push(<AdvSettings key={"adv_settings_" + i.toString()} {...props} count={i} disableDelete={props.adv.name.length === 1} disableUp={i === 0} disableDown={i === props.adv.name.length - 1} />);
    }
    return (<>{a}</>)
}


function TabLeague({register, control, watchedValues}: 
    {register: any, control: any, watchedValues: ConfigValues}) {
    const [leagueValuePanel, setLeagueValuePanel] = useState(0);
    const handleChangeLeaguePanel = (event: React.SyntheticEvent, newValue: number) => {
        setLeagueValuePanel(newValue);
    }

    return (<Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}>
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={leagueValuePanel}
            onChange={handleChangeLeaguePanel}
            aria-label="Vertical tabs"
            sx={{ borderRight: 1, borderColor: 'divider' }}
        >
            <Tab label="Teams" id="tab-leagure-team" sx={{ alignItems: 'start' }} />
            <Tab label="Werbung" id="tab-league-adv" sx={{ alignItems: 'start' }} />
        </Tabs>
        <TabPanel value={leagueValuePanel} index={0}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Team Konfiguration</Typography>
                    <Button onClick={() => { (window as any).electronAPI.saveLeagueTeam(watchedValues.team); }} variant="contained">Speichern</Button>
                </Stack>
                <Stack spacing={2} direction="column" alignItems="left">
                    <CreateTeamSettings key="create_team_settings" register={register} control={control} team={watchedValues.team} setup={watchedValues.setup} />
                </Stack>
            </Stack>
        </TabPanel>
        <TabPanel value={leagueValuePanel} index={1}>
            <Stack spacing={4} direction="column">
                <Stack spacing={2} direction="row" justifyContent="space-between">
                    <Typography component='div' variant="h3">Werbung Konfiguration</Typography>
                    <Button onClick={() => { (window as any).electronAPI.saveLeagueAdv(watchedValues.adv); }} variant="contained">Speichern</Button>
                </Stack>
                <Stack key="adv_details_stack" spacing={2} direction="column" alignItems="left">
                    <CreateAdvSettings key="create_adv_settings" register={register} control={control} adv={watchedValues.adv} setup={watchedValues.setup} />
                </Stack>
            </Stack>
        </TabPanel>
    </Box>);
}

export default TabLeague;
