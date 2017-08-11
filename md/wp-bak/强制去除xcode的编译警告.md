在使用xcode进行iphone应用开发时,经常需要添加一些第三方的类库,而一些第三方的类库由于缺少维护,从而导致类库中含有各种警告和各种内存泄漏,但并不影响运行. 倘若我们需要用到第三方库,而由不想在代码分析时看到这些库的警告或内存泄漏,我需要这样做:

```
#pragma clang diagnostic push

#pragma clang diagnostic ignored "-Wincompatible-pointer-types"


//含警告的代码,如下,btn为UIButton类型的指针
UIView *view = btn;

#pragma clang diagnostic pop

“-Wincompatible-pointer-types”为警告类型

clang为编译器名,这里也可以替换为GCC

#pragma clang diagnostic ignored后面只能跟一个忽略警告类型 如果需要同时忽略多种警告,需要这样写：

#pragma clang diagnostic push

#pragma clang diagnostic ignored "-Wincompatible-pointer-types"

#pragma clang diagnostic ignored "-Wincomplete-implementation"

//含警告的代码,如下,btn为UIButton类型的指针

UIView *view = btn;

#pragma clang diagnostic pop
```

另外使用xcode的Analyze进行代码分析时,xcode会检查出程序的内存泄漏,这个不属于编译警告,我们需要添加一个宏来把这些代码忽略:

```
#ifndef __clang_analyzer__
//含内存泄漏的代码 

#endif
```

ios上的开源正则扩展类 RegexKitLite 就是一个充满各种内存泄漏的类,尽管作者已经在该类上注释说可以忽略这些内存泄漏的提示,但作为一个有代码洁癖的程序员,我还是不想看到这些内存泄漏的警告提示.

```
//已知的一些编译警告类型
-Wincompatible-pointer-types 指针类型不匹配
-Wincomplete-implementation 没有实现已声明的方法
-Wprotocol 没有实现协议的方法
-Wimplicit-function-declaration 尚未声明的函数(通常指c函数)
-Warc-performSelector-leaks 使用performSelector可能会出现泄漏(该警告在xcode4.3.1中没出现过,网上流传说4.2使用performselector:withObject: 就会得到该警告)
-Wdeprecated-declarations 使用了不推荐使用的方法(如[UILabel setFont:(UIFont*)])
-Wunused-variable 含有没有被使用的变量
```