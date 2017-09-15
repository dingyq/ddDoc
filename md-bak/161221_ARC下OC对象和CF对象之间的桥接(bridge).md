在开发iOS应用程序时我们有时会用到Core Foundation对象简称CF，例如Core Graphics、Core Text，并且我们可能需要将CF对象和OC对象进行互相转化，我们知道，ARC环境下编译器不会自动管理CF对象的内存，所以当我们创建了一个CF对象以后就需要我们使用CFRelease将其手动释放，那么CF和OC相互转化的时候该如何管理内存呢？答案就是我们在需要时可以使用```__bridge```,```__bridge_transfer```,```__bridge_retained```，具体介绍和用法如下

1.	```__bridge```:CF和OC对象转化时只涉及对象类型不涉及对象所有权的转化；

	```
	NSURL *url = [[NSURL alloc] initWithString:@"http://www.baidu.com"];
	CFURLRef ref = (CFURLRef)url;
	```
	上面的这段代码在ARC环境下系统会给出错误提示和错误修正，修正后如下：

	```
	NSURL *url = [[NSURL alloc] initWithString:@"http://www.baidu.com"];
	CFURLRef ref = (__bridge CFURLRef)url;
	```
	系统为我们自动添加了__bridge,因为是OC创建的对象并且在转换时没有涉及对象所有权的转换，所以上面的代码不需要加CFRelease

2. ```__bridge_transfer```:常用在讲CF对象转换成OC对象时，将CF对象的所有权交给OC对象，此时ARC就能自动管理该内存；（作用同CFBridgingRelease()）

3. ```__bridge_retained```:（与__bridge_transfer相反）常用在将OC对象转换成CF对象时，将OC对象的所有权交给CF对象来管理；(作用同CFBridgingRetain())

	```
	NSURL *url = [[NSURL alloc] initWithString:@"http://www.baidu.com"];
	CFURLRef ref = (__bridge_retained CFURLRef)url;
	CFRelease(ref);
	```
	当使用_bridge_retained标识符以后，代表OC要将对象所有权交给CF对象自己来管理,所以我们要在ref使用完成以后用CFRelease将其手动释放.

	```
	CFStringRef cfString= CFURLCreateStringByAddingPercentEscapes(NULL, (__bridge CFStringRef)text, NULL, CFSTR("!*’();:@&=+$,/?%#[]"), CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding));
	NSString *ocString = (__bridge_transfer CFStringRef)cfString;
	```
此时OC即获得了对象的所有权，ARC负责自动释放该对象，如果我们在结尾加上CFRelease(cfString)纯属画蛇添足，虽不会崩溃，但是控制台会打印出该对象被free了两次。
