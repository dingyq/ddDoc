block和weak修饰符的区别：

1. block不管是ARC还是MRC模式下都可以使用，可以修饰对象，还可以修饰基本数据类型。
2. weak只能在ARC模式下使用，也只能修饰对象（NSString），不能修饰基本数据类型（int）。
3. block对象可以在block中被重新赋值，weak不可以。

PS：`unsafe_unretained`修饰符可以被视为iOS SDK 4.3以前版本的weak的替代品，不过不会被自动置空为nil。所以尽可能不要使用这个修饰符。