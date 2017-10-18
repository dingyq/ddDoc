实现Cocoa框架TableView的数据导出，支持Excel查看。

---

### csv VS xls

- xls文件就是Microsoft excel电子表格的专用文件格式

- csv是最通用的一种文件格式，它可以非常容易地被导入各种PC表格及数据库中。 此文件，一行即为数据表的一行。生成数据表字段可用半角`,`、`;`或`\t`隔开。

- csv是文本文件，用记事本就能打开，xls是二进制的文件只有用Excel才能打开

- csv (*.csv) 文件格式只能保存活动工作表中的单元格所显示的文本和数值。工作表中所有的数据行和字符都将保存。数据列以逗号分隔，每一行数据都以回车符结束。如果单元格中包含逗号，则该单元格中的内容以双引号引起。

- 如果单元格显示的是公式而不是数值，该公式将转换为文本方式。所有格式、图形、对象和工作表的其他内容将全部丢失。欧元符号将转换为问号

- csv即comma separate values，这种文件格式经常用来作为不同程序之间的数据交互的格式。
通过使用 Excel 中“文件”菜单上的“另存为”命令，可将 Microsoft Excel 文件转换成csv文件格式

- csv文件是以逗号为分隔符号，将各字段列分离出的一种ASCII文件

- csv是最通用的一种文件格式，它可以非常容易地被导入各种PC表格及数据库中，而xls则是Excel专用格式。csv文件一行即为数据表的一行，生成数据表字段用半角逗号隔开。

- csv是逗号分割的文本文件，可以用文本编辑器和电子表格如excel等打开

---

### TableView导出csv文件

以下代码以`NSTableView`为例讲解导出csv格式文件，iOS的实现方式类似

- 首先获取到tableview的行列信息，按照约定的格式生成字符串
	- 为了保证在pc上也能用Excel正常打开，kNewLineMark为`\r\n`
	- 这里分隔符kSplitChar使用`\t`，也可以尝试用`,`或`;`，但实际开发中Excel没能按照预期中的格式打开

```objective-c
+ (NSString *)generateCsvForTableView:(NSTableView *)tableView {
    NSArray *columns = tableView.tableColumns;
    NSMutableArray<NSString *> *columnValues = [NSMutableArray array];
    for (NSTableColumn *col in columns) {
        if (col.title) {
            [columnValues addObject:col.title];
        }
    }
    
    NSMutableArray<NSString *> *rowValues = [NSMutableArray array];
    NSInteger rowCount = tableView.numberOfRows;
    for (int i = 0; i < rowCount; i++) {
        NSMutableString *str = [NSMutableString string];
        for (NSTableColumn *col in columns) {
            id cell = [tableView.dataSource tableView:tableView objectValueForTableColumn:col row:i];
            [str appendFormat:@"\"%@\"%@", [(cell != nil ? [cell description] : @"") stringByReplacingOccurrencesOfString:@"\"" withString:@"\"\""], kSplitChar];
            if (col == columns.lastObject) {
                [str deleteCharactersInRange:NSMakeRange(str.length - 1, 1)];
            }
        }
        [rowValues addObject:str];
    }
    return [self generateCsv:columnValues rowValues:rowValues];
}

/**
 根据行列信息生成约定格式的字符串

 @param columns 列数据
 @param values 行数据
 @return 需要被写入文件的字符串
 */
+ (NSString *)generateCsv:(NSArray<NSString *> *)columns rowValues:(NSArray<NSString *> *)values {
    NSMutableString *dataStr = [NSMutableString string];
    for (NSString *colStr in columns) {
        [dataStr appendFormat:@"\"%@\"%@", [colStr stringByReplacingOccurrencesOfString:@"\"" withString:@"\"\""], kSplitChar];
        if (colStr == columns.lastObject) {
            [dataStr deleteCharactersInRange:NSMakeRange(dataStr.length - 1, 1)];
        }
    }
    if (columns.count > 0) {
        [dataStr appendString:kNewLineMark];
    }
    
    for (NSString *rowStr in values) {
        [dataStr appendString:rowStr];
        [dataStr appendString:kNewLineMark];
    }
    return [dataStr copy];
}
```

