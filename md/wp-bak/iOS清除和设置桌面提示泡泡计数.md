当app重新打开或切换到前台时，在app委托applicationWillEnterForeground:方法里实现

清除泡泡计数

```
- (void)applicationWillEnterForeground:(UIApplication *)application { 
	// clear badage 
	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

```
在app被激活时，设置泡泡计数

```
- (void)applicationDidBecomeActive:(UIApplication *)application { 
	NSInteger testBadgeNum = 10;
	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:testBadgeNum];
}
```