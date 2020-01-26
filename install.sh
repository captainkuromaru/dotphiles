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
cp ./conkyrc ~/conkyrc


# list what's needed to install manually
echo "You gotta manually  install: wbar, rtv, gzdoom, atom, keybase, keepass; download: tor"

echo "Done"
