/* eslint-disable no-console */
import {
  FC,
  Dispatch,
  SetStateAction,
} from 'react';

import { Todo } from '../types/Todo';
import { CustomError } from '../types/CustomError';
import { deleteTodo } from '../api/todos';
import { TodoComponent } from './TodoComponent';

type Props = {
  tempTodo: Todo | null;
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const ListOfTodos: FC<Props> = ({
  tempTodo,
  todos,
  setTodos,
  setError,
}) => {
  const onRemoveTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);

    if (todoToDelete) {
      setTodos((prevTodos) => {
        return [
          ...prevTodos.filter(todo => todo.id !== id),
          {
            ...todoToDelete,
            id: 0,
          },
        ];
      });

      deleteTodo(id)
        .then(() => {
          setTodos((prevState) => {
            return [
              ...prevState.filter(todo => todo.id),
            ];
          });
        })
        .catch(() => setError(CustomError.Delete, 3000));
    } else {
      setError(CustomError.Delete, 3000);
    }
  };

  return (
    <section
      className="todoapp__main"
    >
      {todos.map(({ id, title, completed }: Todo) => (
        <TodoComponent
          setError={setError}
          setTodos={setTodos}
          todos={todos}
          key={id}
          id={id}
          onRemove={onRemoveTodo}
          completed={completed}
          title={title}
        />
      ))}

      {!!tempTodo && (
        <TodoComponent
          setError={setError}
          setTodos={setTodos}
          todos={todos}
          onRemove={onRemoveTodo}
          completed={tempTodo.completed}
          title={tempTodo.title}
          id={tempTodo.id}
        />
      )}
    </section>
  );
};
