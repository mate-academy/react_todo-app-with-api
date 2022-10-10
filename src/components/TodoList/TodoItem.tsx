import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  todos: Todo[];
  selectedIds: number[];
  errorMessage: string | null;
  isAdding: boolean;
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  isAdding,
  selectedIds,
  errorMessage,
  handleOnChange,
  setErrorMessage,
  setSelectedIds,
  setTodos,
}) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  const loaderCondition = useMemo(
    () => selectedIds.includes(id) || (isAdding && todo.id === 0),
    [selectedIds, isAdding, todo.id],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedIds([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== TodoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  }, [todos, errorMessage]);

  const UpdateTitle = useCallback(() => {
    if (!newTodoTitle) {
      removeTodo(selectedTodo);
      setDoubleClicked(false);

      return;
    }

    if (newTodoTitle === todo.title) {
      setDoubleClicked(false);

      return;
    }

    if (todos.find(element => element.title === newTodoTitle)) {
      setDoubleClicked(false);
      setSelectedTodo(0);
    }

    handleOnChange(selectedTodo, { title: newTodoTitle });
    setDoubleClicked(false);
    setNewTodoTitle('');
    setSelectedTodo(0);
  }, [newTodoTitle, selectedTodo, doubleClicked]);

  const TitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClicked(true);
    setSelectedTodo(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleBlur = () => {
    UpdateTitle();
    setDoubleClicked(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClicked(false);
      setSelectedTodo(0);
    }

    if (event.key === 'Enter') {
      UpdateTitle();
      setSelectedTodo(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleOnChange(id, { completed: !completed })}

        />
      </label>
      {doubleClicked && selectedTodo === todo.id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="If your todo is empty, it will be deleted"
              onChange={TitleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeTodo(id);
              }}
            >
              ×
            </button>
          </>
        )}

      {loaderCondition && (
        <Loader />
      )}
    </div>
  );
};
