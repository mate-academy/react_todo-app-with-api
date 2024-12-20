/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  tempTodo: Todo | null;
  editedInputById: number;
  editedValue: string;
  filteredTodos: Todo[];
  idsOfTodosWithLoader: number[];
  editedInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onDelete: (id: number) => void;
  onSelect: (id: number, todo: Todo) => void;
  setForm: (id: number) => void;
  setEditedValue: (str: string) => void;
  onSubmitChangedInput: (event: React.FormEvent) => void;
  keyUp: (event: React.KeyboardEvent) => void;
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    tempTodo,
    editedInputById,
    editedValue,
    filteredTodos,
    idsOfTodosWithLoader,
    editedInputRef,
    onDelete,
    onSelect,
    setForm,
    setEditedValue,
    onSubmitChangedInput,
    keyUp,
  }) => {
    const item = (id: number, todo: Todo) => {
      return (
        <CSSTransition
          key={id}
          timeout={300}
          classNames={tempTodo ? 'temp-item' : 'item'}
        >
          <TodoItem
            key={id}
            todo={todo}
            tempTodo={tempTodo}
            editedValue={editedValue}
            editedInputById={editedInputById}
            idsOfTodosWithLoader={idsOfTodosWithLoader}
            editedInputRef={editedInputRef}
            onDelete={onDelete}
            onSelect={onSelect}
            setForm={setForm}
            setEditedValue={setEditedValue}
            onSubmitChangedInput={onSubmitChangedInput}
            keyUp={keyUp}
          />
        </CSSTransition>
      );
    };

    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {filteredTodos.map(todo => {
            const { id } = todo;

            return item(id, todo);
          })}
          {tempTodo && item(tempTodo.id, tempTodo)}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
