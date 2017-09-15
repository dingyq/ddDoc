今天写demo的时候发现, 如果把通过相机获取到的图片，直接进行操作, 比如裁剪, 缩放, 则会把原图片向又旋转90度。

刚开始觉得莫名其妙, 不知所措。 后来百度了一下，找到了解决办法。

ps: 查找过程中, 碰到了一种说法:

```
//get original photo from iOS photos 
//如果该图片大于2M，会自动旋转90度；否则不旋转
UIImage* originalImg=[dict objectForKey:UIImagePickerControllerOriginalImage];
```

至于是否正确, 还没确定。 先Mark。

下面的解决办法亲测可行。 [原文传送门](http://www.cnblogs.com/jiangyazhou/archive/2012/03/22/2412343.html)

用相机拍摄出来的照片含有EXIF信息，UIImage的imageOrientation属性指的就是EXIF中的orientation信息。

如果我们忽略orientation信息，而直接对照片进行像素处理或者drawInRect等操作，得到的结果是翻转或者旋转90之后的样子。这是因为我们执行像素处理或者drawInRect等操作之后，imageOrientaion信息被删除了，imageOrientaion被重设为0，造成照片内容和imageOrientaion不匹配。

所以，在对照片进行处理之前，先将照片旋转到正确的方向，并且返回的imageOrientaion为0。

下面这个方法就是一个UIImage category中的方法，用它可以达到以上目的。

```
- (UIImage *)fixOrientation:(UIImage *)aImage {
  
  // No-op if the orientation is already correct
  if (aImage.imageOrientation == UIImageOrientationUp) 
    return aImage;
  
  // We need to calculate the proper transformation to make the image upright.
  // We do it in 2 steps: Rotate if Left/Right/Down, and then flip if Mirrored.
  CGAffineTransform transform = CGAffineTransformIdentity;
  
  switch (aImage.imageOrientation) {
    case UIImageOrientationDown:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, aImage.size.width, aImage.size.height);
      transform = CGAffineTransformRotate(transform, M_PI);
      break;
      
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
      transform = CGAffineTransformTranslate(transform, aImage.size.width, 0);
      transform = CGAffineTransformRotate(transform, M_PI_2);
      break;
      
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, 0, aImage.size.height);
      transform = CGAffineTransformRotate(transform, -M_PI_2);
      break;
    default:
      break;
  }
  
  switch (aImage.imageOrientation) {
    case UIImageOrientationUpMirrored:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, aImage.size.width, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
      
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, aImage.size.height, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
    default:
      break;
  }
  
  // Now we draw the underlying CGImage into a new context, applying the transform
  // calculated above.
  CGContextRef ctx = CGBitmapContextCreate(NULL, aImage.size.width, aImage.size.height,
                       CGImageGetBitsPerComponent(aImage.CGImage), 0,
                       CGImageGetColorSpace(aImage.CGImage),
                       CGImageGetBitmapInfo(aImage.CGImage));
  CGContextConcatCTM(ctx, transform);
  switch (aImage.imageOrientation) {
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      // Grr...
      CGContextDrawImage(ctx, CGRectMake(0,0,aImage.size.height,aImage.size.width), aImage.CGImage);
      break;
      
    default:
      CGContextDrawImage(ctx, CGRectMake(0,0,aImage.size.width,aImage.size.height), aImage.CGImage);
      break;
  }
  
  // And now we just create a new UIImage from the drawing context
  CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
  UIImage *img = [UIImage imageWithCGImage:cgimg];
  CGContextRelease(ctx);
  CGImageRelease(cgimg);
  return img;
}
```