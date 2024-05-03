# Notes

## Resources

* [Anchor](https://www.anchor-lang.com/) - Solana's Sealevel runtime framework
* [Program Derived Addressses (PDA)](https://solanacookbook.com/core-concepts/pdas.html): With PDAs, programs can programmatically sign for certain addresses without needing a private key. 
    * PDAs serve as the foundation for Cross-Program Invocation, which allows Solana apps to be composable with one another.
    * PDAs are 32 byte strings that look like public keys, but don’t have corresponding private keys
    * seeds are bumped to find a PDA
* Rent and discriminators

### Setup

* [Installing Rust on Mac OS X](https://www.petergirnus.com/blog/rust-macos-how-to-install)
* [Installing Anchor](https://www.anchor-lang.com/docs/installation)
* [Setup local development and install the Solana CLI](https://docs.solanalabs.com/cli/install#macos--linux-1)
    * going with `curl` installation, not homebrew. seems like homebrew doesn't include `solana-test-validator` ([src](https://github.com/Homebrew/homebrew-core/blob/4b29949e7f7a3dab682f14aac123c94cdc949978/Formula/s/solana.rb)) at the moment. 
* [anchor build vs cargo build](https://stackoverflow.com/questions/74273410/difference-between-cargo-build-and-anchor-build)