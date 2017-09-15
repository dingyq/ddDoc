* 下载并安装nginx

`# yum install nginx`

* 查看nginx服务状态，如下：
`# systemctl status nginx.service`
```
nginx.service - nginx - high performance web server
Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled)
Active: inactive (dead)      //服务未开启
```

```
# systemctl start nginx.service           /启动nginx服务
# systemctl restart nginx.service       /重新启动
# systemctl stop nginx.service          /停止服务
# systemctl enable nginx.service      /开机启动
# systemctl disable nginx.service     /禁止开机启动
```

* CentOS 7 默认是firewall 
	添加防火墙规则如下：

	```
	# firewall-cmd --add-port=80/tcp          //http协议基于TCP传输协议，放行80端口
	```

	如果添加以上的命令还不行，那么就关闭firewalld
	
	停止 
	
	`# systemctl stop firewalld.service  `
	
	禁止开机启动

	`# systemctl disable firewalld.service `

---

* 配置

	默认的配置文件在 /etc/nginx 路径下，使用该配置已经可以正确地运行nginx；

	如需要自定义，修改其下的 nginx.conf 或conf.d/default.conf等文件即可。

* 测试

	在浏览器地址栏中输入部署nginx环境的机器的IP，如果一切正常，应该能看到如下字样的内容。