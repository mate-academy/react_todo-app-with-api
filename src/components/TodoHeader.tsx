import React, {
  useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { addTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { USER_ID } from '../utils/userId';

type Props = {
  todos: Todo[],
  todo: Todo[],
  setTodos: (todos: Todo[]) => void;
  setTodosError: (error: ErrorMessage) => void;
  tempTodos: Todo | null;
  setTempTodos: (value: Todo | null) => void;
  setIsLoading: (value: boolean | number) => void;
  onTodoToggle: (value: Todo | null) => void;
  setNewTodoLoad: (value: number) => void;
  updatedTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  todo,
  setTodos,
  setTodosError,
  tempTodos,
  setTempTodos,
  setIsLoading,
  onTodoToggle,
  setNewTodoLoad,
  updatedTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const focusedInput = useRef<HTMLInputElement>(null);

  const isActiveButton = todo.every(t => t.completed);

  const handlerSubmitData = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTimeout(() => {
        setTodosError(ErrorMessage.TitleShouldNotBeEmpty);
      }, 3000);

      return;
    }

    setIsLoading(true);

    let id;

    if (!todos.length) {
      id = 4;
    } else {
      id = todos[todos.length - 1].id + 1;
    }

    const tempTodo = {
      id,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodos(tempTodo);

    try {
      await addTodos(tempTodo);
      setNewTodoLoad(id);
      setTodos([...todos, tempTodo]);
      setTempTodos(null);
      setTodoTitle('');
    } catch (error) {
      setTempTodos(null);

      setTimeout(() => {
        setTodosError(ErrorMessage.UnableToAddTodo);
      }, 3000);

      throw new Error('Some error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [updatedTodos, todo.length]);

  return (
    <header className="todoapp__header">

      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
      {todo.length > 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isActiveButton },
          )}
          onClick={() => onTodoToggle(null)}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handlerSubmitData}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          ref={focusedInput}
          onChange={(event) => setTodoTitle(
            event.target.value,
          )}
          disabled={tempTodos !== null}
        />
      </form>
    </header>
  );
};
