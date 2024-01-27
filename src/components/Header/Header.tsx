/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';
import { addTodo, updateTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    handleErrorMessage,
    setTempTodo,
    setIsChangedStatus,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  inputRef.current?.focus();

  const createNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    addTodo(newTodo)
      .then(returnedTodo => {
        setTodos([...todos, returnedTodo]);
        setTitle('');
      })
      .catch(() => {
        handleErrorMessage(ErrorMessage.UNABLE_ADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleChangeStatusAllTodos = () => {
    const status = todos.every(todo => todo.completed);

    if (status) {
      setIsChangedStatus(false);
    } else {
      setIsChangedStatus(true);
    }

    todos.map((todo) => {
      const updatedTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: !todo.completed,
      };

      if (status || !todo.completed) {
        updateTodo(updatedTodo)
          .then((newTodo) => {
            setTodos(currentTodos => {
              const newTodos = [...currentTodos];
              const index = newTodos
                .findIndex(element => element.id === updatedTodo.id);

              newTodos.splice(index, 1, newTodo);

              return newTodos;
            });
          })
          .catch(() => {
            setTodos(todos);
            handleErrorMessage(ErrorMessage.UNABLE_UPDATE);
          })
          .finally(() => setIsChangedStatus(null));
      }

      return null;
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed) && todos.length > 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeStatusAllTodos}
        />
      )}

      <form onSubmit={createNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
