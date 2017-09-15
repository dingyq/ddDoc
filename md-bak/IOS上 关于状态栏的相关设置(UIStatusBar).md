IOS上 关于状态栏的相关设置(UIStatusBar)

**知识普及**

ios上状态栏 就是指的最上面的20像素高的部分

状态栏分前后两部分，要分清这两个概念，后面会用到：

前景部分：就是指的显示电池、时间等部分；

背景部分：就是显示黑色或者图片的背景部分；

如下图：前景部分为白色，背景部分为黑色

注意：这里只涉及到ios7以及更高版本，低版本下面的讲解可能无效。

设置statusBar的【前景部分】

简单来说，就是设置显示电池电量、时间、网络部分标示的颜色，

这里只能设置两种颜色：

默认的黑色`（UIStatusBarStyleDefault）`

白色`（UIStatusBarStyleLightContent）`

可以设置的地方有两个：plist设置里面 和 程序代码里

1. plist设置statusBar
	
	在plist里增加一行 UIStatusBarStyle(或者是“Status bar style”也可以)，这里可以设置两个值，就是上面提到那两个
`UIStatusBarStyleDefault` 和 `UIStatusBarStyleLightContent`

	这样在app启动的launch页显示的时候，statusBar的样式就是上面plist设置的风格。
2. 程序代码里设置statusBar

	`[[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];`
	或者
	
	```
	//相对于上面的接口，这个接口可以动画的改变statusBar的前景色
	[[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:YES];
	```

不仅如此，ios还很贴心的在UIViewController也增加了几个接口，

目的是让状态栏根据当前显示的UIViewController来定制statusBar的前景部分。

```
- (UIStatusBarStyle)preferredStatusBarStyle;
- (UIViewController *)childViewControllerForStatusBarStyle;
- (void)setNeedsStatusBarAppearanceUpdate
- (UIStatusBarStyle)preferredStatusBarStyle:
```

在你自己的`UIViewController`里重写此方法，返回你需要的值`(UIStatusBarStyleDefault 或者 UIStatusBarStyleLightContent)；`

**注意：**

这里如果你只是简单的return一个固定的值，那么该UIViewController显示的时候，程序就会马上调用该方法，来改变statusBar的前景部分；

如果在该UIViewController已经在显示在当前，你可能还要在当前页面不时的更改statusBar的前景色，那么，你首先需要调用下
面的`setNeedsStatusBarAppearanceUpdate`方法(这个方法会通知系统去调用当前UIViewController的preferredStatusBarStyle方法)， 这个和UIView的setNeedsDisplay原理差不多(调用UIView对象的setNeedsDisplay方法后，系统会在下次页面刷新时，调用重绘该view，系统最快能1秒刷新60次页面，具体要看程序设置)。

```
- (UIViewController *)childViewControllerForStatusBarStyle:
```

这个接口也很重要，默认返回值为nil。当我们调用`setNeedsStatusBarAppearanceUpdate`时，系统会调用`application.window`的`rootViewController`的`preferredStatusBarStyle`方法，我们的程序里一般都是用`UINavigationController`做root，如果是这种情况，那我们自己的UIViewController里的preferredStatusBarStyle根本不会被调用；

这种情况下childViewControllerForStatusBarStyle就派上用场了，

我们要子类化一个UINavigationController，在这个子类里面重写childViewControllerForStatusBarStyle方法，如下：

```
- (UIViewController *)childViewControllerForStatusBarStyle{
	return self.topViewController;
}
```

上面代码的意思就是说，不要调用我自己(就是UINavigationController)的preferredStatusBarStyle方法，而是去调用`navigationController.topViewController`的`preferredStatusBarStyle`方法，这样写的话，就能保证当前显示的`UIViewController`的`preferredStatusBarStyle`方法能影响statusBar的前景部分。

另外，有时我们的当前显示的UIViewController可能有多个`childViewController`，重写当前UIViewController的`childViewControllerForStatusBarStyle`方法，让`childViewController`的`preferredStatusBarStyle`生效(当前`UIViewController`的`preferredStatusBarStyle`就不会被调用了)。

简单来说，只要`UIViewController`重写的的`childViewControllerForStatusBarStyle`方法返回值不是nil，那么，`UIViewController`的`preferredStatusBarStyle`方法就不会被系统调用，系统会调用`childViewControllerForStatusBarStyle`方法返回的`UIViewController`的`preferredStatusBarStyle`方法。
`- (void)setNeedsStatusBarAppearanceUpdate:`
让系统去调用`application.window`的`rootViewController`的`preferredStatusBarStyle`方法,如果`rootViewController`的`childViewControllerForStatusBarStyle`返回值不为nil，则参考上面的讲解。

设置statusBar的【背景部分】

背景部分，简单来说，就是背景色；改变方法有两种：

系统提供的方法

`navigationBar`的`setBarTintColor`接口，用此接口可改变`statusBar`的背景色

**注意：**一旦你设置了`navigationBar`的`- (void)setBackgroundImage:(UIImage *)backgroundImage forBarMetrics:(UIBarMetrics)barMetrics`接口，那么上面的`setBarTintColor`接口就不能改变`statusBar`的背景色，`statusBar`的背景色就会变成纯黑色。

另辟蹊径

创建一个`UIView`，

设置该`UIView`的`frame.size` 和`statusBar`大小一样，

设置该`UIView`的`frame.origin` 为`{0,-20}`,

设置该`UIView`的背景色为你希望的`statusBar`的颜色，

在`navigationBar`上`addSubView`该`UIView`即可。

refer:

Information Property List Key Reference: iOS Keys

iOS7中容易被忽视的新特性 - CocoaChina 苹果开发中文站

[原文链接](http://my.oschina.net/shede333/blog/304560)