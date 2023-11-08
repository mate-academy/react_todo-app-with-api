/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import cn from 'classnames';
import { Error } from '../../types/Error';
import { addTodo, updateTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../Context/Store';
import { Todo } from '../../types/Todo';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { userId, todos, error } = useContext(StateContext);

  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => refInput.current?.focus(), []);

  useEffect(() => {
    refInput.current?.focus();
  }, [todos.length]);

  useEffect(() => {
    if (error === Error.UnableAddTodo) {
      refInput.current?.focus();
    }
  }, [error]);

  const isAllCompleted = () => {
    return todos.every(todo => todo.completed);
  };

  const toggleCompleted = () => {
    let updateTodos: Todo[];
    let updatedPromises;

    if (isAllCompleted()) {
      updateTodos = [...todos];
      updatedPromises = updateTodos.map(todo => updateTodo({
        ...todo,
        completed: false,
      }));
    } else {
      updateTodos = todos.filter(todo => !todo.completed);
      updatedPromises = updateTodos
        .map(todo => updateTodo({
          ...todo,
          completed: true,
        }));
    }

    Promise.all(updatedPromises)
      .then(() => {
        updateTodos.forEach(todo => {
          dispatch({
            type: 'updateTodo',
            payload: {
              ...todo,
              completed: !todo.completed,
            },
          });
        });
      })
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableUpdateTodo,
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedTitle = title.trim();
    const newTodo = {
      title: preparedTitle,
      completed: false,
      userId,
    };

    if (!preparedTitle) {
      dispatch({
        type: 'setError',
        payload: Error.TitleNotEmpty,
      });

      return;
    }

    setIsSending(true);
    dispatch({
      type: 'tempTodo',
      payload: {
        ...newTodo,
        id: 0,
      },
    });

    addTodo(newTodo)
      .then((response) => {
        dispatch({
          type: 'addTodo',
          payload: response,
        });
        setTitle('');
      })
      .catch(() => {
        setTitle(preparedTitle);
        dispatch({
          type: 'setError',
          payload: Error.UnableAddTodo,
        });
      })
      .finally(() => {
        dispatch({
          type: 'tempTodo',
          payload: null,
        });
        setIsSending(false);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted(),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={refInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSending}
        />
      </form>
    </header>
  );
};
