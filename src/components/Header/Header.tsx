/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  submitTodo: (todo: Todo) => void,
  setError: (message: ErrorType) => void,
  addTempTodo: (title: string) => void,
  setTempTodo: (tempTodo: null) => void,
  setLoading: (isLoading: boolean) => void,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({
  submitTodo,
  setError,
  addTempTodo,
  setTempTodo,
  setLoading,
  todos,
  setTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isTitleInputDisabled, setIsTitleInputDisabled] = useState(false);
  const user = useContext(AuthContext);

  const creatNewTodo = async () => {
    setIsTitleInputDisabled(true);
    addTempTodo(title);
    setLoading(true);

    try {
      const createdTodo = await createTodo(title, user?.id || 0);

      submitTodo(createdTodo);
    } catch {
      setError(ErrorType.AddingError);
    } finally {
      setIsTitleInputDisabled(false);
      setTempTodo(null);
      setLoading(false);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title) {
      creatNewTodo();
      setTitle('');
    } else {
      setError(ErrorType.TitleError);
    }
  };

  const onToggleAllClick = () => {
    const updatedTodos = todos.map(todo => (
      { ...todo, completed: !todos.every(x => x.completed) }));

    setTodos(updatedTodos);

    updatedTodos.forEach(async (todo) => {
      await updateTodo(todo.id, todo.completed, todo.title);
    });
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(x => x.completed),
        })}
        onClick={onToggleAllClick}
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTitleInputDisabled}
        />
      </form>
    </header>
  );
};
