import { Params, Schema, Type } from "./utilTypes";

class Int<P extends Params> implements Schema<number, P> {
  constructor(params: Params) {
    this.type = {
      type: "int",
      ...params,
    };
  }
  type: Type;
  __type: number;
  __params: P;
}
export const int = <P extends Params>(params?: P): Int<P> => {
  return new Int<P>(params);
};
