import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function TabInfo({ version }: { version: string }): JSX.Element {
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
            <Stack spacing={2} direction="column">
                <Typography component="div" variant="h3">
                    Info - CCK2 Live Electron {version}
                </Typography>
                <Typography component="div" variant="h5">
                    Autor
                </Typography>
                <Typography component="div">
                    <ul>
                        <li>Thomas Forell</li>
                    </ul>
                </Typography>
                <Typography component="div" variant="h5">
                    Lizenz
                </Typography>
                <Typography component="div">
                    <ul>
                        <li>
                            CCK2 Live Electron ist freie Software unter der GNU General Public
                            License, Version 3 -{' '}
                            <a
                                href="https://www.gnu.org/licenses/gpl-3.0-standalone.html"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Lizenztext
                            </a>
                        </li>
                    </ul>
                </Typography>
                <Typography component="div" variant="h5">
                    Third Party Pakete
                </Typography>
                <Typography component="div">
                    <ul>
                        <li>
                            <a href="https://www.electronjs.org" target="_blank" rel="noreferrer">
                                Elektron
                            </a>
                        </li>
                        <li>
                            <a href="https://react.dev" target="_blank" rel="noreferrer">
                                React
                            </a>
                        </li>
                        <li>
                            <a href="https://mui.com" target="_blank" rel="noreferrer">
                                MUI
                            </a>
                        </li>
                        <li>
                            Die vollständige Liste der Pakete mit Lizenzhinweis und Source-Code auf{' '}
                            <a
                                href="https://github.com/ThomasForell/cck2_live_electron"
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>{' '}
                        </li>
                    </ul>
                </Typography>
                <Typography component="div" variant="h5">
                    Download
                </Typography>
                <Typography component="div">
                    <ul>
                        <li>
                            Neue Versionen werden auf{' '}
                            <a
                                href="https://skv-lorsch.de/cck2-live-electron"
                                target="_blank"
                                rel="noreferrer"
                            >
                                skv-lorsch.de
                            </a>{' '}
                            veröffentlicht
                        </li>
                    </ul>
                </Typography>
            </Stack>
        </Box>
    )
}

export default TabInfo
