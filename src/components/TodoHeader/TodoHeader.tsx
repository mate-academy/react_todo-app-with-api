import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';

import { useTodo } from '../../context/TodoContext';
import { useError } from '../../context/ErrorContext';
import { TodoTempContext } from '../../context/TodoTempContext';
import { USER_ID } from '../../utils/variables';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  onHandleActive: (value: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({ onHandleActive }) => {
  const { setTodoTemp } = useContext(TodoTempContext);
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
    const allCompleted = todos.every(({ completed }) => completed);

    const updatePromises: Promise<Todo>[] = [];

    if (allCompleted) {
      todos.forEach(todo => {
        if (todo.completed) {
          const updatedTodo = { ...todo, completed: false };

          updatePromises.push(updateTodo(todo.id, updatedTodo));
        }
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          const updatedTodo = { ...todo, completed: true };

          updatePromises.push(updateTodo(todo.id, updatedTodo));
        }
      });
    }

    try {
      await Promise.all(updatePromises);

      setTodos(currentTodos => {
        return currentTodos.map(todo => ({
          ...todo,
          completed: !allCompleted,
        }));
      });
    } catch (error) {
      setErrorMessage(`Error updating todos:, ${error}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      inputRef?.current?.focus();

      return;
    }

    setTodoTemp({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setIsInputDisabled(true);
    onHandleActive(true);
    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then((newTodo) => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, newTodo]);
        setIsInputDisabled(false);
        setTitle('');

        setTimeout(() => {
          onHandleActive(false);
        }, 3000);
      })
      .catch(() => {
        setIsInputDisabled(false);
        setErrorMessage('Unable to add a todo');
        inputRef?.current?.focus();
        onHandleActive(true);
      })
      .finally(() => {
        setTodoTemp(null);
        inputRef?.current?.focus();
        onHandleActive(false);
      });

    onHandleActive(true);
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
