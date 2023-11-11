#!/bin/sh
wget -mbc -np "https://$1" \
   --convert-links \
   --adjust-extension \
   --page-requisites --no-check-certificate --restrict-file-names=nocontrol \
   -e robots=off \
   --waitretry 5 \
   --timeout 60 \
   --tries 5 \
   --wait 1 \
   --user-agent "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27" \
   --directory-prefix=~/Documents/MIRROR/ \
   --append-output=~/Documents/MIRROR/$1.log

