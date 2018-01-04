使用Node.js 本地插件构建工具[node-gyp](https://github.com/nodejs/node-gyp) 来实现C++扩展开发

### 安装

`$ npm install -g node-gyp`

其他环境配置请参考GitHub上的[README](https://github.com/nodejs/node-gyp)

### 使用

项目根目录下创建`binding.gyp`文件，类JSON格式写入文件配置，如下：

```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "src/binding.cc" ]
    }
  ]
}

```
然后根目录下运行以下命令

`node-gyp configure`

`node-gyp build`

之后便会在项目根目录下`build/Release`下生成对应target


### 举例

根目录下创建`hello.cc`文件：

```
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "hello world"));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}
```

`binding.gyp`文件：

```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "./srccc/hello.cc" ]
    }
  ]
}
```

运行命令：

`node-gyp configure`

`node-gyp build`

JS使用如下方式调用便可输出`hello world`

```
var addon = require('../../../build/Release/addon')
console.log(addon.hello())
```

---

## 坑

调用`addon`模块式，可能会报错

```
addon.node was compiled against a different Node.js version using 
NODE_MODULE_VERSION 59. This version of Node.js requires NODE_MODULE_VERSION 57. 
Please try re-compiling or re-installing the module (for instance, using npm 
rebuild or npm install
```

尝试过N多种解决方案未果后，不得不重新安装node，由于之前未采用nvm方式安装管理node版本，所以十分被动，最后不得不卸载原有node后，安装nvm，然后再使用nvm安装node，完美解决问题。

[Node.js各版本对应的`NODE_MODULE_VERSION`](https://nodejs.org/zh-cn/download/releases/)

### nvm

#### 安装

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash`

#### 配置

`~/.bash_profile`文件最后追加输入：

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```
这一步的作用是每次新打开一个bash，nvm都会被自动添加到环境变量中了。

#### 使用

- nvm常用命令
	- nvm install <version> ## 安装指定版本，可模糊安装，如：安装v4.4.0，既可nvm install v4.4.0，又可nvm install 4.4
	- nvm uninstall <version> ## 删除已安装的指定版本，语法与install类似
	- nvm use <version> ## 切换使用指定的版本node
	- nvm ls ## 列出所有安装的版本
	- nvm ls-remote ## 列出所以远程服务器的版本（官方node version list）
	- nvm current ## 显示当前的版本
	- nvm alias <name> <version> ## 给不同的版本号添加别名
	- nvm unalias <name> ## 删除已定义的别名
	- nvm reinstall-packages <version> ## 在当前版本node环境下，重新全局安装指定版本号的npm包

- 举例

	- 查看已安装Node.js

		`nvm ls`

	- 安装v8.0.0版本Node.js

		`nvm install v8.0.0`
		
	- 切换Node版本

		`nvm use v8.0.0`
		
	- 设定默认Node版本

		`nvm alias default v8.0.0`
	
--- 
	
## 参考

- [node-gyp GitHub](https://github.com/nodejs/node-gyp)

- [Node.js C++ addon编写实战](http://deadhorse.me/nodejs/2012/10/08/c_addon_in_nodejs_node_gyp.html)