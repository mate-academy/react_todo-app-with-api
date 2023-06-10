import classNames from 'classnames';
import React from 'react';
import { Todo } from '../Types';
import { client } from '../utils/client';

interface Props {
  todo: Todo[],
  visibleTodos: Todo[],
  isLoading: boolean,
  updatingTodoId: number | null,
  tempTodo: Todo,
  updateIndividualTodo: (id: number) => Promise<void>,
  isDoubleClickedName: string,
  placeHolderText: string,
  setPlaceHolderText: React.Dispatch<React.SetStateAction<string>>,
  excludedInputRef: React.RefObject<HTMLInputElement>,
  isUpdating: boolean,
  setIsDoubleClickedName: React.Dispatch<React.SetStateAction<string>>,
  deleteTodo: (id: number) => Promise<void>,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>,
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>,
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
  setTodo,
}) => {
  const handleTodoUpdate
  = async (id: number, newTitle: string) => {
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          title: newTitle,
        };
      }

      return obj;
    });

    setTodo(updatedTodo);
    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          ...todoToUpdate,
          title: newTitle,
        });
        setIsUpdating(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('There is an issue updating the todo title.', error);
    }
  };

  return (
    <section className="todoapp__main">
      {todo.length !== 0 && (
        <>
          {visibleTodos.map((task) => {
            if (isLoading && updatingTodoId === task.id) {
              return <div className="loader" key={task.id} />;
            }

            return (
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
                    value={tempTodo.title}
                    checked={task.completed}
                    onChange={() => {
                      updateIndividualTodo(task.id);
                    }}
                  />
                </label>
                {isDoubleClickedName === task.title
                  ? (
                    <label>
                      <input
                        type="text"
                        className="todo__edit-field todo__title"
                        value={placeHolderText}
                        onChange={(event) => {
                          setPlaceHolderText(event.target.value);
                        }}
                        onBlur={(event) => {
                          handleTodoUpdate(
                            task.id,
                            event.target.value,
                          );
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

    </section>
  );
};
