import classNames from 'classnames';
import React, { useState } from 'react';
import { createTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todos: Todo[],
  showErrorBanner: (message: string) => void,
  user: User | null,
  setTempNewTodo: (todo: Todo | null) => void,
  setTodos: (todos: Todo[]) => void,
  reloadTodo: (todo: Todo) => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todos,
  showErrorBanner,
  user,
  setTempNewTodo,
  setTodos,
  reloadTodo,
}) => {
  const [title, setTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const allCompleted = !todos.find(todo => !todo.completed);

  const changeTodosStatus = async () => {
    let todosToUpdate = [...todos];

    if (!allCompleted) {
      todosToUpdate = todosToUpdate.filter(todo => !todo.completed);
    }

    await Promise.all(
      todosToUpdate.map(
        todo => updateTodo(todo.id, { completed: !todo.completed }),
      ),
    ).then((updatedTodos) => updatedTodos.forEach(reloadTodo));
  };

  return (
    <header className="todoapp__header">

      {todos.length
        ? (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={
              classNames(
                'todoapp__toggle-all',
                { active: allCompleted },
              )
            }
            onClick={() => changeTodosStatus()}
          />
        ) : null}

      <form onSubmit={(event) => {
        event.preventDefault();

        if (title.trim() === '') {
          showErrorBanner('Title can\'t be empty');
        }

        if (user === null) {
          showErrorBanner('Title can\'t be empty');

          return;
        }

        setDisableInput(true);

        const newTodo: Pick<Todo, 'userId' | 'title' | 'completed'> = {
          title,
          userId: user.id,
          completed: false,
        };

        setTempNewTodo({ ...newTodo, id: 0 });

        createTodo(newTodo)
          .then((createdTodo) => {
            setTodos([...todos, createdTodo]);
          })
          .catch(() => showErrorBanner('Unable to add a todo'))
          .finally(() => {
            setTempNewTodo(null);
            setTitle('');
            setDisableInput(false);
          });
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
