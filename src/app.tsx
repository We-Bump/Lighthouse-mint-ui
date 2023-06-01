import React, { useEffect } from "react"
import config from "./config.json"
import Home from "./home"
import { WalletConnectProvider } from "hooks/walletConnect"
import { Toaster } from "react-hot-toast";
import { color } from "styles/theme";
import { Hex2Rgba } from "utils/helpers";

const App = () => {

    useEffect(() => {
        document.title = config.name
    }, [])

    return (
        <WalletConnectProvider
        >
            <Home />
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        border: "1px solid " + color.black,
                        color: color.white,
                        background: Hex2Rgba(color.black, 0.95),
                    },
                }}
            />
        </WalletConnectProvider>
    )

}

export default App