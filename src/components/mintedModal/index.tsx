import React, { useEffect } from "react"
import * as C from "./style"
import confetti from "canvas-confetti"
import config from "config.json"
import { formatNumber } from "utils/helpers"

const MintedModal = (props: any) => {

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, [])

    return (
        <C.Modal>
            <C.Overlay onClick={props.close}></C.Overlay>
            <C.Dialog>
                <C.MintBg></C.MintBg>
                <C.DialogHeader>
                    <C.DialogTitle></C.DialogTitle>
                    <C.CloseButton onClick={props.close}>&times;</C.CloseButton>
                </C.DialogHeader>
                <C.DialogBody>



                    {props.mints.length === 1 && (
                        <>
                            <C.NftSingle>
                                <C.Nft>
                                    <C.NftImage src={props.mints[0].image}></C.NftImage>
                                    <C.NftTitle>
                                        {config.nft_name_type === "default" && (
                                            <>
                                                {props.mints[0].name}
                                            </>
                                        )}
                                        {config.nft_name_type === "token_id" && (
                                            <>
                                                {(props.name + ' #' + props.mints[0].token_id)}
                                            </>
                                        )}
                                    </C.NftTitle>
                                </C.Nft>
                            </C.NftSingle>
                        </>
                    )}

                    {props.mints.length > 1 && (
                        <C.Nfts>
                            {props.mints.map((mint: any, i: number) => (
                                <C.Nft key={i}>
                                    <C.NftImage src={mint.image}></C.NftImage>
                                    <C.NftTitle>
                                        {config.nft_name_type === "default" && (
                                            <>
                                                {mint.name}
                                            </>
                                        )}
                                        {config.nft_name_type === "token_id" && (
                                            <>
                                                {(props.name + ' #' + mint.token_id)}
                                            </>
                                        )}
                                    </C.NftTitle>
                                </C.Nft>
                            ))}
                        </C.Nfts>
                    )}

                    {props.amount && (
                        <C.Token>
                            {props.mints.length === 0 && (
                                <>
                                    <C.TokenImg>
                                        <img src="/images/launch.png" alt={config.name} />
                                    </C.TokenImg>
                                    <C.Title>
                                        You Minted
                                    </C.Title>
                                </>
                            )}
                            <C.Amount>
                                {formatNumber(props.amount)} {props.symbol}
                            </C.Amount>

                            {props.previous && (
                                <C.Description>
                                    You have total of <span>{formatNumber(props.previous)} Tokens</span> in your wallet
                                </C.Description>
                            )}
                        </C.Token>
                    )}

                    <C.Bottom>

                        {props.mints.length > 1 && (
                            <C.Title>
                                Mint Successful!
                            </C.Title>
                        )}

                        <C.Button onClick={props.close}>
                            OK
                        </C.Button>
                    </C.Bottom>

                </C.DialogBody>

            </C.Dialog>
        </C.Modal>
    )

}

export default MintedModal