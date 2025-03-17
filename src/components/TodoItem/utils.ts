import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import callError from '../../utils/callError';

type TodoItemState = {
  isTodoEditing: boolean;
  editedValue: string;
  isLoading: boolean;
};

export const TodoDelete = (
  id: number,
  setTodos: (value: React.SetStateAction<Todo[]>) => void,
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
  setTodoState: React.Dispatch<React.SetStateAction<TodoItemState>>,
) => {
  setTodoState(prev => ({ ...prev, isLoading: true }));

  deleteTodo(id)
    .then(() => {
      setTodos(prev => prev.filter(task => task.id !== id));
    })
    .catch(() => callError(setError, 'delete'));
};
