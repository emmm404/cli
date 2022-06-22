const which = require('which');
// 找到npm
function findNpm(){
  let npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm'];
  for(let i=0;i<npms.length; i++){
    try{
      which.sync(npms[i]);
      console.log('use npm:' + npms[i]);
      return npms[i]
    } catch(e){
    }
  }
  throw new Error('plase install npm')
}

/**
 * @param {*} cmd
 * @param {*} args
 * @param {*} fn
 */

// 运行终端命令
function runCmd(cmd, args, fn){
  args = args || []
  let runner = require('child_process').spawn(cmd, args, {
    stdio: 'inherit'
  })
  runner.on('close', function(code){
    if(fn)fn(code);
  })
}

/**
 *  @param {*} installArg 执行命令 命令行组成的数组，默认为install
 */

module.exports = function (installArg = ['install']) {
  //找到npm后 闭包保存npm
  const npm =findNpm();
  return function(done){
    // 执行命令
    runCmd(which.sync(npm), installArg, function(){
      // 执行成功的回调
      done && done();
    })
  }
}
