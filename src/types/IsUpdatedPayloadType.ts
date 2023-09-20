import { Types } from '../enums/Types';

export type IsUpdatedPayload = {
  [Types.SetUpdatedTodoId]: {
    updatedTodoId: number;
  };
  [Types.RemoveUpdatedTodoId]: {
    updatedTodoId: number;
  };
};
