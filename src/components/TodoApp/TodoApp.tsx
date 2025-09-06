/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Errormessage } from '../Errormessage/Errormessage';
import { Todo } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import { ErrorMessages } from '../../types/enums';
import { useErrorHandling } from '../../hooks/useErrorHandling';
import { useTodoFiltering } from '../../hooks/useTodoFiltering';

export const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { errorMessage, handleSetErrorMessage, handleClearErrorMessage } =
    useErrorHandling();

  const {
    todoList,
    processingIds,
    addTodo,
    removeTodo,
    updateTodo,
    handleToggleAll,
    handleClearCompleted,
  } = useTodos(handleSetErrorMessage, inputRef);

  const { isActive, setIsActive, visibleTodos, isAllCompleted } =
    useTodoFiltering(todoList, tempTodo);

  const handleEditTodo = useCallback((todoId: number | null) => {
    setEditingTodoId(todoId);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!title.trim()) {
        handleSetErrorMessage(ErrorMessages.EMPTY_TITLE);

        return;
      }

      setTempTodo({ id: 0, title: title.trim(), completed: false, userId: 0 });
      const newTodo = await addTodo({ title: title.trim() });

      setTempTodo(null);
      if (newTodo) {
        setTitle('');
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [title, addTodo, handleSetErrorMessage],
  );

  const handleToggleAllWrapper = useCallback(() => {
    const todosToUpdate = todoList.filter(
      todo => todo.completed !== !isAllCompleted,
    );

    handleToggleAll(isAllCompleted, todosToUpdate);
  }, [isAllCompleted, todoList, handleToggleAll]);

  const handleClearCompletedWrapper = useCallback(() => {
    const completedTodos = todoList.filter(todo => todo.completed);

    handleClearCompleted(completedTodos);
  }, [todoList, handleClearCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          title={title}
          setTitle={e => setTitle(e.target.value)}
          onSubmit={handleSubmit}
          isAdding={!!tempTodo}
          hasTodos={todoList.length > 0}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAllWrapper}
        />

        <TodoList
          todos={visibleTodos}
          processingIds={processingIds}
          editingTodoId={editingTodoId}
          removeTodo={removeTodo}
          onUpdate={updateTodo}
          onEdit={handleEditTodo}
        />

        {todoList.length > 0 && (
          <Footer
            itemsCount={todoList.filter(todo => !todo.completed).length}
            activeStatus={isActive}
            onStatusChange={setIsActive}
            noCompletedTodos={!todoList.some(todo => todo.completed)}
            onClearCompleted={handleClearCompletedWrapper}
          />
        )}
      </div>

      <Errormessage
        errorMessage={errorMessage}
        onClose={handleClearErrorMessage}
      />
    </div>
  );
};
