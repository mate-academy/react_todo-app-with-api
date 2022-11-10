import { useEffect, useRef, useState } from 'react';
import { updateTodoTitle } from '../../../../api/todos';
import { ErrorType } from '../../../../types/ErrorType';
import { Todo } from '../../../../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  loadTodos: () => Promise<void>;
  onChangeError: (errorType: ErrorType) => void;
  handleDoubleClick: (isRelevant: boolean) => void;
  onChangeProcessingIds: (todoId: number) => void;
};

export const EditTodoTitleForm: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  loadTodos,
  onChangeError,
  handleDoubleClick,
  onChangeProcessingIds,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  });

  const handleEditTodoTitle = (text: string): void => {
    setEditedTitle(text);
  };

  const onUpdateTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      await updateTodoTitle(todoId, newTitle);
    } catch (e) {
      onChangeError(ErrorType.UPDATE);
    }
  };

  const handleChangingTodoTitle = async (todoId: number, newTitle: string) => {
    onChangeProcessingIds(todoId);
    await onUpdateTodoTitle(todoId, newTitle);
    await loadTodos();
    onChangeProcessingIds(0);
  };

  const onSubmitEditedTodoTitle = (
    event: React.FormEvent<HTMLFormElement>,
    todoId: number,
    newTitle: string,
  ) => {
    event.preventDefault();
    const titleWithoutSpacesAround = editedTitle.trim();

    if (titleWithoutSpacesAround === todo.title) {
      handleDoubleClick(false);

      return;
    }

    if (!titleWithoutSpacesAround.length) {
      handleDeleteTodo(todoId);
    }

    if (titleWithoutSpacesAround.length) {
      handleChangingTodoTitle(todoId, newTitle);
    }

    handleDoubleClick(false);
  };

  return (
    <form
      onSubmit={(event) => onSubmitEditedTodoTitle(
        event,
        todo.id,
        editedTitle,
      )}
      onBlur={(event) => onSubmitEditedTodoTitle(
        event,
        todo.id,
        editedTitle,
      )}
    >
      <input
        data-cy="TodoTitleField"
        className="todoapp__edit-todo"
        value={editedTitle}
        type="text"
        ref={editTodoField}
        onChange={(event) => handleEditTodoTitle(event.target.value)}
      />
    </form>
  );
};
