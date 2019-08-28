// Add the property 'decodedToken' to Request objects
declare namespace Express {
  export interface Request {
    decodedToken: any;
  }
}
