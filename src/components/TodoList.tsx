import classNames from 'classnames';
import {
  FC, FormEvent, useContext, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import {
  /* deleteTodo, updateTodo */
  deleteTodo2,
  updateTodo2,
} from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { Loader } from './Loader';
import { ErrorContext } from './ErrorContext';

type Props = {
  visibleTodos: Todo[],
  isNewTodoLoaded: boolean,
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setClickedIndex: React.Dispatch<React.SetStateAction<number>>,
  clickedIndex: number,
  isCompletedTodosDeleting: boolean,
  areTodosToggling: boolean,
};

export const TodoList: FC<Props> = ({
  isNewTodoLoaded,
  visibleTodos,
  setVisibleTodos,
  clickedIndex,
  setClickedIndex,
  isCompletedTodosDeleting,
  areTodosToggling,
}) => {
  const user = useContext(AuthContext);
  const [isTodoDeleted, setIsTodoDeleted] = useState(true);
  const [isTodoToggled, setIsTodoToggled] = useState(false);
  const [isTodoEdited, setIsTodoEdited] = useState(true);
  const {
    setIsRemoveErrorShown,
    setHasLoadingError,
    setIsEmptyTitleErrorShown,
    setIsTogglingErrorShown,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');

  const deleteTodoHandler = (todoId: number) => {
    setIsTodoDeleted(false);

    if (user) {
      deleteTodo2(/* user.id, */ todoId) // give user id as first param on deleteTodo
        .then((() => {
          setIsTodoDeleted(true);
          setVisibleTodos(prevTodos => prevTodos.filter(x => x.id !== todoId));
          setIsRemoveErrorShown(false);
        }))
        .catch(() => {
          // set all other errors to false so they don`t overlap each other
          setIsEmptyTitleErrorShown(false);
          setHasLoadingError(false);
          setIsTogglingErrorShown(false);
          setIsAddingErrorShown(false);

          setIsRemoveErrorShown(true);
          setIsTodoDeleted(true);
        });
    }
  };

  const handleToggleTodo = (todoId: number, todoTitle: string) => {
    const clickedTodo = visibleTodos.find(x => x.id === todoId);

    setIsTodoToggled(true);

    if (user && clickedTodo) {
      updateTodo2(/* user.id, */ todoId,
        {
          completed: !clickedTodo?.completed,
          title: todoTitle,
        })
        .then(() => {
          setIsTogglingErrorShown(false);

          setIsTodoToggled(false);
          setVisibleTodos(prevTodos => prevTodos.map(x => {
            const todo = x;

            if (todo.id === todoId) {
              todo.completed = !todo.completed;
            }

            return todo;
          }));
        })
        .catch(() => {
          // set all other errors to false so they don`t overlap each other
          setIsEmptyTitleErrorShown(false);
          setHasLoadingError(false);
          setIsRemoveErrorShown(false);
          setIsAddingErrorShown(false);

          setIsTogglingErrorShown(true);
          setIsTodoToggled(false);
        });
    }
  };

  const [isTodoEditing, setIsTodoEditing] = useState(false);

  const onDoubleClick = (index: number) => {
    setIsTodoEditing(true);
    setClickedIndex(index);
  };

  const onEditSubmit = (
    event: FormEvent<HTMLFormElement>,
    todoId: number,
    todoCompleted: boolean,
  ) => {
    event.preventDefault();
    setIsTodoEdited(false);

    if (inputRef.current?.value.length === 0) {
      deleteTodo2(/* user.id, */ todoId)
        .then(() => {
          setVisibleTodos(prev => prev.filter(x => x.id !== todoId));
          setIsTodoEditing(false);
          setIsTodoEdited(true);
        }).catch(() => {
          setIsTodoEdited(true);

          // set all other errors to false so they don`t overlap each other
          setIsEmptyTitleErrorShown(false);
          setHasLoadingError(false);
          setIsTogglingErrorShown(false);
          setIsAddingErrorShown(false);

          setIsRemoveErrorShown(true);
          // setIsTodoDeleted(true);
        });

      return;
    }

    if (user && inputRef.current) {
      updateTodo2(/* user.id, */
        todoId,
        {
          title: inputRef.current?.value,
          completed: todoCompleted,
        },
      ).then(() => {
        setIsTodoEditing(false);
        setIsTodoEdited(true);
      }).catch(() => {
        setIsTodoEdited(false);
      });
    }
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo, index) => {
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
              { hidden: isTodoEditing && index === clickedIndex },
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
              <form onSubmit={(event) => onEditSubmit(
                event,
                todo.id,
                todo.completed,
              )}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  ref={inputRef}
                  onBlur={() => setIsTodoEditing(false)}
                  onKeyDown={onKeyDownHandler}
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

            {index === clickedIndex && (
              <Loader
                isActiveCondition={((!isNewTodoLoaded))}
              />
            )}

            {index === clickedIndex && (
              <Loader isActiveCondition={isTodoToggled} />
            )}

            {index === clickedIndex && (
              <Loader isActiveCondition={!isTodoDeleted} />
            )}

            {index === clickedIndex && (
              <Loader isActiveCondition={!isTodoEdited} />
            )}

            <Loader
              isActiveCondition={(todo.completed && isCompletedTodosDeleting)}
            />

            <Loader isActiveCondition={areTodosToggling} />
          </div>
        );
      })}
    </section>
  );
};
