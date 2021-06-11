import * as fcl from "@onflow/fcl";

import { ec as EC } from "elliptic";

import { SHA3 } from "sha3";

const ec = new EC("p256");

class FlowService {
  authorizeMinter = () => {
    return async (account) => {
      const user = await this.getAccount(process.env.REACT_APP_MINTER_ADDRESS);
      const key = user.keys[process.env.REACT_APP_MINTER_ACCOUNT_KEY_INDEX || 0];

      const sign = this.signWithKey;
      const pk = process.env.REACT_APP_MINTER_PRIVATE_KEY;

      return {
        ...account,
        tempId: `${user.address}-${key.index}`,
        addr: fcl.sansPrefix(user.address),
        keyId: Number(key.index),
        signingFunction: (signable) => {
          return {
            addr: fcl.withPrefix(user.address),
            keyId: Number(key.index),
            signature: sign(pk, signable.message),
          };
        },
      };
    };
  };

  getAccount = async (addr) => {
    const { account } = await fcl.send([fcl.getAccount(addr)]);
    return account;
  };

  signWithKey = (privateKey, msg) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(this.hashMsg(msg));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
  };

  hashMsg = (msg) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msg, "hex"));
    return sha.digest();
  };
}

export { FlowService };