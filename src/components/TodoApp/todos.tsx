import { useState } from 'react';
import { LoadedTodo } from './Todo';
import { LoadingTodo } from './loadingTodo';
import { TodoInput } from './TodoInput';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[],
  filter: FilterType,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todoLoadId: number | null,
  setTodoLoadId: (id: number | null) => void,
};

const filter = (type: FilterType, todos: Todo[]) => {
  if (type === FilterType.ACTIVE) {
    return todos.filter((todo) => !todo.completed);
  }

  if (type === FilterType.COMPLETED) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

export const Todos:React.FC<Props> = ({
  todos,
  filter: filterType,
  onError: setErrorType,
  setTodos,
  todoLoadId,
  setTodoLoadId,
}) => {
  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);
  const [todoTitle, setTodoTitle] = useState('');

  const filteredTodos = filter(filterType, todos);

  return (
    <>
      {filteredTodos.map((todo: Todo) => {
        if (todo.id === editableTodoId) {
          return (
            <div key={todo.id}>
              <TodoInput
                todo={todo}
                setEditableTodoId={setEditableTodoId}
                setTodos={setTodos}
                onError={setErrorType}
                todoTitle={todoTitle}
                setTodoTitle={setTodoTitle}
                setTodoLoadId={setTodoLoadId}
              />
            </div>
          );
        }

        if (todoLoadId === todo.id) {
          return (
            <div key={todo.id}>
              <LoadingTodo todo={todo} />
            </div>
          );
        }

        return (
          <div key={todo.id}>
            <LoadedTodo
              todo={todo}
              onError={setErrorType}
              setTodos={setTodos}
              onEditId={setEditableTodoId}
              setTodoTitle={setTodoTitle}
              setTodoLoadId={setTodoLoadId}
            />
          </div>
        );
      })}
    </>
  );
};
