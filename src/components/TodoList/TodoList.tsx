import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number, onFail: () => void) => void;
  tempTodo?: Todo | null;
  loading?: boolean;
  handleUpdateTodo: (updatedTodo: Todo, onFail: () => void) => void;
  loadingTodoId: number | null;
  handleToggleTodo: (todoId: number,  todo: Todo) => void;
  toggleId? : number | null;
  updatingTodos: number[];
};

const TodoList: React.FC<Props> = React.memo(({ todos, handleDeleteTodo, tempTodo, loading = false, handleUpdateTodo, loadingTodoId, handleToggleTodo, toggleId, updatingTodos }) => {

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo =>
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            loading={loading}
            handleUpdateTodo={handleUpdateTodo}
            loadingTodoId={loadingTodoId}
            handleToggleTodo={handleToggleTodo}
            toggleId={toggleId}
            updatingTodos={updatingTodos}
          />)}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={() => { }}
          loading={true}
          handleUpdateTodo={() => { }}
          loadingTodoId={loadingTodoId}
          handleToggleTodo= {() => { }}
          updatingTodos={updatingTodos}
        />
      )}
    </section>
  );
});

TodoList.displayName = 'TodoList';
export default TodoList;
