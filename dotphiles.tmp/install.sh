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
dnf install -y nano

# install openbox and the rest
dnf install -y openbox tint2 shutter

# install libreoffice
dnf install -y libreoffice

# install thunderbird
dnf install -y thunderbird

#install oneko
dnf install -y oneko

# install lyx
dnf install -y lyx

# enable rpm fusion and other stuff (media)
dnf install -y https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

dnf install -y gstreamer
dnf groupupdate core
dnf groupupdate multimedia --setop="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
dnf groupupdate sound-and-video
dnf install -y rpmfusion-free-release-tainted # to play dvd
dnf install -y libdvdcss # to play dvd

# install gimp
dnf install -y gimp

#install liferea
dnf install -y liferea

# install lxpanel
dnf install -y lxpanel

# install feh
dnf install -y feh

# prepare wallpapers
cp -R ./wallpapers /home/kuromaru/Pictures/wallpapers

# copy .config dir
cp -R ./.config /home/kuromaru/.config

#copy conkyrc
cp ./.conkyrc /home/kuromaru/.conkyrc
cp ./.conkyrc_openbox /home/kuromaru/.conkyrc_openbox

# copy .atom
cp -R ./.atom /home/kuromaru/.atom

# copy .todo
cp -R ./.todo /home/kuromaru/.todo

# copy .nanorc and .bashrc
cp ./.bashrc /home/kuromaru/.bashrc
cp ./.bash_profile /home/kuromaru/.bash_profile
cp ./.nanorc /home/kuromaru/.nanorc

# copy batpower.sh
cp ./batpower.sh /home/kuromaru/batpower.sh

# cp toggle_xcompmgr.sh
cp ./toggle_xcompmgr.sh /home/kuromaru/toggle_xcompmgr.sh

# setup resolv.conf // because eff virgin media dns
cp /etc/resolv.conf /etc/resolv.conf.bak 
echo "nameserver 104.238.186.189" > /etc/resolv.conf # opennic server
echo "nameserver 8.8.8.8" >> /etc/resolv.conf # google server just in case

# for backup
dnf install -y duplicity
#add the rest when you prepare configs 'n stuff

# dmenu
dnf install -y dmenu

# cp xbindkeys config
cp ./.xbindkeysrc /home/kuromaru/.xbindkeysrc

# weather script for conky
cp ./weather.sh /home/kuromaru/weather.sh

# tmux
dnf install -y tmux

# tmux conf
cp ./.tmux.conf /home/kuromaru/.tmux.conf

# list what's needed to install manually
echo "You gotta manually  install: wbar, rtv, gzdoom, atom, keybase, keepass; download: tor"

echo "Done"
