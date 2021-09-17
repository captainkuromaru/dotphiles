#!/bin/bash
# Checks the battery level and if it's less than 10% it notifies the user
batt=`grep POWER_SUPPLY_CAPACITY= /sys/class/power_supply/BAT0/uevent`
battlvl=`echo $batt | tr -d 'POWER_SUPPLY_CAPACITY='`
if (( $(($battlvl)) < 10 )); then notify-send "Battery is less than 10%" "Please charge your laptop"
elif ((  $(($battlvl)) == 100 )); then notify-send "Battery is charged" "Disconnect your charger ;)"
#else echo "a"
fi
