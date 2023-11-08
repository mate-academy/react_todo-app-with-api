/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

import {
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TodoContext, USER_ID } from '../providers/TodoProvider';
import { TodoError } from '../types/TodoError';
import { addTodo, editTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { FormContext } from '../providers/FormProvider';

export const Form = () => {
  const {
    todos,
    setTodos,
    setError,
    inputRef,
  } = useContext(TodoContext);

  const {
    setPreparingTodoLabel,
    setIsCreating,
    setIsUpdating,
    setIsToggleAll,
    isToggleAll,
  } = useContext(FormContext);
  const [todoLabel, setTodoLabel] = useState('');
  const [isBlockedInput, setIsBlockedInput] = useState(false);

  useEffect(() => {
    if (isBlockedInput === false) {
      inputRef.current?.focus();
    }
  }, [isBlockedInput, inputRef]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoLabel.trim()) {
      setPreparingTodoLabel(todoLabel.trim());
      setIsCreating(true);
      setIsBlockedInput(true);

      addTodo({
        userId: USER_ID,
        title: todoLabel.trim(),
        completed: false,
      })
        .then((newTodo) => {
          setTodos((prevState: Todo[]) => [...prevState, newTodo] as Todo[]);
          setTodoLabel('');
        })
        .catch(() => setError(TodoError.Add))
        .finally(() => {
          setIsBlockedInput(false);
          setIsCreating(false);
          setTimeout(() => {
            setError(TodoError.Null);
          }, 3000);
        });
    } else {
      setError(TodoError.Title);

      setTimeout(() => setError(TodoError.Null), 3000);
    }
  };

  const isActiveButton = todos.every(task => task.completed);

  useEffect(() => setIsToggleAll(isActiveButton),
    [isActiveButton, setIsToggleAll]);

  const handleButtonClick = () => {
    setIsUpdating(true);

    if (isActiveButton) {
      todos.forEach(todo => {
        editTodo({ ...todo, completed: false })
          .then(() => {
            setTodos(prevTodos => {
              return prevTodos.map(prevTodo => ({
                ...prevTodo,
                completed: false,
              }));
            });
          })
          .catch(() => {
            setError(TodoError.Update);
          })
          .finally(() => {
            setIsUpdating(false);
            setIsToggleAll(false);
          });
      });
    } else {
      const todosToChange = todos.filter(todo => !todo.completed);

      todosToChange.forEach(todo => {
        editTodo({ ...todo, completed: true })
          .then(() => {
            setTodos(prevTodos => {
              return prevTodos.map(prevTodo => ({
                ...prevTodo,
                completed: true,
              }));
            });
          })
          .catch(() => {
            setError(TodoError.Update);
          })
          .finally(() => {
            setIsUpdating(false);
          });
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            {
              active: isToggleAll,
            },
          )}
          onClick={handleButtonClick}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoLabel}
          ref={inputRef}
          disabled={isBlockedInput}
          onChange={(event) => setTodoLabel(event.target.value)}
        />
      </form>
    </header>
  );
};
