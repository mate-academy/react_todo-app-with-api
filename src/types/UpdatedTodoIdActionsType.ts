import { ActionMap } from './ActionMapType';
import { IsUpdatedPayload } from './IsUpdatedPayloadType';

// eslint-disable-next-line max-len
export type UpdatedTodoIdActions = ActionMap<IsUpdatedPayload>[keyof ActionMap<IsUpdatedPayload>];
