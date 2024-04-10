import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DispatchContext, StateContext } from '../../store/Store';
import { USER_ID, createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const [value, setValue] = useState<string>('');
  const { todos } = useContext(StateContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useContext(DispatchContext);
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, disabledInput]);

  const checkItemsHandler = todos.every(todo => todo.completed);

  const toggleTodos = async () => {
    if (checkItemsHandler) {
      await Promise.all(
        todos.map(todo => {
          updateTodo({ ...todo, completed: !todo.completed })
            .then(() => dispatch({ type: 'MAKE_COMPLETED_TODOS' }))
            .catch(() => {
              dispatch({
                type: 'SHOW_ERROR_MESSAGE',
                payload: { message: 'Unable to update a todo' },
              });
            });
        }),
      );
    } else {
      await Promise.all(
        todos.map(todo => {
          if (!todo.completed) {
            updateTodo({ ...todo, completed: !todo.completed })
              .then(() => dispatch({ type: 'MAKE_UNCOMPLETED_TODOS' }))
              .catch(() => {
                dispatch({
                  type: 'SHOW_ERROR_MESSAGE',
                  payload: { message: 'Unable to update a todo' },
                });
              });
          }
        }),
      );
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim().length) {
      dispatch({
        type: 'SHOW_ERROR_MESSAGE',
        payload: { message: 'Title should not be empty' },
      });

      return;
    }

    setDisabledInput(true);
    setTempTodo({ id: 0, userId: USER_ID, title: value, completed: false });
    createTodo({ title: value })
      .then(() => {
        dispatch({ type: 'ADD_NEW_TODO', payload: { title: value } });
        setDisabledInput(false);
        setValue('');
      })
      .catch(() => {
        setDisabledInput(false);
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to add a todo' },
        });
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkItemsHandler,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={value}
          disabled={disabledInput}
          onChange={e => setValue(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
