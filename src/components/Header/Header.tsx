import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  handleAddTodo: (event: React.ChangeEvent<HTMLFormElement>) => void;
  titleField: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodos: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  titleField,
  title,
  setTitle,
  setTodos,
  loadingTodos,
}) => {
  const allCompleted = todos.every(todo => todo.completed);
  const isLoading = loadingTodos.length > 0;
  const showToggleAll = !isLoading && todos.length > 0;

  const toggleAllTodos = () => {
    const newStatus = !allCompleted;

    setTodos(
      todos.map(todo => ({
        ...todo,
        completed: newStatus,
      })),
    );

    todos
      .filter(todo => todo.completed !== newStatus)
      .forEach(todo => {
        updateTodo({
          ...todo,
          completed: newStatus,
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
          setTodos(current =>
            current.map(t => {
              if (t.id === todo.id) {
                return { ...t, completed: !newStatus };
              }

              return t;
            }),
          );
        });
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {showToggleAll && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={event => setTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
