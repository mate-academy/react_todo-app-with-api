import {
  FC, useEffect, useRef, useState, ChangeEvent, FormEvent,
} from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';
import { ErrorMessage } from '../types/ErrorMessages';
import { USER_ID } from '../USER_ID';
import { postTodo } from '../api/todos';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  const {
    tempTodo,
    todos,
    completedTodosNum,
    toggleAllStatus,
    setErrorMessage,
    setTodosBeingLoaded,
    setTempTodo,
    setTodos,
  } = useAppContext();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const todoTitle = inputValue.trim();

    if (!todoTitle) {
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTodosBeingLoaded(prev => ([
      ...prev, 0,
    ]));

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const response = await postTodo(newTodo);

      setTodos(prev => ([...prev, response]));
      setInputValue('');
    } catch (error) {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setTodosBeingLoaded(prev => prev.filter(todoId => todoId !== 0));
    }
  };

  useEffect(() => {
    if (todoInputRef.current && tempTodo === null) {
      todoInputRef.current.focus();
    }
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: completedTodosNum === todos.length,
            })}
            data-cy="ToggleAllButton"
            onClick={toggleAllStatus}
          />
        )
      }

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleInputSubmit}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
