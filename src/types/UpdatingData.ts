import { Todo } from './Todo';

export interface UpdatingData {
  todo: Todo;
  key: string;
  value: string | boolean;
}
