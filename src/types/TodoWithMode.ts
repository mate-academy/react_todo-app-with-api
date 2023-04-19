import { Todo } from './Todo';
import { TodoMode } from './TodoMode';

export interface TodoWithMode extends Todo {
  mode: TodoMode;
}
