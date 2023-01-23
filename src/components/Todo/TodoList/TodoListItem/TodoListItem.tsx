import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  changeTodoStatus, changeTodoTitle, deleteTodo,
} from '../../../../api/todos';
import { ErrorContextType } from '../../../../types/ErrorContextType';
import { FilterTypes } from '../../../../types/FilterTypes';
import { LoaderContextType } from '../../../../types/LoaderContextType';
import { Todo } from '../../../../types/Todo';
import { TodoContextType } from '../../../../types/TodoContextType';
import { ErrorContext } from '../../../Error/ErrorContext';
import { LoaderContext } from '../../LoaderContext';
import { TodoContext } from '../../TodoContext';

type Props = {
  todo: Todo,
  selectedClass:string,
};

const TodoListItem: React.FC<Props>
= ({ todo, selectedClass }) => {
  const callbackRef = useCallback((inputElement:HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);
  const { setErrorText, setIsError }
  = useContext(ErrorContext) as ErrorContextType;
  const ref = React.createRef<HTMLDivElement>();
  const { isLoaderActive } = useContext(LoaderContext) as LoaderContextType;
  const { todos, setVisibleTodos }
  = useContext(TodoContext) as TodoContextType;
  const { title, id, completed } = todo;
  const [isFormSeen, setIsFormSeen] = useState(false);
  const [formValue, setFormValue] = useState(title);

  useEffect(() => {
    if (isLoaderActive && ref && ref.current) {
      ref.current.classList.toggle('is-active');
    }
  }, []);

  const deleteTodoFromList = async () => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.classList.toggle('is-active');
    try {
      await deleteTodo(id);

      setVisibleTodos(
        todos.filter((one: Todo) => id !== one.id),
      );
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to delete a todo');
      ref.current.classList.toggle('is-active');
    }
  };

  const updateTodoFromList = async () => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.classList.toggle('is-active');
    try {
      await changeTodoStatus(id, { completed: !completed });

      switch (selectedClass) {
        case FilterTypes.Active:
          setVisibleTodos(
            todos.filter((one: Todo) => id !== one.id && !one.completed),
          );

          return;
        case FilterTypes.Completed:
          setVisibleTodos(
            todos.filter((one: Todo) => id !== one.id && one.completed),
          );

          return;
        default:
          setVisibleTodos(
            todos.map((one: Todo) => {
              if (id === one.id) {
                return {
                  ...one,
                  completed: !completed,
                };
              }

              return one;
            }),
          );
          break;
      }

      ref.current.classList.toggle('is-active');
    } catch (error) {
      ref.current.classList.toggle('is-active');
      setIsError(true);
      setErrorText('Unable to update a todo');
    }
  };

  const showForm = () => {
    setIsFormSeen(true);
  };

  const updateTodoTitle = async () => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.classList.toggle('is-active');

    if (title === formValue) {
      setIsFormSeen(false);
    }

    if (!formValue.length) {
      deleteTodoFromList();

      return;
    }

    try {
      ref.current.classList.toggle('is-active');

      await changeTodoTitle(id, { title: formValue });

      setVisibleTodos(
        todos.map((one: Todo) => {
          if (id === one.id) {
            return {
              ...one,
              title: formValue,
            };
          }

          return one;
        }),
      );
      setIsFormSeen(false);
    } catch (error) {
      ref.current.classList.toggle('is-active');

      setIsError(true);
      setErrorText('Unable to update a todo');
      setIsFormSeen(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed && 'completed'} `}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status checked"
          onClick={async () => {
            updateTodoFromList();
          }}
          defaultChecked
        />
      </label>
      {
        !isFormSeen
          ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={showForm}
              >
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={deleteTodoFromList}
              >
                ×
              </button>
            </>
          )
          : (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue={title}
                ref={callbackRef}
                onChange={(event) => {
                  setFormValue(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    updateTodoTitle();
                    setIsFormSeen(false);
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setIsFormSeen(false);
                  }
                }}
                onBlur={updateTodoTitle}
              />
            </form>
          )
      }
      <div
        ref={ref}
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};

export default TodoListItem;
