* 修改ssh默认22端口

	`vi /etc/ssh/sshd_config`
	
	在Port 22下面加一行，以端口50000为例，Port 50000
	
	然后保存，重启ssh服务`systemctl restart sshd.service`

* 防火墙中放行新加入端口

	`firewall-cmd --permanent --add-port=50000/tcp`
	
	用该命令查询`firewall-cmd --permanent --query-port=50000/tcp`
	
	如果是yes就是添加成功，如果是no就是没成功
	
	成功后重载防火墙`firewall-cmd --reload`

* 关闭selinux

	查看selinux状态sestatus，如果是enabled就是开启状态
	
	`vi /etc/selinux/config`
	
	修改`SELINUX=disabled`
	
	然后重启vps试试用新的50000端口登录，如果登录成功再`vi /etc/ssh/sshd_config`把`Port 22`端口删除，再重启ssh服务就好了。