## Appendix: API Reference

### Setup（账户存储初始化）

Run the commands below to initialize the minter account to hold and mint ToyCoin,
Toy Items, and add offers to the marketplace.

- **POST /v1/ToyCoin/setup** - Create a resource that holds ToyCoin in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/toycoin/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/toy-items/setup** - Create a resource that holds Toy Items in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/toy-items/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/market/setup** - Create a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Toy Items.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
```

### Minting（FT代币和NFT代币铸造）

Run the commands below to mint new ToyCoin, create new items,
and list some items for sale.

- **POST /v1/ToyCoin/mint** - Mint new ToyCoin
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/toycoin/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "amount": 2.0
  }'
```

- **POST /v1/toy-items/mint** - Mint a Toy Item
  and send it to the `recipient` account.
  metadata -- custom info of the nft

```sh
curl --request POST \
  --url http://localhost:3000/v1/toy-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "typeID": 1,
    "metadata": {}
  }'
```

- **POST /v1/toy-items/updmetadata** - update the metadata of the nft
  and send it to the `recipient` account.
  metadata -- custom info of the nft

```sh
curl --request POST \
  --url http://localhost:3000/v1/toy-items/updmetadata \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "itemID": 1,
    "metadata": {}
  }'
```

- **POST /v1/market/sell** - Put a Toy Item up for sale.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemID": 0,
    "price": 7.9
  }'
```

# Toy Items API

The Toy Items API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/flow-js-sdk/).

## Getting started

### 1. Install dependencies

```sh
cd ./api

npm install
```

### 2. Use your Flow Testnet account

You'll need the **account address** and
**private key** for your Flow Testnet account to complete these setup steps.

Read the [Getting Started](https://github.com/onflow/toy-items#-get-started)
guide if you haven't created a Testnet account yet.

```sh
# Replace these values with your own!
export FLOW_ADDRESS=0xabcdef12345689
export FLOW_PRIVATE_KEY=xxxxxxxxxxxx
```

### 3. Configure your environment

Create a copy of `.env.example`:

```sh
cp .env.example .env.local
```

### 4. Start the database（not use database in this demo）

> 🚧 You'll need to have Docker installed to complete this step.

We'll use the included `docker-compose` file to start a Postgres instance for this API.

```sh
docker-compose up -d
```

### 5. Start the API server

```sh
npm run start:dev
```

### 6. Set up the minter account (the initialize need user sign, this just for contract user)

Before you can mint ToyCoin and Toy Items,
you'll need to initialize your account with the following:

- An empty `ToyCoin` vault
- An empty `ToyItems` collection
- An empty `ToyItemsMarket` collection

_💡 Learn more about `Vault` and `Collection` resources [in this tutorial](https://docs.onflow.org/cadence/tutorial/01-first-steps/)._

#### Minter setup script (not use database in this demo)

Run this script to set up the minter account and mint an initial supply of ToyCoin and Toy Items:


```sh
./setup-minter.sh
```

### Try it out!

✨ The API should now be available at http://localhost:3000.

_Note: when the API starts,
it will automatically run the database migrations for the configured `DATABASE_URL` URL._

## Next steps (todo list)

---
