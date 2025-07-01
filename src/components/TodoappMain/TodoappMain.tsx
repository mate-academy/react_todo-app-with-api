import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { errorNotificationMessage } from '../../utils/errorFunction';
import { TodoElement } from '../TodoElement/TodoElement';

interface TodoappMainProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorNotification: (msg: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoappMain: React.FC<TodoappMainProps> = ({
  todos,
  setTodos,
  setErrorNotification,
  inputRef,
}) => {
  const handleTodoDelete = async (idTodo: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      await deleteTodo(idTodo);
      setTodos(prev => prev.filter(todo => todo.id !== idTodo));
      inputRef.current?.focus();

      return true;
    } catch {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...todo, isLoaded: true } : todo,
        ),
      );
      errorNotificationMessage('Unable to delete a todo', setErrorNotification);

      return false;
    }
  };

  const handleToggleStatus = async (todoToUpdate: Todo) => {
    const idTodo = todoToUpdate.id;

    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      const updated = await patchTodo(idTodo, {
        completed: !todoToUpdate.completed,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...updated, isLoaded: true } : todo,
        ),
      );
    } catch {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...todo, isLoaded: true } : todo,
        ),
      );
      errorNotificationMessage('Unable to update a todo', setErrorNotification);
    }
  };

  const handleUpdateTodo = async (
    updatedTodo: Todo,
    setIsEditing: (val: boolean) => void,
    setEditedTitle: (val: string) => void,
    trimmedTitle: string,
  ) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updatedTodo.id ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      const serverTodo = await patchTodo(updatedTodo.id, {
        title: updatedTodo.title,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === serverTodo.id
            ? { ...todo, title: updatedTodo.title.trim(), isLoaded: true }
            : todo,
        ),
      );

      setEditedTitle(trimmedTitle);
      setIsEditing(false);

      return true;
    } catch {
      errorNotificationMessage('Unable to update a todo', setErrorNotification);
      setIsEditing(true);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, isLoaded: true } : todo,
        ),
      );

      return false;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          key={todo.id}
          todo={todo}
          handleTodoDelete={handleTodoDelete}
          handleToggleStatus={() => handleToggleStatus(todo)}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};
