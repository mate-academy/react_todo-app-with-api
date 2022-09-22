import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => Promise<void>,
  setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>,
  setEditingTodoId: React.Dispatch<React.SetStateAction<number>>,
};

export const TodoSpan: React.FC<Props> = ({
  todo,
  removeTodo,
  setEditing,
  setEditedTitle,
  setEditingTodoId,
}) => {
  const handleDblClick = (currentTodo: Todo) => {
    setEditing(true);
    setEditedTitle(currentTodo.title);
    setEditingTodoId(currentTodo.id);
  };

  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => handleDblClick(todo)}
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>
    </>
  );
};
