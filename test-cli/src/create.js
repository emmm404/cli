const { cyan, green, red, yellow, blue} =require('../utils/consoleColors');
const fs = require('fs');
const npm = require('./npm');
const { ColdObservable } = require('rxjs/internal/testing/ColdObservable');

module.exports = function(res){
  // 创建文件
  green('\\\\\\开始构建//////');

  // 找到template文件夹下的模板 
  // __dirname总是指向被执行js文件的绝对路径，例如 在d1/d2/test.js中写了__dirname，他的值就是 d1/d2
  // process.cwd() 方法会返回node.js进程的当前工作目录
  const sourcePath = __dirname.slice(0, -3)+'template';
  red('当前路径'+process.cwd());

  // 修改package.json
  revisePackageJson(res, sourcePath).then(()=>{
    copy(sourcePath, process.cwd(), npm());
  })
}

function revisePackageJson (res, sourcePath){
  return new Promise((resolve) => {
    // 读取文件
    fs.readFile(sourcePath+'/package.json', (err, data) => {
      if(err) throw err;
      const { author, name } =res;
      let json = data.toString();
      // 替换模板
      json = json.replace(/demoName/g,name.trim());
      json = json.replace(/demoAuthor/g,author.trim());
      const path = process.cwd()+'/package.json';
      // 写入文件
      fs.writeFile(path, Buffer.from(json), ()=> {
        yellow('创建文件：'+path);
        resolve();
      })
    })
  })
}


/********* 复制文件部分 ***********/
// flat fileCount dirCount 这三个计数变量是为了控制异步I/O操作
//文件数量
let fileCount = 0;  
// 当前项目路径
let dirCount = 0;
// readir数量
let flat = 0;

/**
 * 
 * @param{*} sourcePath   template资源路径
 * @param{*} currentPath  当前项目路径
 * @param{*} cb  项目复制完成回调函数
 */

function copy(sourcePath, currentPath, cb){
  flat++
  // 读取文件夹下面的文件
  fs.readdir(sourcePath, (err, paths) => {
    flat--;
    if(err){
      throw err
    }
    paths.forEach(path => {
      if(path !== '.git' && path !== 'package.json')fileCount ++;
      const newSoucePath = sourcePath + '/' + path;
      const newCurrentPath = currentPath + '/' + path;
      // 判断文件信息
      fs.stat(newSoucePath, (err, stat)=>{
        if(err){
          throw err
        }
        // 判断是文件，且不是package.json
        if(stat.isFile() && path !== 'package.json'){
          // 创建读写流
          const readSteam = fs.createReadStream(newSoucePath)
          const writeSteam = fs.createWriteStream(newCurrentPath)
          readSteam.pipe(writeSteam);
          cyan('创建文件'+newCurrentPath);
          fileCount--;
          completeControl(cb);
          //判断是文件夹，对文件夹单独进行dirExist操作
        } else if(stat.isDirectory()){
          if(path !== '.git' && path !=='package.json'){
            dirCount++;
            dirExist(newSoucePath, newCurrentPath, copy,cb)
          }
        }
      })
    })
  })
  
}

/**
 * @param {*} sourcePath //template
 * @param {*} currentPath // 当前项目路径
 * @param {*} copyCallback //上面的copy函数
 * @param {*} cb // 项目复制完成回调函数
 */

function dirExist(sourcePath, currentPath, copyCallback, cb){
  // 这里不能使用fs.access替代fs.exists 会导致文件夹无法创建 出现报错
  fs.exists(currentPath, (ext => {
    if(ext){
      // 递归调用copy函数
      copyCallback(sourcePath, currentPath, cb)
    } else {
      fs.mkdir(currentPath, ()=> {
        fileCount--;
        dirCount--;
        copyCallback(sourcePath, currentPath,cb);
        yellow('创建文件夹：' + currentPath);
        completeControl(cb);
      })
    }
  }))
}



function completeControl(cb){
  let isInstall = false;
  // 三变量均为0，说明I/O已执行完毕
  if(fileCount === 0 && dirCount ===0 && flat ===0){
    green('\\\\\\\\构建完成////////');
    if(cb && !isInstall){
      isInstall = true;
      blue('````````开始install’‘’‘’‘’‘’');
      cb(()=>{
        blue('‘’‘’‘’‘’‘完成install````````')
        // 判断是否存在webpack
        runProject()
      })
    }
  }
}

// 启动项目方法
function runProject(){
  try{
    // 继续使用npm执行新的命令 start
    const start = npm(['start']);
    start();
  } catch(e){
    red('自启无反应，请手动npm start 启动项目')
  }
}