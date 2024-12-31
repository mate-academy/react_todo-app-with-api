import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  todoIds: number[];
  tempTodo?: Todo | null;
  toggleTodoStatus: (todo: Todo) => void;
  setTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: (value: string | null) => void;
  isTodoUpdated: boolean;
};

const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  todoIds,
  tempTodo,
  toggleTodoStatus,
  setTodoIds,
  setErrorMessage,
  isTodoUpdated,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        todoIds={todoIds}
        toggleTodoStatus={toggleTodoStatus}
        setTodoIds={setTodoIds}
        setErrorMessage={setErrorMessage}
        isTodoUpdated={isTodoUpdated}
      />
    ))}

    {tempTodo && (
      <TodoItem
        tempTodo={tempTodo}
        key={tempTodo.id}
        todo={tempTodo}
        deleteTodo={deleteTodo}
        todoIds={todoIds}
        toggleTodoStatus={toggleTodoStatus}
        setTodoIds={setTodoIds}
        setErrorMessage={setErrorMessage}
        isTodoUpdated={isTodoUpdated}
      />
    )}
  </section>
);

export default TodoList;
