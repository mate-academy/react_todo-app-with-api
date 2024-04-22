import { USER_ID } from '../api/todos';
import { Setters } from '../types/Setters';
import { Filter } from '../types/Filter';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { handleDelete } from './handleDelete';
import { handleUpdate } from './handleUpdate';
import { State } from '../types/State';
import { errorText } from '../constants';
import { handleAdd } from './handleAdd';

export const items = {
  filter(todos: TodoWithLoader[], filter: Filter) {
    switch (filter) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },
  completed(todos: TodoWithLoader[]) {
    return todos.filter(todo => todo.completed);
  },

  uncompleted(todos: TodoWithLoader[]) {
    return todos.filter(todo => !todo.completed);
  },

  clearCompleted(todos: TodoWithLoader[], setters: Setters) {
    const completed = this.completed(todos);

    completed.map(todo => {
      handleDelete(todo, setters);
    });
  },

  toggleAll(state: State, setters: Setters) {
    const uncompleted = this.uncompleted(state.todos);

    if (uncompleted.length > 0) {
      uncompleted.map(todo => {
        return handleUpdate(todo, !todo.completed, setters);
      });
    }

    if (uncompleted.length === 0 && state.todos.length > 0) {
      state.todos.map(todo => {
        return handleUpdate(todo, !todo.completed, setters);
      });
    }
  },
};

export const item = {
  updateLoading(
    currentTodo: TodoWithLoader,
    isLoading: boolean,
    setters: Setters,
  ): void {
    setters.setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === currentTodo.id) {
          setters.setUpdatedAt(new Date());

          return { ...todo, loading: isLoading };
        }

        return todo;
      });
    });
  },

  handleAdd(
    title: string,
    state: State,
    setters: Setters,
    setTitle: (title: string) => void,
  ) {
    const newTitle = title.trim();

    if (!newTitle) {
      setters.setErrorMessage(errorText.emptyTitle);

      return;
    }

    if (!state.loading) {
      handleAdd(newTitle, setters).then(() => setTitle(''));
    }
  },

  handleDelete(todo: TodoWithLoader, setters: Setters) {
    handleDelete(todo, setters);
  },

  handleUpdate(todo: TodoWithLoader, title: string, setters: Setters) {
    const newTitle = title.trim();

    if (newTitle === todo.title) {
      setters.setSelectedTodo(null);
    } else if (newTitle.length === 0) {
      this.handleDelete(todo, setters);
    } else {
      handleUpdate(todo, todo.completed, setters, newTitle);
    }
  },

  createNew(newTitle: string, isCompleted: boolean) {
    return {
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: isCompleted,
      loading: false,
    };
  },
};
