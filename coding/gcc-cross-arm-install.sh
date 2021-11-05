#!/bin/bash

set -e

prefix="arm-linux-gnueabihf"
# TODO MODIFY WHEN KNOWN:
gcc_filename="gcc-10.2.0.tar.xz"
isl_filename="isl-0.21.tar.xz"
glibc_filename="glibc-2.32.tar.xz"

args=("$@")

function build() {
    if [[ "$args" -eq "--unattended" ]]; then
      (
          cd "./${prefix}-$1"
          package_filename=$(makepkg --packagelist)
          if [[ ! -f "$package_filename" ]] ; then
            makepkg --clean --noconfirm
          fi
          sudo pacinstall --file "$package_filename" --resolve-conflicts=all --no-confirm
      )
    else
        (cd "./${prefix}-$1" && makepkg --skipinteg -i "${args[@]}")
    fi
}

build binutils

build gcc-stage1

build linux-api-headers

build glibc-headers


# TODO MODIFY DEFINES ABOVE
ln -sf "../${prefix}-gcc-stage1/${gcc_filename}" "${prefix}-gcc-stage2/"
ln -sf "../${prefix}-gcc-stage1/${isl_filename}" "${prefix}-gcc-stage2/"
build gcc-stage2

ln -sf "../${prefix}-glibc-headers/${glibc_filename}" "${prefix}-glibc/"
build glibc

ln -sf "../${prefix}-gcc-stage2/${gcc_filename}" "${prefix}-gcc/"
ln -sf "../${prefix}-gcc-stage2/${isl_filename}" "${prefix}-gcc/"
build gcc