- 将按照规定生成的字符串写入文件
	- 注意：写到文件时使用`NSUTF16StringEncoding`编码，否则Excel打开时中文会变成乱码

```objective-c
/**
 将字符串写入本地

 @param suffix 文件后缀名
 @param name 文件名
 @param data 需要写入的文本
 */
+ (void)saveFile:(NSString *)suffix name:(NSString *)name withData:(NSString *)data {
    NSSavePanel *panel = [NSSavePanel savePanel];
    panel.allowedFileTypes = @[suffix];
    panel.allowsOtherFileTypes = NO;
    panel.extensionHidden = NO;
    panel.canCreateDirectories = YES;
    panel.nameFieldStringValue = [NSString stringWithFormat:@"%@.%@", name, suffix];
    [panel setCanCreateDirectories:YES];
    [panel beginSheetModalForWindow:[NSApplication sharedApplication].mainWindow completionHandler:^(NSInteger result) {
        if (result == NSFileHandlingPanelOKButton) {
            NSString *path = [[panel URL] path];
            [data writeToFile:path atomically:YES encoding:NSUTF16StringEncoding error:nil];
        }
    }];
}
```

---

### 扩展FTVGridView支持导出csv

TableViewDataSource提供了接口可以快速获取数据原型，以便在导出时可以直接获取行列数据。
	`- (nullable id)tableView:(NSTableView *)tableView objectValueForTableColumn:(nullable NSTableColumn *)tableColumn row:(NSInteger)row;`

Mac牛牛工程自造的轮子FTVGridViewDataSource需要二次扩展出类似的数据接口

- 数据Model实际使用中会依据具体业务场景做相应的二次处理，所以直接拿数据Model生成csv不符合所见数据即导出数据的需求
- FTVGridViewDataSource补充optional协议，具体业务场景需要实现此协议，对数据原型做二次处理，返回具体的需要被绘制的数据
`- (id)gridView:(FTVGridView *)gridView objectValueForGridColumn:(FTVGridColumn *)column row:(NSUInteger)row;`
- 实现了上述协议的具体业务在执行回调`- (void)gridView:(FTVGridView *)gridView drawCellAtColumn:(FTVGridColumn *)column row:(NSUInteger)row value:(id)value oldValue:(id)oldValue;`时，value便是被处理过的最终需要被绘制的数据


**至此，FTVGridView可以更便捷的支持数据导出**

```objective-c
+ (NSString *)generateCsvForGridView:(FTVGridView *)gridView {
    NSMutableArray *columns = [NSMutableArray arrayWithArray:gridView.anchorColumns];
    [columns addObjectsFromArray:gridView.gridColumns];
    
    NSMutableArray<NSString *> *columnValues = [NSMutableArray array];
    for (FTVGridColumn *col in columns) {
        if (col.title) {
            [columnValues addObject:col.title];
        }
    }
    
    NSMutableArray<NSString *> *rowValues = [NSMutableArray array];
    NSUInteger rowCount = ((NSArray *)gridView.arrayController.arrangedObjects).count;
    for (int i = 0; i < rowCount; i++) {
        NSMutableString *str = [NSMutableString string];
        for (FTVGridColumn *col in columns) {
            if ([gridView.dataSource respondsToSelector:@selector(gridView:objectValueForGridColumn:row:)]) {
                NSString *cellStr = [[gridView.dataSource gridView:gridView objectValueForGridColumn:col row:i] description];
                [str appendFormat:@"\"%@\"%@", [cellStr stringByReplacingOccurrencesOfString:@"\"" withString:@"\"\""], kSplitChar];
                if (col == columns.lastObject) {
                    [str deleteCharactersInRange:NSMakeRange(str.length - 1, 1)];
                }
            }
        }
        [rowValues addObject:str];
    }
    return [self generateCsv:columnValues rowValues:rowValues];
}

```