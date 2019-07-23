
exports.seed = async function(knex) {
  await knex('account').del()
  await knex('credential').del()

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
    twilio_account_sid: '123456',
    twilio_access_token: '7891011',
    friendly_name: 'TZChatbot twilio',
  }]);
};
