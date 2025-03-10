import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[] | null;
  errorMessage: string;
  loading: number[];
  onRemoveTodo: (id: number) => Promise<void>;
  onUpdateTodo: (id: number) => Promise<void>;
  editing: number | null;
  setEditing: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setLoading: Dispatch<SetStateAction<number[]>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  errorMessage,
  loading,
  onRemoveTodo,
  onUpdateTodo,
  editing,
  setEditing,
  inputRef,
  setTodos,
  setLoading,
  setErrorMessage,
  todos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          errorMessage={errorMessage}
          loading={loading.includes(todo.id)}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          editing={editing}
          setEditing={setEditing}
          inputRef={inputRef}
          setTodos={setTodos}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          todos={todos}
        />
      ))}
    </section>
  );
};
