import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  deleteCompletedTodos: () => void;
  todoInOperation: number[];
  setTodoInOperation: React.Dispatch<React.SetStateAction<number[]>>;
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  setFilter,
  errorMessage,
  setErrorMessage,
  deleteCompletedTodos,
  todoInOperation,
  setTodoInOperation,
  editingId,
  setEditingId,
  newTitle,
  setNewTitle,
  inputRef,
}) => {
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodoInOperation={setTodoInOperation}
          todoInOperation={todoInOperation}
          editingId={editingId}
          setEditingId={setEditingId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          inputRef={inputRef}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};

export default TodoList;
