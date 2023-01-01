#!/usr/bin/zsh

rm -f polaric_communicate.apks
java -jar ~/Android/bundletool-all-1.3.0.jar build-apks --bundle=polaric_communicate.aab --output=polaric_communicate.apks
# java -jar bundletool-all-1.3.0.jar build-apks --bundle=polaric_communicate.aab --output=polaric_communicate.apks --mode=universal
