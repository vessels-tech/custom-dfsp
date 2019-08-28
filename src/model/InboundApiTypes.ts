
export enum IdType {
  MSISDN = 'MSISDN',
  ACCOUNT_ID = 'ACCOUNT_ID',
}

export type IdValue = string

export type ParticipantsResponse = {
  fspId: String
}

//This doesn't match up with the other Inbound api P
export type TransferParty = {
  idType: IdType,
  idValue: IdValue,
  displayName?: String,
  firstName?: String,
  middleName?: String,
  lastName?: String,
  dateOfBirth?: String, //Date of birth in the form YYYY-MM-DD.
  merchantClassificationCode?: String,
}

//This is incorrect with the spec, but is required by the scheme adapter inbound api
export type Party = {
  partyIdInfo: {
    partyIdType: IdType
    partyIdentifier: String,
    partySubIdOrType?: String,
    fspId: String,
  },
  merchantClassificationCode?: String,
  name: String,
  personalInfo: {
    complexName: {
      firstName?: String,
      middleName?: String,
      lastName?: String,
    },
    dateOfBirth: String
  }
}


//A Mojaloop API quote identifier(UUID).
export type QuoteId = String

//ID of the transaction, the ID is decided by the Payer FSP during the creation of the quote.
export type TransactionId = String

export type TransferId = String

export enum AmountType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
}

export enum Currency {
  // TODO: Add rest of currencies later on
  AUD = "AUD",
  USD = "USD",
  XOF = "XOF",
}

export type Money = String;

export enum TransactionType {
  TRANSFER = 'TRANSFER',
}

export enum Initiator {
  PAYER = 'PAYER',
  PAYEE = 'PAYEE',
}

export enum InitiatorType {
  CONSUMER = 'CONSUMER',
  AGENT = 'AGENT',
  BUSINESS = 'BUSINESS',
  DEVICE = 'DEVICE',
}

export type GeoCode = {
  latitude: String, //The API data type Latitude is a JSON String in a lexical format that is restricted by a regular expression for interoperability reasons.
  longitude: String, //The API data type Longitude is a JSON String in a lexical format that is restricted by a regular expression for interoperability reasons.
}

export type Timestamp = String

export type QuoteRequest = {
  quoteId: QuoteId,
  transactionId: TransactionId,
  to: TransferParty,
  from: TransferParty,
  amountType: AmountType,
  amount: Money,
  currency: Currency,
  feesAmount?: Money,
  feesCurrency?: Currency,
  transactionType: TransactionType,
  initiator: Initiator,
  initiatorType: InitiatorType,
  geoCode?: GeoCode,
  note?: String,
  expiration?: Timestamp
}

export type QuoteResponse = {
  quoteId: QuoteId,
  transactionId: TransactionId,
  transferAmount: Money,
  transferAmountCurrency: Currency,
  payeeReceiveAmount?: Money,
  payeeReceiveAmountCurrency?: Currency,
  payeeFspFeeAmount?: Money,
  payeeFspFeeAmountCurrency?: Currency,
  payeeFspCommissionAmount?: Money,
  payeeFspCommissionAmountCurrency?: Currency,
  expiration?: Timestamp,
  geoCode?: GeoCode,
}

export type TransferRequest = {
  transferId: TransferId,
  quote: QuoteResponse,
  from: TransferParty,
  to: TransferParty,
  amountType: AmountType,
  currency: Currency,
  amount: Money,
  transactionType: TransactionType,
  note?: String,
}

export type TransferResponse = {
  homeTransactionId: String
}

export enum TransferStatus {
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  WAITING_FOR_QUOTE_ACCEPTANCE = 'WAITING_FOR_QUOTE_ACCEPTANCE',
  COMPLETED = 'COMPLETED',
}