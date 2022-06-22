#!/usr/bin/env node
'use strict';
const { cyan, green, magentaBright, yellow,red } =require('../utils/consoleColors');
// commander 终端交互
const program = require('commander'); 
// inquirer 命令行交互
let inquirer = require('inquirer');
let question = require('../utils/question');
const create = require('../src/create');
const start = require('../src/start');
/**test* */
// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
// program.parse(process.argv)
// if(program.debug){
//   blue('option is debug')
// } else if(program.small){
//   blue('option is small')
// }

/* mycli create 创建项目 */
program
  .command('create')
  .description('create a project')
  .action(function(){
    yellow('欢迎使用mycli测试版，构建react ts项目')
    inquirer
      .prompt(question)
      .then(answer => {
        if(answer.conf){
          red('问卷结果')
          console.log(answer)
          // 创建文件
          create(answer)
        }
      })
  })

/* mycli start 创建项目 */
program
  .command('start')
  .description('start a project')
  .action(function(){
    cyan('~~~运行项目~~~')
    // 运行项目
    start('start').then(()=>{
      green('------- 运行完成 -------')
    })
  })

/* mycli build 打包项目*/
program
  .command('build')
  .description('build a project')
  .action(function(){
    magentaBright('~~~构建项目~~~');
    // 打包项目
    start('build').then(()=> {
      green('------- 构建完成 -------')
    })
  })

program.parse(process.argv)
