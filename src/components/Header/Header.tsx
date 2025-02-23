import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { CreateTodoForm } from '../CreateTodoForm';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  todos: Todo[];
  submitting: boolean;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  errorMessage,
  setErrorMessage,
  addTodo,
  todos,
  submitting,
  updateTodo,
}) => {
  const allCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleToggleAll = () => {
    const allActive = todos.every(todo => !todo.completed);

    if (allCompleted || allActive) {
      todos.forEach(todo =>
        updateTodo({
          id: todo.id,
          userId: todo.userId,
          title: todo.title,
          completed: !todo.completed,
        }),
      );

      return;
    }

    todos.filter(todo => {
      if (!todo.completed) {
        updateTodo({
          id: todo.id,
          userId: todo.userId,
          title: todo.title,
          completed: !todo.completed,
        });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <CreateTodoForm
        title={title}
        setTitle={setTitle}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        addTodo={addTodo}
        todos={todos}
        submitting={submitting}
      />
    </header>
  );
};
