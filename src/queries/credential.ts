import db from '../service/db'

interface CredentialModel {
  type: string,
  account_id: string,
  twilio_account_sid: string,
  twilio_access_token: string,
  friendly_name: string,
  created_at: Date,
  updated_at: Date,
}

async function getAllCredentials() {
  return db<CredentialModel>('credential')
    .select('*')
}


async function getCredentialsForUser(username: string): Promise<CredentialModel[] | undefined> { 
  //Do a fancy join

  /*
    SELECT credential FROM credential
      INNER JOIN account
        ON  credential.account_id = account.id
    WHERE username = '12345';
  */
  return db<CredentialModel>('credential')
    .where({
      username,
    })
    .innerJoin('account', 'credential.account_id', 'account.id')
    .select('*')
}

async function getCredentialsForUserId(id: number): Promise<CredentialModel[] | undefined> {
  return db<CredentialModel>('credential')
    .where({
      account_id: id,
    })
    .select('*')
}

export {
  CredentialModel,
  getAllCredentials,
  getCredentialsForUser,
  getCredentialsForUserId,
}