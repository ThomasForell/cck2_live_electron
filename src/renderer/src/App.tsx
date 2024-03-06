import './assets/App.css'

import React, { useEffect, useState, createContext } from 'react'

import WiFi from '@mui/icons-material/Wifi'
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { useForm, UseFormSetValue } from 'react-hook-form'

import { ConfigValues } from './cck2_live_interface/ConfigValues'
import TabLeague from './TabLeague'
import TabSingle from './TabSingle'
import TabSprint from './TabSprint'
import TabTeam from './TabTeam'
import TabSetup from './TabSetup'
import TabInfo from './TabInfo'
import { SetupConfig } from './cck2_live_interface/LiveConfig'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps): JSX.Element {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

interface CTF {
    watchedValues: any
    setStateUpdate: Function
    setValue: UseFormSetValue<ConfigValues>
}

export const variant = 'standard'
export const controlFktContext = createContext<CTF>(null as any)

function App(): JSX.Element {
    let currentVersion = ''

    function setCurrentVersion(version: string): void {
        currentVersion = version
    }

    const { control, register, watch, setValue, getValues } = useForm<ConfigValues>()
    const watchedValues = watch()
    let stateUpdate: any
    let setStateUpdate: Function
    ;[stateUpdate, setStateUpdate] = useState(watchedValues)

    useEffect(() => {
        setValue('setup', stateUpdate.setup)
        setValue('team', stateUpdate.team)
        setValue('adv', stateUpdate.adv)
        setValue('single', stateUpdate.single)
        setValue('sprint', stateUpdate.sprint)
        setValue('teams', stateUpdate.teams)
    }, [stateUpdate])

    const [mainValuePanel, setMainValuePanel] = useState(0)
    const handleChangeMainMenu = (_, newValue: number): void => {
        setMainValuePanel(newValue)
    }

    const [activeOutput, setActiveOutput] = useState('liga')

    const values = { ...watchedValues }
    const dataStuff: CTF = {
        watchedValues: watchedValues,
        setStateUpdate: setStateUpdate,
        setValue: setValue
    }

    useEffect(() => {
        ;(window as any).electronAPI
            .load()
            .then(
                ({ config: data, version: version }: { config: ConfigValues; version: string }) => {
                    setStateUpdate(data)
                    setCurrentVersion(version)
                    setActiveOutput(data.setup.active_output)
                    console.log('load return')
                }
            )
        return () => {}
    }, [])

    return (
        <controlFktContext.Provider value={dataStuff}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={mainValuePanel}
                        onChange={handleChangeMainMenu}
                        aria-label="basic tabs example"
                    >
                        <Tab
                            icon={
                                activeOutput === 'league' ? (
                                    <WiFi />
                                ) : (
                                    <SignalWifiStatusbarNullIcon />
                                )
                            }
                            iconPosition="start"
                            label="Liga"
                            id="main-panel-liga"
                        />
                        <Tab
                            icon={
                                activeOutput === 'single' ? (
                                    <WiFi />
                                ) : (
                                    <SignalWifiStatusbarNullIcon />
                                )
                            }
                            iconPosition="start"
                            label="Einzel"
                            id="main-panel-single"
                        />
                        <Tab
                            icon={
                                activeOutput === 'sprint' ? (
                                    <WiFi />
                                ) : (
                                    <SignalWifiStatusbarNullIcon />
                                )
                            }
                            iconPosition="start"
                            label="Sprint"
                            id="main-panel-spirnt"
                        />
                        <Tab
                            icon={
                                activeOutput === 'team' ? <WiFi /> : <SignalWifiStatusbarNullIcon />
                            }
                            iconPosition="start"
                            label="Team"
                            id="main-panel-team"
                        />
                        <Tab label="Setup" id="main-panel-2" />
                        <Tab label="Info" id="main-panel-3" />
                    </Tabs>
                </Box>
                <TabPanel value={mainValuePanel} index={0}>
                    <TabLeague
                        register={register}
                        control={control}
                        watchedValues={watchedValues as ConfigValues}
                    />
                </TabPanel>
                <TabPanel value={mainValuePanel} index={1}>
                    <TabSingle />
                </TabPanel>
                <TabPanel value={mainValuePanel} index={2}>
                    <TabSprint />
                </TabPanel>
                <TabPanel value={mainValuePanel} index={3}>
                    <TabTeam />
                </TabPanel>
                <TabPanel value={mainValuePanel} index={4}>
                    <TabSetup
                        register={register}
                        control={control}
                        settings={values.setup as SetupConfig}
                        watchedValues={watchedValues as ConfigValues}
                        setActiveOutput={setActiveOutput}
                        setValue={setValue}
                        getValues={getValues}
                    />
                </TabPanel>
                <TabPanel value={mainValuePanel} index={5}>
                    <TabInfo version={currentVersion} />
                </TabPanel>
            </ThemeProvider>
        </controlFktContext.Provider>
    )
}

export default App
