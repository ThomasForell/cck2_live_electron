import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dropzone from "react-dropzone";

import { Control } from "react-hook-form";
import { Controller } from "react-hook-form";


function LogoDropzone({ label, name, value, control }: { label: string; name: string; value: string; control: Control; }) {
    let source = "";
    if (name.startsWith("adv")) {
        source = "http://localhost/logos/adv/" + value;
    }
    else {
        source = "http://localhost/logos/team/" + value;
    }
    return (
        <Stack spacing={2} direction="row" alignItems="center">
            <Box sx={{ height: 120, width: 120 }}>
                <div style={{ textAlign: "start" }}>
                    {label}
                </div>
            </Box>
            <Box sx={{ height: 120, width: 250 }}>
                <div style={{ textAlign: "center" }}>
                    <img id={name} src={source} alt=" Warte auf Logo" height="120" width="auto" />
                </div>
            </Box>
            <Controller control={control} name={name}
                render={({ field: { onChange, value } }) => <Dropzone
                    noClick noKeyboard
                    accept={{ 'image/*': ['.jpeg', '.png'] }}
                    multiple={false}
                    onDrop={(acceptedFiles: File[]) => {
                        if (name.startsWith("team")) {
                            (window as any).electronAPI.logo("team", acceptedFiles[0].name, (acceptedFiles[0] as any).path).then(
                                (filename: string | null) => { if (filename != null) { onChange(filename); } });
                        }
                        else {
                            (window as any).electronAPI.logo("adv", acceptedFiles[0].name, (acceptedFiles[0] as any).path).then(
                                (filename: string | null) => { if (filename != null) { onChange(filename); } });
                        }
                    }}>
                    {({ getRootProps, getInputProps, open, isDragReject, isDragActive, isDragAccept }) => (
                        <Box sx={{
                            height: 120, width: 250, borderRadius: 2, border: "2px dashed",
                            ...(isDragReject && { background: "#460100" }), ...(isDragAccept && { background: "#092005" })
                        }}>
                            <div {...getRootProps()} style={{ textAlign: "center" }}>
                                <input {...getInputProps()} />
                                {!isDragActive && (<p>Logo in diesen Bereich ziehen</p>)}
                                {isDragAccept && (<p>Logo auswählen</p>)}
                                {isDragReject && (<p>Logo muss eine Bilddatei sein</p>)}
                                <Button onClick={open} variant="contained">Logo Auswählen</Button>
                            </div>
                        </Box>
                    )}
                </Dropzone>} />
        </Stack>
    );
}

export default LogoDropzone;