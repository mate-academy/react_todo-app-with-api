import { Status } from './Status';
import { Todo } from './Todo';
import { Error } from './Error';
import { EventFocus, EventKeyboard, EventSubmit } from './events';

export type Submit = (e: EventSubmit) => void;
export type MultiSubmit = (e: EventSubmit | EventFocus) => void;
export type KeyUp = (e: EventKeyboard) => void;

export type GetId = (id: number) => void;
export type GetValue = (value: string) => void;
export type GetError = (error: Error) => void;
export type GetStatus = (status: Status) => void;
export type GetTodo = (todo: Todo) => void;
export type GetTodoAndTitle = (todo: Todo, title: string) => void;
