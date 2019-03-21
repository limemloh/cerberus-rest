import { Validator } from "cerberus";
import { Request, Response, Express } from "express";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Validates<A extends Validator<any, any>> = A extends Validator<
  any,
  infer R
>
  ? R
  : never;

type GetValidation = {
  query?: Validator<any, any>;
  body?: Validator<any, any>;
};

type GetRequset<B extends Record<string, Validator<any, any>>> = Omit<
  Request,
  // @ts-ignore
  keyof B
> &
  { [K in keyof B]: Validates<B[K]> };

class App {
  constructor(private app: Express) {}
  get<A extends GetValidation>(
    path: string,
    validation: A,
    // @ts-ignore
    fn: (req: GetRequset<A>, res: Response) => void
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
    // @ts-ignore
    fn: (req: GetRequset<A>, res: Response) => void
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
