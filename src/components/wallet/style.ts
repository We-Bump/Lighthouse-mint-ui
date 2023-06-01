import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"

export const Wallet = styled.div`
    background-color:${color.primary};
    padding:0px 16px;
    height:43px;
    border-radius:8px;
    font-size:14px;
    display:flex;
    align-items:center;
    cursor:pointer;
    &:hover{
        background-color:${Hex2Rgba(color.primary, .8)};
    }
    &:active{
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const WBalance = styled.div`
    padding:5px 16px;
    background-color:${color.secondaryLight};
    border-radius:8px;
    margin-right:16px;
    font-size:12px;
`

export const WAddress = styled.div`
    color:${color.black};
    font-weight:500;
`


export const DropdownButtonContent = styled.div<{side?:string, mobileSide?:string}>`
    background: ${Hex2Rgba(color.primary,1)};
    color: ${color.black};
    position: absolute;
    ${props => props.side === "left" ? "left: 0" : "right: 0"};
    z-index: 1;
    border-radius: 8px;
    backdrop-filter: blur(20px);
    display:none;
    /*border-top-right-radius: 0px;*/
    box-shadow: 0 0 10px ${Hex2Rgba(color.black,1)};
    overflow:hidden;
    width: fit-content;
    margin-top: 10px;
    z-index: 2;
    @media (max-width: 768px) {
        ${props => props.mobileSide === "left" ? "left: 0" : "right: 0"};
    }
`

export const DropdownButton = styled.div<{dropdownOpen : boolean, text:string, customIcon? : any}>`
    position: relative;

    & > button > svg{
        transition:all .1s ease-in-out;
        ${props => props.text !== "" && "margin-left:5px;"}
        color:${Hex2Rgba(color.white,.6)};
    }

    & > button{
        position:relative;
        z-index:2;
    }

    ${props => props.dropdownOpen && `
        ${DropdownButtonContent} {
            display: block;
        }

        & > button{
            /*border-bottom-right-radius: 0px;
            border-bottom-left-radius: 0px;*/
            box-shadow: none !important;

            & > svg{
                ${!props.customIcon && `transform:rotate(180deg);`}
            }
        }

        
    `}
`

export const DropdownItem = styled.div<{active? : string}>`
    padding: 10px 20px;
    font-size: 14px;
    display: flex;
    min-width: 150px;
    cursor: pointer;
    display: flex;
    align-items: center;

    & > svg{
        margin-right: 10px;
    }

    border-radius: 0px;
    

    &:hover {
        background: ${Hex2Rgba(color.secondary, 0.1)};
    }
    &:active {
        background: ${Hex2Rgba(color.secondary, 0.2)};
    }

    ${props => props.active === "true" && `
        background: ${Hex2Rgba(color.white, 0.05)};
    `}


`