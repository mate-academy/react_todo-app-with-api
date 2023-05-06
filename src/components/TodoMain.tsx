import React, { Dispatch, SetStateAction } from 'react';
import { TodoList } from './TodoList/TodoList';
import { TodoInfo } from './TodoInfo/TodoInfo';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[],
  removeTodo: (id: number) => void,
  handleUpdateTodo: (todo: Todo) => void,
  isLoadingTodo: boolean,
  tempTodo: Todo | null,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
};

export const TodoMain: React.FC<Props> = ({
  filteredTodos,
  removeTodo,
  handleUpdateTodo,
  isLoadingTodo,
  tempTodo,
  todos,
  setTodos,
}) => (
  <section className="todoapp__main">
    <TodoList
      todos={filteredTodos}
      onDelete={removeTodo}
      onUpdateTodo={handleUpdateTodo}
      setTodos={setTodos}
      isLoadingTodo={isLoadingTodo}
    />
    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onDelete={removeTodo}
        onUpdateTodo={handleUpdateTodo}
        todos={todos}
        setTodos={setTodos}
        isLoadingTodo={isLoadingTodo}
      />
    )}
  </section>
);
