redmine数据迁移

* 备份： 

	* 到`C:\Bitnami\redmine-2.5.2-2`下双击`useredmine.bat`
	* `mysqldump -u bitnami -p bitnamiredmine > backup.sql;`

* 恢复： 
	* 到`C:\Bitnami\redmine-2.5.2-2`下双击`useredmine.bat`
	* `mysql -u bitnami -p bitnamiredmine < backup.sql;`

mysql数据库密码透明查看：

`C:\Bitnami\redmine-2.5.2-2\apps\redmine\htdocs\config\database.yml`