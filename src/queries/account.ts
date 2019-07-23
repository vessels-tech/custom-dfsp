import db from '../service/db'

function getAllAccounts() {
  return db('account')
    .select('*');
}

export {
  getAllAccounts
};