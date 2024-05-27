
# Lighthouse Mint UI

Lighthouse mint ui is a launch pad for launching NFT collections created by [Lighthouse cli](https://github.com/We-Bump/Lighthouse-cli).

See the [documentation](https://webump.xyz) for usage and installation instructions.

  
## Usage
To install, you'll need to have [Node.js](https://nodejs.org/) installed on your computer. 

From your command line:
```bash
# Clone ui repository
git clone https://github.com/We-Bump/Lighthouse-mint-ui

# Go into the repository
cd Lighthouse-launch-ui

# Install dependencies
yarn

```



## Usage
```bash
# To start
$ npm start

# To build
$ npm run build
```
## Configuration

UI relies on `src/config.json` file for configuration of launch.

The Lighthouse mint UI is used to deploy and mint NFTs on the SEI CosmWasm and SEI EVM. Only for NFT and CW404 Collections.

```json
{
    "name": "<project name>",
    "description": "",
    "website": "",
    "socialX": "",
    "discord": "",
    "rpc_wasm": "<rpc url of wasm>",
    "rpc_evm": "<rpc url of evm>",
    "network": "<chain>",
    "collection_address": "",
    "pointer_address": "",
    "nft_name_type": "default",
    "groups": [
        {
            "name":"whitelist",
            "allowlist":[
                "sei1qlmlc9h6deamn6hqc7pfwxslvth77sgpu9ucdn",
                "0xac98ab2de8f9184dfa93c3a186c3e14911b475b9"
            ]
        },
        {
            "name":"public"
        },
    ]
}
```

## Fields

`name` - name to display on ui

`description` - description to display on ui

`rpc_wasm` - rpc url of wasm chain. (required)

`rpc_evm` - rpc url of evm chain. (if you are deploying on evm chain)

`network` - network to connect.  Available networks [here](https://webump.xyz/basics/networks).

`collection_address` - collection address to load

`pointer_address` - pointer address to load. 

`groups` - list of mint groups to display in the ui

`nft_name_type` - type of minted nfts name to display in ui. available (default, token_id)

##### group options

`name` - group name

`allowlist` - array of allowlistled wallets. (if merkle root is set for minting group in lighthouse config) **0x addresses must be in lowercase**



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.