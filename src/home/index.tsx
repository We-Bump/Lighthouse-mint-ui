import { useState, useEffect, useRef, Fragment } from "react"
import * as C from "./style"
import { useWalletConnect } from "hooks/walletConnect"
import config from "config.json"
import { Bg } from "styles/bg"
import Wallet, { DropdownItem } from "components/wallet"
import { getSigningCosmWasmClient } from "@sei-js/core"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCircleNotch, faCopy, faGlobe } from "@fortawesome/free-solid-svg-icons"
import BigNumber from "bignumber.js"
import { Timer } from "components/timer"
import { GasPrice } from "@cosmjs/stargate";
import { keccak_256 } from '@noble/hashes/sha3'
import { MerkleTree } from 'merkletreejs';
import { toast } from "react-hot-toast"
import MintedModal from "components/mintedModal"
import axios from "axios"
import IconFire from "styles/fire.icon"
import { formatNumber, shortenPublicKey } from "utils/helpers"
import ERC2981Abi from "utils/erc2981_lighthouse_edition.abi"
import Web3 from "web3"

const LIGHTHOUSE_CONTRACT_ATLANTIC_2 = "sei1pl24jsr4m7hwpu9qf6uae2h9q4gwf8rrltdht9k0wn7la6qyhd7qetsn3n"
const LIGHTHOUSE_CONTRACT_PACIFIC_1 = "sei1qdlexq6sr2grvx0f6m638xs7e4kswa0jk63cqj0j5z99g2rz7xpq9n7lu8"
const LIGHTHOUSE_CONTRACT_ARCTIC_1 = "sei1zqd3qn4ydj4nu592534hvj5g937j0aadlryd0gt8aan8z23lfwhqsv0h66"

const getLighthouseContract = (network: string) => {
    if (network === "pacific-1") {
        return LIGHTHOUSE_CONTRACT_PACIFIC_1;
    } else if (network === "atlantic-2") {
        return LIGHTHOUSE_CONTRACT_ATLANTIC_2;
    } else if (network === "arctic-1") {
        return LIGHTHOUSE_CONTRACT_ARCTIC_1;
    } else {
        throw new Error("Invalid network");
    }
}

var phaseTimer: any = {}
var interval: any = null
var phaseSwitch = false

