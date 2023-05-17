/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TodoContext } from '../../TodoContext/TodoContext';
import { USER_ID } from '../../utils/globalConst';
import { Errors } from '../../utils/enums';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

export const AddTodoForm = () => {
  const {
    todos,
    setTodos,
    addTodoTitle,
    setAddTodoTitle,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    setTempTodo,
    setClearingTodosId,
  } = useContext(TodoContext);
  const focusedAddInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      focusedAddInput.current?.focus();
    }
  }, [isLoading]);

  const delayErrorDisappear = useCallback(() => {
    setTimeout(() => {
      setErrorMessage(Errors.NoErrors);
    }, 3000);
  }, [errorMessage]);

  const handleChangeInputValue = useCallback((value: string) => {
    setErrorMessage(Errors.NoErrors);
    setAddTodoTitle(value);
  }, [addTodoTitle]);

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    if (!addTodoTitle) {
      setErrorMessage(Errors.TitleError);
      delayErrorDisappear();
      setIsLoading(false);

      return;
    }

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: addTodoTitle,
        completed: false,
      });

      const todoToAdd: Todo = await client.post(`/todos?userId=${USER_ID}`, {
        userId: USER_ID,
        title: addTodoTitle,
        completed: false,
      });

      setIsLoading(false);
      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, todoToAdd]);
    } catch {
      setErrorMessage(Errors.AddError);
      delayErrorDisappear();
    } finally {
      setAddTodoTitle('');
    }
  };

  const handleCompleteAllTodos = useCallback(async () => {
    if (todos.some(({ completed }) => !completed)) {
      try {
        setClearingTodosId(todos
          .filter(({ completed }) => !completed)
          .map(({ id }) => id));

        const activeTodos = todos.filter(({ completed }) => !completed);

        await Promise.all(activeTodos.map(({ id }) => client.patch(`/todos/${id}`, { completed: true })));

        setTodos(todos.map(todo => {
          if (!todo.completed) {
            todo.completed = true;
          }

          return todo;
        }));
      } catch {
        setErrorMessage(Errors.UpdateError);
      } finally {
        setClearingTodosId([]);
      }

      return;
    }

    if (todos.every(({ completed }) => completed)) {
      try {
        setClearingTodosId(todos.map(({ id }) => id));
        await Promise.all(todos.map(({ id }) => client.patch(`/todos/${id}`, { completed: false })));

        setTodos(todos.map(todo => {
          todo.completed = false;

          return todo;
        }));
      } catch {
        setErrorMessage(Errors.UpdateError);
      } finally {
        setClearingTodosId([]);
      }
    }
  }, [todos]);

  const isAnyActive = todos.some(({ completed }) => !completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAnyActive,
        })}
        onClick={handleCompleteAllTodos}
      />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addTodoTitle}
          onChange={(event) => {
            handleChangeInputValue(event.currentTarget.value);
          }}
          disabled={isLoading}
          ref={focusedAddInput}
        />
      </form>
    </header>
  );
};
