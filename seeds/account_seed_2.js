
exports.seed = async function(knex) {
  await knex('credential').del()
  await knex('account').del()

  // Inserts seed entries
  await knex('account').insert([
    {username: '12345', access_token: '12345'},
    {username: 'lewisd', access_token: 'passwd'},
  ]);

  const getAccountIdsResult = await knex.select('id').from('account')
  const account_id = getAccountIdsResult[0].id

  await knex('credential').insert([{ 
    type: 'TWILIO',
    account_id,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_access_token: process.env.TWILIO_AUTH_TOKEN,
    friendly_name: 'TZChatbot twilio',
  }]);
};
