在传统的多线程开发中，我们要负责管理线程的生命周期，维护线程的同步，实现线程间的消息传递。有没有办法让程序员把更多的精力投入到真正需要用线程处理的任务本身呢？ 在掌握了掌握了工作线程、主线程之间的消息传递之后，我开始介绍一个更高级的技术：NSOperation 和 NSOperationQueue。通俗的说，NSOperation 就是一个逻辑上独立的作业。 NSOperationQueue就是作业队列，我们可以定义多个 NSOperation 的实例，并放入 NSOperationQueue 队列中，由队列利用后台线程完成对所有作业的调度执行。

NSOperation 本身是个虚类，需要我们通过定义自己具体的作业内容进行实例化。每个 NSOperation 可以非并行的或者并行的。非并行的 NSOperation 是指在一个方法内可以完成所有处理的 NSOperation，比如一个复杂的高精度数学运算，一个文件的字符串匹配操作等等。并行的 NSOperation 是指在作业内部需要通过异步操作才能完成的作业，比如一次网络通讯，查询地理位置信息等。

我们从最简单的入手，看看如何定义一个非并行的 NSOperation。每个 NSOperation 缺省就是非并发的。我们只要实行自己的
`-(void)main`方法即可。

main方法就是每个 NSOperation 需要完成的任务，由 NSOperation的另一个方法(void)start负责调用。

start是每个NSOperation的执行入口，对于非并发的 NSOperation，当start返回之后，该NSOperation就算执行完成。

当我们定义并初始化了一个 NSOperation 实例之后，只要将该对象加入 NSOperationQueue，就可以实现作业的后台执行。我们也可以直接调用start方法，这时候，作业就是在当前线程中执行。

我们来看一个简单的例子：

首先来实例化一个 NSOperation 类：

```
@interface PrintStrOperation : NSOperation {
	NSString *string;
}
- (id) initWithString:(NSString *)str;

@end

@implementation PrintStrOperation
- (id) initWithString:(NSString *)str {
	self = [super init];
	if (self)
		string = [str retain];
	return self;
}

- (void)main {
	NSLog(@"%@", string);
}

- (void)dealloc {
	[string release];
	[super dealloc];
}

@end

==主程序的实现：==

int main(int argc, char *argv[]) {
	NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
	NSOperationQueue *queue = [[NSOperationQueue alloc] init];
	PrintStrOperation *operation1 = [[PrintStrOperation alloc] initWithString:@"This is string1"];
	//将operation加入队列
	[queue addOperation:operation1];
	[operation1 release];
	PrintStrOperation *operation2 = [[PrintStrOperation alloc] initWithString:@"This is string2"];
	[queue addOperation:operation2];
	[operation2 release];
	PrintStrOperation *operation3 = [[PrintStrOperation alloc] initWithString:@"This is string3"];
	[queue addOperation:operation3];
	[operation3 release];
	//等待所有Operation完成
	[queue waitUntilAllOperationsAreFinished];
	[queue release];
	[pool release];
}
```
