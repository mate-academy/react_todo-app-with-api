import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
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
};

export const TodoList: React.FC<Props> = ({
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
        <TodoItem
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
      <TodoItem
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
