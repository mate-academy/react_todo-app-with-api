import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';
import { UpdatingForm } from '../UpdatingForm/UpdatingForm';

type Props = {
  onUpdateInputFocus: (value: boolean) => void,
  onCheckedToggle: (value: Todo) => void,
  onUpdatingForm: (value: Todo | null) => void,
  onSubmit: (value: Todo) => Promise<void>,
  onDelete: (value: number) => void,

  isAllTodosLoading: boolean,
  updatingForm: Todo | null,
  isTodoLoading: Todo | null,
  tempTodo: Todo | null,
  query: string,
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({
  onUpdateInputFocus,
  onCheckedToggle,
  onUpdatingForm,
  onSubmit,
  onDelete,

  isAllTodosLoading,
  isTodoLoading,
  updatingForm,
  tempTodo,
  query,
  todos,
}) => {
  return (
    <>
      {todos.map(todo => (
        <React.Fragment key={todo.id}>
          {updatingForm?.id === todo.id ? (
            <UpdatingForm
              onUpdateInputFocus={onUpdateInputFocus}
              onCheckedToggle={onCheckedToggle}
              onUpdatingForm={onUpdatingForm}
              onSubmit={onSubmit}
              onDelete={onDelete}
              isTodoLoading={isTodoLoading}
              query={query}
              todo={todo}
            />
          ) : (
            <TodoItem
              key={todo.id}
              onCheckedToggle={onCheckedToggle}
              onUpdatingForm={onUpdatingForm}
              onDelete={onDelete}
              isAllTodosLoading={isAllTodosLoading}
              isTodoLoading={isTodoLoading}
              todo={todo}
            />
          )}
        </React.Fragment>
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          onCheckedToggle={onCheckedToggle}
          onUpdatingForm={onUpdatingForm}
          onDelete={onDelete}
          isAllTodosLoading={isAllTodosLoading}
          isTodoLoading={isTodoLoading}
          todo={tempTodo}
        />
      )}
    </>
  );
};
