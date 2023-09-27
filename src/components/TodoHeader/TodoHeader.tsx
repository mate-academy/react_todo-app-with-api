import {
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';

import { useTodo } from '../../context/TodoContext';
import { useError } from '../../context/ErrorContext';
import { useTodoTemp } from '../../context/TodoTempContext';
import { USER_ID } from '../../utils/variables';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  onHandleActive: (value: boolean) => void;
  onToggleActive: (value: number[]) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onHandleActive, onToggleActive,
}) => {
  const { setTodoTemp } = useTodoTemp();
  const [title, setTitle] = useState('');
  const { todos, setTodos } = useTodo();
  const { errorMessage, setErrorMessage } = useError();

  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isActiveItemsLeft = todos.some(({ completed }) => !completed);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todos, errorMessage]);

  const toggleAll = async () => {
    const isAllCompleted = todos.every(({ completed }) => completed);

    if (isAllCompleted) {
      const allCompleted = todos
        .filter(({ completed }) => completed)
        .map(({ id }) => id);

      onToggleActive(allCompleted);
    } else {
      const allActive = todos
        .filter(({ completed }) => !completed)
        .map(({ id }) => id);

      onToggleActive(allActive);
    }

    const updatePromises = todos.map(todo => {
      const updatedTodo = { ...todo, completed: !todo.completed };

      return updateTodo(todo.id, updatedTodo);
    });

    try {
      await Promise.all(updatePromises);

      setTodos(currentTodos => {
        return currentTodos.map(todo => ({
          ...todo,
          completed: !isAllCompleted,
        }));
      });

      onToggleActive([]);
    } catch (error) {
      setErrorMessage(`Error updating todos: ${error}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      inputRef?.current?.focus();

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTodoTemp({
      ...newTodo,
      id: 0,
    });

    setIsInputDisabled(true);
    onHandleActive(true);

    createTodo(newTodo)
      .then((response) => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, response]);
        setIsInputDisabled(false);
        setTitle('');
      })
      .catch(() => {
        setIsInputDisabled(false);
        setErrorMessage('Unable to add a todo');
        inputRef?.current?.focus();
      })
      .finally(() => {
        setTodoTemp(null);
        inputRef?.current?.focus();
        onHandleActive(false);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="toggle all"
          className={classnames(
            'todoapp__toggle-all',
            {
              active: !isActiveItemsLeft,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isInputDisabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
