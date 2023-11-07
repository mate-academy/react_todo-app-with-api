/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessages';
import { TodosContext } from '../TodosContext';
import { addTodo, updateTodo } from '../../api/todos';

type Props = {
  onTodoAdd: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoHeader: React.FC<Props> = ({ onTodoAdd }) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setErrorWithTimeout,
  } = useContext(TodosContext);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedAllTodos, setCompletedAllTodos] = useState(false);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [isLoading, todos.length]);

  useEffect(() => {
    const todosCompleted = todos.every(todo => todo.completed);

    setCompletedAllTodos(todosCompleted);
  }, [todos]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    if (newTodo.trim() !== '') {
      setErrorMessage(null);
      setIsLoading(true);
      onTodoAdd({
        title: newTodo.trim(),
        completed: false,
        userId: 11813,
        id: 0,
      });

      addTodo({
        title: newTodo.trim(),
        completed: false,
        userId: 11813,
      })
        .then(createdTodo => {
          setTodos(currTodos => {
            return [...currTodos, createdTodo] as Todo[];
          });

          setNewTodo('');
        })
        .catch((err) => {
          setErrorWithTimeout(ErrorMessage.Adding, setErrorMessage);
          throw err;
        })
        .finally(() => {
          setIsLoading(false);
          onTodoAdd(null);
        });
    } else {
      setErrorWithTimeout(ErrorMessage.Title, setErrorMessage);
    }
  };

  const handleToggleAllTodos = () => {
    if (completedAllTodos) {
      todos.forEach(todo => {
        updateTodo(todo.id.toString(), { ...todo, completed: false })
          .then(() => {
            setTodos(currTodos => {
              return currTodos.map(currTodo => ({
                ...currTodo,
                completed: false,
              }));
            });
          })
          .catch(() => {
            setErrorWithTimeout(ErrorMessage.Loading, setErrorMessage);
          });
      });
    } else {
      const todosToChange = todos.filter(todo => !todo.completed);

      todosToChange.forEach(todo => {
        updateTodo(todo.id.toString(), { ...todo, completed: true })
          .then(() => {
            setTodos(currTodos => {
              return currTodos.map(currTodo => ({
                ...currTodo,
                completed: true,
              }));
            });
          })
          .catch(() => {
            setErrorWithTimeout(ErrorMessage.Loading, setErrorMessage);
          });
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length
        ? (
          <button
            type="button"
            data-cy="ToggleAllButton"
            className={cn('todoapp__toggle-all',
              { active: completedAllTodos })}
            onClick={handleToggleAllTodos}
          />
        )
        : null}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
