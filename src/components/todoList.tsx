import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { ErrorMesagges } from '../types/enums';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  deletingIds: number[] | null;

  setDeletingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;
  isAllTodosCompleted: boolean;
  isCompletedIds: number[] | null;
  isLoadingIds?: number[] | null;
  setIsLoadingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;

  onToggle: (id: number, completed: boolean) => void;

  setErrorMessage: (value: ErrorMesagges) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDelete,
  deletingIds,
  setDeletingIds,
  isAllTodosCompleted,
  isCompletedIds,
  isLoadingIds,
  setIsLoadingIds,

  onToggle,
  setErrorMessage,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletingIds={deletingIds}
          setDeletingIds={setDeletingIds}
          isAllTodosCompleted={isAllTodosCompleted}
          isCompletedIds={isCompletedIds}
          isLoadingIds={isLoadingIds}
          setIsLoadingIds={setIsLoadingIds}
          onToggle={onToggle}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};

export default TodoList;
