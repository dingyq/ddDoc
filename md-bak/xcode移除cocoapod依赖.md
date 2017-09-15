## XCode移除cocoapod依赖

在项目中移除CocoaPods
如果你觉得CocoaPods让你的项目出现了问题，不好用甚至是恶心，想将其从项目中彻底移除：

1. 删除工程文件夹下的Podfile、Podfile.lock和Pods文件夹。

2. 删除xcworkspace文件。

3. 打开xcodeproj文件，删除项目中的Pods文件夹及Pods.xcconfig引用和libpods.a：

4. 打开Build Phases选项，删除Check Pods Manifest.lock和Copy Pods Resources，以及Embeded Pods Frameworks：

5. 完成，编译运行，无错通过。