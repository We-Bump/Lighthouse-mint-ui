import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.68);
    z-index: 20;
    display:flex;
`

export const Overlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:1;
`

export const Dialog = styled.div`
    position: relative;
    width:350px;
    max-width:100%;
    max-height:100%;
    z-index:2;
    color: ${color.white};
    padding-top:0px;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background: ${Hex2Rgba(color.bg, .8)};
    overflow-y: auto;
    display:flex;
    flex-direction:column;

    @media (max-width: 576px) {
        width:100%;
    }
    overflow:auto;
    margin:auto;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.75);    
`

export const DialogHeader = styled.div`
    display: flex;
    align-items: center;
    cursor:default;
    user-select:none;
    padding:0 24px;
`

export const DialogTitle = styled.div`
    font-size:16px;
    display:flex;
    font-weight:500;
    padding-top:18px;
`

export const CloseButton = styled.div`
    margin-left: auto;
    cursor: pointer;
    font-size: 24px;
    padding:0px 20px;
    padding-top:24px;
    padding-bottom:10px;
    padding-right:0px;
`

export const DialogBody = styled.div`
    
`

export const Wallet = styled.div`
    display:flex;
    padding:16px 24px;
    align-items:center;
    font-size:16px;
    transition: background .1s ease-in-out;
    cursor:pointer;
    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
`

export const WalletIcon = styled.img`
    width: 32px;
    height: 32px;
`

export const WalletName = styled.div`
    margin-left: 16px;
`