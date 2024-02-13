import { Todo } from './Todo';

export interface Context {
  addTodo: (todo: Todo) => Promise<void>,
  removeTodo: (id: number) => Promise<void>,
  changeTodo: (id: number, todo: boolean, title?: string) => Promise<void>,
}
