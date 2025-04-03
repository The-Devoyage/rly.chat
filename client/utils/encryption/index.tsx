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

  const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(data));

  const encrypted = nacl.secretbox(messageUint8, nonce, key);

  return {
    encryptedData: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptData(encryptedData: string, nonce: string, password: string) {
  const key = nacl.hash(naclUtil.decodeUTF8(password)).slice(0, 32);

  const encryptedUint8 = naclUtil.decodeBase64(encryptedData);
  const nonceUint8 = naclUtil.decodeBase64(nonce);

  const decrypted = nacl.secretbox.open(encryptedUint8, nonceUint8, key);

  if (!decrypted) {
    throw new Error("Incorrect password or data corrupted");
  }

  const decryptedString = naclUtil.encodeUTF8(decrypted);

  return JSON.parse(decryptedString);
}

export function encryptMessage(
  recipientPublicKey: string,
  senderSecretKey: string,
  message: string,
) {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const publicKey = naclUtil.decodeBase64(recipientPublicKey);
  const privateKey = naclUtil.decodeBase64(senderSecretKey);

  const encryptedMessage = nacl.box(messageUint8, nonce, publicKey, privateKey);

  return {
    encryptedMessage: naclUtil.encodeBase64(encryptedMessage),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptMessage(
  senderPublicKey: string,
  recipientSecretKey: string,
  encryptedMessage: string,
  nonce: string,
) {
  const messageUint8 = naclUtil.decodeBase64(encryptedMessage);
  const nonceUint8 = naclUtil.decodeBase64(nonce);

  const publicKey = naclUtil.decodeBase64(senderPublicKey);
  const privateKey = naclUtil.decodeBase64(recipientSecretKey);

  const decryptedMessage = nacl.box.open(messageUint8, nonceUint8, publicKey, privateKey);

  if (!decryptedMessage) {
    throw new Error("Decryption failed");
  }

  return naclUtil.encodeUTF8(decryptedMessage);
}
