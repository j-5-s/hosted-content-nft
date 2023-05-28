import Dexie, { Table } from "dexie";

export interface Contract {
  id?: number;
  // The logged in user to wagmi
  user: string;
  address: string;
  txHash: string;
  name: string;
  symbol: string;
  creator: string;
  owner: string;
}

// export const db = new Dexie("j5s");
// db.version(1).stores({
//   contracts: "++id, address, txHash", // Primary key and indexed props
// });
export class J5SClassedDexie extends Dexie {
  contracts!: Table<Contract>;

  constructor() {
    super("j5s");
    // consider unique compound index - &[address+txHash]
    this.version(1).stores({
      contracts: "++id, user, address, txHash, name, symbol, creator, owner", // Primary key and indexed props
    });
  }
}

export const db = new J5SClassedDexie();
