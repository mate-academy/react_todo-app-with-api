import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem';

type Props = {
  throwErr: (msg: string) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (newTodo: Todo) => void;
  focusInput: () => void;
  todos: Todo[];
  showLoadingFor: string;
};

const TodoList: React.FC<Props> = ({
  throwErr,
  deleteTodo,
  updateTodo,
  focusInput,
  todos,
  showLoadingFor,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading =
          (todo.completed && showLoadingFor === 'completed') ||
          (!todo.completed && showLoadingFor === 'uncompleted');

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            throwErr={throwErr}
            deleteTodoFromArray={deleteTodo}
            updateTodo={updateTodo}
            focusInput={focusInput}
          />
        );
      })}
    </section>
  );
};

export default React.memo(TodoList);
