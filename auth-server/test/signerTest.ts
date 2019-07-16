import jose from 'node-jose';
import sign from '../src/signer';

const PKEY = `
  -----BEGIN EC PRIVATE KEY-----
  MIHcAgEBBEIAs9NPqhuaJ1AYYppNww2Fy+eOA2k8uFqWr3aDoKDpPHVCBNm6ItlK
  PZFtso+1QsTpPXTlnjUPKIUieg9pn3Pxh9CgBwYFK4EEACOhgYkDgYYABAHDQJ0K
  oPXmPgvBKFMGigTaE1j1Qisfavl4dCt8qDfIjK4YMK6jkaRHKbyQ2gP2EQ35DGPU
  ESjOzA8dy9vKKwbONgEyRuzDOs8IeC1mnBgj/w+FVXE0b5p4d7CPmhrgPpVDO443
  vo2ckrppdi3C0qG9BghSoHvzcIlyYT2WFYNKSKL5oA==
  -----END EC PRIVATE KEY-----
`;

const PUBKEY = `
  -----BEGIN PUBLIC KEY-----
  MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBw0CdCqD15j4LwShTBooE2hNY9UIr
  H2r5eHQrfKg3yIyuGDCuo5GkRym8kNoD9hEN+Qxj1BEozswPHcvbyisGzjYBMkbs
  wzrPCHgtZpwYI/8PhVVxNG+aeHewj5oa4D6VQzuON76NnJK6aXYtwtKhvQYIUqB7
  83CJcmE9lhWDSkii+aA=
  -----END PUBLIC KEY-----
`;

test('signer returns signed message', async () => {
  const message = 'Hello world';
  const signed = await sign(PKEY, message);

  expect(signed).toHaveProperty('signatures');
  expect(signed.payload).toEqual('Hello world');
});

test('json stays valid when signed', async () => {
  const message = { name: 'kurko', bool: false };
  const signed = await sign(PKEY, JSON.stringify(message));

  const payload = JSON.parse(signed.payload);
  expect(payload).toEqual(message);
});

test('signed message can be verified', async () => {
  const key = await jose.JWK.asKey(PUBKEY, 'pem');

  const message = 'Hello world';
  const signed = await sign(PKEY, message);

  signed.payload = jose.util.base64url.encode(signed.payload, 'utf8');
  signed.signatures[0].protected = jose.util.base64url.encode(
    JSON.stringify(signed.signatures[0].protected),
    'utf8'
  );

  const result = await jose.JWS.createVerify(key, {
    algorithms: ['ES512'],
  }).verify(signed);

  expect(result.payload.toString()).toEqual('Hello world');
});
