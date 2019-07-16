import jose from 'node-jose';
import crypto from 'crypto';

interface Signature {
  protected: any;
  signature: string;
}

interface SignedMessage {
  payload: string;
  signatures: Signature[];
}

const sign = async (privateKey: string | Buffer, message: string) => {
  const key = await jose.JWK.asKey(privateKey, 'pem');

  const messageid = crypto.randomBytes(12).toString('base64');
  const fields = { timestamp: Date.now(), messageid };

  const signed = await jose.JWS.createSign({ fields }, key)
    .update(message)
    .final();

  const result = signed as SignedMessage;

  result.payload = jose.util.base64url.decode(result.payload).toString();
  result.signatures[0].protected = JSON.parse(
    jose.util.base64url.decode(result.signatures[0].protected).toString()
  );

  return result;
};

export default sign;
