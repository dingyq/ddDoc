在AFSecurityPolicy.m这个类中,第30行,会报这样三个错误

1. Use of undeclared identifier 'kSecFormatUnknown'

2. Use of undeclared identifier 'kSecItemPemArmour'

3. Implicit declaration of function 'SecItemExport' is invalid in C99
解决办法：
在项目pch文件中写入如下代码：

```

#ifndef TARGET_OS_IOS

#define TARGET_OS_IOS TARGET_OS_IPHONE

#endif

#ifndef TARGET_OS_WATCH

#define TARGET_OS_WATCH 0

#endif
```