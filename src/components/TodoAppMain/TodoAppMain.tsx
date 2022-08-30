import React from 'react';
import { TodoList } from '../TodoList/TodoList';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  handleRenameTodo: (todo: Todo, title: string) => void,
  loadingTodosID: number[],
};

export const TodoAppMain: React.FC<Props> = (props) => {
  const {
    todos,
    handleDeleteTodo,
    handleRenameTodo,
    handleUpdateTodoStatus,
    loadingTodosID,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        todos={todos}
        loadingTodosID={loadingTodosID}
        handleUpdateTodoStatus={handleUpdateTodoStatus}
        handleRenameTodo={handleRenameTodo}
        handleDeleteTodo={handleDeleteTodo}
      />
    </section>
  );
};
