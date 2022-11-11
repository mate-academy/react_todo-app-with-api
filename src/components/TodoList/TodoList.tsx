import React from 'react';
import { Todo } from '../../types/Todo';
import { AddingLoader } from '../AddingLoader/AddingLoader';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  handleDeleteTodo:(todoId: number) => void,
  deletingTodosIds: number[]
  newTitle: string,
  toggleTodo: (todoId: number, isCompleted: boolean) => void,
  changeTodoTitle: (todoId: number, title: string) => void,
  selectingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTitle,
  handleDeleteTodo,
  deletingTodosIds,
  toggleTodo,
  changeTodoTitle,
  selectingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodosIds={deletingTodosIds}
          toggleTodo={toggleTodo}
          changeTodoTitle={changeTodoTitle}
          selectingTodoIds={selectingTodoIds}
        />
      ))}

      {isAdding && (
        <AddingLoader newTitle={newTitle} />
      )}
    </section>
  );
};
