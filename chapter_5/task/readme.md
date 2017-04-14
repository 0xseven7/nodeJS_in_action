此程序是一个简易版的todolists,  通过命令行来增加或者列出
items.并以`json`的格式保存的tasks文件中, 以待下次读取.
要点:
- `process.argv` 
命令行各参数组成的数组:
```
$ node task.js add sport
```
此时`process.argv` = [node, task.js, add, sport];
- `process.cwd()` 返回当前的工作目录