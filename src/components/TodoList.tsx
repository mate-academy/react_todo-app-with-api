import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { filterTodos } from '../utils/helpers';
import { FilterType } from '../enums/enums';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  tempTodo: Todo | null;

  handleDeleteTodo: (id: number) => Promise<void>;
  handleEditTodo: (updatedTodo: Todo) => Promise<void>;
  handleToggleTodo: (todo: Todo) => Promise<void>;
  deletingTodoId: number | null;
  isTodoEditing: boolean;
  selectedPostId: number;

  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;

  showErrorContainer: (message: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,

  handleDeleteTodo,
  handleEditTodo,
  deletingTodoId,
  isTodoEditing,
  selectedPostId,

  setIsTodoEditing,
  setSelectedPostId,

  showErrorContainer,
}) => {
  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingTodoId === todo.id || Boolean(todo.isLoading)}
          isTodoEditing={isTodoEditing}
          selectedPostId={selectedPostId}
          setIsTodoEditing={setIsTodoEditing}
          setSelectedPostId={setSelectedPostId}
          onDelete={() => handleDeleteTodo(todo.id)}
          onUpdate={updatedTodo => handleEditTodo(updatedTodo)}
          showErrorContainer={showErrorContainer}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          isTodoEditing={false}
          selectedPostId={0}
          setIsTodoEditing={() => {}}
          setSelectedPostId={() => {}}
          onDelete={async () => Promise.resolve()}
          onUpdate={async () => Promise.resolve()}
          showErrorContainer={() => {}}
        />
      )}
    </section>
  );
};
