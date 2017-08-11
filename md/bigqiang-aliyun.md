
* Virtual Host Login
	* `ssh root@bigqiang.com -p 11223` `123heikeshiSB$%^`

* nginx 

	* nginx目录: `/usr/share/nginx/html`
	
	* nginx配置文件: `/etc/nginx/nginx.conf`

* mariadb

	* 启动mariadb: `systemctl start mariadb`
	* 登录mysql: `mysql -u root -p`  password: `123456`
	* wordpress user: `mysql -u panger -p`  password: `123456`

* git 失灵时
	
	```
	eval `ssh-agent`
	ssh-add ~/.ssh/id_rsa.github1
	```