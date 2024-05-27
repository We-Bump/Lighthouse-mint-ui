import React, { useContext, useEffect } from "react"
import * as C from "./style"
import { connect, WalletConnect } from '@sei-js/core'
import { Transition } from 'react-transition-group'
import config from "../../config.json"
import { StdSignature } from '@cosmjs/amino';

const WalletConnectContext = React.createContext({
    isModalOpen: false,
    openWalletConnect: () => { },
    closeWalletConnect: () => { },
    wallet: null as WalletConnect | null,
    disconnectWallet: () => { },
    signMessage: async (message: string) => { return Promise.resolve(null) as Promise<StdSignature | null> }
})

const WalletConnectProvider = ({ children }: any) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [wallet, setWallet] = React.useState<WalletConnect | null>(null)
    const [walletType, setWalletType] = React.useState("")

    const openWalletConnect = () => setIsModalOpen(true)
    const closeWalletConnect = () => setIsModalOpen(false)

    const connectWallet = (name: any) => {
        connect(name, config.network).then((wallet: WalletConnect) => {
            setWallet(wallet)
            setWalletType(name)
            closeWalletConnect()
            localStorage.setItem("lastConnectedWallet", name)
        }).catch((err: any) => {
            console.log(err)
            localStorage.removeItem("lastConnectedWallet")
        })
    }

    useEffect(() => {
        const lastConnectedWallet = localStorage.getItem("lastConnectedWallet")
        if (lastConnectedWallet) {
            connectWallet(lastConnectedWallet)
        }
    }, [])

    const disconnectWallet = () => {
        setWallet(null)
        localStorage.removeItem("lastConnectedWallet")
    }

    const signMessage = async (message: string) => {
        if (!wallet) {
            return null
        }

        try {

            if (walletType === "compass") {
                let sign = await window.compass!.signArbitrary("pacific-1", wallet!.accounts[0].address, message)
                return sign
            } else if (walletType === "fin") {
                let sign = await window.fin!.signArbitrary("pacific-1", wallet!.accounts[0].address, message)
                return sign
            } else if (walletType === "leap") {
                let sign = await window.leap!.signArbitrary("pacific-1", wallet!.accounts[0].address, message)
                return sign
            } else if (walletType === "keplr") {
                let sign = await window.keplr!.signArbitrary("pacific-1", wallet!.accounts[0].address, message)
                return sign
            }

            return null
        } catch (err) {
            return null
        }
    }


    return (
        <WalletConnectContext.Provider value={{ isModalOpen, openWalletConnect, closeWalletConnect, wallet, disconnectWallet, signMessage }}>
            {children}
            <WalletConnectModal connectWallet={connectWallet} />
        </WalletConnectContext.Provider>
    )
}

const wallets = [
    ["compass", require("./assets/compass.png")], ["leap", require("./assets/leap.png")], ["keplr", require("./assets/keplr.png")],
    ["fin", require("./assets/fin.png")], ["falcon", require("./assets/falcon.png")], ["coin98", require("./assets/coin98.png")]
]

const WalletConnectModal = ({ connectWallet }: any) => {
    const { isModalOpen, closeWalletConnect } = useContext(WalletConnectContext)

    const duration = 100

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
    }

    const transitionStyles: any = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
    }

    return (
        <Transition in={isModalOpen} timeout={duration} unmountOnExit>
            {state => (
                <C.Modal style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    <C.Overlay onClick={closeWalletConnect}></C.Overlay>
                    <C.Dialog>
                        <C.DialogHeader>
                            <C.DialogTitle>Connect SEI Wallet</C.DialogTitle>
                            <C.CloseButton onClick={closeWalletConnect}>&times;</C.CloseButton>
                        </C.DialogHeader>
                        <C.DialogBody>
                            {wallets.map(([name, icon]) => (
                                <C.Wallet key={name} onClick={() => connectWallet(name)}>
                                    <C.WalletIcon src={icon} />
                                    <C.WalletName>{name.charAt(0).toUpperCase() + name.slice(1)}</C.WalletName>
                                </C.Wallet>
                            ))}
                        </C.DialogBody>
                    </C.Dialog>
                </C.Modal>
            )}
        </Transition>
    )
}

const useWalletConnect = () => {
    const { isModalOpen, openWalletConnect, closeWalletConnect, wallet, disconnectWallet, signMessage } = useContext(WalletConnectContext)
    return { isModalOpen, openWalletConnect, closeWalletConnect, wallet, disconnectWallet, signMessage }
}

export { WalletConnectProvider, useWalletConnect }