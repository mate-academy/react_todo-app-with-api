import { ActionMap } from './ActionMapType';
import { TodoPayload } from './TodoPayloadType';

export type TodoActions = ActionMap<TodoPayload>[keyof ActionMap<TodoPayload>];
