import React, { useEffect } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodo, USER_ID } from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type TodosState = {
  todos: Todo[];
  setTodos: (callback: (todos: Todo[]) => Todo[]) => void;
};

type TitleState = {
  todoTitle: string;
  setTodoTitle: (el: string) => void;
};

type ActivationArrowState = {
  activationArrow: boolean;
  setActivationArrow: (el: boolean) => void;
};

type Props = {
  todosState: TodosState;
  titleState: TitleState;
  setActivateTodosId: (el: number[]) => void;
  reset: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDeleting: boolean;
  loading: boolean;
  addTodos: (
    title: string,
    completed: boolean,
    userId: number,
  ) => Promise<Todo | void>;
  setErrorMessage: (el: string) => void;
  activationArrowState: ActivationArrowState;
};

export const Header: React.FC<Props> = ({
  todosState,
  titleState,
  setActivateTodosId,
  reset,
  inputRef,
  isDeleting,
  loading,
  addTodos,
  setErrorMessage,
  activationArrowState,
}) => {
  {
    /* eslint-disable-next-line */
  }

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  {
    /* eslint-enable max-len */
  }

  const handleForm: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();

    if (!titleState.todoTitle.trim()) {
      showErrorMesage('Title should not be empty', setErrorMessage);

      return;
    }

    addTodos(titleState.todoTitle.trim(), false, USER_ID).then(() => {
      reset();
    });
  };

  const handleActivationArrow = () => {
    activationArrowState.setActivationArrow(
      !activationArrowState.activationArrow,
    );

    const newCompletedStatus = !activationArrowState.activationArrow;

    const idsToUpdate = todosState.todos
      .filter(todo => todo.completed !== newCompletedStatus)
      .map(todo => todo.id);

    setActivateTodosId(idsToUpdate);

    Promise.allSettled(
      todosState.todos.map(todo => {
        if (todo.completed === newCompletedStatus) {
          return Promise.resolve();
        }

        return updateTodo({ ...todo, completed: newCompletedStatus }).then(
          (updatedTodo: Todo) => {
            todosState.setTodos((prevTodos: Todo[]) =>
              prevTodos.map(td =>
                td.id === updatedTodo.id ? updatedTodo : td,
              ),
            );
          },
        );
      }),
    ).finally(() => {
      setActivateTodosId([]);
    });
  };

  const areAllCompleted = todosState.todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todosState.todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            handleActivationArrow();
          }}
        />
      )}

      <form onSubmit={handleForm}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleState.todoTitle}
          onChange={el => {
            titleState.setTodoTitle(el.target.value);
          }}
          disabled={loading || isDeleting}
        />
      </form>
    </header>
  );
};
