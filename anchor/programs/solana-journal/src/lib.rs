#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("xNT9fpMyDBXvCMAkTafwWdQHkjrAR3gCdXjtubMSA14");

#[program]
pub mod solana_journal {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaJournal>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solana_journal.count = ctx.accounts.solana_journal.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solana_journal.count = ctx.accounts.solana_journal.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaJournal>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solana_journal.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaJournal<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + SolanaJournal::INIT_SPACE,
  payer = payer
  )]
  pub solana_journal: Account<'info, SolanaJournal>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaJournal<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solana_journal: Account<'info, SolanaJournal>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solana_journal: Account<'info, SolanaJournal>,
}

#[account]
#[derive(InitSpace)]
pub struct SolanaJournal {
  count: u8,
}
