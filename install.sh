#! /bin/bash

##############################
# install.sh 		     #
# version 0.2		     #
#			     #
# Gotta add the rest         #
##############################


echo "Setting up"

# update system
dnf update -y

# install nano
dnf install -y nano

# install libreoffice
dnf install -y libreoffice

# install thunderbird
dnf install -y thunderbird

#install oneko
dnf install -y oneko

# install lynx
dnf install -y lynx

# enable rpm fusion and other stuff (media)
dnf install -y https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

dnf install -y gstreamer
dnf groupupdate core -y
dnf groupupdate multimedia --setop="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin -y
dnf groupupdate sound-and-video -y
dnf install -y rpmfusion-free-release-tainted # to play dvd
dnf install -y libdvdcss # to play dvd

# install gimp
dnf install -y gimp

#install quiterss
dnf install -y quiterss

# install feh
dnf install -y feh

# instal pdf reader
dnf install -y atril

# prepare wallpapers
cp -R ./wallpapers /home/kuromaru/Pictures/wallpapers

# copy .config dir
cp -R ./.config /home/kuromaru/.config

#copy conkyrc
cp ./conky.conf /home/kuromaru/conky.conf
cp ./.conky_todorc /home/kuromaru/.conky_todorc

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

# for backup
dnf install -y duplicity
#add the rest when you prepare configs 'n stuff

# dmenu
dnf install -y dmenu

# cp xbindkeys config
#cp ./.xbindkeysrc /home/kuromaru/.xbindkeysrc

# weather script for conky
cp ./weather.sh /home/kuromaru/weather.sh

# tmux
dnf install -y tmux

# tmux conf
cp ./.tmux.conf /home/kuromaru/.tmux.conf

# copy bin directory
cp -r ./bin/* /home/kuromaru/bin/

# list what's needed to install manually
echo "You gotta manually  install: keepass, tor, the protonmail thingy"

echo "Done"

