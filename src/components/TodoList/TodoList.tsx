import React, {
  useMemo, useEffect, useState, useRef, useCallback,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TypeOfFiltering } from '../../types/TypeOfFiltering';
import './TodoList.scss';
import { Loader } from '../Loader';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  filterType: TypeOfFiltering;
  onDelete: (id: number) => void;
  onChange: (
    id: number,
    title: string,
    completed: boolean,
  ) => void;
  activeLoader: number[];
  allChecked: boolean;
  toggleActive: boolean;
  useToggle: boolean;
  setUseToggle: (useToggle: boolean) => void;
  editTodo: number;
  setEditTodo: (editTodo: number) => void;
  // setTodos: (todos: Todo[]) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  filterType,
  onDelete: deleteTodo,
  onChange: changeTodo,
  activeLoader,
  allChecked,
  toggleActive,
  useToggle,
  setUseToggle,
  editTodo,
  setEditTodo,
}) => {
  const visibleTodos = useMemo<Todo[]>(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case TypeOfFiltering.Active:
          return !todo.completed;

        case TypeOfFiltering.Comleted:
          return todo.completed;

        case TypeOfFiltering.All:
        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  const [inputValue, setInputValue] = useState('');
  // const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitInput = useCallback((todo: Todo) => {
    setEditTodo(-1);
    inputRef.current?.blur();

    if (inputValue === todo.title) {
      return null;
    }

    if (inputValue.trim().length === 0) {
      deleteTodo(todo.id);

      return null;
    }

    return changeTodo(
      todo.id,
      inputValue.trim(),
      todo.completed,
    );
  }, [todos, inputValue]);

  useEffect(() => {
    if (allChecked) {
      todos.map(currentTodo => {
        if (currentTodo.completed === false) {
          return changeTodo(
            currentTodo.id,
            currentTodo.title,
            true,
          );
        }

        return currentTodo;
      });
    }

    if (!allChecked) {
      todos.map(currentTodo => {
        if (currentTodo.completed === true) {
          return changeTodo(
            currentTodo.id,
            currentTodo.title,
            false,
          );
        }

        return currentTodo;
      });
    }
  }, [allChecked]);

  useEffect(() => {
    if (toggleActive) {
      todos.map(currentTodo => {
        if (currentTodo.completed === false) {
          return changeTodo(
            currentTodo.id,
            currentTodo.title,
            true,
          );
        }

        return currentTodo;
      });
    }

    if (!toggleActive) {
      todos.map(currentTodo => {
        if (currentTodo.completed === true) {
          return changeTodo(
            currentTodo.id,
            currentTodo.title,
            false,
          );
        }

        return currentTodo;
      });
    }

    setUseToggle(false);
  }, [useToggle]);

  useEffect(() => {
    if (editTodo) {
      inputRef.current?.focus();
    }
  }, [editTodo]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              key={todo.id}
              data-cy="Todo"
              className={
                classNames('todo', {
                  completed: todo.completed,
                })
              }
              onDoubleClick={() => {
                // setIsEditing(true);
                setInputValue(todo.title);
                setEditTodo(todo.id);
              }}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  name="complete"
                  id={todo.id.toString()}
                  checked={todo.completed}
                  onChange={() => {
                    return changeTodo(
                      todo.id,
                      todo.title,
                      !todo.completed,
                    );
                  }}

                />
              </label>
              {editTodo === todo.id
                ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();

                      // console.log('submit');

                      submitInput(todo);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      type="text"
                      value={inputValue}
                      onChange={(event) => {
                        setInputValue(event.target.value);
                      }}
                      ref={inputRef}
                      onBlur={() => {
                        // setIsEditing(false);
                        submitInput(todo);
                      }}
                      onKeyUp={(event) => {
                        event.preventDefault();

                        if (event.key === 'Escape' || event.key === 'Esc') {
                          // setIsEditing(false);
                          setEditTodo(-1);
                        }
                      }}
                    />
                  </form>
                )
                : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                    >
                      {todo.title}
                    </span>
                    <button
                      data-cy="TodoDelete"
                      type="button"
                      className="todo__remove"
                      onClick={() => {
                        return deleteTodo(todo.id);
                      }}
                    >
                      x
                    </button>
                  </>
                )}

              <Loader todo={todo} activeLoader={activeLoader} />
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              className={
                classNames('todo')
              }
              data-cy="Todo"
            >
              <label
                className="todo__status-label"
              >
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  name="complete"
                  id="0"
                />
              </label>

              <span
                className="todo__title"
                data-cy="TodoTitle"
              >
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <Loader tempTodo={tempTodo} />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
