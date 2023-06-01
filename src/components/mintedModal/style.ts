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
    width:500px;
    max-width:100%;
    max-height:100%;
    z-index:2;
    color: ${color.white};
    padding-top:0px;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background: linear-gradient(180deg, #15232D 0%, #0A141B 100%);
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
    z-index:2;
`

export const NftImage = styled.img`
    width:100%;
    max-width:272px;
    border-radius: 24px;
`

export const NftTitle = styled.div`
    font-size: 14px;
    margin-top:8px;
    color:${color.primary};
`

export const Nft = styled.div`
    text-align:center;
`

export const Nfts = styled.div`
    //horizontal scroll
    display:flex;
    overflow-x:auto;
    padding:0 24px;
    white-space: nowrap;

    & ${NftImage}{
        width:214px;
    }

    & ${Nft}:not(:last-child){
        margin-right:24px;
    }

    & ${NftTitle}{
        margin-bottom:8px;
    }

    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${Hex2Rgba(color.primary, .2)};
        border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${color.primary};
        border-radius: 8px;
    }
`

export const NftSingle = styled.div`
    display:flex;
    justify-content:center;
    width:100%;
`






export const Bottom = styled.div`
    width:100%;
    padding:0 24px;
    padding-bottom:24px;
    display:flex;
    flex-direction:column;
    align-items:center;
`

export const Title = styled.div`
    font-size: 24px;
    margin-top:24px;
    text-align:center;
    font-weight:500;
    color:${color.white};
`

export const Button = styled.button`
    width:80%;
    padding:8px 0;
    border-radius:8px;
    background-color:${color.primary};
    color:${color.black};
    font-size:18px;
    font-weight:500;
    cursor:pointer;
    transition:all .1s ease-in-out;
    &:hover{
        background-color:${Hex2Rgba(color.primary, .8)};
    }
    outline:none;
    border:none;
    margin-top:24px;

    &:active{
        outline:none;
        border:none;
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const MintBg = styled.div`
    background-image:url('/images/mintbg.png');
    background-position: 100% 0%;
    background-repeat: no-repeat;
    background-size: 100%;
    position:absolute;
    top:0;
    right:0;
    z-index:0;
    pointer-events:none;
    width:100%;
    height:100%;
`