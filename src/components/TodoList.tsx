import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

type Props = {
  todosLength: number;
  tempTodo: Todo | null;

  visibleTodos: Todo[];

  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;

  todoIdsInProgress: number[];

  handleToggleTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  handleRenameTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todosLength,
  tempTodo,
  visibleTodos,

  editingTodoId,
  editingTitle,
  setEditingTitle,
  setEditingTodoId,

  todoIdsInProgress,

  handleToggleTodo,
  handleDeleteTodo,
  handleRenameTodo,
}) => {
  if (!todosLength && !tempTodo) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          setEditingTodoId={setEditingTodoId}
          todoIdsInProgress={todoIdsInProgress}
          handleToggleTodo={handleToggleTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleRenameTodo={handleRenameTodo}
        />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
