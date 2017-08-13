向svn上传a文件或其他默认不识别的文件


彩票项目中，使用了一些公司的静态库，其中一个库是以a文件的方式来提供二进制内容的。默认情况下，svn是不会对这种文件进行版本控制的，即使在工具中选择添加也没有用。

---
下边来看看在mac和windows下分别如何做可以去掉这个限制。

* mac-命令行添加

由于mac在10.6之后已经自带了svn工具，因此可以在命令行下使用svn命令来进行对a文件的添加。

[mac下SVN上传.a静态库文件](http://yul100887.blog.163.com/blog/static/20033613520121117105938991/)给出了具体步骤：

1. 打开终端，cd 进入到需要上传的.a文件所在的文件夹。 确保 ls能看到.a文件
2. 然后使用命令，如：svn add libzbar.a
	
使用完成后出现 A (bin) libzbar.a ，既表示已经添加，随后可以用工具上传。

---
* mac-修改配置文件

还可以通过修改svn的配置文件来做到让svn对a进行版本控制，这样对于多个a文件比较方便。

[xcode-svn配置(解决某些文件禁止上传或可以上传问题)](http://mmz06.blog.163.com/blog/static/121416962011426105557403/)给出了步骤：

1. 打开终端，输入：open ~/.subversion/config
2. 找到 global-ignores 一行，去掉注释，修改为：

```
global-ignores = *~.nib *.so *.pbxuser *.mode *.perspective* *.o *.lo *.la #*# .*.rej *.rej .*~ *~ .#* .DS_Store
```

这里主要是把原来global-ignores中带有*.a的字样给去掉，这样就解除了a文件的限制。当然这里还有其他的过滤列表，可以根据需要去除。

[xcode-svn配置(解决某些文件禁止上传或可以上传问题)](http://mmz06.blog.163.com/blog/static/121416962011426105557403/)中本来还有第三个步骤，不过是针对XCode的svn集成。对于其他svn工具，就没需要第三步了。

---
* windows-修改配置文件

在windows下，默认的cmd中没有svn可以直接手动添加，因此也只能修改配置文件了。

安装了svn工具后，右键菜单中选中svn的菜单，setting来到general的配置项，右侧有Global ignore pattern的栏目。可以里
边找到并去掉.a的pattern。如果不能直接修改，则可以点击Edit按钮，对它进行编辑。方法和0x02中介绍的是一致的。

[SVN过滤文件设置](http://blog.csdn.net/chb2000/article/details/5677947)中介绍了windows环境下的修改方法，同时还包括了linux环境下的修改方法。