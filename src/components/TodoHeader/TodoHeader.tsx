/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import * as todosAPI from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useTodosState } from '../../contexts/TodosContext';
import { useErrorsState } from '../../contexts/ErrorsContext';

const TEMP_TODO_ID = 0;
const USER_ID = 11645;

type Props = {
  isLoading: boolean;
  isFocusedInput: boolean;
  triggerInputFocus: () => void;
  setLoading: (isLoading: boolean) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const TodoHeader: React.FC<Props> = ({
  isLoading,
  isFocusedInput,
  triggerInputFocus,
  setLoading,
  setTempTodo,
}) => {
  const [todos, todosDispatch] = useTodosState();
  const [, setErrorMessage] = useErrorsState();

  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [isFocusedInput]);

  const sendAsyncStatusUpdates = (todosToUpdate: Todo[]) => {
    const updatingPromises: Promise<any>[] = [];
    const updatedTodoIds: number[] = [];

    todosToUpdate.forEach(todo => {
      updatingPromises.push(
        new Promise((resolve, reject) => {
          todosAPI.updateTodo(todo.id, { completed: !todo.completed })
            .then(() => resolve(todo.id))
            .catch(reject);
        }),
      );
    });

    Promise.allSettled(updatingPromises)
      .then(results => {
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            updatedTodoIds.push(result.value);
          } else {
            setErrorMessage('Unable to update a todo');
          }
        });
      })
      .finally(() => todosDispatch(
        { type: 'toggle status of specified', payload: updatedTodoIds },
      ));
  };

  const handleToggleAllStatus = () => {
    if (isAllCompleted) {
      sendAsyncStatusUpdates(todos);
    } else {
      sendAsyncStatusUpdates(todos.filter(todo => !todo.completed));
    }
  };

  const handleInputTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const todoTitle = inputText.trim();

    if (todoTitle.length > 0) {
      setTempTodo({
        id: TEMP_TODO_ID,
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      });
      setLoading(true);

      todosAPI.createTodo({
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      })
        .then(createdTodo => {
          todosDispatch({ type: 'create', payload: createdTodo });
          setInputText('');
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          triggerInputFocus();
          setLoading(false);
          setTempTodo(null);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllStatus}
          />
        )
      }

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputTyping}
          value={inputText}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
