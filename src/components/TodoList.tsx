import { useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  inputRef,
}: Props) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const handleDeleteTodo = async (todo: Todo) => {
    if (!inputRef.current) {
      return;
    }

    setDeletingTodoId(todo.id);

    try {
      await deleteTodo(todo.id);

      const filteredTodos = todos.filter(item => item.id !== todo.id);

      setTodos(filteredTodos);

      inputRef.current.focus();
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setDeletingTodoId(null);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          onError={handleError}
          onUpdate={handleUpdateTodo}
          isLoading={todo.id === deletingTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onError={handleError}
          onUpdate={handleUpdateTodo}
        />
      )}
    </section>
  );
};
