import {FC, useContext, useEffect, useRef, useState} from "react";
import {AppTodoContext} from "../../contexts/AppTodoContext";
import {Todo} from "../../types/Todo";
import {editTodoTitle} from "../../api/todos";
import {ErrorType} from "../../types/enums";

interface Props {
  todo: Todo,
  setIsEditAvailable: React.Dispatch<React.SetStateAction<boolean>>,
  onRemove: () => Promise<void>,
  isEditAvailable: boolean,
}

export const EditForm: FC<Props> = ({
  todo,
  setIsEditAvailable,
  onRemove,
  isEditAvailable,
}) => {
  const { id, title } = todo;
  const {
    setProcessingTodoIds,
    addProcessingTodo,
    removeProcessingTodo,
    setTodos,
    setErrorMessage,
  } = useContext(AppTodoContext);
  const [editValue, setEditValue] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditSubmit = async () => {
    addProcessingTodo(id);

    if (editValue === title) {
      setProcessingTodoIds({});
      setIsEditAvailable(false);

      return;
    }

    if (editValue.trim() === '') {
      onRemove();
      setIsEditAvailable(false);

      return;
    }

    try {
      const updatedTodo = await editTodoTitle(id, editValue);

      setTodos(prevTodos => {
        return prevTodos.map(prevTodo => (
          prevTodo.id === id
            ? updatedTodo
            : prevTodo
        ));
      });
    } catch {
      setErrorMessage(ErrorType.UpdateTodoError);
    } finally {
      setIsEditAvailable(false);
      removeProcessingTodo(id);
    }
  };

  const handleKeyUpAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditAvailable(false);
    }
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEditAvailable]);

  return (
    <form
      className="todo__title"
      onSubmit={
        (event) => {
          event.preventDefault();
          handleEditSubmit();
        }
      }
    >
      <input
        className="todo__title"
        ref={inputRef}
        value={editValue}
        onChange={(event) => setEditValue(event.target.value)}
        onBlur={handleEditSubmit}
        onKeyUp={handleKeyUpAction}
      />
    </form>
  );
};
