import { JSX } from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'

function NavigationButtons(
    props: {
        count: number
        disableDelete: boolean
        disableUp: boolean
        disableDown: boolean
        swapElement: (id: number, offset: number) => void
        deleteElement: (id: number) => void
        addElement: (id: number) => void
        }): JSX.Element {
    return (
        <ButtonGroup variant="outlined" size="small">
            <Button
                onClick={() => props.addElement(props.count)}
            >
                <AddIcon />
            </Button>
            <Button
                disabled={props.disableDelete}
                onClick={() => props.deleteElement(props.count)}
            >
                <DeleteForeverIcon />
            </Button>
            <Button
                disabled={props.disableUp}
                onClick={() => props.swapElement(props.count, -1)}
            >
                <ArrowCircleUpIcon />
            </Button>
            <Button
                disabled={props.disableDown}
                onClick={() => props.swapElement(props.count, 1)}
            >
                <ArrowCircleDownIcon />
            </Button>
        </ButtonGroup>
    )
}

export default NavigationButtons
