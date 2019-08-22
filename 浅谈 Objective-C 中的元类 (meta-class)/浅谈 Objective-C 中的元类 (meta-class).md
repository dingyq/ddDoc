原文转自

- [浅谈 Objective-C 中的元类 (meta-class)](https://www.jianshu.com/p/79b06fabb459)
- [英文原文](https://link.jianshu.com/?t=http://www.cocoawithlove.com/2010/01/what-is-meta-class-in-objective-c.html#)

### 元类

这篇文章中，我将着眼于 OC中一个相对比较陌生的概念——元类 ( meta-class )。每个OC中的类有他自己关联的元类，但是你一般不会直接用到元类。通过检查 “class pair”（类对）的创建过程，我将解释什么是元类，以及他在OC中作为对象或者类的数据表现形式。

#### 在运行时创建一个类

接下来的代码在运行时创建了一个 NSError 的子类，并添加了一个方法：

```objective-c
Class newClass = objc_allocateClassPair([NSError class], "RuntimeErrorSubclass", 0);
class_addMethod(newClass, @selector(report), (IMP)ReportFunction, "v@:");
objc_registerClassPair(newClass);
```

添加的方法使用了一个名为 **ReportFunction**的函数来作为他的实现：

```objective-c
void ReportFunction(id self, SEL _cmd) {
    NSLog(@"This object is %p.", self);
    NSLog(@"Class is %@, and super is %@.", [self class], [self superclass]);
    
    Class currentClass = [self class];
    for (int i = 1; i < 5; i++) {
        NSLog(@"Following the isa pointer %d times gives %p", i, currentClass);
        currentClass = object_getClass(currentClass);
    }

    NSLog(@"NSObject's class is %p", [NSObject class]);
    NSLog(@"NSObject's meta class is %p", object_getClass([NSObject class]));
}
```

表面上看来非常简单。在运行时创建一个类只要三步：

1. 为"class pair"（类对）分配空间（使用 objc_allocateClassPair ）
2. 添加类中所需的方法和变量（这里使用 class_addMethod 添加了一个方法）
3. 注册这个类使其能够被使用（使用 objc_registerClassPair ）

然而，紧接着的问题是：什么是"class pair（类对）"？函数 objc_allocateClassPair 只返回一个值：类。那么这个"class pair（类对）"的另一半呢？

我确信你正在猜想另一半是不是就是元类（这篇文章的主题），但是为了解释元类是什么以及为什么你需要它，我们先要了解下OC中对象和类的一些背景知识。

#### 一个数据结构需要什么才能成为一个对象？

每个对象都有一个类。这是面向对象概念的基本原则，但是在OC中，这也是数据的一个基础部分。任何数据结构在正确的位置都有一个指向类的指针，使其能够被视作对象。

在OC中，一个对象的类由他的isa指针来决定。isa指针指向对象的类。
实际上，OC中一个对象的基本定义看起来是这样的：

```objective-c
typedef struct objc_object {
    Class isa;      
} *id;
```

** 注意，现在isa的类型变成了 isa_t 类型而不是 Class类型**

这说明：任何以一个指向 Class 结构体的指针开始的结构体都可以视为一个 objc_object。

OC中对象的最重要的特性是你能发消息给他们：

```objective-c
[@"stringValue" writeToFile:@"/file.txt" atomically:YES encoding:NSUTF8StringEncoding error:NULL];
```

这段代码能够工作的原因是因为当你发送一个消息给OC的对象时（就像这里的 NSCFString），运行时会根据对象的isa指针获取到对象的类（这里是 NSCFString 类）。类包含了一串方法能够被这个类的所有实例对象使用，并且有一个 superclass的指针来查找继承链中的方法。运行时在类和父类的方法列表中查找能够匹配这个消息的 selector（在上面的例子中，是在 NSString 类中的 writeToFile:atomically:encoding:error 方法）。然后运行时唤起这个方法的实现(IMP)。

重点是**你能够将类定义的消息发送给一个实例对象。**

#### 什么是元类？

现在，正如你可能已经知道的，OC中的类也是一个对象。这意味着你能够发送消息给类。

```objective-c
NSStringEncoding defaultStringEncoding = [NSString defaultStringEncoding];
```

这个例子中，**defaultStringEncoding**是发送给**NSString**类的。
这行代码能够工作的原因是因为每个OC中的类本身就是自己的对象。这意味类的结构必须以一个isa指针开始，以便和 objc_object 结构二进制兼容。我在上面展示的结构体中的下一个字段必须是一个指向 superclass 的指针（基类指向的是 nil）。

有几种不同的方式来定义一个类，这依赖你正在运行的运行时的版本。但有一点不会变：他们都有一个 isa 字段开始，紧接着是一个 superclass 字段。

```objective-c
typedef struct objc_class *Class;
struct objc_class {
    Class isa;
    Class super_class;
    /* followed by runtime specific details... */
};
```

然而，为了让我们对一个类调用方法（使用类方法），类的isa指针必须指向一个类结构，并且这个类结构必须包含一个方法列表使我们能够对类使用。

这就引导出元类的定义： 元类是一个类对象的类。

简而言之：
当你向一个对象发送一条消息的时候，运行时会在对象的类的方法列表中查找这条消息是否存在。
当你向一个类发送一条消息的时候，运行时会在类的元类的方法列表中查找这条消息是否存在。

元类的存在是必需的，因为他存储了一个类的所有类方法。每个类的元类都是独一无二的，因为每个类都有一系列独特的类方法。

#### 什么是元类的类

元类，和类一样，也是一个对象。这表示你能够对元类调用方法。自然的，这表示他必须也有一个类指针。

所有元类使用基类的元类（即继承链顶端的类的元类）作为他们的类，而所有类的基类都是 NSObject（大多数类是这样的），所以大多数元类使用 NSObject 的元类作为他的类。

根据规则所有元类使用基类的元类作为他们的类，那么基类的元类就是他自己的类（他们的isa指针指向了自己）。这表明NSObject的元类的指针指向的是他自己（他是一个他自己的实例）。

#### 继承类和元类

同样的，类使用 super_class 指针指向他们的 superclass，元类也有 super_class 指针来指向 superclass。
这里又有一个奇怪的地方，基类的元类设置的 superclass 是基类自己。
这种继承结构导致的结果是所有结构中的实例、类以及元类都继承自结构中的基类。

所有实例、类和元类都在 NSObject 的层级下，这表明所有 NSObject 的实例方法都能够被使用，同样的，对类以及元类来说，所有 NSObject 的类方法也是有效的。

所有这些用文字描述起来可能比较容易让人困惑。[Greg Parker的文章](https://link.jianshu.com/?t=http://www.sealiesoftware.com/blog/archive/2009/04/14/objc_explain_Classes_and_metaclasses.html)中有一张附图描述了实例、类和元类以及他们的super class是如何完美的共存的。（这张图大家应该都很熟悉了）



![](objc-isa_&_superclass.jpeg)


#### 实验论证

为了确认上述结论，让我们来看下文章开头中 ReportFunction 函数的输出。这个函数的目的是沿着isa指针查找并打印日志。

执行 ReportFunction 之前，我们需要使用我们动态创建的类来创建一个实例，并对他调用 report 的方法。

```objective-c
id instanceOfNewClass = [[newClass alloc] initWithDomain:@"someDomain" code:0 userInfo:nil];
[instanceOfNewClass performSelector:@selector(report)];
[instanceOfNewClass release];
```

因为这里没有 **report**方法的声明，我使用 **performSelector:**来调用他，所以编译器不会给出警告。

**ReportFunciton**现在将会遍历 isa 指针，然后告诉我们对象所使用的类、元类以及元类的类。

> 获取一个对象的类：**ReportFunction**使用 **object_getClass**来跟踪 isa 指针，因为 isa 指针是类结构中被保护的成员（你不能直接访问对象的 isa 指针）。**ReportFunction**没有使用一个类方法来做这些，是因为对一个类对象调用类方法不会返回元类，取而代之的是又返回了这个类（所以 [NSString class] 将返回 NSString 的类而不是 NSString 元类）。

运行后输出如下：

> This object is 0x10010c810.
> Class is RuntimeErrorSubclass, and super is NSError.
> Following the isa pointer 1 times gives 0x10010c600
> Following the isa pointer 2 times gives 0x10010c630
> Following the isa pointer 3 times gives 0x7fff71038480
> Following the isa pointer 4 times gives 0x7fff71038480
> NSObject's class is 0x7fff710384a8
> NSObject's meta class is 0x7fff71038480

看一下isa所指向的地址的值：

- instanceOfNewClass实例对象的地址： 0x10010c810
- instanceOfNewClass 的类的地址： 0x10010c600
- RuntimeErrorSubclass 的元类的地址： 0x10010c630
- RuntimeErrorSubclass 的元类的类的地址： 0x7fff71038480 (即NSObject的元类地址)
- NSObject 元类的类就是 NSObject 的元类（地址相同）。

地址的值并不是主要的，但是他体现了之前我们所描述的从类到元类，再到NSObject元类的整个进度。

### 总结

- 元类是一个类对象的类。每一个类有他自己独一无二的元类（因为每个类能够有自己独一无二的方法列表）。这就意味着类对象的类并不是和他们一样的类。
- 元类能确保类对象有所有底层类的实例和类方法，中间加上所有自己的类方法。所有类继承自NSObject，这意味着NSObject所有的实例和协议方法为所有类（和元类）对象都定义了。
- 所有元类使用基类的元类（NSObject 元类）来作为他们的类，包括只在运行时自定义的类的元类。