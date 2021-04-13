import React, {useState} from  'react'
import {Alert} from 'reactstrap'

export function UtilityContainer({ component: Component, ...rest })
{

const [alertOpen, setAlertOpen] = useState(false)
const [alertOptions, setAlertOptions] = useState({color: "", text: ""})



const toggle = () => setAlertOpen(!alertOpen)

const alert = (color, text) =>
{
    var tempAlertOptions = {...alertOptions};
    tempAlertOptions.color = color;
    tempAlertOptions.text = text;
    setAlertOptions(tempAlertOptions)
    toggle()

    setTimeout(() => {
        tempAlertOptions.color = "";
        tempAlertOptions.text = "";
        setAlertOptions(tempAlertOptions)
        toggle()
    },1000)
}


return(
<div>
    <Component />
    <Alert color={alert.color} isOpen={alertOpen} toggle={toggle} >
        {alert.text}
    </Alert>
</div>
)


}


