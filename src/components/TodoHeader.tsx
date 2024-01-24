import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import * as postServise from '../api/todos';
import { TodosContext } from './TodoProvider';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

type Props = {
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string,
  setTitle: (value: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  handleChangeInput,
  title,
  setTitle,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const {
    todos,
    setTodos,
    setError,
    userId,
    setTempTodo,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError(Errors.ERRORS_EMPTY_TITLE);

      return;
    }

    setIsSubmiting(true);

    try {
      const temporaryTodo: Todo = {
        id: Date.now(),
        title: title.trim(),
        completed: false,
        userId,
      };

      setTempTodo(temporaryTodo);

      const newTodo = await postServise.createTodo(temporaryTodo);

      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTitle('');
    } catch (newError) {
      setError(Errors.UNABLE_ADD);
    } finally {
      setTempTodo(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setIsSubmiting(false);
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    await Promise.all(todos.map(async (todo) => {
      try {
        await postServise.updateTodo({
          todo: { ...todo, completed: !allCompleted },
          todoId: todo.id,
        });
      } catch (updateError) {
        setError(Errors.UNABLE_UPDATE);
      }
    }));

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="toggle"
          type="button"
          className={cn('todoapp__toggle-all',
            todos.every(t => t.completed) && 'active')}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmiting}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
        />
      </form>
    </header>
  );
};
