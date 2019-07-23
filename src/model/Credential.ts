import { CredentialModel } from '../queries/credential';

export enum CredentialType {
  TWILIO='TWILIO',
}

export type Credential = {
  type: CredentialType,
  accountId: string,
  twilioAccountSid: string,
  twilioAccessToken: string,
  friendlyName: string,
  createdAt: Date,
  updatedAt: Date,
}

//TODO implement
export function credentialTypeFromString(_: string): CredentialType {
  return CredentialType.TWILIO;
}

export function credentialModelToCredential(input: CredentialModel): Credential {

  return {
    type: credentialTypeFromString(input.type),
    accountId: input.account_id,
    twilioAccountSid: input.twilio_account_sid,
    twilioAccessToken: input.twilio_access_token,
    friendlyName: input.friendly_name,
    createdAt: input.created_at,
    updatedAt: input.updated_at,
  }
}