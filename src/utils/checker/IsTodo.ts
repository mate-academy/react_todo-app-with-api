import { Todo } from '../../types/Todo';

export function isTodo(item: Todo): item is Todo {
  return 'id' in item && 'completed' in item;
}
