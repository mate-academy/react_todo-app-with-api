import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  selectedId: number;
  title: string;
  setTodos: (value: Todo[]) => void;
  setSelectedId: (value: number) => void;
  setTitle: (value: string) => void;
  editTodoStatus: (value: number, value2: boolean) => void;
  editTodoTitle: () => void;
  deleteTodo: (value: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  (props) => {
    const {
      todos,
      deleteTodo,
      setTodos,
      editTodoStatus,
      selectedId,
      setSelectedId,
      title,
      setTitle,
      editTodoTitle,
    } = props;

    return (
      <>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            selectedId={selectedId}
            title={title}
            key={todo.id}
            setTodos={setTodos}
            setSelectedId={setSelectedId}
            setTitle={setTitle}
            editTodoStatus={editTodoStatus}
            editTodoTitle={editTodoTitle}
            deleteTodo={deleteTodo}
          />
        ))}
      </>
    );
  },
);
