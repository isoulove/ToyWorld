import ToyNonFungibleToken from "./ToyNonFungibleToken.cdc"

// 潮玩NFT合约
//
pub contract ToyItems: ToyNonFungibleToken {

    // 事件
    // 
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, typeID: UInt64)

    // 资源路径
    //
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // 总供应量
    //
    pub var totalSupply: UInt64

    // 潮玩NFT
    // 增加新属性需删除合约重新部署
    //
    pub resource NFT: ToyNonFungibleToken.INFT {
        // NFT代币ID
        pub let id: UInt64
        // 类型
        pub let typeID: UInt64
        // 创建者
        pub let author: Address
        // 元数据
        pub(set) var metadata: String
        // 交易次数
        pub(set) var tcnt: UInt64

        // 初始化，类似构造函数
        //
        init(initID: UInt64, initTypeID: UInt64, initData: String, initAuthor: Address) {
            self.id = initID
            self.typeID = initTypeID
            self.author = initAuthor
            self.metadata = initData
            self.tcnt = 0
        }
    }

    // This is the interface that users can cast their ToyItems Collection as
    // to allow others to deposit ToyItems into their Collection. It also allows for reading
    // the details of ToyItems in the Collection.
    // 潮玩NFT公共接口
    pub resource interface ToyItemsCollectionPublic {
        pub fun deposit(token: @ToyNonFungibleToken.NFT)
        pub fun updMetadata(id: UInt64, metadata: String)
        pub fun getIDs(): [UInt64]
        pub fun idExists(id: UInt64): Bool
        pub fun getMetadata(id: UInt64) : String
        pub fun borrowNFT(id: UInt64): &ToyNonFungibleToken.NFT
        pub fun borrowToyItem(id: UInt64): &ToyItems.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ToyItem reference: The ID of the returned reference is incorrect"
            }
        }
        //
        pub fun borrowOwnedNFTs(): {UInt64: &ToyItems.NFT?}
    }

    // Collection
    // A collection of ToyItem NFTs owned by an account
    // 合约上的资源类可以被创建，并存储到账户上
    // 这里我们用Collection资源来表示一个账户拥有的所有NFT资源，并提供公开创建方法
    // 账户可以调用合约创建Collection资源，存储在自己的storage存储区域
    // 账户可以Link storage存储区域的资源，公开私有private和公共public能力
    // 通过私有private和公共public能力，对资源对象进行读或者写
    // 因此，像FT或NFT代币的取出，是不能作为public能力公开的，不然任何人都可以取出你的虚拟资产
    //
    pub resource Collection: ToyItemsCollectionPublic, ToyNonFungibleToken.Provider, ToyNonFungibleToken.Receiver, ToyNonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        //
        pub var ownedNFTs: @{UInt64: ToyNonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @ToyNonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit
        // Takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
        pub fun deposit(token: @ToyNonFungibleToken.NFT) {
            let token <- token as! @ToyItems.NFT

            let id: UInt64 = token.id

            token.tcnt = token.tcnt + 1

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun updMetadata(id: UInt64, metadata: String) {
            let token1 <- self.ownedNFTs.remove(key: id) ?? panic("missing NFT")
            let token2 <- token1 as! @ToyItems.NFT

            if(token2.tcnt==UInt64(1)) {
                token2.metadata = metadata
                let oldToken <- self.ownedNFTs[id] <- token2
                destroy oldToken
            }else{
                let oldToken <- self.ownedNFTs[id] <- token2
                destroy oldToken
                panic("只有初次售卖的NFT才能修改其元数据！")
            }
        }

        // getIDs
        // Returns an array of the IDs that are in the collection
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun idExists(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        // borrowNFT
        // Gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        //
        pub fun borrowNFT(id: UInt64): &ToyNonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &ToyNonFungibleToken.NFT
        }

        // borrowToyItem
        // Gets a reference to an NFT in the collection as a ToyItem,
        // exposing all of its fields (including the typeID).
        // This is safe as there are no functions that can be called on the ToyItem.
        //
        pub fun borrowToyItem(id: UInt64): &ToyItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &ToyNonFungibleToken.NFT
                return ref as! &ToyItems.NFT
            } else {
                return nil
            }
        }

        pub fun borrowOwnedNFTs(): {UInt64: &ToyItems.NFT?} {
            var bOwnedNFTs: {UInt64: &ToyItems.NFT?} = {}

            for key in self.ownedNFTs.keys {
                bOwnedNFTs[key] = self.borrowToyItem(id: key);
            }

            return bOwnedNFTs
        }

        pub fun getMetadata(id: UInt64): String {
            return self.borrowToyItem(id: id)!.metadata;
        }

        // destructor
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init () {
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @ToyNonFungibleToken.Collection {
        return <- create Collection()
    }

    // NFTMinter
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
	pub resource NFTMinter {
		// mintNFT
        // Mints a new NFT with a new ID
		// and deposit it in the recipients collection using their collection reference
        //
        pub fun mintNFT(author: Address, typeID: UInt64, metadata: String) {
            emit Minted(id: ToyItems.totalSupply, typeID: typeID)
            
            let recipient = getAccount(author)

            // borrow the recipient's public NFT collection reference
            let receiver = recipient
                .getCapability(ToyItems.CollectionPublicPath)!
                .borrow<&{ToyNonFungibleToken.CollectionPublic}>()
                ?? panic("Could not get receiver reference to the NFT Collection")


			// deposit it in the recipient's account using their reference
			receiver.deposit(token: <-create ToyItems.NFT(
                initID: ToyItems.totalSupply,
                initTypeID: typeID,
                initData: metadata,
                initAuthor: author)
            )

            ToyItems.totalSupply = ToyItems.totalSupply + (1 as UInt64)
		}
	}

    // initializer
    //
	init() {
        // Set our named paths
        //FIXME: REMOVE SUFFIX BEFORE RELEASE
        self.CollectionStoragePath = /storage/d1eaadd012fcd9f0ToyItemsCollection007
        self.CollectionPublicPath = /public/d1eaadd012fcd9f0ToyItemsCollection007
        self.MinterStoragePath = /storage/d1eaadd012fcd9f0ToyItemsMinter007

        // Initialize the total supply
        self.totalSupply = 0

        // Create a Minter resource and save it to storage
        // 合约账户仅用来铸造NFT，并不实际存储NFT
        // 
        self.account.save(<-create NFTMinter(), to: self.MinterStoragePath)

        emit ContractInitialized()
	}
}