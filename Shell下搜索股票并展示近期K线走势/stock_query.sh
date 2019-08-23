#!/bin/bash
# @author: 良民小丁

stock=$1

c_green='\033[0;32m'
c_yellow='\033[1;33m'
c_no_color='\033[0m'

if [[ -n $stock ]]; then
	curl bigqiang.com:8080/?key=${stock}
else
	printf "\n   [Error] ${c_yellow}参数非法；需传递【股票名称或代码】，支持模糊匹配 ${c_no_color}\n"
	printf " [Example] ${c_green} ./stock_query.sh 00700 ${c_no_color}\n"
	printf "            ${c_green}./stock_query.sh 腾讯控股 ${c_no_color}\n"
	printf "            ${c_green}./stock_query.sh tencent ${c_no_color}\n"
	printf "            ${c_green}./stock_query.sh tengxun ${c_no_color}\n"
	printf "      [Ad] ${c_no_color}查看更多详情可下载【富途牛牛】，覆盖各终端平台（PC、Mac、iOS、Android、微信小程序）；\n"
	printf "           富途官网[https://www.futu5.com/] ${c_no_color}\n\n"
fi
