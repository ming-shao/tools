#!/bin/bash

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数が必要です。" 1>&2
  exit 1
fi

wkd="./work_dir/"
_ts=0
mkdir -p $wkd

egrep "[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]" $1 > ${wkd}ng.${_ts}.csv
egrep -v "[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]" $1 > ${wkd}ok.csv

remover () {
 sed -e 's/^\(.*[a-zA-Z0-9 ]\)\(\"\,\)\([a-zA-Z0-9 ].*\)$/\1\\"\,\3/g' $1 > $2
}

while :
do
 echo $_ts
 remover ${wkd}ng.${_ts}.csv ${wkd}ng.$(( $_ts+1 )).csv
 diff ${wkd}ng.${_ts}.csv ${wkd}ng.$(( $_ts+1 )).csv > /dev/null
 if [[ $? -ne 1 ]]; then
   cat ${wkd}ok.csv ${wkd}ng.$(( $_ts+1 )).csv > ${wkd}done.csv
   break
 fi
 _ts=$(( $_ts+1 ))
done

