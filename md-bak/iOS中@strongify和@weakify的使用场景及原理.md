主要是在block中使用

因为block一般都在对象内部声明.. 如果在block内部使用了当前对象的属性,就会造成循环引用(block拥有当前对象的地址,而当前对象拥有block的地址),而引起内存泄露,block和当前对象都无法释放.

`@weakify` 将当前对象声明为weak.. 这样block内部引用当前对象,就不会造成引用计数+1可以破解循环引用

`@strongify` 相当于声明一个局部的strong对象,等于当前对象.可以保证block调用的时候,内部的对象不会释放

大概相当于

``` objective-c
__weak __typeof(self)weakSelf = self; 
block = ^(){ 
	// strongSelf.property 
	__strong __typeof(weakSelf)strongSelf = weakSelf; 
};
```