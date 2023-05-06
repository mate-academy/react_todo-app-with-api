import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoTask } from './TodoTask';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  tempTodo: Todo;
  deleteTodo: (todoId: number) => void;
  onUpdateTodo: (
    todoId: number,
    todo: Partial<Todo>) => void;
  loadingTodosId: Set<number>;
}

export const TodoList: FC<Props> = ({
  todos,
  isAdding,
  tempTodo,
  deleteTodo,
  onUpdateTodo,
  loadingTodosId,
}) => (
  <>
    {todos.map((todo) => (
      <TodoTask
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={loadingTodosId.has(todo.id)}
      />
    ))}

    {isAdding && (
      <TodoTask
        todo={tempTodo}
        deleteTodo={deleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={false}
        isAdding={isAdding}
      />
    )}
  </>
);
