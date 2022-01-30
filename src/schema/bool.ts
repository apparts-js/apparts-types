import { Params, Schema, Type } from "./utilTypes";

class Bool<P extends Params> implements Schema<boolean, P> {
  constructor(params: P) {
    this.type = {
      type: "boolean",
      ...params,
    };
  }
  type: Type;
  __type: boolean;
  __params: P;
}
export const bool = <P extends Params>(params?: P): Bool<P> => {
  return new Bool(params);
};
