import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  handleChangeCompleted: (id: number) => void,
  handleDoubleClick: (id: number) => void,
  updateTitle: (id: number, value: string) => void,
  setIsEditing: (value: number) => void,
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
  isEditing: number,
  isLoading: number,
  isLoadingCompleted: boolean,
};

export const TodosList: React.FC<Props> = ({
  todos,
  handleChangeCompleted,
  handleDoubleClick,
  updateTitle,
  deleteTodo,
  setIsEditing,
  tempTodo,
  deleteTodoId,
  isEditing,
  isLoading,
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
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          todo={todo}
          key={todo.id}
          deleteTodoId={deleteTodoId}
          isLoading={isLoading}
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
        setIsEditing={setIsEditing}
        deleteTodoId={deleteTodoId}
        isLoading={isLoading}
        isEditing={+tempTodo}
        isLoadingCompleted={isLoadingCompleted}
      />
    )}
  </>
);
