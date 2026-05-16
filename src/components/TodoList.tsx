import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: number[] | null;
  updatingTodoIds: number[] | null;
  setErrorMessage?: (error: string) => void;
  updateTodo?: (todo: Todo, newTodo: Todo) => Promise<void>;
  onDelete?: (todoId: number) => Promise<void>;
  onChecked?: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  updatingTodoIds,
  setErrorMessage,
  updateTodo,
  onDelete,
  onChecked,
}) => {
  return (
    <>
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={
              deletingTodoIds?.includes(todo.id) ||
              updatingTodoIds?.includes(todo.id)
            }
            setErrorMessage={setErrorMessage}
            updateTodo={updateTodo}
            onDelete={onDelete}
            onChecked={onChecked}
          />
        );
      })}
    </>
  );
};
