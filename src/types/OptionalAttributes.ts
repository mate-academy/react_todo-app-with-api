export type OptionalAttributes<T> = {
  [K in keyof T]?: T[K];
};
