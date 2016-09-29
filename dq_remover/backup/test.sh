#!/bin/bash

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数が必要です。" 1>&2
  exit 1
fi

remover () {
 _line=$1
 _res=`echo $_line | awk 'match($0,  /[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]/)'`
 #echo $_line
if [[ $_res == $_line ]]; then
  _after=`echo $_line | sed -e 's/^\(.*[a-zA-Z0-9 ]\)\(\"\,\)\([a-zA-Z0-9 ].*\)$/\1\\\"\,\3/g'` 
  #echo $_after
  remover $_after
else
  echo $_line
  #echo "ccc"
fi
}

while read x; do
 res=""
 res=`echo $x | awk 'match($0,  /[a-zA-Z0-9 ]\"\,[a-zA-Z0-9 ]/)'`
 #echo $res
if [[ $res == $x ]]; then
  remover $x
  #echo "aaa"
else
  echo $x
  #echo "bbb"
fi
done < $1

