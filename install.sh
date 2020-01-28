#! /bin/bash

##############################
# install.sh 		     #
# version 0.1		     #
#			     #
# Gotta add the rest         #
##############################


echo "Setting up"

# update system
dnf update

# install nano
dnf install nano

# install openbox and the rest
dnf install openbox tint2 shutter

# install libreoffice
dnf install libreoffice

# install thunderbird
dnf install thunderbird

#install oneko
dnf install oneko

# install lyx
dnf install lyx

# enable rpm fusion and other stuff (media)
dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

dnf install gstreamer
dnf groupupdate core
dnf groupupdate multimedia --setop="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
dnf groupupdate sound-and-video
dnf install rpmfusion-free-release-tainted # to play dvd
dnf install libdvdcss # to play dvd

# install gimp
dnf install gimp

#install liferea
dnf install liferea

# install lxpanel
dnf install lxpanel

# install feh
dnf install feh

# prepare wallpapers
cp -R ./wallpapers ~/Pictures/wallpapers

# copy .config dir
cp -R ./.config ~/.config

#copy conkyrc
cp ./.conkyrc ~/.conkyrc
cp ./.conkyrc_openbox ~/.conkyrc_openbox

# copy .atom
cp -R ./.atom ~/.atom

# copy .todo
cp -R ./.todo ~/.todo

# copy .nanorc and .bashrc
cp ./.bashrc ~/.bashrc
cp ./.bash_profile ~/.bash_profile
cp ./.nanorc ~/.nanorc

# copy batpower.sh
cp ./batpower.sh ~/batpower.sh

# cp toggle_xcompmgr.sh
cp ./toggle_xcompmgr.sh ~/toggle_xcompmgr.sh

# setup resolv.conf // because eff virgin media dns
cp /etc/resolv.conf /etc/resolv.conf.bak 
echo "nameserver 104.238.186.189" > /etc/resolv.conf # opennic server
echo "nameserver 8.8.8.8" >> /etc/resolv.conf # google server just in case

# install protonvpn
dnf install -y openvpn dialog python3-pip python3-setuptools # having pip installed is always handy 
pip3 install protonvpn-cli

# for backup
dnf install duplicity
#add the rest when you prepare configs 'n stuff

# dmenu
dnf install dmenu

# cp xbindkeys config
cp ./.xbindkeysrc ~/.xbindkeysrc

# list what's needed to install manually
echo "You gotta manually  install: wbar, rtv, gzdoom, atom, keybase, keepass; download: tor"

echo "Done"
