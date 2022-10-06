import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import classNames from 'classnames';
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  toggleAll: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  setErrorMessage,
  toggleAll,
}) => {
  const [isActive, setActive] = useState(false);
  const [rename, setRename] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.title);
  const [selectedTodo, setSelectedTodo] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const updatedTodos = [...todos];
  const todoIndex = todos.findIndex(foundTodo => {
    return foundTodo.id === todo.id;
  });

  const handleDelete = () => {
    setActive(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(tod => tod.id !== todo.id));
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleStatus = () => {
    setActive(true);
    const todoId = todo.id;

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        setActive(false);
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
      });

    updatedTodos[todoIndex].completed = !todo.completed;

    setTodos(updatedTodos);
  };

  const handleDoubleClick = () => {
    setRename(true);
    setSelectedTodo(todo.id);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const updateTitle = () => {
    setActive(true);

    if (!newTodoTitle) {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(tod => tod.id !== todo.id));
          setActive(false);
        })
        .catch(() => {
          setError(true);
          setErrorMessage('Unable to delete a todo');
        });

      setRename(false);

      return;
    }

    if (newTodoTitle === todo.title) {
      setRename(false);
      setActive(false);

      return;
    }

    if (todos.find(item => item.title === newTodoTitle)) {
      setRename(false);
      setSelectedTodo(0);
    }

    updatedTodos[todoIndex].title = newTodoTitle;

    updateTodo(todo.id, { title: newTodoTitle })
      .then(() => {
        setActive(false);
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
      });
    setRename(false);

    setTodos(updatedTodos);
    setNewTodoTitle('');
    setSelectedTodo(0);
  };

  const handleBlur = () => {
    updateTitle();
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setRename(false);
      setSelectedTodo(0);
    }

    if (event.key === 'Enter') {
      updateTitle();
      setSelectedTodo(0);
    }
  };

  return (
    <TransitionGroup>
      <CSSTransition
        key={todo.id}
        timeout={300}
        classNames="item"
      >
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleStatus}
            />
          </label>

          {!rename && (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={handleDoubleClick}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={handleDelete}
              >
                ×
              </button>
            </>
          )}

          {rename && (
            <form onSubmit={event => event.preventDefault()}>
              <input
                data-cy="TodoTitleField"
                type="text"
                ref={newTodoField}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTodoTitle}
                onChange={handleChangeTitle}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
              />
            </form>
          )}

          {(isActive || toggleAll) && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
