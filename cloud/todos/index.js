const cloud = require('wx-server-sdk')

cloud.init();


const todos = cloud.database().collection('todos');
const MAX_LIMIT = 100;
const SUCCESS_CODE = 0;
const FAIL_CODE = -1;
const TcbRouter = require('tcb-router');
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  const {
    OPENID
  } = cloud.getWXContext()

  let {
    data
  } = event;
  data['_openid'] = OPENID;

  app.use(async (ctx, next) => {
    ctx.data = {}
    await next();
  })

  //添加记录
  app.router('add', async (ctx, next) => {
    try {
      const result = await todos.add({data})
      ctx.body = {
        code: SUCCESS_CODE,
        msg: '添加成功'
      }
    } catch (err) {
      ctx.body = {
        code: FAIL_CODE,
        msg: err
      }
    }
  })

  //删除某一条记录
  app.router('delete', async (ctx, next) => {
    try {
      const result = await todos.doc(data.id).remove();
      ctx.body = {
        code: SUCCESS_CODE,
        msg: '删除成功'
      }
    } catch (err) {
      ctx.body = {
        code: FAIL_CODE,
        msg: err
      }
    }
  })

  //更新某一条记录
  app.router('update', async (ctx, next) => {
    try {
      const result = await todos.doc(data.id).update({
        data:{
          done:true
        }
      });
      ctx.body = {
        code: SUCCESS_CODE,
        msg: '更新成功'
      }
    } catch (err) {
      ctx.body = {
        code: FAIL_CODE,
        msg: err
      }
    }
  })

  //查询所有记录
  app.router('get', async (ctx, next) => {
    try {
      // 先取出集合记录总数
      const countResult = await todos.where({
        _openid: OPENID
      }).count();
      const total = countResult.total;
      if (total > 0) {
        // 计算需分几次取
        const batchTimes = Math.ceil(total / 100);
        const tasks = []
        for (let i = 0; i < batchTimes; i++) {
          const promise = todos.skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
            _openid: OPENID
          }).get()
          tasks.push(promise)
        }
        let result = (await Promise.all(tasks)).reduce((acc, cur) => {
          return acc.data.concat(cur.data)
        })
        result.data.sort((obj1,obj2) => {
          return  new Date(obj2.date).getTime() - new Date(obj1.date).getTime()
        })
        ctx.body = {
          code: SUCCESS_CODE,
          data: result.data,
          msg: '查询成功'
        }
      }else{
        ctx.body = {
          code: SUCCESS_CODE,
          data: [],
          msg: '查询成功'
        }
      }
    } catch (err) {
      ctx.body = {
        code: FAIL_CODE,
        msg: err
      }
    }
  })

  return app.serve()
}