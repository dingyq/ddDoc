swift cocoapod 引入第三方库时编译失败 

* 环境

```
pod version: 1.2.0
xcode 8.2.1
swift

```

* pod install 收到警告

```
[!] The `APP_NAME [Debug]` target overrides the `FRAMEWORK_SEARCH_PATHS` build setting defined in `Pods/Target Support Files/Pods-BasePods-APP_NAME/Pods-BasePods-APP_NAME.debug.xcconfig'. This can lead to problems with the CocoaPods installation

- Use the `$(inherited)` flag, or
- Remove the build settings from the target.

```


* 错误提示

```
ld: framework not found error in xcode 8
```

* 解决方案

Go to **Build Settings** of your target and add **$(inherited)** to **Framework Search Paths**

