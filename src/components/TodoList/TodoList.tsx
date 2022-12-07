import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  handleDeleteButton: (todoId: number) => void;
  temporaryTodo: Todo;
  isAdding?: boolean;
  selectedTodoId: number[];
  handleUpdateTodoStatus: (todo: Todo) => void;
  handleNewTodoTitle: (todo: Todo, newTodoTitle: string) => void;
};

export const TodoList: React.FC<Props>
  = React.memo(({
    todos, handleDeleteButton, temporaryTodo, isAdding,
    selectedTodoId, handleUpdateTodoStatus, handleNewTodoTitle,
  }) => (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          handleDeleteButton={handleDeleteButton}
          key={todo.id}
          isActive={selectedTodoId.includes(todo.id)}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          handleNewTodoTitle={handleNewTodoTitle}
        />
      ))}
      {isAdding && (
        <TodoInfo
          isAdding={isAdding}
          todo={temporaryTodo}
        />
      )}
    </section>
  ));
