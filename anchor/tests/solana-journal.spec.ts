import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { SolanaJournal } from '../target/types/solana_journal';

describe('solana-journal', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.SolanaJournal as Program<SolanaJournal>;

  const solanaJournalKeypair = Keypair.generate();

  it('Initialize SolanaJournal', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanaJournal: solanaJournalKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanaJournalKeypair])
      .rpc();

    const currentCount = await program.account.solanaJournal.fetch(
      solanaJournalKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment SolanaJournal', async () => {
    await program.methods
      .increment()
      .accounts({ solanaJournal: solanaJournalKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solanaJournal.fetch(
      solanaJournalKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment SolanaJournal Again', async () => {
    await program.methods
      .increment()
      .accounts({ solanaJournal: solanaJournalKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solanaJournal.fetch(
      solanaJournalKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement SolanaJournal', async () => {
    await program.methods
      .decrement()
      .accounts({ solanaJournal: solanaJournalKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solanaJournal.fetch(
      solanaJournalKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set solanaJournal value', async () => {
    await program.methods
      .set(42)
      .accounts({ solanaJournal: solanaJournalKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solanaJournal.fetch(
      solanaJournalKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the solanaJournal account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanaJournal: solanaJournalKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solanaJournal.fetchNullable(
      solanaJournalKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
