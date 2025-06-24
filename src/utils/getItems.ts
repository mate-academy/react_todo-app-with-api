import { Todo } from '../types/Todo';

export function getActiveItems(items: Todo[]): number {
  return items.filter(item => !item.completed).length;
}

export function getCompletedItems(items: Todo[]): number[] {
  return items.filter(item => item.completed).map(item => item.id);
}
