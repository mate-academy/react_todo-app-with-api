import React from 'react';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodoAppContentProps } from './types/TodoAppContentProps';

export const TodoAppContent: React.FC<TodoAppContentProps> = ({
  filteredTodos,
  tempTodo,
  todos,
  filterBy,
  todoInput,
  isSubmitting,
  handleAddTodo,
  setTodoInput,
  deleteTodo,
  handleFilterClick,
  clearCompletedTodos,
  loadingTodo,
  focusRef,
  toggleTodoStatus,
  toggleAllTodos,
  isUpdatingAll,
  setTodos,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleEdit,
}) => {
  return (
    <div className="todoapp__content">
      <TodoHeader
        isUpdatingAll={isUpdatingAll}
        todos={todos}
        isSubmitting={isSubmitting}
        toggleAllTodos={toggleAllTodos}
        todoInput={todoInput}
        setTodoInput={setTodoInput}
        handleAddTodo={handleAddTodo}
        focusRef={focusRef}
      />

      <TodoList
        todos={todos}
        setTodos={setTodos}
        isUpdatingAll={isUpdatingAll}
        filteredTodos={filteredTodos}
        isSubmitting={isSubmitting}
        tempTodo={tempTodo}
        deleteTodo={deleteTodo}
        loadingTodo={loadingTodo}
        toggleTodoStatus={toggleTodoStatus}
        editingId={editingId}
        setEditingId={setEditingId}
        editText={editText}
        setEditText={setEditText}
        handleEdit={handleEdit}
      />

      {todos.length > 0 && (
        <TodoFooter
          todos={todos}
          filterBy={filterBy}
          handleFilterClick={handleFilterClick}
          clearCompletedTodos={clearCompletedTodos}
        />
      )}
    </div>
  );
};
