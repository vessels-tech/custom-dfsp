/* Read from DB */
const user = {
  name: {
    first: 'Tobi',
    last: 'Holowaychuk'
  },
  msisdn: "+123456789",
  balance: 100
};

async function getPositionState() {
  // TODO: get the state
  return {
    user,
    state: {
      dfspId: 'Lewbank1',
      baseUrl: 'http://localhost:4000',
      position: 100,
      totalTransfers: 10,
    }
  }
}

async function getUserState() {
  // TODO: DB query
  return {
    user,
    users: [
      {...user, balance: 101},
      {...user, balance: 102},
      {...user, balance: 50},
    ]
  }
}


/* Render Handlers */
async function position(ctx: any) {
  const state = await getPositionState()
  return await ctx.render('position', state)
}

async function users(ctx: any) {
  const state = await getUserState()
  return await ctx.render('users', state)

}


export default {
  position,
  users,
}