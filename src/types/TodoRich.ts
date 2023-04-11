import { Todo } from './Todo';
import { TodoMode } from './TodoMode';

export interface TodoRich extends Todo {
  mode: TodoMode;
}
