一、获取系统所支持的国际化信息

在国际化之前,你可以在iphone中的`设置->通用->多语言环境->语言`中来查看你的iphone支持哪些语言,当然也可以写一段代码测试一下你的iphone都支持哪些语言.测试代码如下:

```
NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults]; 
NSArray *languages = [defaults objectForKey:@"AppleLanguages"];  
NSLog(@"%@", languages);
```
注:NSUserDefaults类用来取得用户人默认信息.

---
二、在Xcode中建立多语言文档

1. 在Resources分类下新建文档(右鍵/Add/New File…)
2. 在模板对话框中选择Other,然后再选择Strings File
3. 将文件保存名设置为Localizable.strings
4. 在Localizable.strings 文件上按右键并选择 Get Info
5. 点击信息界面的Make File Localizable,然后再将Tab标签切换到General
6. 输入新的语言名称 zh 後按 Add,有些时有English与zh两种语言,你还可以增加其它语言.

---
三、在源代码中使用NSLocalizedString来引用国际化文件

```
//括号里第一个参数是要显示的内容,与各Localizable.strings中的id对应 
//第二个是对第一个参数的注释,一般可以为空串 
[_alertView setTitle:NSLocalizedString(@"Submitted successfully",@"")];
```
---
四、使用Terminal的genstrings命令进行生成资源文件

打开Terminal,然后cd到工程所在的目录,然后使用genstrings来生成自动从源代码中生成资源文件.

例如，项目的目录为：/user/project/test01,则命令如下：


`genstrings -o English.lproj  ./classes/*.m genstrings -o zh.lproj  ./classes/*.m`

---
五、编辑各Localizable.strings文件

从第四步中得到了与代码对应的资源文件,最后我们需要对这些资源文件翻译成对应的语言就可以了.如在Localizable.strings(zh)中,把等号后的文字进行编译成中文.

`"Submitted successfully" = "提交成功"`

本文简单介绍下，如何不同的应用系统，对应于同一个应用程序来说，显示不同的名字。

例如我的这个游戏，中文是水果连连看，那么中文系统下载来显示这个名字，修改了系统之后，显示可能显示的是FruitPuzzle，如果是日本语的话，显示‘フールツパゼル’。

* 将Info.plist本地化

	在Info.plist上右键点选Get Info，在General标签下，点击Make File Localizable按钮。
	里面会有一个默认的英文版本，点击Add Localization… 按钮，
	例如我添加中文，zh-CN，和日文。
	
	那么这样，我们回到xcode中，就可以看见，Info.plist,可以展开，变成三个。 分别是English，Jananese，Zh-CN

* 创建InfoPlist.strings文件，并本地化它

	在项目目录下新建一个InfoPlist.strings文件，同样按着以上的步骤进行本地化处理。保存。

* 编辑InfoPlist.strings中的内容。

	这样InfoPlist.strings， 也是可以展开的了。也是变成三个。 分别是English，Jananese，Zh-CN。

	然后在English下面，添加一行：`CFBundleDisplayName = "FruitPuzzle"` Janpanese，对应：CFBundleDisplayName = "フールツパゼル"

	zh-CN对应：CFBundleDisplayName = "水果连连看" 
