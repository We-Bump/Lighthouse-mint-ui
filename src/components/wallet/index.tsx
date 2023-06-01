import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect } from "react"
import * as C from "./style"
import { shortenPublicKey } from "utils/helpers"

const DropdownButton = (props: any) => {

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const dropdownRef = React.useRef<any>(null);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleClickOutside = (event: any) => {

        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    }

    const openDropdown = () => {
        if (!dropdownOpen)
            setDropdownOpen(true)
        else
            setDropdownOpen(false)
    }

    return (
        <C.DropdownButton text={props.text} customIcon={props.icon} ref={dropdownRef} onClick={openDropdown} dropdownOpen={dropdownOpen}>
            <C.Wallet>
                    <C.WBalance>{props.balance}</C.WBalance>
                    <C.WAddress>{shortenPublicKey(props.address)}</C.WAddress>
            </C.Wallet>
        
            <C.DropdownButtonContent side={props.side} mobileSide={props.mobileSide} onClick={() => setDropdownOpen(false)}>
                {props.children}
            </C.DropdownButtonContent>
        </C.DropdownButton>
    )
}

export const DropdownItem = (props: any) => {

    let { onClick, ...rest } = props

    return (
        <C.DropdownItem onClick={props.onClick ?? (() => {})} {...rest}>
            {props.children}
        </C.DropdownItem>
    )
}

export default DropdownButton