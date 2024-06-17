import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
  completedTodoIds: number[];
  makingChanges: boolean;
  setMakingChanges: (value: boolean) => void;
  editingTodoStatus: Todo | null;
  setEditingTodoStatus: (todo: Todo | null) => void;
  clearCompleted: boolean;
  editingTodoTitle: Todo | null;
  setEditingTodoTitle: (value: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  inputRef,
  editInputRef,
  makingChanges,
  completedTodoIds,
  setMakingChanges,
  editingTodoStatus,
  setEditingTodoStatus,
  clearCompleted,
  editingTodoTitle,
  setEditingTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            inputRef={inputRef}
            editInputRef={editInputRef}
            makingChanges={makingChanges}
            completedTodoIds={completedTodoIds}
            setMakingChanges={setMakingChanges}
            editingTodoStatus={editingTodoStatus}
            setEditingTodoStatus={setEditingTodoStatus}
            clearCompleted={clearCompleted}
            editingTodoTitle={editingTodoTitle}
            setEditingTodoTitle={setEditingTodoTitle}
          />
        );
      })}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
