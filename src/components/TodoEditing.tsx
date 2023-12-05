import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Todo } from '../types/Todo';
import { TodoContext } from '../providers/TodoProvider';
import { deleteTodo, editTodo } from '../api/todos';
import { TodoError } from '../types/TodoError';

interface Props {
  todoToEdit: Todo
  setIsEditing: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export const TodoEditing: React.FC<Props> = ({
  todoToEdit,
  setIsEditing,
  setIsLoading,
}) => {
  const { title, id } = todoToEdit;

  const { setTodos, setError, todos } = useContext(TodoContext);

  const [todoTitle, setTodoTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim() === title) {
      setIsEditing(false);
    } else if (!todoTitle.trim()) {
      setIsLoading(true);

      deleteTodo(id)
        .then(() => {
          const editedArray = todos.filter(task => task.id !== id);

          setTodos(editedArray);
          setIsEditing(false);
        })
        .catch(() => setError(TodoError.Delete))
        .finally(() => {
          setIsLoading(false);

          if (inputRef.current) {
            inputRef.current.focus();
          }

          setTimeout(() => {
            setError(TodoError.Null);
          }, 3000);
        });
    } else {
      setIsLoading(true);

      editTodo({
        ...todoToEdit,
        title: todoTitle.trim(),
      })
        .then(() => {
          setTodos(prevTodos => prevTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                title: todoTitle.trim(),
              };
            }

            return todo;
          }));

          setIsEditing(false);
        })
        .catch(() => {
          setError(TodoError.Update);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleFormBlur = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    handleSubmit(event);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={todoTitle}
        ref={inputRef}
        onChange={handleTitleChange}
        onKeyUp={handleKeyUp}
        onBlur={handleFormBlur}
      />
    </form>
  );
};
