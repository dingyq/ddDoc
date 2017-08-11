本文转载自【[克里斯的小屋](http://blog.chriscabin.com/others/wordpress/1502.html)】

### 日志

以下是 mariadb 服务器挂掉时的比较关键的日志信息，从下面的日志信息中，我们可以很容易地看出由于内存不足，从而导致数据库服务器启动时崩溃。

```
InnoDB: Starting crash recovery.
InnoDB: Reading tablespace information from the .ibd files...
InnoDB: Restoring possible half-written data pages from the doublewrite
InnoDB: buffer...
160919  2:47:12  InnoDB: Waiting for the background threads to start
160919  2:47:13 Percona XtraDB (http://www.percona.com) 5.5.46-MariaDB-37.6 started; log sequence number 352718445
160919  2:47:13 [ERROR] mysqld: Out of memory (Needed 128917504 bytes)
160919  2:47:13 [Note] Plugin 'FEEDBACK' is disabled.
160919  2:47:13 [Note] Server socket created on IP: '0.0.0.0'.
160919  2:47:13 [Note] Event Scheduler: Loaded 0 events
160919  2:47:13 [Note] /usr/libexec/mysqld: ready for connections.
Version: '5.5.47-MariaDB'  socket: '/var/lib/mysql/mysql.sock'  port: 3306  MariaDB Server
160919 02:47:35 mysqld_safe Number of processes running now: 0
160919 02:47:35 mysqld_safe mysqld restarted
160919  2:47:35 [Note] /usr/libexec/mysqld (mysqld 5.5.47-MariaDB) starting as process 28614 ...
160919  2:47:35 InnoDB: The InnoDB memory heap is disabled
160919  2:47:35 InnoDB: Mutexes and rw_locks use GCC atomic builtins
160919  2:47:35 InnoDB: Compressed tables use zlib 1.2.7
160919  2:47:35 InnoDB: Using Linux native AIO
160919  2:47:35 InnoDB: Initializing buffer pool, size = 128.0M
InnoDB: mmap(137756672 bytes) failed; errno 12
160919  2:47:35 InnoDB: Completed initialization of buffer pool
160919  2:47:35 InnoDB: Fatal error: cannot allocate memory for the buffer pool
160919  2:47:35 [ERROR] Plugin 'InnoDB' init function returned error.
160919  2:47:35 [ERROR] Plugin 'InnoDB' registration as a STORAGE ENGINE failed.
160919  2:47:35 [ERROR] mysqld: Out of memory (Needed 128917504 bytes)
160919  2:47:35 [ERROR] mysqld: Out of memory (Needed 96681984 bytes)
160919  2:47:35 [ERROR] mysqld: Out of memory (Needed 72499200 bytes)
160919  2:47:35 [Note] Plugin 'FEEDBACK' is disabled.
160919  2:47:35 [ERROR] Unknown/unsupported storage engine: InnoDB
160919  2:47:35 [ERROR] Aborting
```

### 解决

在使用 free -m 查看内存信息时，发现 swap 分区大小为 0。难怪说数据库服务器无法启动呢，在内存不够用的情况下，又无法使用 swap 分区，自然崩溃了。由于 VPS 使用了 SSD，性能自然不错。下面我们给服务器系统 CentOS 7 添加 1024M 的 swap 分区，采用的方法是创建一个 swap 文件：

* 使用下面的命令创建 swapfile：

```
# 1048576 = 1024 * 1024
dd if=/dev/zero of=/swapfile bs=1024 count=1048576
```

* 使用下面的命令配置 swap 文件：

```
mkswap /swapfile
```

* 接下来，使用下面的命令立即启用 swapfile，这样就不用等到下次重启时自动启用：

```
swapon /swapfile
```

* 最后，我们在 /etc/fstab 中添加下面一行，这样可以在系统下次重启时自动生效创建的 swapfile：

```
/swapfile       swap    swap defaults   0 0
```
使用 `cat /proc/swaps` 或 `free -m` 查看 `swapfile` 的生效情况，如下所示：

```
[root@iZ94jqsx9o2Z ~]# cat /proc/swaps
Filename				Type		Size	Used	Priority
/swapfile                               file		1048572	0	-1
[root@iZ94jqsx9o2Z ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:            487         168          45           4         273         289
Swap:          1023           0        1023
```

* 在完成上面的步骤后，我们还可以在 /etc/my.cnf 配置文件中添加一些配置信息，降低 mariadb 资源需求，具体的配置请参考文末给出的链接。

### 启动
启动 mariadb 服务器：systemctl start mariadb.service。

启动完成后，再次打开网站主页，bingo，问题解决了！

### 总结

* 低配 VPS 最好还是要多增加 swap 分区大小，尤其对于使用 SSD 的 VPS 而言，swap 分区的性能也非常不错；
* 数据库服务器崩溃后，一定要记得学会分析日志。最简单的做法就是使用 tail 命令看看最近的崩溃日志，并根据崩溃信息寻找解决问题的办法；
* WordPress 程序本身比较占资源，所以运行在低配的 VPS 时，还是需要做些优化工作。具体请参考文末给出的链接。

### 参考
* [Mysql (mariadb) crashing on DO Centos7 (SOLVED)](https://discuss.erpnext.com/t/mysql-mariadb-crashing-on-do-centos7-solved/3864);

* [MySql (MariaDB) crashes on small RAM VPS, what to do](http://vedmant.com/);

* [MySQL (MariaDB) crashes frequently](http://serverfault.com/questions/564748/mysql-mariadb-crashes-frequently/686638);

* [Adding Swap Space](https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-swap-adding.html);

* [老左博客：解决WordPress占用资源过大，导致主机商暂停账户的方法](http://www.laozuo.org/975.html)。