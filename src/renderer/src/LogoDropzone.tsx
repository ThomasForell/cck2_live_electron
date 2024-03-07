import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Dropzone from 'react-dropzone'

import { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

function LogoDropzone({
    label,
    name,
    value,
    control,
    dense = false
}: {
    label: string
    name: string
    value: string
    control: Control
    dense?: boolean
}): JSX.Element {
    const group = name.split('.')[0]
    const source = 'http://localhost/logos/' + group + '/' + value

    let height = 120
    if (dense) {
        height = 80
    }

    return (
        <Stack spacing={2} direction="row" alignItems="center">
            <Box sx={{ height: { height }, width: 120 }}>
                <div style={{ textAlign: 'start' }}>{label}</div>
            </Box>
            <Box sx={{ height: { height }, width: 350 }}>
                <div style={{ textAlign: 'center' }}>
                    <img
                        id={name}
                        src={source}
                        alt="Warte auf Logo"
                        onLoad={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const w = (event.target as HTMLImageElement).width
                            const h = (event.target as HTMLImageElement).height
                            const ratioW = w / 350
                            const ratioH = h / height
                            // set only one dimension - element keeps ratio!
                            if (ratioW < ratioH) {
                                ;(event.target as HTMLImageElement).width /= ratioH
                            } else {
                                ;(event.target as HTMLImageElement).width /= ratioW
                            }
                        }}
                    />
                </div>
            </Box>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange } }) => (
                    <Dropzone
                        noClick
                        noKeyboard
                        accept={{ 'image/*': ['.jpeg', '.png'] }}
                        multiple={false}
                        onDrop={(acceptedFiles: File[]) => {
                            ;(window as any).cck2live
                                .logo(group, acceptedFiles[0].name, (acceptedFiles[0] as any).path)
                                .then((filename: string | null) => {
                                    if (filename != null) {
                                        onChange(filename)
                                    }
                                })
                        }}
                    >
                        {({
                            getRootProps,
                            getInputProps,
                            open,
                            isDragReject,
                            isDragActive,
                            isDragAccept
                        }) => (
                            <Box
                                sx={{
                                    height: { height },
                                    width: 250,
                                    borderRadius: 2,
                                    border: '2px dashed',
                                    padding: '8px',
                                    ...(isDragReject && { background: '#460100' }),
                                    ...(isDragAccept && { background: '#092005' })
                                }}
                            >
                                <div {...getRootProps()} style={{ textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    <Stack spacing={2} direction={dense ? 'row' : 'column'}>
                                        <Button onClick={open} variant="contained">
                                            Logo Auswählen
                                        </Button>
                                        {!isDragActive && <p>Logo in diesen Bereich ziehen</p>}
                                        {isDragAccept && <p>Logo auswählen</p>}
                                        {isDragReject && <p>Logo muss eine Bilddatei sein</p>}
                                    </Stack>
                                </div>
                            </Box>
                        )}
                    </Dropzone>
                )}
            />
        </Stack>
    )
}

export default LogoDropzone
