import {
  SetStateAction, Dispatch, useState, useRef, useEffect,
} from 'react';
import { TasksFilter } from '../types/tasksFilter';
import { Todo } from '../types/Todo';
import { ErrorMesage } from '../types/ErrorIMessage';
import * as postService from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  tasksFilter: TasksFilter
  setErrorMessage: Dispatch<SetStateAction<ErrorMesage>>
}

export const Section: React.FC<Props> = ({
  todos,
  setTodos,
  tasksFilter,
  setErrorMessage,
}) => {
  const [editedText, setEditedText] = useState('');
  const [isEdited, setIsEdited] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdited && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isEdited]);

  const onDoubleClick = (id: number, title: string) => {
    setIsEdited(id);
    setEditedText(title);
  };

  const handleInputBlur = () => {
    setIsEdited(0);
  };

  const handleInputFocus = (id: number) => {
    setIsEdited(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  async function handleSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();

    if (editedText.trim()) {
      setTodos((currentTodo) => currentTodo.map((todo) => {
        return todo.id === id ? { ...todo, title: editedText } : todo;
      }));

      try {
        await Promise.all(todos.map((todo) => {
          if (todo.id === id) {
            return postService.updateTodoTitle(id, { title: editedText });
          }

          return 'error';
        }));
      } catch (error) {
        setErrorMessage(ErrorMesage.addingError);
      }
    } else {
      setTodos((currentTodo) => currentTodo.filter((todo) => todo.id !== id));
      try {
        await Promise.all(todos.map((todo) => {
          if (todo.id === id) {
            return postService.deleteTodo(id);
          }

          return 'error';
        }));
      } catch (error) {
        setErrorMessage(ErrorMesage.deletingError);
      }
    }

    setIsEdited(0);
  }

  async function deleteData(idToDelete: number) {
    try {
      setTodos(currentTodos => currentTodos
        .filter((currentTodo) => currentTodo.id !== idToDelete));
      await postService.deleteTodo(idToDelete);
    } catch (error) {
      setErrorMessage(ErrorMesage.deletingError);
    }
  }

  async function updateData(taskId: number, completed: boolean) {
    setTodos((currentTodos) => (
      currentTodos.map((currentTodo) => (
        currentTodo.id === taskId ? (
          { ...currentTodo, completed: !completed }
        ) : (
          currentTodo
        )
      ))
    ));
    try {
      await postService.updateTodo(taskId, { completed: !completed });
    } catch (error) {
      setErrorMessage(ErrorMesage.deletingError);
    }
  }

  let filteringTodos;

  switch (tasksFilter) {
    case TasksFilter.active:
      filteringTodos = todos.filter((todo) => !todo.completed);
      break;

    case TasksFilter.completed:
      filteringTodos = todos.filter((todo) => todo.completed);
      break;
    default:
      filteringTodos = todos;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteringTodos.map(({ title, id, completed }) => (
        <div
          data-cy="Todo"
          className={`todo ${completed ? 'completed' : ''}`}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => updateData(id, completed)}
            />
          </label>
          {isEdited === id ? (
            <form
              action=""
              onSubmit={(e) => handleSubmit(e, id)}
            >
              <input
                type="text"
                ref={inputRef}
                className="edit"
                value={editedText}
                onBlur={handleInputBlur}
                onFocus={() => handleInputFocus(id)}
                onChange={(e) => handleInputChange(e)}
              />
            </form>

          ) : (
            <>
              <span
                id="TodoTitle"
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => onDoubleClick(id, title)}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteData(id)}
              >
                ×
              </button>
            </>

          )}

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
