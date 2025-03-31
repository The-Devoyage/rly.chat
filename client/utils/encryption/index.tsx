import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

export function encryptData<T>(data: T, password: string) {
  const key = nacl.hash(naclUtil.decodeUTF8(password)).slice(0, 32);
  const nonce = nacl.randomBytes(24);

  // Convert object to JSON string, then to Uint8Array
  const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(data));

  // Encrypt the JSON string
  const encrypted = nacl.secretbox(messageUint8, nonce, key);

  return {
    encryptedData: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptData(encryptedData: string, nonce: string, password: string) {
  const key = nacl.hash(naclUtil.decodeUTF8(password)).slice(0, 32);

  // Decode from base64
  const encryptedUint8 = naclUtil.decodeBase64(encryptedData);
  const nonceUint8 = naclUtil.decodeBase64(nonce);

  // Decrypt the data
  const decrypted = nacl.secretbox.open(encryptedUint8, nonceUint8, key);

  if (!decrypted) {
    throw new Error("Incorrect password or data corrupted");
  }

  // Convert the decrypted data (Uint8Array) back to a string
  const decryptedString = naclUtil.encodeUTF8(decrypted);

  // Parse the string into a JSON object
  return JSON.parse(decryptedString);
}
