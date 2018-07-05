## 背景： 

> 原生App支持换肤功能，产品要求RN页面也需要支持换肤

## 实现思路

### 1. 原生实现思路

本地维护多个资源buddle，颜色分皮肤存在不同的plist配置文件中，切换皮肤时读取对应的皮肤资源bundle。

### 2. 通过桥接从原生那边获取对应的色值和图片

- 色值

首先原生写好了一个桥接方法，传入不同的key去色值表中查找对应的16进制色值，返回给rn。rn页面在`render()`函数之前，调用该桥接获取色值，并且通过state保存该色值。之后在`render()`函数渲染的时候设置到对应的节点上就行了。好吧。是可以。后来又发现了个问题。RN中原生和JS桥接是异步执行，那么就不能保证在`render()`函数执行之前获取到的是真正的色值。很尴尬。这种方式好像行不通。换个思路。

- 图片

其实RN加载图片，是通过RCTImageLoader这个类。通过断点发现主要调用下面的那个方法。
	
```
-(RCTImageLoaderCancellationBlock)_loadImageOrDataWithURLRequest:(NSURLRequest *)request
                                                             size:(CGSize)size
                                                            scale:(CGFloat)scale
                                                       resizeMode:(RCTResizeMode)resizeMode
                                                    progressBlock:(RCTImageLoaderProgressBlock)progressHandler
                                                 partialLoadBlock:(RCTImageLoaderPartialLoadBlock)partialLoadHandler
                                                  completionBlock:(void (^)(NSError *error, id imageOrData, BOOL cacheResult, NSString *fetchDate))completionBlock {
}
```


主要的一个参数就是request。如果是网络图片就是正常的http:// 协议的链接。如果是本地图片，不管是项目image.xcassets里的图片还是mainBundle里的图片，又或者是沙盒里的图片，都会是一个file://协议的图片本地地址。
	
**RN项目中直接指定bundle+imageName即可。**
	
```
<Image source={{uri: 'white_skin.bundle/skin_quote_icon_add_nncircle.png'}}/>
```

### 3. 解决色值问题

RN那部分不仅支持16进制的色值，而且还支持字符串类型的色值，例如设置'red'，RN最终会设置成真正的色值。RN是不是通过这个字符串key，去它自己的色值表去查找对应色值的呢？那么就要找到将‘red’解析成真正色值的方法。

- 原生部分

找了半天，发现了RCTConvert中有个方法是用来转换颜色的。断点发现RN中的设置颜色最终都会来到该方法里转换成UIColor的对象。
	
```
+ (UIColor *)UIColor:(id)json
{
  if (!json) {
    return nil;
  }
    
    if ([json isKindOfClass:[NSString class]]) {
        // Mark: 去皮肤包查找色值
        UIColor *color = [[FTSkinsManager sharedInstance] getStateColorWithValue:json];
        if (!color) {
            return [UIColor whiteColor];
        }
        return color;
    }
    
  if ([json isKindOfClass:[NSArray class]]) {
    NSArray *components = [self NSNumberArray:json];
    CGFloat alpha = components.count > 3 ? [self CGFloat:components[3]] : 1.0;
    return [UIColor colorWithRed:[self CGFloat:components[0]]
                           green:[self CGFloat:components[1]]
                            blue:[self CGFloat:components[2]]
                           alpha:alpha];
  } else if ([json isKindOfClass:[NSNumber class]]) {
    NSUInteger argb = [self NSUInteger:json];
    CGFloat a = ((argb >> 24) & 0xFF) / 255.0;
    CGFloat r = ((argb >> 16) & 0xFF) / 255.0;
    CGFloat g = ((argb >> 8) & 0xFF) / 255.0;
    CGFloat b = (argb & 0xFF) / 255.0;
    return [UIColor colorWithRed:r green:g blue:b alpha:a];
  } else {
    RCTLogConvertError(json, @"a UIColor. Did you forget to call processColor() on the JS side?");
    return nil;
  }
}
```

该方法里只支持从RN那边传递过来的NSArray类型和NSNumber类型的。也不支持NSString类型的啊。所以RN中通过'red'这种字符串设置颜色的解析并不是在原生这部分。所以在原生部分支持字符串类型。通过该字符串key去对应皮肤包的色值表中去查找真正的色值。

- RN部分

发现`node_modules/react-native/Libraries/StyleSheet/processColor.js`该文件中`processColor()`函数是用来解析色值的。
	
```
const Platform = require('Platform');

const normalizeColor = require('normalizeColor');

/* eslint no-bitwise: 0 */
function processColor(color?: string | number): ?number {

  if (color === undefined || color === null) {
    return color;
  }

  let int32Color = normalizeColor(color);
  if (int32Color === null || int32Color === undefined) {
    return undefined;
  }

  if(typeof int32Color === 'string') {
    return int32Color;
  }
  // Converts 0xrrggbbaa into 0xaarrggbb
  int32Color = (int32Color << 24 | int32Color >>> 8) >>> 0;

  if (Platform.OS === 'android') {
    // Android use 32 bit *signed* integer to represent the color
    // We utilize the fact that bitwise operations in JS also operates on
    // signed 32 bit integers, so that we can use those to convert from
    // *unsigned* to *signed* 32bit int that way.
    int32Color = int32Color | 0x0;
  }
  return int32Color;
}
```

在该方法中，RN会去查找类似'red'这样的色值，并且返回为一个32位int类型。如果没找到对应色值，它会强转为一个0x0的色值。所以我们在它查找完之后，强转之前，如果没找到，直接将字符串类型的变量返回出去，这样原生也就能接受到一个字符串类型的key了。

`node_modules/react-native/Libraries/StyleSheet/processColor.js`也需要做对应的更改，使其支持原生调色板配置文件中的颜色key值，以免误伤。

```
function normalizeColor(color: string | number): ?number {
  var match;

  if (typeof color === 'number') {
    if (color >>> 0 === color && color >= 0 && color <= 0xffffffff) {
      return color;
    }
    return null;
  }

  // Ordered based on occurrences on Facebook codebase

  if ((match = matchers.pub.exec(color))) {
    return color;
  }

  if ((match = matchers.skin.exec(color))) {
    return color;
  }

  if ((match = matchers.style.exec(color))) {
    return color;
  }

  if ((match = matchers.ck.exec(color))) {
    return color;
  }

  if ((match = matchers.hex6.exec(color))) {
    return parseInt(match[1] + 'ff', 16) >>> 0;
  }

...
...
}

```

```

var matchers = {
  rgb: new RegExp('rgb' + call(NUMBER, NUMBER, NUMBER)),
  rgba: new RegExp('rgba' + call(NUMBER, NUMBER, NUMBER, NUMBER)),
  hsl: new RegExp('hsl' + call(NUMBER, PERCENTAGE, PERCENTAGE)),
  hsla: new RegExp('hsla' + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER)),
  hex3: /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex4: /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#([0-9a-fA-F]{6})$/,
  hex8: /^#([0-9a-fA-F]{8})$/,
  pub: /^pub_/,
  skin: /^skin_/,
  style: /^style_/,
  ck: /^ck_/,
};
```

## 总结

以上换肤解决思路仅在iOS下验证Ok，Android支持方式还有待确认