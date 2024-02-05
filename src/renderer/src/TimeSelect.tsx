import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";

import { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { variant } from './App';
import { ConfigValues } from "../cck2_live_interface/ConfigValues";


function SingleTimeSelect({ control, name, label }: { control: Control, name: string, label: string }) {
    return (
        <FormControl key={name + "_fc"} sx={{ m: 1, minWidth: 120 }}>
            <InputLabel key={name + "_il"}>{label}</InputLabel>
            <Controller key={name + "_c"} control={control} name={name} defaultValue={0} render={({ field }) => (
                <Select key={name + "_s"} {...field} label={label} variant={variant}>
                    <MenuItem key={name + "_i_0"} value={0}>0s</MenuItem>
                    <MenuItem key={name + "_i_5"} value={5}>5s</MenuItem>
                    <MenuItem key={name + "_i_10"} value={10}>10s</MenuItem>
                    <MenuItem key={name + "_i_20"} value={20}>20s</MenuItem>
                    <MenuItem key={name + "_i_30"} value={30}>30s</MenuItem>
                    <MenuItem key={name + "_i_45"} value={45}>45s</MenuItem>
                    <MenuItem key={name + "_i_60"} value={60}>60s</MenuItem>
                </Select>)} />
        </FormControl>
    );
}

function TimeSelect({ control, name, setup }: { control: any, name: string, setup: ConfigValues["setup"] }) {
    let t = [];
    for (let i = 0; i < setup.output_name.length; ++i) {
        t.push(<SingleTimeSelect control={control} name={name + "." + i.toString()} label={"Zeit " + setup.output_name[i]} key={"TimeSelect." + name + "." + i.toString()} />);
    }
    return (<>{t}</>);
}

export default TimeSelect;