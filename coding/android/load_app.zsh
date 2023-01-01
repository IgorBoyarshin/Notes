#!/usr/bin/zsh

~/Android/Sdk/platform-tools/adb push ~/work/ReleasePolaricCommunicate/polaric_communicate.apk /data/local/tmp/com.polaricsemi.polaric_communicate
~/Android/Sdk/platform-tools/adb shell pm install -t -r "/data/local/tmp/com.polaricsemi.polaric_communicate"
~/Android/Sdk/platform-tools/adb shell am start -n "com.polaricsemi.polaric_communicate/com.polaricsemi.polaric_communicate.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
