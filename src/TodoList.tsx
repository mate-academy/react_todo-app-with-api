import { useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './utils/TodoItem';

interface TodoListProps {
  todos: Todo[];
  setRemoveTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setToggleTodoIsFailed: React.Dispatch<React.SetStateAction<boolean>>;
  updatingTodosToggle: number[];
  deletingCompletedTodos: number[];
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  setRemoveTodoIsClicked,
  setEditTodoIsClicked,
  tempTodo,
  setTodos,
  setToggleTodoIsFailed,
  updatingTodosToggle,
  deletingCompletedTodos,
  setIsInputDisabled,
}) => {
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [itemToToggle, setItemToToggle] = useState<number | null>(null);
  const [itemToUpdate, setItemToUpdate] = useState<number | null>(null);
  const [itemToLoad, setItemToLoad] = useState<number | null>(null);

  const toggleTodo = async (todoId: number) => {
    setItemToToggle(todoId);

    const todoToUpdate = todos.find((todo) => todo.id === todoId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { id, userId, title } = todoToUpdate!;

    const updatedTodo: Todo = {
      id,
      userId,
      title,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      completed: !todoToUpdate!.completed,
    };

    try {
      await fetch(`https://mate.academy/students-api/todos/${todoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(updatedTodo),
        });
      // eslint-disable-next-line no-console
      console.log('todo has been updated');
      if (todoToUpdate) {
        todoToUpdate.completed = !todoToUpdate.completed;
        setTodos([...todos]);
      }
    } catch {
      setToggleTodoIsFailed(true);
    } finally {
      setItemToToggle(null);
    }
  };

  const handleToggleComplete = (todoId: number) => {
    toggleTodo(todoId);

    // eslint-disable-next-line no-console
    console.log('handleToggleComplete invoked');
  };

  const remove = (url: string) => {
    return fetch(url, {
      method: 'DELETE',
    });
  };

  const deleteTodo = (todoId: number) => {
    return remove(`https://mate.academy/students-api/todos/${todoId}`);
  };

  const handleTodoRemoval = async (todoId: number) => {
    setItemToDelete(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
      setItemToDelete(null);
    } catch {
      setRemoveTodoIsClicked(true);
    }
  };

  const updateTodo = (todoId: number, editedTitle: string) => {
    return fetch(`https://mate.academy/students-api/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        title: editedTitle,
      }),
    });
  };

  const handleTodoTitleChange = async (
    todoId: number,
    editedTitle: string,
    currentTitle: string,
  ) => {
    if (currentTitle === editedTitle) {
      setItemToUpdate(null);

      return;
    }

    if (editedTitle === '') {
      handleTodoRemoval(todoId);
      setItemToUpdate(null);

      return;
    }

    try {
      await updateTodo(todoId, editedTitle);
    } catch {
      // eslint-disable-next-line no-console
      console.log('errorUpdatingTodoTitle');
      setEditTodoIsClicked(true);
    } finally {
      setItemToLoad(null);
      setItemToUpdate(null);
    }

    setIsInputDisabled(false);
  };

  return (
    <section className="todoapp__main">

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDoubleClick={() => setItemToUpdate(todo.id)}
          onClick={handleTodoRemoval}
          isLoading={todo.id === itemToDelete
            || todo.id === itemToToggle
            || (updatingTodosToggle.includes(todo.id))
            || (deletingCompletedTodos.includes(todo.id))
            || (todo.id === itemToLoad)}
          handleToggleComplete={() => handleToggleComplete(todo.id)}
          isEditing={todo.id === itemToUpdate}
          handleTodoTitleChange={handleTodoTitleChange}
          finishEditing={() => setItemToUpdate(null)}
        />

      ))}

      {tempTodo
          && (
            <TodoItem
              todo={tempTodo}
              isLoading
            />
          )}

    </section>
  );
};
