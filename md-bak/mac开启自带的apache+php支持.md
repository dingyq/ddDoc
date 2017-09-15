
10.10.3这个版本是默认安装了apache和php，但是需要使用root用户来启用，所以请按照我下面的步骤来：

* 启用root用户

	1. 选取系统偏好设置...。
	2. 从显示菜单中，选取“帐户”。
	3. 点按锁图标并使用管理员帐户进入。
	4. 点击“登录选项”。
	5. 点按右下方的“加入”按钮。
	6. 点击“打开目录实用工具”按钮。
	7. 点按“目录实用工具”窗口中的锁图标。
	8. 输入管理员帐户名称和密码，然后点按“好”。
	9. 从编辑菜单中选取启用 root 用户。
	10. 在“密码”和“验证”字段中输入您想要使用的 root 密码，然后点按“好”

* 启用apache
	
	1. 进入终端 应用程序--实用工具--终端
	2. 输入su回车
	3. 输入root密码回车
	4. 启动apache，输入命令 `apachectl start`
	5. apache的主目录是：	`/libary/webserver/documents/`
	6. 打开浏览器输入：`http://127.0.0.1/` 可以看到输出：`it works!`

* 让apache支持php

	1. 命令行输入：`vi /etc/apache2/httpd.conf`
	2. 修改#`loadmodule php5_module libexec/apache2/libphp5.so` 为 `loadmodule php5_module libexec/apache2/libphp5.so`
	3. 命令行输入：`cp /etc/php.ini.default /etc/php.ini`
	4. 重启apache: `apachectl restart`
	5. 在`/libary/webserver/documents/`目录中创建一个新文件`index.php`来测试php是否支持输入：

		```
		<php
			phpinfo();
		?>
		```

	6. 在浏览器中输入：http://127.0.0.1/index.php 如果正确的话，可以输出php信息