import classNames from 'classnames';
import React, {
  FC, FormEvent, useContext, useRef, useState,
} from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { ErrorContext } from './ErrorContext';
import { Loaders } from './Loaders';

type Props = {
  isCurrentClicked: boolean,
  todo: Todo,
  isNewTodoLoaded: boolean,
  visibleTodos: Todo[],
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  clickedIndex: number,
  setClickedIndex: React.Dispatch<React.SetStateAction<number>>
  isCompletedTodosDeleting: boolean,
  areTodosToggling: boolean,
  index: number,
};

export const TodoComponent: FC<Props> = ({
  isCurrentClicked,
  todo,
  isNewTodoLoaded,
  visibleTodos,
  setVisibleTodos,
  clickedIndex,
  setClickedIndex,
  isCompletedTodosDeleting,
  areTodosToggling,
  index,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useContext(AuthContext);

  const [isTodoDeleted, setIsTodoDeleted] = useState(true);
  const [isTodoEdited, setIsTodoEdited] = useState(true);
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [isTodoToggled, setIsTodoToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {
    setIsRemoveErrorShown,
    setHasLoadingError,
    setIsEmptyTitleErrorShown,
    setIsTogglingErrorShown,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  function setErrorsToFalseExceptRemoveError() {
    setIsEmptyTitleErrorShown(false);
    setHasLoadingError(false);
    setIsTogglingErrorShown(false);
    setIsAddingErrorShown(false);

    setIsRemoveErrorShown(true);
  }

  function setErrorsToFalseExceptTogglingError() {
    setIsEmptyTitleErrorShown(false);
    setHasLoadingError(false);
    setIsRemoveErrorShown(false);
    setIsAddingErrorShown(false);

    setIsTogglingErrorShown(true);
  }

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const deleteTodoHandler = (todoId: number) => {
    setIsTodoDeleted(false);

    if (user) {
      deleteTodo(user.id, todoId)
        .then((() => {
          setIsTodoDeleted(true);
          setVisibleTodos(prevTodos => prevTodos.filter(x => x.id !== todoId));
          setIsRemoveErrorShown(false);
        }))
        .catch(() => {
          setErrorsToFalseExceptRemoveError();
          setIsTodoDeleted(true);
        });
    }
  };

  const handleToggleTodo = (todoId: number, todoTitle: string) => {
    const clickedTodo = visibleTodos.find(x => x.id === todoId);

    setIsTodoToggled(true);

    if (clickedTodo && user) {
      updateTodo(user.id, todoId, {
        completed: !clickedTodo?.completed,
        title: todoTitle,
      })
        .then(() => {
          setIsTogglingErrorShown(false);

          setIsTodoToggled(false);
          setVisibleTodos(prevTodos => prevTodos.map(x => {
            const currentTodo = x;

            if (currentTodo.id === todoId) {
              currentTodo.completed = !todo.completed;
            }

            return currentTodo;
          }));
        })
        .catch(() => {
          setErrorsToFalseExceptTogglingError();
          setIsTodoToggled(false);
        });
    }
  };

  const onDoubleClick = (i: number) => {
    setIsTodoEditing(true);
    setClickedIndex(i);
  };

  const onEditSubmit = (
    event: FormEvent<HTMLFormElement>,
    todoId: number,
    todoCompleted: boolean,
  ) => {
    event.preventDefault();
    setIsTodoEdited(false);

    const clickedTodoTitle = visibleTodos.find(currentTodo => {
      return currentTodo.id === todoId;
    })?.title;

    if (inputRef.current?.value.length === 0 && user) {
      deleteTodo(user.id, todoId)
        .then(() => {
          setVisibleTodos(prev => prev.filter(x => x.id !== todoId));
          setIsTodoEditing(false);
          setIsTodoEdited(true);
        }).catch(() => {
          inputRef.current?.blur();
          setIsTodoEditing(false);
          setIsTodoEdited(true);

          setIsTodoDeleted(true);

          setErrorsToFalseExceptRemoveError();
        });

      return;
    }

    if (inputValue === clickedTodoTitle) {
      inputRef.current?.blur();
      setIsTodoEdited(true);

      return;
    }

    if (inputRef.current && user) {
      updateTodo(user.id, todoId, {
        title: inputRef.current?.value.trim(),
        completed: todoCompleted,
      }).then(() => {
        setIsTodoEditing(false);
        setIsTodoEdited(true);
        setVisibleTodos(prevTodos => prevTodos.map(el => {
          const prevTodo = el;

          if (prevTodo.id === todoId && inputRef.current) {
            prevTodo.title = inputRef?.current.value;
          }

          return prevTodo;
        }));
      }).catch(() => {
        setIsTodoEdited(true);
        setIsTodoEditing(false);

        setErrorsToFalseExceptTogglingError();
      });
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      onDoubleClick={() => {
        onDoubleClick(index);
        setInputValue(todo.title);
        setIsTodoEditing(true);
        setTimeout(() => {
          if (inputRef) {
            inputRef.current?.focus();
          }
        }, 0);
      }}
    >
      <label className={classNames(
        'todo__status-label',
        { hidden: isTodoEditing && isCurrentClicked },
      )}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            setClickedIndex(index);
            handleToggleTodo(todo.id, todo.title);
          }}
        />
      </label>

      {isTodoEditing && index === clickedIndex ? (
        <form
          onSubmit={(event) => onEditSubmit(
            event,
            todo.id,
            todo.completed,
          )}
          className="todo__title-form"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            ref={inputRef}
            onBlur={() => setIsTodoEditing(false)}
            onKeyDown={onKeyDownHandler}
            className="todo__input"
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className={classNames(
          'todo__remove',
          { hidden: isTodoEditing && index === clickedIndex },
        )}
        data-cy="TodoDeleteButton"
        onClick={() => {
          setClickedIndex(index);
          deleteTodoHandler(todo.id);
        }}
      >
        ×
      </button>

      <Loaders
        isCurrentClicked={isCurrentClicked}
        isNewTodoLoaded={isNewTodoLoaded}
        isTodoToggled={isTodoToggled}
        isTodoDeleted={isTodoDeleted}
        isTodoEdited={isTodoEdited}
        areTodosToggling={areTodosToggling}
        todoCompleted={todo.completed}
        isCompletedTodosDeleting={isCompletedTodosDeleting}
      />
    </div>
  );
};
