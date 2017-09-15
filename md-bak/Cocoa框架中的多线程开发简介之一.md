Mac OS X 和 iOS 中都支持 Posix pthread 技术，同时Cocoa框架中对Posix pthread进行了封装，形成了自成体系的 NSThread 类。NSThread 不仅仅是封装了 pthread 中对线程的创建、运行等功能，更将线程同步，线程间消息和数据的传递进行了封装。这个熟悉 pthread 的程序员带来全新的开发体验。本文着重介绍 NSThread 类中线程同步和数据传递的方法和技巧。

* **创建新线程，同时传递数据的方法，初始化一个NSThread对象：**

```
-(id)initWithTarget:(id)target selector:(SEL)selector object:(id)argument
```

就是将 target 对象的方法 selector 作为线程入口初始化一个线程，方法 selector 可以是类方法也可以是实例方法，并且需要接收参数 argument 。 target 和 argument 将被 retain，并在线程退出时release。argument 参数就可以作为传递给线程的数据使用。
当用该方法将线程初始化之后，线程并不会立刻执行，需要调用以下方法触发线程的运行：

```
-(void)start
```

* **运行新线程的类方法**

```
-(void)detachNewThreadSelector:(SEL)aSelector toTarget:(id)aTarget withObject:(id)anArgument
```

该方法的各参数意义和 `initWithTarget:selector:object:` 完全一样，返回值也是NSThread对象，所不同的是该方法不仅创建线程，同时立刻调度线程的执行。不需要调用start方法。

* **向已运行线程传递数据的方法**

在很多情况下，我们同样有向已经运行的线程传递数据的需求：例如，向空闲的工作线程分派指令，工作线程将处理结果返回给主线程，以及普通意义上的线程同步。对于熟悉线程间同步的Unix程序员（比如我）一定会想到信号灯、互斥甚至共享内存等等。但在 Cocoa 框架下，通过给线程发送消息就能实现简单的数据传递和线程同步。如果需要高级的线程同步，还可以通过 NSCondition 实现。

```
-(void)performSelector:(SEL)aSelector onThread:(NSThread *)thr withObject:(id)argwaitUntilDone:(BOOL)wait
```

该方法将 aSelector 使用缺省的 run loop 模式放入 线程 thr 的 run loop 队列，并传递参数 arg，当参数 wait为YES时候，该调用将等待线程执行 aSelector 返回（注意：不是指线程结束）后返回；为NO时，则立即返回。
通过 arg 我们可以指定传递给线程 thr 的数据，同时当 wait 为 YES 时，不仅指定了调用 performSelector:onThread:withObject:waitUntilDone: 的线程和 thr 的同步执行，同时 arg 可以用于传递 thr 到调用线程的执行结果。
如果希望指定特定的 run loop 模式，可以使用如下调用：

```
-(void) performSelector:withObject:waitUntilDone:wait modes:
```


在实际使用中，我们常常在主线程当中通过上述两个方法将处理请求发送到事先创建好的工作线程，容过指定参数 wait 为 NO 让主线程立即继续执行，而不等待工作线程处理结束。当工作线程处理结束之后可以通过其它手段通知主线程。

* **通知主线程的方法**

```
-(void)performSelectorOnMainThread:(SEL)aSelector withObject:(id)arg waitUntilDone:(BOOL)wait
```
该方法将 aSelector 方法放入主线程的 run loop 队列。aSelector 需要由发送`performSelectorOnMainThread:withObject:waitUntilDone:` 的类实现。
在多线程应用中，可以在工作线程完成某个操作之后通过该方法将处理结果 arg 通知到主线程 NSApplication Delegate 对象。通常，我们希望主线程能够接收处理的结果或者工作线程和主线程之间同步，则可以指定 wait 为 YES。
线程结束时的通知

当某个线程接收到 exit 消息而结束时，将发送 NSThreadWillExitNotification 通知。