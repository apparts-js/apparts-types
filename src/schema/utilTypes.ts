export interface Type {}
export interface Schema<T, P extends Params> {
  __params: P;
  __type: T;
  type: Type;
}

export interface Params {
  optional?: true;
  description?: string;
  semantic?: string;
}
