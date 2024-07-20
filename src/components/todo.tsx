import { useContext, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Todo } from "../types/Todo";
import { TodosContext } from "../services/Store";
import * as todoService from "../api/todos";
import { ErrorText } from "../enums/errorText";

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    setLoadErrorMessage,
    todosWithLoader,
    setTodosWithLoader,
    isEditing,
    setIsEditing,
  } = useContext(TodosContext);

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const todosWithLoaderIds = [...todosWithLoader].map((td) => td.id);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const todoFileld = useRef<HTMLInputElement>(null);

  const initialTitle = todo.title;

  useEffect(() => {
    if (todoFileld.current && isEditing) {
      todoFileld.current.focus();
    }
  });

  const onDelete = (todoItem: Todo) => {
    const todosForLoading: Todo[] = [];

    todosForLoading.push(todoItem);

    setTodosWithLoader(todosForLoading);

    const newTodos = todos.filter((todoEl) => todoEl.id !== todo.id);

    const deleteTodos = async () => {
      try {
        await todoService.deleteTodo(todo.id);
        setTodos(newTodos);
      } catch (error) {
        setTodos(todos);
        setLoadErrorMessage(ErrorText.Deliting);
        if (selectedTodoId) {
          setIsEditing(true);
          setSelectedTodoId(todo.id);
        }

        throw error;
      } finally {
        setTodosWithLoader([]);
      }
    };

    deleteTodos();
  };

  const handleEscapeKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditing(false);
      setTodoTitle(initialTitle);
      setSelectedTodoId(null);
    }
  };

  const updateTodoFunction = () => {
    if (!todoTitle.trim().length) {
      return onDelete(todo);
    } else {
      const todoItem = todo;

      const todosForLoading: Todo[] = [];

      todosForLoading.push(todoItem);

      todoItem.title = todoTitle.trim();

      setSelectedTodoId(null);
      setIsEditing(false);

      setTodoTitle(todoTitle.trim());

      setTodosWithLoader(todosForLoading);

      return todoService
        .updatePost(todoItem)
        .then(() => {
          setTodos(todos);
        })
        .catch(() => {
          setTodoTitle(todo.title);
          setLoadErrorMessage(ErrorText.Update);
          setIsEditing(true);
          setSelectedTodoId(todo.id);
        })
        .finally(() => {
          setTodosWithLoader([]);
        });
    }
  };

  const onSelected = (todoElement: Todo) => {
    const todoEl = todoElement;

    todoEl.completed = !todoEl.completed;

    const todosForLoading: Todo[] = [];

    todosForLoading.push(todoEl);

    setTodosWithLoader(todosForLoading);

    const updateTodos = async () => {
      try {
        await todoService.updatePost(todosForLoading[0]);
        setTodos(todos);
      } catch {
        const todoItem = todo;

        todoItem.completed = !todoItem.completed;
        setLoadErrorMessage(ErrorText.Update);
      } finally {
        setTodosWithLoader([]);
      }
    };

    return updateTodos();
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTodoTitle(todoTitle.trim());

    event.preventDefault();

    updateTodoFunction();
  };

  const onChangeHandler = () => {
    onSelected(todo);
  };

  const buttonOnClichHandler = () => {
    setLoadErrorMessage("");
    onDelete(todo);
  };

  const handleEnterKey = (event: React.KeyboardEvent) => {
    if (event.key != "Enter") {
      return;
    }

    event.preventDefault();

    updateTodoFunction();
  };

  return (
    <div
      data-cy="Todo"
      className={cn("todo", {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <p style={{ display: "none" }}>hidden text</p>

        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onChangeHandler}
        />
      </label>

      {isEditing && selectedTodoId === todo.id ? (
        <form>
          <input
            ref={todoFileld}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleEscapeKey}
            onKeyDown={handleEnterKey}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodoId(todo.id);
              setIsEditing(true);
            }}
          >
            {todoTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={buttonOnClichHandler}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn("modal", "overlay", {
          "is-active": todosWithLoaderIds.includes(todo.id),
        })}
      >
        <div className="has-background-white-ter modal-background" />
        <div className="loader" />
      </div>
    </div>
  );
};
