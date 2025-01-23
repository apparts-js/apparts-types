import { Type, Schema, Obj, InferType, Required, HasDefault } from "../schema";
import { InferHasDefaultType } from "../schema/infer";

export const getDefaultFromType = (type: Type, defaultFnParam?: unknown) =>
  typeof type.default === "function"
    ? type.default(defaultFnParam)
    : type.default;

type DefaultsAsOptional<FullS extends Schema<any, any>> = Omit<
  InferType<FullS>,
  keyof InferHasDefaultType<FullS>
> &
  Partial<InferHasDefaultType<FullS>>;

type Subject<FullS extends Schema<any, any>> = FullS extends Obj<any, any>
  ? DefaultsAsOptional<FullS>
  : InferType<FullS>;

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends object ? { [k in keyof T]: T[k] } : T;

export type SubjectMaybe<FullS extends Schema<any, any>> = _<
  Required extends FullS["__flags"]
    ? HasDefault extends FullS["__flags"]
      ? Subject<FullS> | undefined
      : Subject<FullS>
    : Subject<FullS> | undefined
>;

type SubjectObj<FullS extends Schema<any, any>> = DefaultsAsOptional<FullS>;

export type SubjectMaybeObj<FullS extends Schema<any, any>> = _<
  Required extends FullS["__flags"]
    ? HasDefault extends FullS["__flags"]
      ? SubjectObj<FullS> | undefined
      : SubjectObj<FullS>
    : SubjectObj<FullS> | undefined
>;
