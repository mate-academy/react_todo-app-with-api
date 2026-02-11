import { useState } from 'react';
import { deleteTodos, patchTodos } from '../api/todos';
import { Todo } from '../types/Todo';

import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  loadingTodos: number | null;
  setLoadingTodos: (id: number | null) => void;
  handleErrorMessage: (errorMessage: string) => void;
  handleCheckTodo: (id: number) => void;
  tempTodo: Todo | null;
  submmitInputRef: React.RefObject<HTMLInputElement>;
};

export function TodoList({
  todos,
  setTodos,
  loadingTodos,
  setLoadingTodos,
  handleErrorMessage,
  handleCheckTodo,
  tempTodo,
  submmitInputRef,
}: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<number | null>(null);

  const handleEditedTodoSubmit = async (
    newTodo: Todo,
    event: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    event.preventDefault();

    setLoadingTodos(newTodo.id);

    patchTodos(newTodo)
      .then(() => {
        const newList = todos.map(t => {
          if (t.id === newTodo.id) {
            return newTodo;
          } else {
            return t;
          }
        });

        setTodos(newList);
        setEditingTodo(null);
        setTimeout(() => {
          submmitInputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        handleErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodos(null);
      });
  };

  const handleDeleteTodo = async (id: number) => {
    if (todos.find(t => t.id === id)) {
      setLoadingTodos(id);

      try {
        await deleteTodos(id);
        const newTodosList = todos.filter(t => t.id !== id);

        setTodos(newTodosList);
      } catch (error) {
        handleErrorMessage('Unable to delete a todo');
      } finally {
        setLoadingTodos(null);
        setTimeout(() => {
          submmitInputRef.current?.focus();
        }, 0);
      }
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodos={loadingTodos}
          handleCheckTodo={handleCheckTodo}
          onSave={handleEditedTodoSubmit}
          editingTodo={todo.id === editingTodo}
          setEditingTodo={setEditingTodo}
          onEditing={() => setEditingTodo(todo.id)}
          onDelete={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          loadingTodos={loadingTodos}
          handleCheckTodo={handleCheckTodo}
          onSave={handleEditedTodoSubmit}
          editingTodo={tempTodo.id === editingTodo}
          setEditingTodo={setEditingTodo}
          onEditing={() => setEditingTodo(tempTodo.id)}
          onDelete={handleDeleteTodo}
        />
      )}
    </section>
  );
}
