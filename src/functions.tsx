import { checkTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

export const handleDelete = async (
  todo: Todo,
  setDeleting: React.Dispatch<React.SetStateAction<number[]>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    setDeleting(prev => [...prev, todo.id]);
    await deleteTodo(todo);
    setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
  } catch (error: unknown) {
    setError(`Unable to delete a todo`);
  } finally {
    setDeleting(prev => prev.filter(id => id !== todo.id));
  }
};

export async function handleEdit(
  editedTodo: Todo,
  field: keyof Todo,
  value: boolean | string,
  setLoading: React.Dispatch<React.SetStateAction<number[]>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setEdit?: React.Dispatch<React.SetStateAction<number | null>>,
) {
  try {
    setLoading(current => [...current, editedTodo.id]);

    const editedValue = {
      [field]: typeof value === 'string' ? value.trim() : value,
    };
    const response = await checkTodo({
      id: editedTodo.id,
      newValue: editedValue,
    });

    setTodos(current => {
      const allTodos = [...current];
      const index = allTodos.findIndex(todo => todo.id === editedTodo.id);

      allTodos[index] = response;

      return allTodos;
    });

    if (setEdit) {
      setEdit(null);
    }
  } catch (err) {
    setError('Unable to update a todo');
    if (setEdit) {
      setEdit(editedTodo.id);
    }
  } finally {
    setLoading(prev => prev.filter(id => id !== editedTodo.id));
  }
}
