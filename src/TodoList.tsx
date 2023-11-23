import React from 'react';
import { TodoListProps } from './types/TodoListProps';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  deleteTodo,
  loadingTodo,
  toggleTodoStatus,
  isUpdatingAll,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodo={loadingTodo}
          toggleTodoStatus={toggleTodoStatus}
          isUpdatingAll={isUpdatingAll}
          editingId={editingId}
          setEditingId={setEditingId}
          editText={editText}
          setEditText={setEditText}
          handleEdit={handleEdit}
        />
      ))}
      {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
    </section>
  );
};
