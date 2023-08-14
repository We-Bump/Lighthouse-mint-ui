import React, { useEffect } from "react"
import * as C from "./style"
import confetti from "canvas-confetti"
import config from "config.json"

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
                        <C.NftSingle>
                            <C.Nft>
                                <C.NftImage src={typeof props.mints[0].data === "undefined" ? `${props.tokenUri}/${props.mints[0]}` : props.mints[0].data.image}></C.NftImage>
                                <C.NftTitle>
                                    {config.nft_name_type === "default" && (
                                        <>
                                            {typeof props.mints[0].data === "undefined" ? (props.name + ' #' + props.mints[0]) : props.mints[0].data.name}
                                        </>
                                    )}
                                    {config.nft_name_type === "token_id" && (
                                        <>
                                            {(props.name + ' #' + props.mints[0].mint)}
                                        </>
                                    )}
                                </C.NftTitle>
                            </C.Nft>
                        </C.NftSingle>
                    )}

                    {props.mints.length > 1 && (
                        <C.Nfts>
                            {props.mints.map((mint: any, i:number) => (
                                <C.Nft key={i}>
                                    <C.NftImage src={typeof mint.data === "undefined" ? `${props.tokenUri}/${mint}` : mint.data.image}></C.NftImage>
                                    <C.NftTitle>
                                        {config.nft_name_type === "default" && (
                                            <>
                                                {typeof mint.data === "undefined" ? (props.name + ' #' + mint) : mint.data.name}
                                            </>
                                        )}
                                        {config.nft_name_type === "token_id" && (
                                            <>
                                                {(props.name + ' #' + mint.mint)}
                                            </>
                                        )}
                                    </C.NftTitle>
                                </C.Nft>
                            ))}
                        </C.Nfts>
                    )}

                    <C.Bottom>

                        <C.Title>
                            Mint Successful!
                        </C.Title>

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