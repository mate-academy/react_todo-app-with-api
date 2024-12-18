import React from 'react';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo[];
  onError: React.Dispatch<React.SetStateAction<string>>;
  updateTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
  updateTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  updateProcessedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: React.FC<Props> = ({
  todoList,
  onError,
  updateTodoList,
  updateTempTodo,
  updateProcessedIds,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const allTodosCompleted = useMemo(
    () => todoList.every(todo => todo.completed),
    [todoList],
  );
  const noTodos = todoList.length === 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const normalizeTitle = title.trim();

      if (!normalizeTitle) {
        onError('Title should not be empty');

        return;
      }

      setLoading(true);
      const newTodo = {
        userId: 2042,
        title: normalizeTitle,
        completed: false,
      };

      updateTempTodo({
        id: 0,
        ...newTodo,
      });

      addTodo(newTodo)
        .then(response => {
          setTitle('');
          updateTodoList(existing => [...existing, response]);
          setLoading(false);
        })
        .catch(() => onError('Unable to add a todo'))
        .finally(() => {
          setLoading(false);
          updateTempTodo(null);
        });
    },
    [title],
  );

  const handleTotalStatusUpdate = useCallback(() => {
    if (!allTodosCompleted) {
      todoList.forEach(todo => {
        if (!todo.completed) {
          updateProcessedIds(existing => [...existing, todo.id]);
          const toUpdate = { completed: true };

          updateTodo(todo.id, toUpdate)
            .then(() => {
              updateTodoList(existing =>
                existing.map(el =>
                  el.id === todo.id
                    ? { ...el, completed: toUpdate.completed }
                    : el,
                ),
              );
            })
            .catch(() => onError('Unable to update a todo'))
            .finally(() => {
              updateProcessedIds(existing =>
                existing.filter(id => id !== todo.id),
              );
            });
        }
      });
    }

    if (allTodosCompleted) {
      todoList.forEach(todo => {
        setLoading(true);
        updateProcessedIds(existing => [...existing, todo.id]);
        const toUpdate = { completed: false };

        updateTodo(todo.id, toUpdate)
          .then(() => {
            updateTodoList(existing =>
              existing.map(el =>
                el.id === todo.id
                  ? { ...el, completed: toUpdate.completed }
                  : el,
              ),
            );
          })
          .catch(() => onError('Unable to update a todo'))
          .finally(() => {
            setLoading(false);
            updateProcessedIds(existing =>
              existing.filter(id => id !== todo.id),
            );
          });
      });
    }
  }, [todoList]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoList, loading]);

  return (
    <header className="todoapp__header">
      {!noTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleTotalStatusUpdate}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
