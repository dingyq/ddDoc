[本文转载自简书](http://www.jianshu.com/p/36e55c289d65)

## 安装

搬瓦工自带shaowsocks一键安装，直接进入KiwiVM控制面板，拉倒最下面的Shadowsocks Server，安装就好。然后系统就会分配IP、端口和密码，如果自己用，直接使用就行了。

##配置

* 说明

自带的系统只有一个用户，想自己多弄几个用户，就要自己更改配置。
首先上，官方的[单用户配置](https://github.com/shadowsocks/shadowsocks/wiki/Configuration-via-Config-File)，[多用户配置](https://github.com/shadowsocks/shadowsocks/wiki/Configure-Multiple-Users)。

* 步骤

1. putty连上vps
2. putty中输入 `vi /etc/shadowsocks.json`

然后输入（vi的操作，先按i才可以输入）下面的内容：

```
{
 "server":"my_server_ip"，
 "local_address": "127.0.0.1",
 "local_port":1080,
  "port_password": {
     "8381": "foobar1",
     "8382": "foobar2",
     "8383": "foobar3",
     "8384": "foobar4"
 },
 "timeout":300,
 "method":"aes-256-cfb",
 "fast_open": false
}
```

* 配置的说明：

```
Name	Explanation
server	the address your server listens（服务器IP）
local_address	the address your local listens（本地代理地址）
local_port	local port（本地代理端口）
port_password	password used for encryption(自己设定的服务器端口和密码)
timeout	in seconds（超时断开，以秒为单位）
method	default: "aes-256-cfb", see Encryption（加密方式）
fast_open	use TCP_FASTOPEN, true / false（是否使用TCP）
workers	number of workers, available on Unix/Linux（这个只在Unix和Linux下有用，可不设置）
```

1. 然后按下shift+:,输入`wq`，再回车，就保存了
2. 然后就可以启动了，可选择前端启动（可看见日志），或者后台启动
	
	前端启动，putty输入：`ssserver -c /etc/shadowsocks.json`
	
	后端启动，输入：
	
	```
	开始：ssserver -c /etc/shadowsocks.json -d start
	结束：ssserver -c /etc/shadowsocks.json -d stop
	```
3. 设置开机启动

设置好了，但是如果只是这样，那每次都要手动启动ss，太麻烦。可以将其加到开机启动项。

putty输入`vi /etc/rc.local`，然后将里面的最后带有ssserver的删除（双击字母d），然后加入`ssserver -c /etc/shadowsocks.json -d start`, 再wq保存退出。开机试试效果吧，正常的话，就设置完成了。

## 其他说明

#### 非root用户运行ss

按照上面的设置shadowsocks是以root权限运行的，不是很安全，可以这样设置。

```
sudo useradd ssuser //添加一个ssuser用户
sudo ssserver [other options] --user ssuser //用ssuser这个用户来运行ss
```
其中的[other options]是只，之前启动ss的命令，比如`ssserver -c /etc/shadowsocks.json -d start`。这样就可以使用非root用户来运行ss了。
然后修改开机启动项，将之前的`ssserver -c /etc/shadowsocks.json -d start`改为`ssserver -c /etc/shadowsocks.json -d start --user ssuser`，然后保存就OK了。

## 更多

更多的问题，请看官方的[说明文档](https://github.com/shadowsocks/shadowsocks/wiki)。