/* eslint-disable react/display-name */
import React from 'react';
import { LoadingItem, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  setTodos: (callback: (todos: Todo[]) => Todo[]) => void;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  setErrorMessage: (message: string) => void;
  isLoadingItems: LoadingItem[];
  setDeleteItem: (onDelete: boolean) => void;
};

export const ListTodo: React.FC<Props> = React.memo(
  ({
    todos,
    setTodos,
    tempTodo,
    onDelete,
    setErrorMessage,
    isLoadingItems,
    setDeleteItem,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            setErrorMessage={setErrorMessage}
            setTodos={setTodos}
            isLoadingItems={isLoadingItems}
            setDeleteItem={setDeleteItem}
          />
        ))}

        {tempTodo && <TempTodo key={tempTodo.id} tempTodo={tempTodo} />}
      </section>
    );
  },
);
