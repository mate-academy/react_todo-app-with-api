import { Todo } from '../types/Todo';
import { FilterType } from '../enums/enums';

export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  return todos.filter((todo: Todo) => {
    return (
      filter === FilterType.All ||
      (filter === FilterType.Completed && todo.completed) ||
      (filter === FilterType.Active && !todo.completed)
    );
  });
};

export const handleTodoBlur = (
  isSubmitting: boolean,
  editedTitle: string,
  todoTitle: string,
  handleTitleSubmit: () => void,
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (!isSubmitting && editedTitle.trim() !== todoTitle.trim()) {
    handleTitleSubmit();
  } else {
    setIsTodoEditing(false);
  }
};

export const handleTodoKeyDown = (
  e: React.KeyboardEvent,
  isSubmitting: boolean,
  handleTitleSubmit: () => void,
) => {
  if (e.key === 'Enter' && !isSubmitting) {
    e.preventDefault();
    handleTitleSubmit();
  }
};

export const handleTodoDoubleClick = (
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>,
  todoId: number,
) => {
  setIsTodoEditing(true);
  setSelectedPostId(todoId);
};

export const handleTodoKeyUp = (
  e: React.KeyboardEvent,
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>,
  todoTitle: string,
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (e.key === 'Escape') {
    setEditedTitle(todoTitle);
    setIsTodoEditing(false);
  }
};
