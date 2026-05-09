declare namespace NodeJS {
  interface ProcessEnv {
    appKey: string;
    secretKey: string;
    serverRoot: string;
    publicKey: string;
  }
}
