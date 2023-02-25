#!/bin/sh

#add configs later
#use grep later
HOME_DIR=$HOME
DOWNLOADS_DIR=$HOME_DIR"/Downloads"
PDF_DIR=$DOWNLOADS_DIR"/PDF"
IMG_DIR=$DOWNLOADS_DIR"/IMG"
ZIP_DIR=$DOWNLOADS_DIR"/ZIP"
BASH_DIR=$DOWNLOADS_DIR"/BASH"
touch -t "$(date -d '30 days ago' +%Y%m%d%H%M)" $HOME_DIR"/30DAYSAGO"
TIMESTAMP=$HOME_DIR/"30DAYSAGO"

if [[ ! -d $PDF_DIR ]]; then
	mkdir -p $PDF_DIR
fi

if [[ ! -d $IMG_DIR ]]; then
	mkdir $IMG_DIR
fi

if [[ ! -d $ZIP_DIR ]]; then
	mkdir $ZIP_DIR
fi

if [[ ! -d $BASH_DIR ]]; then
	mkdir $BASH_DIR
fi

echo "MOVING FILES TO SUBDIRECTORIES"
for file in "$DOWNLOADS_DIR"/*; do

	if [[ ($file == *.webp) || ($file == *.jpg)  || ($file == *.png) || ($file == *.jpeg) || ($file == *.svg) ]]; then
		echo "Moving $file to $IMG_DIR"
		mv "$file" $IMG_DIR/
	fi

	if [[ $file == *.pdf ]]; then
		echo "Moving $file to $PDF_DIR"
		mv "$file" $PDF_DIR/
	fi

	if [[ ($file == *.tar.xz) || ($file == *.zip) || ($file == *.tar.bz2) || ($file == *.tgz) || ($file == *.tar.gz) ]]; then
		echo "Moving $file to $ZIP_DIR"
		mv "$file" $ZIP_DIR/
	fi

	if [[ $file == *.sh ]]; then
		echo "Moving $file to $BASH_DIR"
		mv "$file" $BASH_DIR/
	fi
done

echo "DELETING OLD FILES"
for file in "$DOWNLOADS_DIR"/*; do
	if [[ ($file == *.rpm) && ($file -ot $TIMESTAMP) ]]; then
		echo "Deleting $file"
		rm "$file"
	fi
done
