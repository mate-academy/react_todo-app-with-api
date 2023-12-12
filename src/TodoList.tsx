/* eslint-disable no-lone-blocks */
// import { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodo: (todoId: number) => void
  todoTitle: string;
  setTodoTitle: (title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  deletingTodoId,
  isLoading,
  setIsLoading,
  tempTodo,
  toggleTodo,
  todoTitle,
  setTodoTitle,
}) => {
  // const [isEditing, setIsEditing] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (isEditing) {
  //     inputRef.current?.focus();
  //   }
  // }, [isEditing]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoId === todo.id && isLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          toggleTodo={toggleTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          // setIsEditing={setIsEditing}
          // isEditing={isEditing}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          toggleTodo={toggleTodo}
          // setIsEditing={setIsEditing}
          // isEditing={isEditing}
        />
      )}
    </section>
  );
};
