import KoaRouter from 'koa-router'

import Handlers from './template.handler'

const templateRouter = new KoaRouter()

const user = {
  name: {
    first: 'Tobi',
    last: 'Holowaychuk'
  },
  species: 'ferret',
  age: 3
};


//TODO: spread into handlers that inject state

templateRouter.get('/', async (ctx: any) => await ctx.render('index', { user }));
templateRouter.get('/login', async (ctx: any) => await ctx.render('login', { user }));
templateRouter.get('/logout', async (ctx: any) => await ctx.render('login', { user }));
templateRouter.get('/register', async (ctx: any) => await ctx.render('register', { user }));
templateRouter.get('/position', Handlers.position);
templateRouter.get('/info', Handlers.position);
templateRouter.get('/users', Handlers.users);


export { 
  templateRouter
}