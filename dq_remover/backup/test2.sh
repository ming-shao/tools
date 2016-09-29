#!/bin/bash

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数が必要です。" 1>&2
  exit 1
fi


egrep "[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]" $1 > ng.0.csv
egrep -v "[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]" $1 > ok.csv
_ts=0 

remover () {
 sed -e 's/^\(.*[a-zA-Z0-9 ]\)\(\"\,\)\([a-zA-Z0-9 ].*\)$/\1\\"\,\3/g' $1 > $2
}

while :
do
 echo $_ts
 remover ng.${_ts}.csv ng.$(( $_ts+1 )).csv
 diff ng.${_ts}.csv ng.$(( $_ts+1 )).csv
 if [[ $? -ne 1 ]]; then
   echo "aaaaa"
   cat ok.csv ng.$(( $_ts+1 )).csv > done.csv
   break
 fi
 _ts=$(( $_ts+1 ))
done

