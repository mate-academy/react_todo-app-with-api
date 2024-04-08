import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import * as serviceTodos from "../api/todos";
import { useTodos } from "../lib/TodosContext";
import { ErrorText } from "../types/ErrorText";
import type { Todo } from "../types/Todo";

export type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    setIsFocused,
    isFocused,
    isLoading,
    setIsLoading,
    processTodoIds,
    setProcessTodoIds,
    setTodos,
    inputTitleRef,
    setErrorMessage,
  } = useTodos();

  const { id, completed, title } = todo;

  const [editValue, setEditValue] = useState(title);
  const [isEdit, setIsEdit] = useState(false);
  const [hasEditError, setHasEditError] = useState(false);
  const isActive = isLoading && processTodoIds.includes(id);
  const editInput = useRef<HTMLInputElement>(null);

  const titleTrimmed = title.trim();
  const editTitleTrimmed = editValue.trim();
  const isTitleEqual = titleTrimmed === editTitleTrimmed;
  const isTitleEmpty = !editValue.trim().length;

  useEffect(() => {
    if (isFocused && inputTitleRef.current) {
      inputTitleRef.current?.focus();
    }
  }, [inputTitleRef, isFocused]);

  useEffect(() => {
    if (isEdit && editInput.current) {
      editInput.current.focus();
    }
  }, [editInput, hasEditError, isEdit]);

  const deleteTodos = async (deleteId: number) => {
    setErrorMessage(ErrorText.NoErr);
    setProcessTodoIds((prevState) => [...prevState, deleteId]);

    try {
      setIsFocused(false);
      setIsLoading(true);
      await serviceTodos.deleteTodo(deleteId);

      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== deleteId));
    } catch (error) {
      setErrorMessage(ErrorText.DeleteErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
      throw new Error(ErrorText.DeleteErr);
    } finally {
      setProcessTodoIds((prev) => prev.filter((prevId) => prevId !== deleteId));
      setIsLoading(false);
      setIsFocused(true);
    }
  };

  const handleCheckboxToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    todoUpdate: Todo,
  ) => {
    const { checked } = event.target;

    setErrorMessage(ErrorText.NoErr);

    setProcessTodoIds((prevState) => [...prevState, todoUpdate.id]);

    try {
      setIsLoading(true);
      const data = await serviceTodos.updateTodo({
        ...todoUpdate,
        completed: checked,
      });

      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        const index = newTodos.findIndex((todoItem) => todoItem.id === data.id);

        newTodos.splice(index, 1, data);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage(ErrorText.UpdateErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
    } finally {
      setProcessTodoIds((prev) =>
        prev.filter((currentId) => currentId !== todoUpdate.id),
      );
      setIsLoading(false);
    }
  };

  const saveChanges = async () => {
    setErrorMessage(ErrorText.NoErr);

    const newTodo = {
      ...todo,
      title: editTitleTrimmed,
    };

    try {
      setIsLoading(true);
      setProcessTodoIds((prevState) => [...prevState, todo.id]);
      const data = await serviceTodos.updateTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, data]);
    } catch (error) {
      setErrorMessage(ErrorText.UpdateErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
      throw new Error(ErrorText.UpdateErr);
    } finally {
      setProcessTodoIds((prev) =>
        prev.filter((prevId) => prevId !== newTodo.id),
      );
      setIsLoading(false);
    }
  };

  const handleBlur = async () => {
    setHasEditError(false);

    if (isTitleEmpty) {
      deleteTodos(todo.id).then(() => setIsEdit(false));
    } else {
      if (!isTitleEqual) {
        try {
          await saveChanges();
          setIsEdit(false);
        } catch (error) {
          setHasEditError(true);
        }
      }

      setIsEdit(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    setHasEditError(false);

    if (e.key === "Enter") {
      e.preventDefault();
      if (isTitleEqual) {
        setIsEdit(false);

        return;
      }

      if (isTitleEmpty) {
        try {
          await deleteTodos(todo.id);
          setIsEdit(false);
        } catch (error) {
          setHasEditError(true);
        }

        return;
      }

      try {
        await saveChanges();
        setIsEdit(false);
      } catch {
        setHasEditError(true);
      }
    } else if (e.key === "Escape") {
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn("todo", {
        completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => {
            handleCheckboxToggle(event, todo);
          }}
        />
      </label>

      {isEdit ? (
        <form>
          <input
            ref={editInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodos(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn("modal overlay", {
          "is-active": isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
