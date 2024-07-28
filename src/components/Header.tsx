import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { updateTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  handleNewTodo: (event: React.ChangeEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodoId: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  handleNewTodo,
  inputRef,
  title,
  setTitle,
  setTodos,
  loadingTodoId,
}) => {
  const loading = loadingTodoId.length > 0;
  const todoComleted = todos.every(todo => todo.completed);
  const allToggle = !loading && todos.length > 0;

  const toggleTodos = () => {
    const toggleStatus = !todoComleted;
    const previousTodos = todos;

    setTodos(currentTodos =>
      currentTodos.map(todo => ({
        ...todo,
        completed: toggleStatus,
      })),
    );

    const filteredTodos = todos.filter(todo => todo.completed !== toggleStatus);

    filteredTodos.forEach(todo => {
      updateTodo({
        ...todo,
        completed: toggleStatus,
      }).catch(() => {
        setTodos(previousTodos);
      });
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
  };

  return (
    <header className="todoapp__header">
      {allToggle && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todoComleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleTodos}
        />
      )}
      <form onSubmit={handleNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
