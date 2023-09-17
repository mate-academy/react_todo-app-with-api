import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Errors';

const USER_ID = 11128;

type Props = {
  todos: Todo[];
  addTempTodo:(todo: Todo | null) => void;
  addTodo: (newTodo: Todo) => Promise<void>;
  onErrorMessage:(error:ErrorType) => void;
  changeTodoStatus:()=>void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  addTodo,
  onErrorMessage,
  addTempTodo,
  changeTodoStatus,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onErrorMessage(ErrorType.emptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    addTempTodo(newTodo);
    setIsSubmit(true);

    addTodo(newTodo)
      .then(() => setTitle(''))
      .catch(() => {
        onErrorMessage(ErrorType.addTodo);
      })
      .finally(() => {
        addTempTodo(null);
        setIsSubmit(false);
      });
  };

  const complitedTodods = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0
          && (
            <button
              aria-label="btn"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: complitedTodods,
              })}
              onClick={changeTodoStatus}
            />
          )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmit}
        />
      </form>
    </header>
  );
};
