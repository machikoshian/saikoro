#!/bin/sh

revision=`git log --pretty=format:"%h %ad" -n 1`;
sed  -e "s/REVISION_INFO/${revision}/g" $1;
