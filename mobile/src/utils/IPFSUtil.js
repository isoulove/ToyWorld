import { NFTStorage } from 'nft.storage'

const endpoint = 'https://api.nft.storage' // the default
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA5NThEZDFlOWJlYjUyNWIxOTREMjk0ZUZDMEM2YTE1YTI5ZjNDNEIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNTk2ODg0NDUwMywibmFtZSI6IlRveVdvcmxkLUtleTEifQ.Kvw5fksZ6RIbVdtgVJBWoY1u4ET219J33EY4rdG-I-g' // your API key from https://nft.storage/manage

export async function storeFiles(files) {
  const storage = new NFTStorage({ endpoint, token })
  const cid = await storage.storeDirectory(files)
  return cid
}

export async function queryStatus(cid) {
  const storage = new NFTStorage({ endpoint, token })
  const status = await storage.status(cid)
  return status
}

export async function deleteFiles(cid) {
  const storage = new NFTStorage({ endpoint, token })
  const status = await storage.delete(cid)
  return status
}