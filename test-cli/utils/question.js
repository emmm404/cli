const question = [
  {
    name: 'conf',
    type: 'confirm',
    message: '你要创建新项目吗？'
  },
  {
    name: 'name',
    message: '请给项目起个名字',
    when: res => Boolean(res.conf)
  },
  {
    name: 'author',
    message: '你是谁？',
    when: res => Boolean(res.conf)
  },
  {
    type: 'list',
    message: '请选择使用哪种框架',
    name: 'type',
    choices: ['common', 'umi', 'antd Pro'],
    filter: function(val){
      return val.toLowerCase()
    },
    when: res => Boolean(res.conf)
  },
  {
    name: 'isSubiframe',
    type: 'confirm',
    message: '你需要SiSubfiram'
  },
]

/*inquirer用法设置*/
// inquirer
//   // 问题list
//   .prompt([])
//   // 用户反馈的内容
//   .then(answers => {})
//   // 出现错误
//   .catch(error => {})

module.exports =  question;