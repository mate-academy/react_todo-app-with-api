import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, editTodo } from '../../api/todos';
import { TodoItem } from './TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  getTodosFromServer: () => Promise<void>;
  isAdding: boolean;
  tempTodo: Todo;
  setHasError: (isError: boolean) => void;
  setMessageError: (message: ErrorMessage) => void;
  setIsLoading: Dispatch<SetStateAction<number[]>>;
  isLoading: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  getTodosFromServer,
  isAdding,
  tempTodo,
  setHasError,
  setMessageError,
  setIsLoading,
  isLoading,
}) => {
  const handleEditTodo = async (id: number, completed: boolean) => {
    try {
      setIsLoading((currentIds) => [...currentIds, id]);
      await editTodo(id, { completed });
      await getTodosFromServer();
      setIsLoading((currentIds) => currentIds
        .filter((numberOfId) => numberOfId !== id));
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.UpdateError);
    }
  };

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      setIsLoading((currentIds) => [...currentIds, id]);
      await deleteTodo(id);
      await getTodosFromServer();
      setIsLoading((currentIds) => currentIds
        .filter((numberOfId) => numberOfId !== id));
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.DeleteError);
    }
  }, []);

  const handleEditTitle = async (id: number, title: string) => {
    try {
      const newTodoTitle = title.trim();

      if (newTodoTitle.length > 0) {
        setIsLoading((currentIds) => [...currentIds, id]);
        await Promise.all([editTodo(id, { title })]);
        await getTodosFromServer();
        setIsLoading((currentIds) => currentIds
          .filter((numberOfId) => numberOfId !== id));
      } else {
        setIsLoading((currentIds) => [...currentIds, id]);
        await handleDeleteTodo(id);
      }
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.UpdateError);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            handleEditTodo={handleEditTodo}
            handleDeleteTodo={handleDeleteTodo}
            todo={todo}
            isLoading={isLoading}
            isAdding={isAdding}
            handleEditTitle={handleEditTitle}
          />
        );
      })}
      {isAdding && (
        <TodoItem
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
          todo={tempTodo}
          isLoading={isLoading}
          isAdding={isAdding}
          handleEditTitle={handleEditTitle}
        />
      )}
    </section>
  );
};
