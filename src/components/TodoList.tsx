import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodoId: number | null;
  deleteTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, completed: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  updateTodo: (todoId: number, newTitle: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodoId,
  deleteTodo,
  toggleTodoStatus,
  setErrorMessage,
  updateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingTodoId={loadingTodoId}
        deleteTodo={deleteTodo}
        toggleTodoStatus={toggleTodoStatus}
        setErrorMessage={setErrorMessage}
        updateTodo={updateTodo}
      />
    ))}
  </section>
);

export default TodoList;
