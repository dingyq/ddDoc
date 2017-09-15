让我们来通过一个简单的例子介绍 Cocoa 框架中主线程和工作线程交互和同步的实现。

在该例子中，主线程将一个NSDate 对象传递到工作线程，工作线程根据接收到的对象生成一个 UIImage 对象，当工作线程完成工作之后，通知主线程将结果显示在视图中。

我们首先在XCode中建立一个基于 View 的 iPhone 应用，在 View 中添加一个用于显示结果的UIImageView 和一个 请求工作线程的 UIButton。 在 ViewController 中添加成员变量：

`NSThread *runLoopThread;`

这就是工作线程对象。
在 UIButton 的 Action 中 添加如下代码：

```
- (IBAction)onStartThreadingJob:(id)sender {
	//第一次调用时，首先创建线程
	if (!runLoopThread){
		runLoopThread = [[NSThread alloc initWithTarget:self selector:@selector(threadRunLoop) object:nil];
		[runLoopThread start];
	}
	[self startThreadingJob:[NSDate date]];
}
```

实现工作线程的代码

```
- (void)threadRunLoop {
	//为了让线程不退出而加上的无用 Port
	NSPort *dummyPort = [[NSMachPort alloc] init];
	[[NSRunLoop currentRunLoop] addPort:dummyPort forMode:NSDefaultRunLoopMode];
	//让线程进入 run loop，等待主线程的调用
	CFRunLoopRun();[[NSRunLoop currentRunLoop] removePort:dummyPort forMode:NSDefaultRunLoopMode];
	[dummyPort release];
}
```
向工作线程发送消息的代码，方法 createImageByDate 将在工作线程 runLoopThread 中被调度：

```
- (void)startThreadingJob:(NSObject *)obj {
	[self performSelector:@selector(createImageByDate:) onThread:runLoopThread withObject:obj waitUntilDone:NO];
}
```

工作线程的处理代码，

```
- (void)createImageByDate:(NSObject*)obj {
	//在 Context 中绘图
	CGFloat width = 200.0, height = 200.0f;
	UIGraphicsBeginImageContext(CGSizeMake(width, height)); CGContextRef context = UIGraphicsGetCurrentContext();
	UIGraphicsPushContext(context);
	[[UIColor blackColor] set];
	NSString *str = [obj description];
	[str drawInRect:CGRectMake(0.0, 0.0, 200.0f, 200.0f) withFont:[UIFont systemFontOfSize:16.0f] 	lineBreakMode:UILineBreakModeTailTruncation];
	UIGraphicsPopContext();
	//将绘图结果输出到 UIImage 对象
	UIImage *outputImage = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
	// 希望在主线程处理结果之后，才返回，waitUntilDone 为 YES
	[self performSelectorOnMainThread:@selector(threadingJobFinish:) withObject:outputImage waitUntilDone:YES];
}
```

在这段代码中，我们仅仅为了显示工作线程等待主线程响应才将 waitUntilDone 设为 YES，实际上在该程序的逻辑上说，我们并不需要这么做。

主线程响应工作线程的代码：

```
- (void)threadingJobFinish:(id)obj{
	imgView.image = obj;
}
```

在这个例子中，工作线程执行很快，几乎没有任何延时，如果我们在 createImageByDate 中稍稍加上一些延时并在 threadingJobFinish 中假如一行日志：比如这样：

```
- (void)createImageByDate:(NSObject*)obj {
	//在 Context 中绘图
	CGFloat width = 200.0, height = 200.0f;
	UIGraphicsBeginImageContext(CGSizeMake(width, height)); CGContextRef context = UIGraphicsGetCurrentContext(); UIGraphicsPushContext(context);
	[[UIColor blackColor] set];
	NSString *str = [obj description];
	[str drawInRect:CGRectMake(0.0, 0.0, 200.0f, 200.0f) withFont:[UIFont systemFontOfSize:16.0f] lineBreakMode:UILineBreakModeTailTruncation];
	UIGraphicsPopContext();
	//将绘图结果输出到 UIImage 对象
	UIImage *outputImage = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
	[NSThread sleepForTimeInterval:3];
	// 希望在主线程处理结果之后，才返回，waitUntilDone 为 YES
	[self performSelectorOnMainThread:@selector(threadingJobFinish:) withObject:outputImage waitUntilDone:YES];
}

- (void)threadingJobFinish:(id)obj {
	imgView.image = obj;
	NSLog(@" threading Job Finish");
}
```

运行时候，连续快速点击几次按钮，看看结果会怎样。