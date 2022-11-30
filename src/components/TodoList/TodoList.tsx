import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoWithLoader } from '../TodoWithLoader';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onDeleteTodo: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
  isAdding: boolean;
  deletedTodoIds: number[];
  deleteTodoId: number;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loadTodos: () => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTodoId: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTitle,
  onDeleteTodo,
  isLoading,
  isAdding,
  deletedTodoIds,
  deleteTodoId,
  setHasError,
  setErrorMessage,
  loadTodos,
  setIsLoading,
  setActiveTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            isLoading={isLoading}
            deletedTodoIds={deletedTodoIds}
            deleteTodoId={deleteTodoId}
            setHasError={setHasError}
            setErrorMessage={setErrorMessage}
            loadTodos={loadTodos}
            setIsLoading={setIsLoading}
            setActiveTodoId={setActiveTodoId}
          />
        ))}

        {isAdding && <TodoWithLoader todoTitle={todoTitle} />}
      </ul>
    </section>
  );
};
