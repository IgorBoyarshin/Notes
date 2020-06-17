case $1/$2 in
    pre/*)
        echo Hello
        ;;
    post/*)
        echo Hello
        ;;
esac

case $1 in
    pre) echo Hello  ;;
    post) echo Hello  ;;
esac




read -r selected_source_input < $SELECTED_SOURCE_INPUT_FILE



# Group
# Mind the ; (semicolon)!!!!!
# Choose 0 as default sink number if the specified name could not be found
search_result=$({{ ~/scripts/.get_all_sinks.zsh | grep -n $preferred_sink_name; } || echo "0"; } | cut -d : -f 1)
