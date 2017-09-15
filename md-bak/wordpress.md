一、安装ftp

*  安装

	```
	yum install -y vsftpd
	```

* 编辑一些值并使其它行保留原样，除非你知道自己在做什么

	```
	vi /etc/vsftpd/vsftpd.conf
	```

	```
	anonymous_enable=NO
	local_enable=YES
	write_enable=YES
	chroot_local_user=YES
	```

* 你也可以更改端口号，记得让 vsftpd 端口通过防火墙。

	```
	# firewall-cmd --add-port=21/tcp
	# firewall-cmd --reload
	```
	
* 下一步重启 vsftpd 并启用开机自动启动。

	```
	# systemctl restart vsftpd
	# systemctl enable vsftpd
	```

