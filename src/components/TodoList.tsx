/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { MutableRefObject } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoItem } from './TodoItem';

type Props = {
  tempTodo: Todo | undefined;
  todoForDelete: number[];
  setFocusForm: (isFocused: boolean) => void;
  handleToggle: (todo: Todo | undefined) => void;
  getFilteredTodos: Todo[];
  renaming: Todo | undefined;
  setNewTitle: (newTitle: string) => void;
  newTitle: string;
  loading: boolean;
  handleRename: (event?: React.FormEvent<HTMLFormElement>) => void;
  setRenaming: (todo: Todo | undefined) => void;
  handleDelete: (id: number | undefined) => void;
  formRef: MutableRefObject<HTMLInputElement | null>;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  todoForDelete,
  setFocusForm,
  getFilteredTodos,
  renaming,
  handleToggle,
  handleRename,
  setNewTitle,
  newTitle,
  loading,
  handleDelete,
  formRef,
  setRenaming,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {getFilteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          renaming={renaming}
          handleToggle={handleToggle}
          handleRename={handleRename}
          setNewTitle={setNewTitle}
          newTitle={newTitle}
          setFocusForm={setFocusForm}
          setRenaming={setRenaming}
          handleDelete={handleDelete}
          loading={loading}
          todoForDelete={todoForDelete}
          formRef={formRef}
        />
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          key={tempTodo.id}
          className={classNames('todo', { completed: tempTodo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className={'modal overlay is-active'}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
