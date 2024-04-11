import {
  ChangeEvent,
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
import { Action } from '../../types/Action';

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const [value, setValue] = useState('');

  const { todos } = useContext(StateContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useContext(DispatchContext);

  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  const handleMaxId = (): number => {
    const getIDs: number[] = todos.map(e => e.id);

    if (!getIDs.length) {
      return 1;
    }

    return Math.max(...getIDs) + 1;
  };

  const currentId = handleMaxId();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabledInput, todos.length]);

  const checkItemsHandler = todos.every(todo => todo.completed);

  const updateTodoStatus = (todo: Todo, action: Action) => {
    updateTodo({ ...todo, completed: !todo.completed })
      .then(() => {
        dispatch(action);
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to update a todo' },
        });
      });
  };

  const toggleTodos = () => {
    if (checkItemsHandler) {
      todos.forEach(todo => {
        updateTodoStatus(todo, { type: 'MAKE_COMPLETED_TODOS' });
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodoStatus(todo, { type: 'MAKE_UNCOMPLETED_TODOS' });
        }
      });
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
    createTodo({ title: value, id: currentId })
      .then(() => {
        dispatch({
          type: 'ADD_NEW_TODO',
          payload: { title: value, id: currentId },
        });
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

  const textHandlerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
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

      <form onSubmit={handleSubmitForm}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={value}
          disabled={disabledInput}
          onChange={textHandlerChange}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
