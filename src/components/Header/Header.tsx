import React, { RefObject } from 'react';
import { NewTodo } from '../../types/NewTodo';
import { Todo } from '../../types/Todo';
import { patchTodoStatus } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  query: string;
  inputRef: RefObject<HTMLInputElement>;
  setQuery: (query: string) => void;
  addTodo: ({}: NewTodo) => void;
  showError: (message: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Header: React.FC<Props> = ({
  todos,
  query,
  inputRef,
  setQuery,
  addTodo,
  showError,
  setTodos,
}) => {
  const checkAllStatus = () => {
    return todos.every(todo => todo.completed);
  };

  const isAllActive = checkAllStatus();

  const changeStatus = () => {
    const todosToUpdate = todos.filter(todo => isAllActive || !todo.completed);

    const promises = todosToUpdate.map(todo =>
      patchTodoStatus({
        ...todo,
        completed: isAllActive ? false : true,
      }),
    );

    Promise.all(promises)
      .then(newTodos => {
        setTodos(
          todos.map(todo => {
            const newItem = newTodos.find(newTodo => newTodo.id === todo.id);

            if (newItem) {
              return newItem;
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clearQuery = query.trim();

    if (clearQuery) {
      addTodo({ title: clearQuery });
    } else {
      showError('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: isAllActive })}
          data-cy="ToggleAllButton"
          onClick={changeStatus}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
