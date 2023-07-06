import { useState } from 'react';
import { LoadedTodo } from './LoadedTodo';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[],
  filter: FilterType,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  loadingTodosId: number[],
  addTodoLoadId: (todoId: number) => void,
  removeTodoLoadId: (todoId: number) => void,
  tempNewTodo: Todo | null,
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
  loadingTodosId,
  addTodoLoadId,
  removeTodoLoadId,
  tempNewTodo,
}) => {
  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const filteredTodos = filter(filterType, todos);

  return (
    <div>
      {filteredTodos.map((todo: Todo) => (
        <div key={todo.id}>
          <LoadedTodo
            todo={todo}
            onError={setErrorType}
            setTodos={setTodos}
            onEditId={setEditableTodoId}
            editableTodoId={editableTodoId}
            setTodoTitle={setTodoTitle}
            todoTitle={todoTitle}
            addTodoLoadId={addTodoLoadId}
            removeTodoLoadId={removeTodoLoadId}
            loadingTodosId={loadingTodosId}
          />
        </div>
      ))}
      {tempNewTodo && (
        <LoadedTodo
          todo={tempNewTodo}
          onError={setErrorType}
          setTodos={setTodos}
          onEditId={setEditableTodoId}
          editableTodoId={editableTodoId}
          setTodoTitle={setTodoTitle}
          todoTitle={todoTitle}
          addTodoLoadId={addTodoLoadId}
          removeTodoLoadId={removeTodoLoadId}
          loadingTodosId={loadingTodosId}
        />
      )}
    </div>
  );
};
