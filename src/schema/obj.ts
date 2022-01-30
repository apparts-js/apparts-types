import { Params, Schema, Type } from "./utilTypes";

interface ObjParams<T extends Keys> extends Params {
  keys: T;
}

interface Keys {
  [T: string]: Schema<any, any>;
}

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends {} ? { [k in keyof T]: T[k] } : T;

/* Required<{}> tricks TS as optional: true does not have type object.
   Not sure why it works. I discovered it by accident.
 */
type OptionalKeys<T extends Keys> = {
  [Property in keyof T]: Required<{}> extends T[Property]["__params"]["optional"]
    ? never
    : Property;
}[keyof T];

type RequiredKeys<T extends Keys> = Exclude<keyof T, OptionalKeys<T>>;
type ObjKeyType<T extends Keys> = _<
  {
    [Property in OptionalKeys<T> as T[Property] extends never
      ? never
      : Property]?: T[Property]["__type"];
  } & {
    [Property in RequiredKeys<T> as T[Property] extends never
      ? never
      : Property]: T[Property]["__type"];
  }
>;

class Obj<T extends Keys, P extends Params>
  implements Schema<ObjKeyType<T>, P>
{
  /*

      {
        [Property in keyof T]: T[Property]["__type"];
      }
*/
  constructor({ keys, ...params }: ObjParams<T>) {
    const typeKeys = {};
    for (const key in keys) {
      typeKeys[key as string] = keys[key].type;
    }
    this.type = {
      type: "object",
      keys: typeKeys,
      ...params,
    };
  }
  type: Type;
  __type: ObjKeyType<T>;
  __params: P;
}

export const obj = <T extends Keys, P extends ObjParams<T>>(
  params: ObjParams<T>
): Obj<T, P> => {
  return new Obj(params);
};
