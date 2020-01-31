# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]
then
    PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
export PATH

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions

alias describe="sdcv --color"
alias reddit="sudo rtv"
alias jarg="curl dict://dict.org/d:$1"
alias gokgs="java -jar /home/kuromaru/Downloads/cgoban.jar &"
alias skype="skypeforlinux"
alias killskype="killall skypeforlinux"
