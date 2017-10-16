* 打电话：建议用`telprompt://`而不用`tel://`，因为前者有拨打前提示，且拨打完成后回到原先应用界面。

```
NSURL *url=[NSURL URLWithString:@"telprompt://10086"];
[[UIApplication sharedApplication]openURL:url];
```

* 跳转到appstore的应用页面去评价。

	我们发布应用后，每个应用会有一个Apple ID，根据这个Apple ID可以组成这个地址：id后面？前面的就是Apple ID。

	```
	NSURL *webUrl=[NSURL URLWithString:@"itms-apps://itunes.apple.com/cn/app/id791297521?mt=8"];
	[[UIApplication sharedApplication]openURL:webUrl];
	```