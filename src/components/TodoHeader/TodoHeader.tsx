import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import cn from 'classnames';

function createTodo(title: string): Omit<Todo, 'id'> {
  return {
    userId: client.USER_ID,
    title: title,
    completed: false,
  };
}

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  todos: Todo[] | undefined;
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  setError: Dispatch<SetStateAction<string>>;
  setTempTodo: Dispatch<SetStateAction<Omit<Todo, 'id'> | null>>;
  isFormDisabled: boolean;
  setIsFormDisabled: Dispatch<SetStateAction<boolean>>;
  deletingTodoIds: number[];
  setUpdatingTodoIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoHeader = ({
  query,
  setQuery,
  todos,
  setTodos,
  setError,
  setTempTodo,
  isFormDisabled,
  setIsFormDisabled,
  deletingTodoIds,
  setUpdatingTodoIds,
}: Props) => {
  const isAllCompleted = todos?.every(task => task.completed) ?? false;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFormDisabled) {
      inputRef.current?.focus();
    }
  }, [isFormDisabled, deletingTodoIds]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={() => {
            todos?.forEach(todo => {
              if (isAllCompleted || todo.completed === false) {
                setUpdatingTodoIds(previous => [...previous, todo.id]);
                client
                  .editTodo(todo.id, {
                    ...todo,
                    completed: !isAllCompleted,
                  })
                  .then(updatedTodo => {
                    setTodos(previousTodos =>
                      previousTodos?.map(item => {
                        if (item.id === updatedTodo.id) {
                          return updatedTodo;
                        }

                        return item;
                      }),
                    );
                  })
                  .catch(() => setError('Unable to update todo'))
                  .finally(() => {
                    setUpdatingTodoIds(previous =>
                      previous.filter(id => id !== todo.id),
                    );
                  });
              }
            });
          }}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();

          if (query.trim() !== '') {
            setTempTodo(createTodo(query.trim()));
            setIsFormDisabled(true);

            client
              .addTodo(createTodo(query.trim()))
              .then(newTodo => {
                setTodos(previousTodos =>
                  previousTodos ? [...previousTodos, newTodo] : [newTodo],
                );
                setQuery('');
              })
              .catch(() => {
                setError('Unable to add a todo');
              })
              .finally(() => {
                setIsFormDisabled(false);
                setTempTodo(null);
              });
          } else {
            setError('Title should not be empty');
          }
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          autoFocus={true}
          disabled={isFormDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
