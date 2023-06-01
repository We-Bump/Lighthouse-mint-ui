import React, { useState } from 'react'

//props: {startdate: string, enddate: string}
export const Timer = (props : any) => {
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)


    const enddate = new Date(props.date)

    const start = () => {
        const now = new Date().getTime()
        const distance = enddate.getTime() - now

        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setDays(days)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
    }

    React.useEffect(() => {
        start()
    }, [])

    setInterval(start, 1000)

    return (
        <>
            {days !== 0 && days > 0 && days + "d "}
            {hours !== 0 && hours > 0 && hours + "h "}
            {minutes > 0 && minutes + "m "}
            {seconds >= 0 && seconds + "s"}
        </>
    )
}