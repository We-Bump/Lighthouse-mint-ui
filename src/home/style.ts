import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"

export const Home = styled.div`
    background-color: ${color.bg};
    min-height:100vh;
    height:100%;
`

export const Bg = styled.div`
    position:absolute;
    top:0;
    left:0;
    z-index:0;
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    overflow:hidden;

    & svg{
        position:absolute;
        top:0;
        height:100%;
        width:100%;
        color:${Hex2Rgba("#1B5072", .32)}
    }
`

export const Container = styled.div`
    max-width: 1255px;
    margin: 0 auto;
    padding: 0 20px;
    height:100%;
    width:100%;
    position:relative;
    z-index:1;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const Header = styled.div`
    padding-top:76px;
    display:flex;
    justify-content:space-between;
    align-items:center;

    @media (max-width: 768px) {
        flex-direction:column;
        padding-top:24px;
        &>*:nth-child(2){
            margin:8px 0;
        }
    }
`

export const Logo = styled.img`
    width:147px;
`

export const WalletConnect = styled.button`
    background-color:${color.primary};
    color:${color.black};
    padding:0px 24px;
    height:43px;
    display:flex;
    align-items:center;
    border-radius:8px;
    font-size:14px;
    font-weight:500;
    cursor:pointer;
    transition:all .1s ease-in-out;
    &:hover{
        background-color:${Hex2Rgba(color.primary, .8)};
    }
    outline:none;
    border:none;
    &:active{
        outline:none;
        border:none;
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const WalletConnected = styled.div`
    background-color:${color.primary};
    padding:8px 16px;
    border-radius:8px;
    font-size:14px;
    display:flex;
    align-items:center;
`

export const WBalance = styled.div`
    padding:8px 16px;
    background-color:${color.secondaryLight};
    border-radius:8px;
    margin-right:16px;
`

export const WAddress = styled.div`
    color:${color.black};
`

export const Launch = styled.div<{showMintedNfts?:string}>`
    margin-top:16px;
    min-height:769px;
    background: linear-gradient(180deg, #15232D 0%, #0A141B 100%);
    box-shadow: 0px 11.8109px 53.1492px rgba(0, 0, 0, 0.35);
    border-radius: 16px;
    padding:70px 56px;
    display:flex;
    position:relative;
    &::before {
        pointer-events: none;
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 16px; 
        padding: 1px; 
        background:linear-gradient(137deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0)); 
        -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude; 
    }
    overflow:hidden;

    ${props => props.showMintedNfts === 'true' && `
        padding-top:16px;
    `}

    @media (max-width: 768px) {
        flex-direction:column-reverse;
        padding:24px;

        ${props => props.showMintedNfts === 'true' && `
        flex-direction:column;
        `}
    }
`

export const LaunchBg = styled.div`
    background-image:url('/images/mintbg.png');
    background-position: 100% 0%;
    background-repeat: no-repeat;
    background-size: 50%;
    position:absolute;
    top:0;
    right:0;
    z-index:0;
    width:100%;
    height:100%;
    pointer-events:none;
`

export const Mid = styled.div`
    flex:.33;
`

export const Loading = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    font-size:28px;
    color:${color.whiteShade};
` 

export const LaunchInfo = styled.div`
    flex:1;
    position:relative;
    z-index:1;
`

export const Title = styled.div`
    font-size:32px;
    font-weight:500;

    @media (max-width: 768px) {
        display:none;
    }
`

export const TitleMobile = styled.div`
    display:none;

    @media (max-width: 768px) {
        display:block;
        font-size:32px;
        font-weight:500;
        margin-bottom:16px;
    }
`

export const TotalMinted = styled.div`
    margin-top:24px;
    font-size:14px;
`

export const TotalMintedInfo = styled.div`
    display:flex;
    justify-content:space-between;
`

export const TotalMintedTitle = styled.div`
    color:${color.primary};
`

export const TotalMintedValue = styled.div`
    & span{
        font-weight:500;
    }
`

export const TotalMintedProgress = styled.div<{value:number}>`
    margin-top:8px;
    border-radius:69px;
    height:12px;
    background-color:#263039;
    transition:all .3s ease-in-out;
    overflow:hidden;
    &:after{
        transition:all .3s ease-in-out;
        content:'';
        display:block;
        width:${props => props.value}%;
        height:100%;
        background-color:${color.white};
        border-radius:69px;
    }
`

export const Description = styled.div`
    color:${color.whiteShade};
    font-size:14px;
    margin-top:32px;
`

export const Links = styled.div`
    display:flex;
    gap: 1.2rem;
    margin-top: 25px;
`

export const Link = styled.a`
    color:${color.primary};
    font-size: 25px;
    &:hover{
        opacity: 80%;
    }
`

export const Phases = styled.div`
    margin-top:24px;
`

export const Phase = styled.div<{active:string,switch?:string}>`
    background-color:${props => props.active === 'true' ? color.secondaryLight : color.secondary};
    color:${props => props.active === 'true' ? color.white : color.whiteShade};
    position:relative;
    border-radius:8px;
    border:${props => props.active === 'true' ? '1px solid'+color.primary : '1px solid'+color.secondaryLight};
    padding:16px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    font-size:14px;

    &:not(:last-child){
        margin-bottom:24px;
    }

    ${props => (props.switch === 'true' && props.active === 'false') && `
        cursor:pointer;
        &:hover{
            background-color:${Hex2Rgba(color.secondaryLight, .8)};
        }
        &:active{
            background-color:${Hex2Rgba(color.secondaryLight, .5)};
        }
    `}

    transition:all .1s ease-in-out;
`

export const PhaseTop = styled.div`
    display:flex;
    justify-content:space-between;
    margin-bottom:8px;
`

export const PhaseTitle = styled.div`
    color:${color.primary};
`

export const PhaseDate = styled.div`
    & span{
        color:${color.whiteShade};
    }
`

export const PhaseBottom = styled.div`

`

export const PhaseBadge = styled.div`
    position:absolute;
    right:16px;
    padding:8px;
    border-radius:8px;
    background-color:${color.secondaryLight};
    font-size:12px;
`

export const LaunchMint = styled.div`
    flex:.9;
    position:relative;
    z-index:1;
`

export const Image = styled.div`
    width:100%;

    img {
        width:100%;
        border-radius:16px;
    }
`

export const MintInfo = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top:24px;
`

export const Price = styled.div`
    color:${color.whiteShade};

    & span{
        color:${color.white};
        font-weight:500;
    }
`

export const Amount = styled.div`
    display:flex;
    align-items:center;
    padding:8px;
    background-color:${color.secondaryLight};
    border-radius:8px;
`

export const AmountButton = styled.div`
    width:24px;
    height:24px;
    border-radius:8px;
    cursor:pointer;
    color:${color.whiteShade};
    display:flex;
    justify-content:center;
    align-items:center;
    background-color:${color.secondary};
    transition:all .1s ease-in-out;
    &:hover{
        background-color:${Hex2Rgba(color.secondary, .8)};
    }
    &:active{
        background-color:${Hex2Rgba(color.secondary, .5)};
    }
    user-select:none;
`

export const AmountValue = styled.input`
    margin:0 16px;
    width:40px;
    background-color:transparent;
    border:none;
    color:${color.white};
    font-size:14px;
    font-weight:500;
    text-align:center;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
      
`

export const MintButton = styled.button`
    width:100%;
    padding:16px 0;
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

    &:disabled{
        background-color:${color.primary} !important;
        cursor:default;
    }

    &:active{
        outline:none;
        border:none;
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const MintedBalance = styled.div`
    text-align:center;
    margin-top:16px;
    font-size:14px;
    color:${color.whiteShade};
    cursor:pointer;

    &:hover{
        color:${color.primary};
    }
`

export const MintedNfts = styled.div`
    width:100%;
`

export const MintedNftsHeader = styled.div`

`

export const GoBack = styled.button`
    width:100%;
    max-width:266px;
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

export const MintedNftsBody = styled.div`
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;
    margin-top:24px;
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
        grid-template-columns: repeat(1, 1fr);
    }
    width:100%;
`

export const Nft = styled.div`
    display:flex;
    align-items:center;
    border-radius:8px;
    border:1px solid ${color.primary};
    padding:16px;
    background-color:${color.secondaryLight};
`

export const NftImage = styled.img`
    width:90px;
    height:90px;
    border-radius:8px;
`

export const NftTitle = styled.div`
    margin-left:16px;
`