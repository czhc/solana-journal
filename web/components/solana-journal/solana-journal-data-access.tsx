'use client';

import {
  SolanaJournalIDL,
  getSolanaJournalProgramId,
} from '@solana-journal/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

interface EntryArgs {
  owner: PublicKey,
  title: string,
  message: string
}
export function useSolanaJournalProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolanaJournalProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(SolanaJournalIDL, programId, provider);


  const accounts = useQuery({
    queryKey: ['solana-journal', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, EntryArgs>({
    mutationKey: ['solana-journal', 'create', { cluster }],
    mutationFn: async ({title, message, owner}) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId,
      );

      return program.methods.createEntry(title, message).accounts({journalEntry: journalEntryAddress}).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry
  };
}

export function useSolanaJournalProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { programId, program, accounts } = useSolanaJournalProgram();

  const accountQuery = useQuery({
    queryKey: ['solana-journal', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });

  const updateEntry = useMutation<string, Error, EntryArgs>({
    mutationKey: ['solana-journal', 'update', { cluster }],
    mutationFn: async ({title, message, owner}) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId,
      );

      return program.methods.updateEntry(title, message).accounts({journalEntry: journalEntryAddress}).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  const deleteEntry = useMutation({
    mutationKey: ['solana-journal', 'delete', { cluster }],
    mutationFn: (title: string) =>
      program.methods.deleteEntry(title).accounts({journalEntry: account}).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    }
  })

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  };
}
