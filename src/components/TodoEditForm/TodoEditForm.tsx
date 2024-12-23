import { LegacyRef } from 'react';
import { updateTitleTodo } from '../../api/todos';
import { errorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../context/TodoProvider';
//
type Props = {
  tasks: Todo[];
  setCanEdit: (canEdit: number[]) => void;
  setNewTitle: (newTitle: string) => void;
  newTitle: string;
  deleteTask: (id: number) => void;
  taskId: number;
  editRef: LegacyRef<HTMLInputElement>;
};
export const TodoEditForm = ({
  tasks,
  setCanEdit,
  setNewTitle,
  newTitle,
  deleteTask,
  taskId,
}: Props) => {
  const { setErrorMessage, setIsUpdating, setIsSubmitting, setTasks } =
    useTodoContext();
  const updateNewTitle = (id: number, newTitl: string) => {
    const updateTitle = newTitl.trim();
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    if (todoToUpdate.title === updateTitle) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, title: updateTitle };

    const updatedTasks = tasks.map(todo =>
      todo.id === id ? updatedTodo : todo,
    );

    if (newTitle.trim() === '') {
      deleteTask(id);
    }

    updateTitleTodo(id, updatedTodo)
      .then(() => {
        setTasks(updatedTasks);
        setIsUpdating([]);
        setCanEdit([]);
      })
      .catch(() => {
        setErrorMessage(errorType.updateTodo);

        setCanEdit([id]);
        const revertedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, title: todoToUpdate.title } : todo,
        );

        setTasks(revertedTasks);

        setIsUpdating([]);
      });
    setIsSubmitting(false);
  };

  const handleSubmitNewTitle = (id: number, title: string) => {
    const originalTodo = tasks.find(todo => todo.id === id);

    if (!originalTodo) {
      setErrorMessage(errorType.found);

      return;
    }

    const trimmedTitle = title.trim();

    if (originalTodo.title === trimmedTitle) {
      return;
    }

    if (!trimmedTitle) {
      deleteTask(id);
      setIsSubmitting(false);

      return;
    }

    setIsSubmitting(true);
    setIsUpdating([id]);
    updateNewTitle(id, trimmedTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle((e.target as HTMLInputElement).value);
  };

  const sendTitle = (id: number) => {
    handleSubmitNewTitle(id, newTitle);
    setCanEdit([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setCanEdit([]);
    }
  };

  return (
    <form
      key={taskId}
      onSubmit={e => {
        e.preventDefault();
        sendTitle(taskId);
      }}
      onBlur={e => {
        e.preventDefault();
        sendTitle(taskId);
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleTitleChange(e)
        }
        autoFocus={true}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};
