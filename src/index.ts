import { Validator } from "cerberus";
import { Request, Response, Express } from "express";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Validates<A> = A extends Validator<any, infer R> ? R : any;

type GetValidation = {
  query?: Validator<any, any>;
  body?: Validator<any, any>;
  params?: Validator<any, any>;
};

type GetRequest<A extends GetValidation> = Omit<Request, keyof GetValidation> &
  { [k in keyof GetValidation]-?: Validates<A[k]> };

class App {
  constructor(private app: Express) {}
  get<A extends GetValidation>(
    path: string,
    validation: A,
    fn: (req: GetRequest<A>, res: Response) => void
  ) {
    this.app.get(path, (req: any, res) => {
      for (const key of Object.keys(validation)) {
        // @ts-ignore
        const validator: Validator<any, any> = validation[key];
        req[key] = validator.assert(req[key]);
      }
      fn(req, res);
    });
  }
  post<A extends GetValidation>(
    path: string,
    validation: A,
    fn: (req: GetRequest<A>, res: Response) => void
  ) {
    this.app.get(path, (req: any, res) => {
      for (const key of Object.keys(validation)) {
        // @ts-ignore
        const validator: Validator<any, any> = validation[key];
        req[key] = validator.assert(req[key]);
      }
      fn(req, res);
    });
  }
}

export default function cerberusRest(e: Express) {
  return new App(e);
}