const Home = () => {

    const { openWalletConnect, wallet, disconnectWallet } = useWalletConnect()

    const [loading, setLoading] = useState(true)
    const [collection, setCollection] = useState<any>(null)
    const [phases, setPhases] = useState<any[]>([])
    const [currentPhase, setCurrentPhase] = useState<any>(null)
    const cw20tokens = useRef<any>([])
    const [tokenBalances, setTokenBalances] = useState<any[]>([])
    const [walletWhitelisted, setWalletWhitelisted] = useState(true)
    const [myMintedNfts, setMyMintedNfts] = useState<any[]>([])
    const [myMintedTokens, setMyMintedTokens] = useState<any>("0")
    const [myMintedNftsData, setMyMintedNftsData] = useState<any[]>([])

    const [amount, setAmount] = useState(1)
    const amountInput = useRef<any>(null)

    const [showMintedModal, setShowMintedModal] = useState(false)
    const [mintedInfo, setMintedInfo] = useState<any>({})
    const [showMintedNfts, setShowMintedNfts] = useState(false)
    const [balance, setBalance] = useState('')

    const walletEvmAddress = useRef<any>(null)
    const walletBech32Address = useRef<any>(null)


    useEffect(() => {

        load()

        return () => {
            clearInterval(interval)
        }

    }, [wallet])

    const load = async () => {
        setTokenBalances([])
        if (wallet) {
            walletBech32Address.current = wallet.accounts[0].address
            await getEvmWalletAddress()
        } else {
            walletEvmAddress.current = null
            walletBech32Address.current = null
        }
        refresh()
        clearInterval(interval)

        interval = setInterval(() => {
            refresh()
        }, 5000)
    }

    const getEvmWalletAddress = async () => {
        const client = await SigningCosmWasmClient.connect(config.rpc_wasm)
        const result = await client.queryContractSmart(getLighthouseContract(config.network), { get_evm_address_of_bech32_address: { address: wallet!.accounts[0].address } })
        if (result.associated) {
            walletEvmAddress.current = result.evm_address.toLowerCase()
        } else {
            walletEvmAddress.current = null
        }
        client.disconnect()
    }

    const getBalance = async () => {

        if (!wallet) {
            return;
        }
        const address = wallet.accounts[0].address

        const client = await SigningCosmWasmClient.connect(config.rpc_wasm)
        const balance = await client.getBalance(address, "usei");
        setBalance(new BigNumber(balance.amount).div(1e6).toString());
    };

    const refresh = async () => {
        const client = await SigningCosmWasmClient.connect(config.rpc_wasm)
        client.queryContractSmart(getLighthouseContract(config.network), { get_collection: { collection: config.collection_address } }).then(async (result) => {
            //console.log(result)
            let collectionData: any = {
                collection_type: result.collection_type,
                chain: result.chain,
                supply: result.collection_type === "404" ? new BigNumber(result.supply).dividedBy(Math.pow(10, result.cw404_info.decimals)).toString() : result.supply,
                mintedSupply: result.collection_type === "404" ? new BigNumber(result.next_token).dividedBy(Math.pow(10, result.cw404_info.decimals)).toString() : result.next_token - result.start_order,
                phases: [],
                name: result.name,
                symbol: result.symbol,
                cw404_info: result.cw404_info,
            }

            for (let i = 0; i < config.groups.length; i++) {
                for (let j = 0; j < result.mint_groups.length; j++) {
                    let group = result.mint_groups[j]
                    let groupConfig: any = config.groups[i]
                    if (groupConfig.name.toLowerCase().trim() === group.name.toLowerCase().trim()) {
                        collectionData.phases.push({
                            ...group,
                            allowlist: groupConfig.allowlist,
                        })
                    }
                }
            }

            setCollection(collectionData)
            await managePhases(collectionData.phases)
            setLoading(false)
            getBalance()
            refreshMyMintedTokens(collectionData)
            client.disconnect()
        })
    }

    const refreshMyMintedTokens = async (_collection?: any) => {

        if (wallet === null) {
            setMyMintedNfts([])
            setMyMintedTokens("0")
            return
        }

        const client = await SigningCosmWasmClient.connect(config.rpc_wasm)

        let __collection = _collection || collection

        client.queryContractSmart(getLighthouseContract(config.network), { mints_of: { address: walletBech32Address.current, collection: config.collection_address } }).then((result) => {
            if (__collection.collection_type === "404") {
                let sum = new BigNumber(0)
                for (let i = 0; i < result.mints.length; i++) {
                    sum = sum.plus(new BigNumber(result.mints[i]))
                }
                setMyMintedTokens(sum.toString())
            } else
                setMyMintedNfts(result.mints)

            client.disconnect()
        })
    }

    const loadPaymentTokens = async (tokens: any) => {


        let loadedTokens: any[] = []

        for (let i = 0; i < tokens.length; i++) {
            try {
                let token = tokens[i]
                let client = await SigningCosmWasmClient.connect(config.rpc_wasm)
                let tokenInfo = await client.queryContractSmart(token, { token_info: {} })
                loadedTokens.push({
                    contract: token,
                    data: tokenInfo
                })
                client.disconnect()
            } catch (e) {
                console.log(e)
            }
        }

        //if any token not loaded, throw error
        if (loadedTokens.length !== tokens.length) {
            throw new Error("Failed to load tokens")
        }

        return loadedTokens
    }

    const refreshMyTokenBalances = async (tokens: any) => {

        let balances: any[] = []

        for (let i = 0; i < tokens.length; i++) {
            try {
                let token = tokens[i]
                let client = await SigningCosmWasmClient.connect(config.rpc_wasm)
                let balance = await client.queryContractSmart(token, { balance: { address: walletBech32Address.current } })
                balances.push({
                    contract: token,
                    balance: balance.balance
                })
                client.disconnect()
            } catch (e) { }
        }

        return balances;

    }

    const managePhases = async (phases: any[]) => {

        let currentPhase = null
        let anyTokenPayment = false

        for (let i = 0; i < phases.length; i++) {
            let phase = phases[i]

            phase.start_time *= 1000
            phase.end_time = phase.end_time === 0 ? 0 : phase.end_time * 1000

            let start = new Date(phase.start_time)
            let end = new Date(phase.end_time)
            let now = new Date()

            if (phase.end_time === 0)
                end = new Date(32503680000000)

            if (end.getTime() - start.getTime() > 31536000000)
                phases[i].noend = true
            else
                phases[i].noend = false

            if (now > start && now < end)
                currentPhase = phase

            let totalPayments: any = {}
            for (let j = 0; j < phase.payments.length; j++) {
                let payment = phase.payments[j];
                let key: string;
                if (payment.payment_type === "native")
                    key = "native"
                else
                    key = payment.payment_type + payment.args[1]
                if (typeof totalPayments[key] === 'undefined') {
                    let contract = payment.payment_type === "native" ? null : payment.payment_type === "cw20_burn" ? payment.args[0] : payment.args[1]
                    let tokenInfo = cw20tokens.current.find((t: any) => t.contract === contract)
                    totalPayments[key] = {
                        payment_type: payment.payment_type,
                        contract,
                        symbol: payment.payment_type === "native" ? "SEI" : tokenInfo?.data?.symbol || null,
                        value: new BigNumber(0),
                        decimals: payment.payment_type === "native" ? 6 : tokenInfo?.data?.decimals || 0
                    }
                }

                totalPayments[key].value = totalPayments[key].value.plus(new BigNumber(payment.amount))
            }

            if (phase.payments.length > 0)
                phases[i].totalPayments = Object.values(totalPayments)
            else
                phases[i].totalPayments = [{ payment_type: "native", contract: null, symbol: "SEI", value: new BigNumber(0), decimals: 6 }]
        }


        let tokensToLoad = phases.map((phase) => phase.totalPayments.filter((p: any) => p.symbol === null).map((payment: any) => payment.contract)).flat().filter((contract: any) => contract !== null)
        anyTokenPayment = phases.map((phase) => phase.totalPayments.filter((p: any) => p.payment_type !== "native").length > 0).reduce((acc, val) => acc || val, false)

        if (tokensToLoad.length > 0) {
            try {
                let loadedTokens = await loadPaymentTokens(tokensToLoad)
                cw20tokens.current = [...loadedTokens, ...cw20tokens.current]

                let loadedTokensMap = loadedTokens.reduce((acc, token) => {
                    acc[token.contract] = token.data
                    return acc;
                }, {});

                for (let phase of phases) {
                    for (let payment of phase.totalPayments) {
                        if (payment.symbol !== null) continue;
                        payment.symbol = loadedTokensMap[payment.contract].symbol;
                        payment.decimals = loadedTokensMap[payment.contract].decimals;
                    }
                }
            } catch (e) {
                console.log(e)
                setPhases([])
                setCurrentPhase(null)
                return;
            }
        }

        if (anyTokenPayment) {
            let allTokens: any[] = cw20tokens.current.map((token: any) => token.contract).filter((contract: any) => contract !== null)
            //remove duplicates
            allTokens = allTokens.filter((value, index, self) => self.indexOf(value) === index)
            refreshMyTokenBalances(allTokens).then((balances) => {

                setTokenBalances(balances)
            }).catch((e) => {
                setTokenBalances([])
            })
        }

        if (currentPhase === null) {
            let closest = null
            for (let i = 0; i < phases.length; i++) {
                let phase = phases[i]
                let start = new Date(phase.start_time)

                if (closest === null)
                    closest = phase
                else {
                    let closestStart = new Date(closest.start_time)
                    if (start < closestStart) closest = phase
                }
            }

            currentPhase = closest
        }

        //order phases by start date
        phases.sort((a: any, b: any) => {
            let aStart = new Date(a.start_time)
            let bStart = new Date(b.start_time)

            if (aStart < bStart) {
                return -1
            } else if (aStart > bStart) {
                return 1
            } else {
                return 0
            }
        })

        if (phaseTimer.name !== currentPhase.name) {
            if (phaseTimer.timeout) clearTimeout(phaseTimer.timeout)

            const now = new Date()
            const start = new Date(currentPhase.start_time)
            const end = new Date(currentPhase.end_time)

            phaseTimer.name = currentPhase.name

            if (now > start && now < end) {
                if (end.getTime() - now.getTime() < 31536000000) {
                    phaseTimer.timeout = setTimeout(() => {
                        refresh()
                        phaseTimer.timeout = null
                        phaseTimer.name = null
                    }, new Date(currentPhase.end_time).getTime() - new Date().getTime())
                } else {
                    currentPhase.noend = true
                }
            } else if (now < start) {
                phaseTimer.timeout = setTimeout(() => {
                    managePhases(phases)
                    refresh()
                    phaseTimer.timeout = null
                    phaseTimer.name = null
                }, new Date(currentPhase.start_time).getTime() - new Date().getTime())
            } else if (now > end) {
                //past phase
            }
        }

        setPhases(phases)
        if (!phaseSwitch) {
            manageWhitelist(currentPhase)
            setCurrentPhase(currentPhase)
        }
    }

    const manageWhitelist = (currentPhase: any) => {
        if (wallet !== null) {
            if (typeof currentPhase.allowlist !== 'undefined' && currentPhase.allowlist !== null) {
                let allowlist = currentPhase.allowlist.find((a: any) => a === walletBech32Address.current || a === walletEvmAddress.current)
                if (allowlist) {
                    setWalletWhitelisted(true)
                } else {
                    setWalletWhitelisted(false)
                }
            } else {
                setWalletWhitelisted(true)
            }
        } else {
            setWalletWhitelisted(true)
        }
    }

    const switchPhase = (phase: any) => {
        if (!phase.noend && new Date(phase.end_time) < new Date() || phase.name === currentPhase.name)
            return;

        setCurrentPhase(phase)
        manageWhitelist(phase)
        phaseSwitch = true
    }

    const incrementAmount = () => {
        amountInput.current.value = amount + 1
        setAmount(amount + 1)
    }

    const decrementAmount = () => {
        if (amount > 1) {
            amountInput.current.value = amount - 1
            setAmount(amount - 1)
        }
    }

    const onAmountChange = () => {
        let value = amountInput.current.value
        if (value === '') value = 1
        try {
            setAmount(parseInt(value))
        } catch (e) { }
    }

    const getMintInstructions = async () => {
        const client = await SigningCosmWasmClient.connect(config.rpc_wasm)
        let lighthouseConfig = await client.queryContractSmart(getLighthouseContract(config.network), { get_config: {} })
        let totalNativePayment = new BigNumber(0)
        let cw20Instructions: any = {}

        for (let i = 0; i < currentPhase.totalPayments.length; i++) {
            let payment = currentPhase.totalPayments[i]
            if (payment.payment_type === "native") {
                totalNativePayment = totalNativePayment.plus(new BigNumber(payment.value).times(amount))
            }
            else if (payment.payment_type === "cw20_burn" || payment.payment_type === "cw20") {
                if (typeof cw20Instructions[payment.contract] === "undefined") {
                    cw20Instructions[payment.contract] = {
                        contractAddress: payment.contract,
                        msg: {
                            increase_allowance: {
                                spender: getLighthouseContract(config.network),
                                amount: "0"
                            }
                        }
                    }
                }

                cw20Instructions[payment.contract].msg.increase_allowance.amount = new BigNumber(cw20Instructions[payment.contract].msg.increase_allowance.amount).plus(payment.value.times(amount)).toString()
            }
        }

        cw20Instructions = Object.values(cw20Instructions)

        if (totalNativePayment.gt(0) || currentPhase.totalPayments.filter((payment: any) => payment.payment_type === "cw20").length > 0) {
            totalNativePayment = totalNativePayment.plus(new BigNumber(lighthouseConfig.fee).times(amount))

            if (totalNativePayment.div(1e6).gt(new BigNumber(balance))) {
                toast.error("Insufficient balance")
                return false;
            }
        }

        let merkleProof: any = null
        let merkleProofAddressType = null

        if (currentPhase.merkle_root !== '' && currentPhase.merkle_root !== null) {
            let hashedWallets = currentPhase.allowlist.map(keccak_256)
            const tree = new MerkleTree(hashedWallets, keccak_256, { sortPairs: true })
            //merkleProof = tree.getProof(Buffer.from(keccak_256(getAddress()))).map(element => Array.from(element.data))
            let allowlistEvm = currentPhase.allowlist.find((a: any) => a === walletEvmAddress.current)
            let allowlistBech32 = currentPhase.allowlist.find((a: any) => a === walletBech32Address.current)

            if (!allowlistEvm && !allowlistBech32) {
                toast.error("You are not whitelisted")
                return false
            }

            if (allowlistBech32)
                merkleProofAddressType = "bech32"
            else
                merkleProofAddressType = "hex"


            merkleProof = tree.getProof(Buffer.from(keccak_256(allowlistBech32 ? walletBech32Address.current : walletEvmAddress.current))).map(element => Array.from(element.data))
        }

        let mintedAmount = ""
        if (collection.collection_type === "404") {
            mintedAmount = new BigNumber(amount).times(currentPhase.batch_size).toString()
        }

        const instruction: any = {
            contractAddress: getLighthouseContract(config.network),
            msg: {
                mint: {
                    collection: config.collection_address,
                    group: currentPhase.name,

                    amount: amount.toString(),
                }
            }
        }

        if (merkleProof) {
            instruction.msg.mint.merkle_proof = merkleProof
            instruction.msg.mint.merkle_proof_address_type = merkleProofAddressType
        }

        if (totalNativePayment.gt(0)) {
            instruction.funds = [{
                denom: 'usei',
                amount: totalNativePayment.toString()
            }]
        }

        return { instruction, cw20Instructions, mintedAmount }
    }

    const mint = async () => {
        if (wallet === null) return openWalletConnect();
        const wasMinted = myMintedTokens;

        //check if amount is larger than max mints per wallet
        if (currentPhase.max_mints_per_wallet > 0 && amount > currentPhase.max_mints_per_wallet) {
            toast.error("You can only mint " + currentPhase.max_mints_per_wallet + " times per wallet for this phase")
            return
        }

        //check if amount is larger than remaining tokens
        if (amount > collection.supply - collection.mintedSupply) {
            toast.error("There are only " + (collection.supply - collection.mintedSupply) + " tokens left")
            return
        }

        //check if current phase is active
        if (new Date(currentPhase.start_time) > new Date()) {
            toast.error("This phase has not started yet")
            return
        }

        //check if current phase has ended
        if (!currentPhase.noend && new Date(currentPhase.end_time) < new Date()) {
            toast.error("This phase has ended")
            return
        }

        const instructions = await getMintInstructions()

        if (!instructions) return;

        let loading = toast.loading("Minting...")

        try {
            const client = await getSigningCosmWasmClient(config.rpc_wasm, wallet.offlineSigner, {
                gasPrice: GasPrice.fromString("0.01usei")
            })

            const allInstructions = [
                ...instructions.cw20Instructions,
                instructions.instruction
            ]

            const mintReceipt = await client.executeMultiple(wallet!.accounts[0].address, allInstructions, "auto")

            console.log(mintReceipt)
            toast.dismiss(loading)
            toast.success("Minted successfully")

            let tokenIds: any[] = [];

            const logs = mintReceipt.logs

            for (const log of logs) {
                const events = log.events
                for (const event of events) {
                    if (event.type === 'wasm') {
                        // Find the attribute with the key 'collection'
                        for (const attribute of event.attributes) {
                            if (attribute.key === 'token_ids') {
                                tokenIds = [...tokenIds, ...attribute.value.split(",").map((id: any) => id.trim())]
                                break
                            }
                            if (attribute.key === 'nft_ids') {
                                if (attribute.value !== "None")
                                    tokenIds = [...tokenIds, ...attribute.value.split(",").map((id: any) => id.trim())]
                                break
                            }
                        }
                    }
                }
            }

            refresh()
            refreshMyMintedTokens()

            if (tokenIds.length > 0) {
                let additional: any = {};
                if (collection.collection_type === "404")
                    additional = { amount: new BigNumber(instructions.mintedAmount).div(Math.pow(10, collection.cw404_info.decimals)), previous: wasMinted ? new BigNumber(wasMinted).plus(instructions.mintedAmount).div(Math.pow(10, collection.cw404_info.decimals)).toString() : null }

                loadNowMintedMetadata(tokenIds).then((metadata: any) => {

                    setMintedInfo({ mints: metadata, ...additional })
                    setShowMintedModal(true)
                }).catch((e) => {
                    setMintedInfo({ mints: tokenIds, ...additional })
                    setShowMintedModal(true)
                    console.log(e)
                })
            } else {
                setMintedInfo({ mints: [], amount: new BigNumber(instructions.mintedAmount).div(Math.pow(10, collection.cw404_info.decimals)), previous: wasMinted ? new BigNumber(wasMinted).plus(instructions.mintedAmount).div(Math.pow(10, collection.cw404_info.decimals)).toString() : null })
                setShowMintedModal(true)
            }

        } catch (e:any) {
            toast.dismiss(loading)
            if (e.message.includes("Cannot Mint More Than Max Tokens"))
                toast.error("You can only mint " + currentPhase.max_mints_per_wallet + " tokens per wallet for this phase")
            else if (e.message.includes("Overflow: Cannot Sub with given operands"))
                toast.error("Insufficient cw20 balance")
            else if (e.message.includes("Reserved Supply Ran Out:"))
                toast.error("Reserved supply ran out")
            else if (e.message !== "Transaction declined")
                toast.error("Mint failed")


            console.log(e)
        }
    }

    const loadNowMintedMetadata = async (mints: any[]) => new Promise(async (resolve, reject) => {

        if (collection.chain === "v1") {
            const client = await SigningCosmWasmClient.connect(config.rpc_wasm);

            const queryToken = async (token: any) => {
                let q = await client.queryContractSmart(config.collection_address, { nft_info: { token_id: token } });
                return {
                    token_uri: q.token_uri,
                    token_id: token
                }
            };

            // First, query all tokens to get their URI
            let tokenInfoPromises = mints.map((mint: any) => queryToken(mint));
            Promise.all(tokenInfoPromises).then(async (tokensInfo) => {
                let metadataPromises = tokensInfo.map((tokenInfo, index) => {
                    let tokenUri = tokenInfo.token_uri
                    return axios.get(tokenUri)
                        .then(response => ({
                            token_id: mints[index],
                            image: response.data.image,
                            name: response.data.name
                        }))
                        .catch(error => {
                            console.error(`Failed to fetch metadata for mint ${mints[index]}: `, error);
                            return {
                                token_id: mints[index],
                                image: undefined,
                                name: `#${mints[index]}`
                            }
                        });
                });

                Promise.all(metadataPromises).then((results) => {
                    resolve(results);
                }).catch((e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            });
        } else {
            const web3 = new Web3(config.rpc_evm);
            const contract = new web3.eth.Contract(ERC2981Abi, config.collection_address);
            const queryToken = async (token: any) => {
                return contract.methods.tokenURI(token).call();
            }

            let tokenInfoPromises = mints.map((mint: any) => queryToken(mint));
            Promise.all(tokenInfoPromises).then(async (tokensInfo) => {
                let metadataPromises = tokensInfo.map((tokenInfo, index) => {
                    return axios.get(tokenInfo)
                        .then(response => ({
                            token_id: mints[index],
                            image: response.data.image,
                            name: response.data.name
                        }))
                        .catch(error => {
                            console.error(`Failed to fetch metadata for mint ${mints[index]}: `, error);
                            return {
                                token_id: mints[index],
                                image: undefined,
                                name: `#${mints[index]}`
                            }
                        });
                });

                Promise.all(metadataPromises).then((results) => {
                    resolve(results);
                }).catch((e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            });
        }
    });


    const loadMinted = async () => {
        setLoading(true)
        setShowMintedNfts(true)
        setMyMintedNftsData([])

        let mints = myMintedNfts

        let result: any = await loadNowMintedMetadata(mints)
        setMyMintedNftsData(result)
        setLoading(false)



    }

    return (
        <C.Home>
            <C.Bg><Bg /></C.Bg>
            <C.Container>
                <C.Header>
                    <C.Logo src="/images/logo.png" />
                    {wallet === null && (
                        <C.WalletConnect onClick={openWalletConnect}>Connect Wallet</C.WalletConnect>
                    )}
                    {wallet !== null && (
                        <Wallet
                            balance={balance + " SEI"}
                            bech32Address={walletBech32Address.current}
                            evmAddress={walletEvmAddress.current}
                        >
                            {walletBech32Address.current && <DropdownItem onClick={() => navigator.clipboard.writeText(walletBech32Address.current)}>Copy Sei Address</DropdownItem>}
                            {walletEvmAddress.current && <DropdownItem onClick={() => navigator.clipboard.writeText(walletEvmAddress.current)}>Copy 0x Address</DropdownItem>}
                            <DropdownItem onClick={() => { disconnectWallet(); openWalletConnect() }}>Change Wallet</DropdownItem>
                            <DropdownItem onClick={disconnectWallet}>Disconnect</DropdownItem>
                        </Wallet>
                    )}
                </C.Header>

                <C.Launch showMintedNfts={showMintedNfts ? "true" : "false"}>

                    {loading && (
                        <C.Loading><FontAwesomeIcon icon={faCircleNotch} spin /></C.Loading>
                    )}

                    {!loading && (
                        <>
                            <C.LaunchBg></C.LaunchBg>
                            {!showMintedNfts && (
                                <>
                                    <C.LaunchInfo>
                                        <C.Title>
                                            {config.name}
                                            <C.CollectionType>
                                                {collection.collection_type === "721" && collection.chain === "v1" && "CW-721"}
                                                {collection.collection_type === "721" && collection.chain === "v2" && "ERC-721"}
                                                {collection.collection_type === "404" && "CW-404"}
                                            </C.CollectionType>
                                        </C.Title>
                                        <C.CA>
                                            <C.CaTitle>
                                                COLLECTION ADDRESS
                                            </C.CaTitle>
                                            <C.CaValues>
                                                <C.CaValue onClick={() => { navigator.clipboard.writeText(config.collection_address); toast.success("Copied collection address") }}>
                                                    {shortenPublicKey(config.collection_address)} <FontAwesomeIcon icon={faCopy} />
                                                </C.CaValue>
                                                {config.pointer_address && (
                                                    <C.CaValue onClick={() => { navigator.clipboard.writeText(config.pointer_address); toast.success("Copied pointer address") }}>
                                                        {shortenPublicKey(config.pointer_address)} <FontAwesomeIcon icon={faCopy} />
                                                    </C.CaValue>
                                                )}
                                            </C.CaValues>
                                        </C.CA>
                                        <C.TotalMinted>
                                            <C.TotalMintedInfo>
                                                <C.TotalMintedTitle>TOTAL MINTED</C.TotalMintedTitle>
                                                <C.TotalMintedValue>{Math.floor((collection.mintedSupply / collection.supply * 100) * 100) / 100}% <span>{formatNumber(collection.mintedSupply)}/{formatNumber(collection.supply)}</span></C.TotalMintedValue>
                                            </C.TotalMintedInfo>
                                            <C.TotalMintedProgress value={Math.floor((collection.mintedSupply / collection.supply * 100) * 100) / 100}></C.TotalMintedProgress>
                                        </C.TotalMinted>

                                        <C.Description>{config.description}</C.Description>

                                        {(config.website || config.socialX || config.discord) && (
                                            <C.Links>
                                                {config.website &&
                                                    <C.Link href={config.website} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faGlobe} />
                                                    </C.Link>
                                                }
                                                {config.socialX &&
                                                    <C.Link href={config.socialX} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faXTwitter} />
                                                    </C.Link>
                                                }
                                                {config.discord &&
                                                    <C.Link href={config.discord} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faDiscord} />
                                                    </C.Link>
                                                }
                                            </C.Links>
                                        )}

                                        <C.Phases>
                                            {phases.map((phase, index) => (
                                                <C.Phase key={index} active={currentPhase.name === phase.name ? "true" : "false"} switch={!(!phase.noend && new Date(phase.end_time) < new Date()) ? "true" : "false"} onClick={() => switchPhase(phase)}>
                                                    <C.PhaseTop>
                                                        <C.PhaseTitle>
                                                            {phase.name}
                                                            {phase.reserved_supply && phase.reserved_supply !== "0" && (
                                                                <C.PhaseReserved>
                                                                    {collection.collection_type === "721" && '• ' + phase.reserved_supply + " NFT"}
                                                                    {collection.collection_type === "404" && '• ' + formatNumber(new BigNumber(phase.batch_size).div(Math.pow(10, collection.cw404_info.decimals)).times(phase.reserved_supply)) + " Token"}
                                                                </C.PhaseReserved>
                                                            )}
                                                        </C.PhaseTitle>
                                                        {!phase.noend && (
                                                            <>
                                                                {new Date(phase.start_time) < new Date() && new Date(phase.end_time) > new Date() && (
                                                                    <C.PhaseDate>
                                                                        <span>Ends In</span> <Timer date={phase.end_time} />
                                                                    </C.PhaseDate>
                                                                )}
                                                            </>
                                                        )}
                                                        {new Date(phase.start_time) > new Date() && (
                                                            <C.PhaseDate>
                                                                <span>Starts In</span> <Timer date={phase.start_time} />
                                                            </C.PhaseDate>
                                                        )}
                                                    </C.PhaseTop>
                                                    <C.PhaseBottom>
                                                        {phase.max_mints_per_wallet > 0 && <span>{phase.max_mints_per_wallet} Per Wallet •</span>}
                                                        {phase.totalPayments.map((payment: any, index: number) => (
                                                            <span key={index}>
                                                                {payment.payment_type === "cw20_burn" && (
                                                                    <C.PhaseBurn>
                                                                        <IconFire />
                                                                    </C.PhaseBurn>
                                                                )}
                                                                {payment.value.div(Math.pow(10, payment.decimals)).toString()} {payment.symbol}
                                                                {index < phase.totalPayments.length - 1 ? ' • ' : ''}
                                                            </span>
                                                        ))}
                                                    </C.PhaseBottom>
                                                    {collection.collection_type === "404" && (
                                                        <C.PhaseRatio>
                                                            <span>{formatNumber(new BigNumber(phase.batch_size).div(Math.pow(10, collection.cw404_info.decimals)).toString())}</span> Token / {' '}
                                                            <span>{(new BigNumber(phase.batch_size).div(Math.pow(10, collection.cw404_info.decimals))).div(new BigNumber(collection.cw404_info.tokens_per_nft).div(Math.pow(10, collection.cw404_info.decimals))).toString()}</span> NFT
                                                        </C.PhaseRatio>
                                                    )}
                                                    {(!phase.noend && new Date(phase.end_time) < new Date()) && (
                                                        <C.PhaseBadge>
                                                            Ended
                                                        </C.PhaseBadge>
                                                    )}
                                                </C.Phase>
                                            ))}
                                        </C.Phases>
                                    </C.LaunchInfo>
                                    <C.Mid></C.Mid>
                                    <C.LaunchMint>
                                        <C.TitleMobile>
                                            {config.name}
                                            <C.CollectionType>
                                                {collection.collection_type === "721" && "CW-721"}
                                                {collection.collection_type === "404" && "CW-404"}
                                            </C.CollectionType>
                                        </C.TitleMobile>
                                        <C.Image>
                                            <img src="/images/launch.png" alt="launch" />
                                        </C.Image>
                                        <C.MintInfo>
                                            <C.Price>
                                                <C.PriceText>
                                                    PRICE
                                                    {collection.collection_type === "404" && (
                                                        <C.Ratio>
                                                            for <span>{formatNumber(new BigNumber(currentPhase.batch_size).div(Math.pow(10, collection.cw404_info.decimals)).times(amount).toString())}</span> Token / {' '}
                                                            <span>{(new BigNumber(currentPhase.batch_size).div(Math.pow(10, collection.cw404_info.decimals)).times(amount)).div(new BigNumber(collection.cw404_info.tokens_per_nft).div(Math.pow(10, collection.cw404_info.decimals))).toString()}</span> NFT

                                                            <span>{/*new BigNumber(collection.cw404_info.tokens_per_nft).div(Math.pow(10, collection.cw404_info.decimals)).times(amount).toString()}</span> Tokens / <span>{new BigNumber(1).times(amount).toString()*/}</span>
                                                        </C.Ratio>
                                                    )}
                                                </C.PriceText>
                                                <C.Prices>
                                                    {currentPhase.totalPayments.map((payment: any, index: number) => (
                                                        <Fragment key={index}>
                                                            <C.PriceItem >
                                                                {payment.payment_type === "cw20_burn" && (
                                                                    <C.PriceItemBurn>
                                                                        <IconFire />
                                                                    </C.PriceItemBurn>
                                                                )}
                                                                {payment.value.div(Math.pow(10, payment.decimals)).times(amount).toString()} <span>{payment.symbol}</span>


                                                            </C.PriceItem>
                                                            {index < currentPhase.totalPayments.length - 1 ? <C.PriceItemSeperator>&</C.PriceItemSeperator> : ''}
                                                        </Fragment>
                                                    ))}
                                                </C.Prices>
                                            </C.Price>
                                            <C.AmountWrapper>
                                                {collection.collection_type === "404" && (
                                                    <span>x</span>
                                                )}
                                                <C.Amount>
                                                    <C.AmountButton onClick={decrementAmount}>
                                                        &minus;
                                                    </C.AmountButton>
                                                    <C.AmountValue ref={amountInput} type="number" step="1" min={1} defaultValue={1} onChange={onAmountChange} />
                                                    <C.AmountButton onClick={incrementAmount}>
                                                        &#43;
                                                    </C.AmountButton>
                                                </C.Amount>
                                            </C.AmountWrapper>
                                        </C.MintInfo>
                                        <C.MintButton onClick={mint} disabled={walletWhitelisted === false || collection.supply - collection.mintedSupply <= 0} $haveToken={tokenBalances.length > 0 && currentPhase.totalPayments.filter((p: any) => p.payment_type !== "native").length > 0}>
                                            {collection.supply - collection.mintedSupply <= 0 ? (
                                                <>Sold Out!</>
                                            ) : (
                                                <>{walletWhitelisted === true ? 'Mint' : 'Not Whitelisted'}</>
                                            )}
                                        </C.MintButton>

                                        {tokenBalances.length > 0 && currentPhase.totalPayments.filter((p: any) => p.payment_type !== "native").length > 0 && (
                                            <C.TokenBalances>
                                                <C.TokenBalancesTitle>Balances</C.TokenBalancesTitle>
                                                <C.TokenBalancesList>
                                                    {currentPhase.totalPayments
                                                        .filter((p: any) => p.payment_type !== "native")
                                                        .reduce((unique: any[], payment: any) => {
                                                            if (!unique.some((p: any) => p.contract === payment.contract)) {
                                                                unique.push(payment);
                                                            }
                                                            return unique;
                                                        }, [])
                                                        .map((payment: any, index: number) => {
                                                            let balance = tokenBalances.find((b: any) => b.contract === payment.contract)

                                                            if (!balance) return null;
                                                            return (
                                                                <C.TokenBalance key={index}>
                                                                    <span>
                                                                        {new BigNumber(balance.balance).div(Math.pow(10, payment.decimals)).toString()}
                                                                    </span> {payment.symbol}
                                                                </C.TokenBalance>
                                                            )
                                                        })}
                                                </C.TokenBalancesList>
                                            </C.TokenBalances>
                                        )}

                                        {myMintedNfts.length > 0 && (
                                            <C.MintedBalance onClick={() => loadMinted()}>
                                                You have minted <span>{myMintedNfts.length}</span> {myMintedNfts.length === 1 ? 'NFT' : 'NFTs'}
                                            </C.MintedBalance>
                                        )}
                                        {new BigNumber(myMintedTokens).isGreaterThan(0) && (
                                            <C.MintedTokenBalance >
                                                You have minted <span>{formatNumber(new BigNumber(myMintedTokens).div(Math.pow(10, collection.cw404_info.decimals)).toString())}</span> tokens
                                            </C.MintedTokenBalance>
                                        )}
                                    </C.LaunchMint>
                                </>
                            )}

                            {showMintedNfts && (
                                <C.MintedNfts>
                                    <C.MintedNftsHeader>
                                        <C.GoBack onClick={() => setShowMintedNfts(false)}>Back</C.GoBack>
                                    </C.MintedNftsHeader>
                                    <C.MintedNftsBody>
                                        {myMintedNftsData.map((mint: any, i: any) => (
                                            <C.Nft key={i}>
                                                <C.NftImage src={`${mint.image}`}></C.NftImage>
                                                <C.NftTitle>{config.nft_name_type === "token_id" ? config.name + " #" + mint.mint : mint.name}</C.NftTitle>
                                            </C.Nft>
                                        ))}
                                    </C.MintedNftsBody>
                                </C.MintedNfts>
                            )}
                        </>
                    )}
                </C.Launch>
            </C.Container>

            {showMintedModal && (
                <MintedModal close={() => setShowMintedModal(false)} name={collection.name} {...mintedInfo} tokenUri={collection.tokenUri} symbol={collection.symbol} />
            )}
        </C.Home>
    )

}

export default Home