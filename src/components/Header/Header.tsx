import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StateContext } from '../../utils/Store';
import { addTodo, updateTodo } from '../../api/todos';
// import { Todo } from '../../types/Todo';
// import { Todo } from '../../types/Todo';

export const Header = () => {
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);
  const [title, setTitle] = useState('');
  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputReference.current?.focus();
  }, [state.todos, state.tempTodo]);

  const handleTitleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const getRandomDigits = () => {
    return Math.random().toFixed(4).slice(2);
  };

  const Submit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (title.length === 0 || title.trim().length === 0) {
      dispatch({
        type: 'setError',
        payload: 'Title should not be empty',
      });

      return;
    }

    const todo = {
      id: +getRandomDigits(),
      title: title.trim(),
      completed: false,
      userId: 575,
    };

    dispatch({
      type: 'setTempTodo',
      payload: todo,
    });
    dispatch({
      type: 'addToLoading',
      payload: { id: todo.id },
    });
    dispatch({
      type: 'setError',
      payload: '',
    });

    addTodo(todo)
      .then(() => {
        setTitle('');

        dispatch({
          type: 'addTodo',
          payload: todo,
        });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: 'Unable to add a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'setTempTodo',
          payload: null,
        });
        dispatch({
          type: 'removeFromLoading',
          payload: { id: todo.id },
        });
      });
  };

  const notCompleted = state.todos.filter(todo => todo.completed === false);

  const AllCompleted = () => {
    if (notCompleted.length > 0) {
      for (const todo of notCompleted) {
        dispatch({
          type: 'addToLoading',
          payload: { id: todo.id },
        });

        updateTodo({
          ...todo,
          completed: !todo.completed,
        })
          .then(() => {
            dispatch({
              type: 'toggleTodo',
              payload: { id: todo.id },
            });
          })
          .catch(() => {
            dispatch({
              type: 'setError',
              payload: 'Unable to complete all todos',
            });
          })
          .finally(() => {
            dispatch({
              type: 'removeFromLoading',
              payload: { id: todo.id },
            });
          });
      }
    } else {
      for (const todo of state.todos) {
        dispatch({
          type: 'addToLoading',
          payload: { id: todo.id },
        });

        updateTodo({
          ...todo,
          completed: !todo.completed,
        })
          .then(() => {
            dispatch({
              type: 'toggleTodo',
              payload: { id: todo.id },
            });
          })
          .catch(() => {
            dispatch({
              type: 'setError',
              payload: 'Unable to complete all todos',
            });
          })
          .finally(() => {
            dispatch({
              type: 'removeFromLoading',
              payload: { id: todo.id },
            });
          });
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={AllCompleted}
      />

      <form method="POST" onSubmit={Submit}>
        <input
          disabled={!!state.tempTodo}
          ref={inputReference}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleAdd}
        />
      </form>
    </header>
  );
};
