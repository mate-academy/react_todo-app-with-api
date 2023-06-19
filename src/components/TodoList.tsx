import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../Types';
import { client } from '../utils/client';

const USER_ID = 10377;

interface TodoListProps {
  todos: Todo[];
  visibleTodos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  isPlusOne: boolean;
  isThereIssue: boolean;
  deletedTodoId: number;
  isEveryThingDelete: boolean;
  todoStatusChange: boolean;
  toggleFalseTodosId: number[];
  isEveryThingTrue: boolean;
  setIsThereIssue: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHidden: React.Dispatch<React.SetStateAction<string>>;
  deleteTodo: (id: number) => Promise<void>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

interface EditComponentProps {
  setIsThereIssue: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface RenderConditionsProps {
  isPlusOne: boolean;
  isThereIssue: boolean;
  isEveryThingDelete: boolean;
  isEveryThingTrue: boolean;
  todoStatusChange: boolean;
  isLoading: boolean;
}

interface Props extends
  TodoListProps,
  EditComponentProps,
  RenderConditionsProps {}

export const TodoList: React.FC<Props> = ({
  todos,
  visibleTodos,
  isLoading,
  tempTodo,
  deleteTodo,
  setTodos,
  isPlusOne,
  isThereIssue,
  deletedTodoId,
  isEveryThingDelete,
  todoStatusChange,
  toggleFalseTodosId,
  isEveryThingTrue,
  setIsThereIssue,
  setDeleteErrorMessage,
  setIsLoading,
  setIsHidden,
}) => {
  const [isTodoRenaming, setIsTodoRenaming] = useState(false);
  const [reWrittenTodoId, setReWrittenTodoId] = useState(0);
  const [isTitleSame, setIsTitleSame] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isModifing, setIsModifing] = useState(false);
  const [isDoubleClickedId, setIsDoubleClickedId] = useState(0);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(true);
  const excludedInputRef = useRef<HTMLInputElement>(null);
  const [placeHolderText, setPlaceHolderText] = useState('');

  const handleDoubleClicked = (title: string, id: number) => {
    setPlaceHolderText(title);
    setIsDoubleClickedId((prevId) => (prevId === id ? 0 : id));
    setIsModifing(true);
  };

  const updateIndividualTodo = async (id: number) => {
    setUpdatingTodoId(id);
    const updatedTodo = todos.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    setTodos(updatedTodo);

    try {
      const todoToUpdate = todos.find((elem) => elem.id === id);

      if (todoToUpdate) {
        setIsLoading(true);

        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });

        setIsLoading(false);
        setUpdatingTodoId(null);
      }
    } catch (error) {
      setIsHidden('Unable to update a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    }
  };

  const handleTodoUpdate = async (id: number, newTitle: string) => {
    const updatedTodo = todos.map((obj) => {
      if (obj.id === id) {
        if (obj.title === newTitle) {
          setIsTitleSame(true);
        }

        return {
          ...obj,
          title: newTitle,
        };
      }

      return obj;
    });

    setReWrittenTodoId(id);

    setTodos(updatedTodo);

    try {
      setIsTodoRenaming(true);
      const todoToUpdate = todos.find((elem) => elem.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          ...todoToUpdate,
          title: newTitle,
        });
        setIsUpdating(false);
      }
    } catch (error) {
      setIsThereIssue(true);
      setDeleteErrorMessage('Unable to update a todo');
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      throw Error('Unable to update a todo');
    } finally {
      setIsTodoRenaming(false);
      setIsModifing(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsTodoRenaming(false);
      setIsUpdating(false);
      setIsModifing(false);
      setIsDoubleClickedId(0);
    }

    if (event.key === 'Enter') {
      handleTodoUpdate(id, placeHolderText);
      setIsUpdating(false);
      setIsModifing(false);
      setIsDoubleClickedId(0);
    }

    if (placeHolderText === '' && event.key === 'Enter') {
      deleteTodo(id);
    }

    if (placeHolderText === '' && event.key === 'Escape') {
      deleteTodo(id);
    }
  };

  const handleBlur = (id: number, currentTitle: string) => {
    if (currentTitle === '' && currentTitle !== tempTodo?.title) {
      deleteTodo(id);
      setIsDoubleClickedId(0);
      setIsModifing(false);
    } else if (currentTitle !== tempTodo?.title) {
      handleTodoUpdate(id, currentTitle);
      setIsDoubleClickedId(0);
      setIsModifing(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isModifing && excludedInputRef.current !== null) {
      excludedInputRef.current.focus();
    }
  }, [isModifing]);

  return (
    <section className="todoapp__main">
      {todos.length !== 0 && (
        <>
          {visibleTodos.map((task) => {
            const deletition = (isEveryThingDelete && task.completed)
            || (deletedTodoId === task.id && isLoading);
            const updating = (isLoading && updatingTodoId === task.id)
            || (isEveryThingTrue && todoStatusChange)
            || (todoStatusChange && toggleFalseTodosId.includes(task.id));
            const renaming = (isTodoRenaming && reWrittenTodoId === task.id
              && !isTitleSame);

            return deletition || updating || renaming ? (
              <div
                className={classNames('todo todo-loader', {
                  completed: task?.completed,
                })}
                key={task.id}
              >
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status todo__title-field"
                    checked={task.completed}
                    disabled
                  />
                </label>
                <span className="todo__title todo__title-container">
                  {task.title}
                  <div className="loader loader__delete" />
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => deleteTodo(task.id)}
                >
                  ×
                </button>
                <div className="modal overlay">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                </div>
              </div>
            ) : (
              <div
                className={classNames('todo', {
                  completed: task.completed,
                })}
                key={task.id}
              >
                <label className="todo__status-label" key={task.id}>
                  <input
                    type="checkbox"
                    className="todo__status todo__title-field"
                    value={tempTodo?.title}
                    checked={task.completed}
                    onChange={() => {
                      updateIndividualTodo(task.id);
                    }}
                  />
                </label>
                {isDoubleClickedId === task.id && isModifing
                  ? (
                    <label>
                      <input
                        type="text"
                        className="todo__edit-field todo__title"
                        value={placeHolderText}
                        onChange={(event) => {
                          setPlaceHolderText(event.target.value);
                        }}
                        onBlur={() => handleBlur(task.id, placeHolderText)}
                        onKeyUp={(event) => {
                          handleKeyDown(event, task.id);
                        }}
                        ref={excludedInputRef}
                      />
                    </label>
                  ) : (
                    <span
                      className={isUpdating
                        ? 'onchange todo__title'
                        : 'todo__title'}
                      onDoubleClick={() => {
                        handleDoubleClicked(task.title, task.id);
                      }}
                    >
                      {task.title}
                    </span>
                  )}
                {isDoubleClickedId !== task.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => deleteTodo(task.id)}
                  >
                    ×
                  </button>
                )}
                <div className="modal overlay">
                  <div
                    className="modal-background
                             has-background-white-ter"
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
      {isPlusOne && isLoading && !isThereIssue && (
        <div
          className={classNames('todo todo-loader', {
            completed: tempTodo?.completed,
          })}
          key={tempTodo?.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status todo__title-field"
              checked={tempTodo?.completed}
              disabled
            />
          </label>
          <span className="todo__title  todo__title-container">
            {tempTodo?.title}
            <div className="loader loader__delete" />
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(tempTodo?.id || 0)}
          >
            ×
          </button>
          <div className="modal overlay">
            <div
              className="modal-background has-background-white-ter"
            />
          </div>
        </div>
      )}
    </section>
  );
};
