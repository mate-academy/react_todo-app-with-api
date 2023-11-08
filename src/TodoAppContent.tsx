import React from 'react';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList.1';
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
}) => {
  return (
    <div className="todoapp__content">
      <TodoHeader
        isSubmitting={isSubmitting}
        todoInput={todoInput}
        setTodoInput={setTodoInput}
        handleAddTodo={handleAddTodo}
        focusRef={focusRef}
      />

      <TodoList
        filteredTodos={filteredTodos}
        isSubmitting={isSubmitting}
        tempTodo={tempTodo}
        deleteTodo={deleteTodo}
        loadingTodo={loadingTodo}
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
