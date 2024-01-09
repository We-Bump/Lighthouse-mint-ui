
# Lighthouse Mint UI

Lighthouse mint ui is a launch pad for launching NFT collections created by [Lighthouse cli](https://github.com/We-Bump/Lighthouse-cli).


  
## Usage
To install, you'll need to have [Node.js](https://nodejs.org/) installed on your computer. 

From your command line:
```bash
# Clone this repository 
$ git clone https://github.com/We-Bump/Lighthouse-mint-ui

# Go into the repository
$ cd Lighthouse-mint-ui

# Install dependencies
$ npm install
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
```json
{
	"name":"My Project",
	"description":"",
	"website":"",
	"twitter":"",
	"discord":"",
	"rpc":"http://127.0.0.1:26657/",
	"network":"atlantic-2",
	"collection_address":"sei1tkzcnkln5fl8ytlcafcp9wdujw62hadwpn65c5lwz668275vlgys8tf88p",
	"nft_name_type":"default",
	"groups":[
		{
			"name":"whitelist",
			"allowlist":[
				"sei14v72v7hgzuvgck6v6jsgjacxnt34gj06qnx53d",
				"sei1t22vwusjlxg4vp7gttsx7n2y9u4k0vv9lpk2ge"
			]
		},
		{
			"name":"public"
		}
	]
}
```
`name` - name to display on ui

`description` - description to display on ui

`rpc` - SEI rpc to interact with blockchain

`network` - network to connect- available (atlantic-2) (pacific-1)

`collection_address` - collection address to load

`groups` - list of mint groups to display in the ui

`nft_name_type` - type of minted nfts name to display in ui. available (default, token_id)

##### group options
`name` - group name

`allowlist` - array of allowlistled wallets. (if merkle root is set for minting group in lighthouse config)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.