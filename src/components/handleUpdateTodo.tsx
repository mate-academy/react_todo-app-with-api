import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  todos: Todo[];
  newTitle: string;
  deleteTodo: (props: {
    todoId: number;
    todos: Todo[];
    setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorType: React.Dispatch<React.SetStateAction<string>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditledTitle: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const handleUpdateTodo = ({
  todo,
  todos,
  newTitle,
  deleteTodo,
  setTodos,
  setEditingId,
  setEditledTitle,
  setError,
  setErrorType,
  setProcessingIds,
  inputRef,
}: Props) => {
  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    deleteTodo({
      todoId: todo.id,
      todos,
      setProcessingIds,
      setTodos,
      setError,
      setErrorType,
      inputRef,
    });

    return;
  }

  if (trimmedTitle === todo.title) {
    setEditingId(null);
    setEditledTitle('');

    return;
  }

  setProcessingIds(prev => [...prev, todo.id]);

  fetchClient
    .patch<Todo>(`/todos/${todo.id}`, { title: trimmedTitle })
    .then(updatedTodo => {
      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      setEditingId(null);
      setEditledTitle('');
    })
    .catch(() => {
      setError(true);
      setErrorType('update');
    })
    .finally(() => {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    });
};
