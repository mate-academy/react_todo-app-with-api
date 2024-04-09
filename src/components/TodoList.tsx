import { Errors, Todo } from '../types/Types';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null | undefined;
  deleteCurrentTodo: (id: number) => void;
  deleteTodoByID: number | null | undefined;
  toggleCompleted: (id: number) => void;
  setErrorMessage: (error: Errors | null) => void;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoList = ({
  todos,
  tempTodo,
  deleteCurrentTodo,
  deleteTodoByID,
  toggleCompleted,
  setErrorMessage,
  updateTodoTitle,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            title={todo.title}
            id={todo.id}
            completed={todo.completed}
            deleteCurrentTodo={deleteCurrentTodo}
            deleteTodoByID={deleteTodoByID}
            toggleCompleted={toggleCompleted}
            setErrorMessage={setErrorMessage}
            updateTodoTitle={updateTodoTitle}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          id={tempTodo.id}
          completed={tempTodo.completed}
          deleteCurrentTodo={deleteCurrentTodo}
          deleteTodoByID={deleteTodoByID}
          toggleCompleted={toggleCompleted}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};
