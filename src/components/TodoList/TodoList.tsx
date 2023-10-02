import { TempTodo } from './TempTodo/TempTodo';
import { TodoComponent } from './TodoComponent/TodoComponent';
import { EditedTodo } from './EditedTodo/EditedTodo';
import { useTodosProvider } from '../../providers/TodosContext';
import { Filter } from '../../types/Filter';

export const TodoList: React.FC
  = () => {
    const {
      todos, editedTodoId, tempTodo, activeFilter,
    } = useTodosProvider();

    const filteredTodos = todos.filter(todo => {
      if (activeFilter === Filter.Active) {
        return !todo.completed;
      }

      if (activeFilter === Filter.Completed) {
        return todo.completed;
      }

      return todo;
    });

    return (
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          if (todo.id === editedTodoId) {
            return (
              <EditedTodo todo={todo} key={todo.id} />
            );
          }

          return (
            <TodoComponent todo={todo} key={todo.id} />
          );
        })}

        {tempTodo
          && <TempTodo /> }
      </section>
    );
  };
