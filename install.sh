#!/bin/bash

while IFS='' read -r line || [[ -n "$line" ]]; do

    # Get rid of empty lines
    if [[ ${#line} -eq 0 ]]; then
        continue
    fi

    # Get rid of comments
    if [[ ${line:0:1} = "*" ]]; then
        continue
    fi

    # (%) won't get installed, so get rid of them either
    if [[ ${line:0:1} = "%" ]]; then
        continue
    fi

    # (:) => just execute
    if [[ ${line:0:2} = ":>" ]]; then
        echo ":>${line:2}"
        eval ${line:2}
    fi

    # Get rid of whitespaces
    line="$(echo -e "${line}" | tr -d '[:space:]')"

    # Now have the following format (without spaces):
    # {#|?|%} {pac|aur} {package}
    if [[ "$line" =~ ([#?])\[(pac|aur)\](.*) ]]; then
        priority=${BASH_REMATCH[1]}
        src=${BASH_REMATCH[2]}
        package=${BASH_REMATCH[3]}

        # if [[ $priority = "#" ]]; then
        #     if [[ $src = "pac" ]]; then
        #         echo $package
        #     fi
        # fi
    fi

    # echo ":>${line}"
done < "$1"
