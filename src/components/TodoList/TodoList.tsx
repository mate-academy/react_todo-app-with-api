import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  handleRenameTodo: (todo: Todo, title: string) => void,
  loadingTodosID: number[],
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    handleDeleteTodo,
    handleRenameTodo,
    handleUpdateTodoStatus,
    loadingTodosID,
  } = props;

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const isTodoLoading = (todoId: number) => loadingTodosID.includes(todoId);

  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleRenameTodo={handleRenameTodo}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          isLoading={isTodoLoading(todo.id)}
          key={todo.id}
        />
      ))}
    </>
  );
};
