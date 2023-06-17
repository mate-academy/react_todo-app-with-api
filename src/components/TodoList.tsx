import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../Types';
import { client } from '../utils/client';

interface Props {
  todo: Todo[],
  visibleTodos: Todo[],
  isLoading: boolean,
  updatingTodoId: number | null,
  tempTodo: Todo | null,
  updateIndividualTodo: (id: number) => Promise<void>,
  isDoubleClickedName: string,
  placeHolderText: string,
  setPlaceHolderText: React.Dispatch<React.SetStateAction<string>>,
  excludedInputRef: React.RefObject<HTMLInputElement>,
  isUpdating: boolean,
  setIsDoubleClickedName: React.Dispatch<React.SetStateAction<string>>,
  deleteTodo: (id: number) => Promise<void>,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  isPlusOne: boolean,
  isThereIssue: boolean,
  deletedTodoId: number,
  isEveryThingDelete: boolean,
  todoStatusChange: boolean,
  toggleFalseTodosId: number[],
  isEveryThingTrue: boolean,
  setIsThereIssue: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

export const TodoList: React.FC<Props> = ({
  todo,
  visibleTodos,
  isLoading,
  updatingTodoId,
  tempTodo,
  updateIndividualTodo,
  isDoubleClickedName,
  placeHolderText,
  setPlaceHolderText,
  excludedInputRef,
  isUpdating,
  setIsDoubleClickedName,
  deleteTodo,
  setIsUpdating,
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
}) => {
  const [isTodoRenaming, setIsTodoRenaming] = useState(false);
  const [reWrittenTodoId, setReWrittenTodoId] = useState(0);
  const [isTitleSame, setIsTitleSame] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isModifiing, setIsModifiing] = useState(false);

  const handleTodoUpdate = async (id: number, newTitle: string) => {
    const updatedTodo = todo.map((obj) => {
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

    if (newTitle === '') {
      deleteTodo(id);
    }

    try {
      setIsTodoRenaming(true);
      const todoToUpdate = todo.find((elem) => elem.id === id);

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
      setIsModifiing(false);
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
      setIsModifiing(false);
      setIsDoubleClickedName('');
    }

    if (placeHolderText === '') {
      deleteTodo(id);
    }
  };

  const handleBlur = (id: number, currentTitle: string) => {
    if (currentTitle === '' && currentTitle !== tempTodo?.title) {
      deleteTodo(id);
    } else if (currentTitle !== tempTodo?.title) {
      handleTodoUpdate(id, currentTitle);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <section className="todoapp__main">
      {todo.length !== 0 && (
        <>
          {visibleTodos.map((task) => {
            const shouldChange
            = (todoStatusChange && toggleFalseTodosId.includes(task.id))
            || (isEveryThingTrue && todoStatusChange)
            || (isLoading && updatingTodoId === task.id)
            || (isEveryThingDelete && task.completed)
            || (deletedTodoId === task.id && isLoading)
            || (isTodoRenaming && reWrittenTodoId === task.id
              && !isTitleSame);

            return shouldChange ? (
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
                  <div className="loader loader__ondelete" />
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
                {isDoubleClickedName === task.title && isModifiing
                  ? (
                    <label>
                      <input
                        type="text"
                        className="todo__edit-field todo__title"
                        value={placeHolderText}
                        onChange={(event) => {
                          setPlaceHolderText(event.target.value);
                        }}
                        onBlur={() => handleBlur(task.id, task.title)}
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
                        setPlaceHolderText(task.title);
                        setIsDoubleClickedName(task.title);
                        setIsModifiing(true);
                      }}
                    >
                      {task.title}
                    </span>
                  )}
                {isDoubleClickedName !== task.title && (
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
            <div className="loader loader__ondelete" />
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
