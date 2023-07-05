import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setIsBeingEdited: (newStatus:boolean) => void;
  setError:(error:string) => void;
  newTitle: string;
  setNewTitle: (newTitle:string) => void;
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId:number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>) => void,
};

export const TodoEdit:React.FC<Props> = ({
  todo,
  setIsBeingEdited,
  setError,
  newTitle,
  setNewTitle,
  deleteTodo,
  updateTodo,

}) => {
  const submit = () => {
    try {
      setIsBeingEdited(true);

      const trimmedNewTitle = newTitle.trim();

      if (todo.title === trimmedNewTitle) {
        setIsBeingEdited(false);

        return;
      }

      if (trimmedNewTitle === '') {
        setError('Title can\'t be empty');

        deleteTodo(todo.id);

        return;
      }

      updateTodo(todo.id, { title: trimmedNewTitle });
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsBeingEdited(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submit();
  };

  const handleBlur = () => {
    submit();
  };

  const handleKeyUp = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={handleBlur}
        onKeyUp={(event) => handleKeyUp(event)}
      />
    </form>
  );
};
