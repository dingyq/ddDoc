一、配置防火墙，开启80端口、3306端口

CentOS 7.0默认使用的是firewall作为防火墙且是打开的

---

二、服务器环境安装

* 安装apache

	`yum install httpd`
	
	apache基础命令
	
	```
	systemctl start httpd.service #启动apache
	
	systemctl stop httpd.service #停止apache
	
	systemctl restart httpd.service #重启apache
	
	systemctl enable httpd.service #设置apache开机启动
	
	```

* 安装（nginx）

	`yum install httpd`

	注：nginx本身不能处理PHP，它只是个web服务器，当接收到请求后，如果是php请求，则发给php解释器处理，并把结果返回给客户端。
	nginx一般是把请求发fastcgi管理进程处理，fascgi管理进程选择cgi子进程处理结果并返回被nginx
	
	
	解决方法：nginx.conf文件中server段增加如下配置，注意标红内容配置，否则会出现No input file specified.错误

	```
	# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
	```
	
	```
	location ~ .php$ {
		root html;
		fastcgi_pass 127.0.0.1:9000;
		fastcgi_index index.php;
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		include fastcgi_params;
	}
	
	```

---

三、安装php

	`yum install php`

注：最好先升级php以免出现php扩展不足

终端命令：`yum install php-devel`


* 安装PHP组件，使PHP支持mysql

`sudo yum install php php-mysql php-fpm php-mbstring php-gd php-pear php-mcrypt php-mhash php-eaccelerator php-cli php-imap php-ldap php-odbc php-pear php-xml php-xmlrpc php-mssql php-snmp php-soap php-tidy php-common php-devel php-pecl-xdebug -y`

* 编辑php配置文件
	
	`vi /etc/php.ini`
	
	`cgi.fix_pathinfo=0`

* 设置php-fpm配置文件

	`sudo vi /etc/php-fpm.d/www.conf`
	
	`listen = /var/run/php-fpm/php-fpm.sock`

* 启动php-fpm服务

	`sudo systemctl start php-fpm`

* 设置开机自动重启php-fpm

	`sudo systemctl enable php-fpm.service`

* 编辑站点配置文件
	
	```
	server {
	    listen       80;
	    server_name  bigqiang.com;
	
	    # note that these lines are originally from the "location /" block
	    root   /usr/share/nginx/html;
	    index index.php index.html index.htm;
	
	    location / {
	        try_files $uri $uri/ =404;
	    }
	    error_page 404 /404.html;
	    error_page 500 502 503 504 /50x.html;
	    location = /50x.html {
	        root /usr/share/nginx/html;
	    }
	
	    location ~ \.php$ {
	        try_files $uri =404;
	        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
	        fastcgi_index index.php;
	        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	        include fastcgi_params;
	    }
	}
	```

* 重启对应服务

	`systemctl restart httpd.service`

---
四、安装mysql(初次安装mysql，root账户没有密码)

* 方法一：安装`mariadb`

	MariaDB数据库管理系统是MySQL的一个分支，主要由开源社区在维护，采用GPL授权许可。开发这个分支的原因之一是：甲骨文公司收购了MySQL后，有将MySQL闭源的潜在风险，因此社区采用分支的方式来避开这个风险。MariaDB的目的是完全兼容MySQL，包括API和命令行，使之能轻松成为MySQL的代替品。
	
	安装mariadb，大小59 M。
	
	```
	yum install mariadb-server mariadb 
	```
	
	mariadb数据库的相关命令是：
	
	```
	systemctl start mariadb  #启动MariaDB
	
	systemctl stop mariadb  #停止MariaDB
	
	systemctl restart mariadb  #重启MariaDB
	
	systemctl enable mariadb  #设置开机启动
	```
	
	所以先启动数据库
	
	`systemctl start mariadb`


* 方法二：官网下载安装mysql-server

	`wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpmrpm -ivh mysql-community-release-el7-5.noarch.rpmyum install mysql-community-server`
	
	安装成功后重启mysql服务。
	
	`service mysqld restart`
	
	mysql修改密码：
	
	`set password for 'root'@'localhost'=password('password');`
	
	设置Mysql开启客户端远程连接
	
	在mysql控制台执行 
	
	`GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'MyPassword' WITH GRANT OPTION;
	FLUSH PRIVILEGES;`(让配置生效)
	
	**注：在mysql控制台执行命令中的 'root'@'%' 可以这样理解: root是用户名，%是主机名或IP地址，这里的%代表任意主机或IP地址，你也可替换成任意其它用户名或指定唯一的IP地址；'MyPassword'是给授权用户指定的登录数据库的密码；另外需要说明一点的是我这里的都是授权所有权限，可以指定部分权限。**