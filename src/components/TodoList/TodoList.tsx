import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  todos: Todo[],
  handleChangeCompleted: (id: number) => void,
  handleDoubleClick: (id: number) => void,
  updateTitle: (id: number, value: string) => void,
  setEditingTodo: (value: number) => void,
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
  editingTodo: number,
  loadingTodo: number,
  isLoadingCompleted: boolean,
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  handleChangeCompleted,
  handleDoubleClick,
  updateTitle,
  deleteTodo,
  setEditingTodo,
  tempTodo,
  deleteTodoId,
  editingTodo,
  loadingTodo,
  isLoadingCompleted,
}) => (
  <>
    {todos.map((todo) => {
      return (
        <TodoInfo
          handleChangeCompleted={handleChangeCompleted}
          handleDoubleClick={handleDoubleClick}
          updateTitle={updateTitle}
          deleteTodo={deleteTodo}
          setEditingTodo={setEditingTodo}
          editingTodo={editingTodo}
          todo={todo}
          key={todo.id}
          deleteTodoId={deleteTodoId}
          loadingTodo={loadingTodo}
          isLoadingCompleted={isLoadingCompleted}
        />
      );
    })}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        handleChangeCompleted={handleChangeCompleted}
        handleDoubleClick={handleDoubleClick}
        updateTitle={updateTitle}
        deleteTodo={deleteTodo}
        setEditingTodo={setEditingTodo}
        deleteTodoId={deleteTodoId}
        loadingTodo={loadingTodo}
        editingTodo={+tempTodo}
        isLoadingCompleted={isLoadingCompleted}
      />
    )}
  </>
);
