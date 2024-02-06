import React, {
  SetStateAction, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/TodosContext';
import { updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';

type Props = {
  setIsEditing: React.Dispatch<SetStateAction<boolean>>;
  todo: Todo;
};

export const EditingForm: React.FC<Props> = ({ setIsEditing, todo }) => {
  const {
    handleTodoDelete,
    todos,
    setTodos,
    setError,
    setLoadingTodos,
    loadingTodos,
  } = useContext(TodosContext);

  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const saveChanges = async () => {
    if (!newTitle.trim()) {
      handleTodoDelete(todo.id);
    } else if (newTitle.trim() !== todo.title) {
      setLoadingTodos([...loadingTodos, todo.id]);

      try {
        const updatedTodo = await updateTodo(
          todo.id,
          { title: newTitle.trim() },
        );

        const updatedTodos = todos.map(t => {
          return t.id === todo.id
            ? updatedTodo
            : t;
        });

        setTodos(updatedTodos);
        setIsEditing(false);
      } catch {
        setError(ErrorType.Update);
      } finally {
        setLoadingTodos(loadingTodos.filter(id => id !== todo.id));
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleOnBlur = () => {
    saveChanges();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveChanges();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <form
      onBlur={handleOnBlur}
      onSubmit={e => handleSubmit(e)}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        ref={editInputRef}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyUp={handleKeyUp}
      />
    </form>
  );
};
