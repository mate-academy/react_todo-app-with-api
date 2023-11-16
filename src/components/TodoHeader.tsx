import React, {
  useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { addTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void;
  setTodosError: (error: ErrorMessage) => void;
  tempTodos: Todo | null;
  setTempTodos: (value: Todo | null) => void;
  setIsLoading: (value: boolean | number) => void;
  onTodoToggle: (value: Todo | null) => void;
  setNewTodoLoad: (value: number) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  setTodosError,
  tempTodos,
  setTempTodos,
  setIsLoading,
  onTodoToggle,
  setNewTodoLoad,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [tempTodos, todos.length]);

  const isActiveButton = todos.every(todo => todo.completed);

  const addTodoHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTimeout(() => {
        setTodosError(ErrorMessage.TitleShouldNotBeEmpty);
      }, 3000);

      return;
    }

    setIsLoading(true);
    const id = todos[todos.length - 1].id + 1;

    const tempTodo = {
      id,
      userId: 11859,
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

  const onTodoToggleHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onTodoToggle(null);
  };

  return (
    <header className="todoapp__header">

      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isActiveButton },
          )}
          onClick={onTodoToggleHandler}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={addTodoHandler}
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
