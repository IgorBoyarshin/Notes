Rust
[pac] rustup
:> rustup install nightly
:> rustup default nightly
:> cargo +nightly install racer
:> rustup toolchain add nightly
:> rustup component add rust-src
:> rustup component add rls-preview --toolchain nightly
:> rustup component add rust-analysis --toolchain nightly
export RUST_SRC_PATH="$(rustc --print sysroot)/lib/rustlib/src/rust/src"
export PATH=$PATH:/home/igorek/.cargo/bin
:> rustup component add rustfmt-preview --toolchain nightly
Can run:
:> rustfmt --check src.rs

rustup component add clippy-preview
cargo clippy


Specify function (lambda) type:
let sum = ratio.iter().sum::<u32>() as f32;
