import koaRouter from 'koa-router'
import views from 'koa-views'

const staticRouter = new koaRouter()

// Must be used before any router is used
staticRouter.use(views(__dirname + '/views', {
  map: {
    html: 'underscore'
  }
}));

// staticRouter.use(async function (ctx) {
//   ctx.state = {
//     session: this.session,
//     title: 'app'
//   };

//   await ctx.render('user', {
//     user: 'John'
//   });
// });