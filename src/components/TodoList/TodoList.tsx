import React from 'react';
import { Todo as TodoInterface } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

interface Props {
  todos: TodoInterface[],
  tempTodo: Omit<TodoInterface, 'userId'> | null,
  handleDelete: (todoId: number) => void,
  selectedTodos: number[],
  toggleComplete: (
    todoId: number,
    { completed }: Pick<TodoInterface, 'completed'>,
  ) => void
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete = () => { },
  selectedTodos,
  toggleComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({
        title,
        id,
        completed,
      }) => (
        <Todo
          id={id}
          title={title}
          completed={completed}
          key={id}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          onClick={toggleComplete}
        />
      ))}
      {tempTodo
        && (
          <Todo
            id={tempTodo.id}
            title={tempTodo.title}
            completed={tempTodo.completed}
            handleDelete={() => { }}
            selectedTodos={selectedTodos}
          />
        )}
    </section>
  );
};
