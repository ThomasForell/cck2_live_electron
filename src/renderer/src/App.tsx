import './assets/App.css'

import React, { JSX, useEffect, useState } from 'react'

import WiFi from '@mui/icons-material/Wifi'
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { ConfigValues } from './cck2_live_interface/ConfigValues'
import TabLeague from './TabLeague'
import TabSingle from './TabSingle'
import TabSprint from './TabSprint'
import TabTeam from './TabTeam'
import TabTeam4 from './TabTeam4'
import TabAdv from './TabAdv'
import TabSetup from './TabSetup'
import TabInfo from './TabInfo'

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

export const variant = 'standard'

function App(): JSX.Element {

    const [mainValuePanel, setMainValuePanel] = useState(0)
    const handleChangeMainMenu = (_, newValue: number): void => {
        setMainValuePanel(newValue)
    }

    const [activeOutput, setActiveOutput] = useState('liga')

    // this triggers the load function in main process
    useEffect(() => {
        window.cck2live
            .load()
            .then(
                (config: ConfigValues) => {
                    setActiveOutput(config.setup.active_output)
                    console.log('load return')
                }
            )
        return () => {}
    }, [])

    return (
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
                            activeOutput === 'team4' ? (
                                <WiFi />
                            ) : (
                                <SignalWifiStatusbarNullIcon />
                            )
                        }
                        iconPosition="start"
                        label="4 Teams"
                        id="main-panel-team-4"
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
                    <Tab label="Werbung" id="main-panel-adv" />
                    <Tab label="Setup" id="main-panel-2" />
                    <Tab label="Info" id="main-panel-3" />
                </Tabs>
            </Box>
            <TabPanel value={mainValuePanel} index={0}>
                <TabLeague />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={1}>
                <TabTeam4 />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={2}>
                <TabSingle />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={3}>
                <TabSprint />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={4}>
                <TabTeam />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={5}>
                <TabAdv />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={6}>
                <TabSetup 
                    setActiveOutput={setActiveOutput} 
                />
            </TabPanel>
            <TabPanel value={mainValuePanel} index={7}>
                <TabInfo />
            </TabPanel>
        </ThemeProvider>
    )
}

export default App
