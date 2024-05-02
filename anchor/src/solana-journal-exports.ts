// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { SolanaJournal } from '../target/types/solana_journal';
import { IDL as SolanaJournalIDL } from '../target/types/solana_journal';

// Re-export the generated IDL and type
export { SolanaJournal, SolanaJournalIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const SOLANA_JOURNAL_PROGRAM_ID = new PublicKey(
  'xNT9fpMyDBXvCMAkTafwWdQHkjrAR3gCdXjtubMSA14'
);

// This is a helper function to get the program ID for the SolanaJournal program depending on the cluster.
export function getSolanaJournalProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOLANA_JOURNAL_PROGRAM_ID;
  }
}
