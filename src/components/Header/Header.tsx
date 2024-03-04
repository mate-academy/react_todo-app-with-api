import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { addTodo, toggleAllTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  callError: () => void;
  errorMessage: (message: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setLoaderToAll: (loader: boolean) => void;
  setErrorMessage: (message: string) => void;
  showErrorCallback: () => void;
};

export const Header: React.FC<Props> = ({
  callError,
  errorMessage,
  setTempTodo,
  setLoaderToAll,
  showErrorCallback,
  setErrorMessage,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const { todos, setTodos } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const allTodosCompleted = todos.every(todo => todo.completed);

  const setInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTodoTitle.trim().length) {
      setInputDisabled(true);
      setTempTodo({
        title: newTodoTitle.trim(),
        id: 0,
        userId: 163,
        completed: false,
      });

      addTodo(newTodoTitle)
        .then(response => {
          setTodos([...todos, response]);
          setNewTodoTitle('');
        })
        .catch(() => {
          errorMessage('Unable to add a todo');
          callError();
        })
        .finally(() => {
          setInputDisabled(false);
          setTempTodo(null);
          setInputFocus();
        });
    } else {
      e.preventDefault();
      errorMessage('Title should not be empty');
      callError();
    }
  };

  const handleToggleAll = (todosToUpdate: Todo[]) => {
    setLoaderToAll(true);
    toggleAllTodos(todosToUpdate)
      .then(() => {
        if (todos.every(todo => todo.completed)) {
          setTodos(
            todos.map(todo => {
              return { ...todo, completed: false };
            }),
          );
        } else {
          setTodos(
            todos.map(todo => {
              return { ...todo, completed: true };
            }),
          );
        }
      })
      .catch(() => {
        setErrorMessage?.('Unable to update todos');
        showErrorCallback?.();
      })
      .finally(() => {
        setLoaderToAll(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
        onClick={() => handleToggleAll(todos)}
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          id="todoInput"
          value={newTodoTitle}
          onChange={handleOnChange}
          disabled={inputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
