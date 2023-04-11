import React from 'react';

type Props = {
  title: string,
  onEditingSkip: () => void;
  onTodoTitleUpdate: (newTitle: string) => Promise<void>;
  onTodoDelete: () => Promise<void>;
};

type State = {
  title: string | null;
};

export class TodoEditForm extends React.Component<Props, State> {
  state = {
    title: null,
  }

  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.title === null) {
      return {
        title: props.title,
      };
    }

    return null;
  }

  componentDidMount(): void {
    const todoTitleInput = this.inputRef.current;

    if (!todoTitleInput) {
      return;
    }

    todoTitleInput.focus();
    todoTitleInput.addEventListener('keyup', this.handleTodoEditingSkip);
  }

  componentWillUnmount(): void {
    const todoTitleInput = this.inputRef.current;

    if (!todoTitleInput) {
      return;
    }

    todoTitleInput.removeEventListener('keyup', this.handleTodoEditingSkip);
  }

  handleTodoUpdate = async () => {
    const { title } = this.state;
    const {
      onEditingSkip,
      onTodoTitleUpdate,
      onTodoDelete,
    } = this.props;

    if (!title) {
      await onTodoDelete();

      return;
    }

    if (title === this.props.title) {
      onEditingSkip();

      return;
    }

    await onTodoTitleUpdate(title);
  }

  handleTodoEditingSkip = (escClickEvent: KeyboardEvent) => {
    if (escClickEvent.key !== 'Escape' || !this.inputRef.current) {
      return;
    }

    this.props.onEditingSkip();
    this.inputRef.current.blur();
  };

  render() {
    const title = this.state.title ?? '';

    return (
      <>
        <form
          onSubmit={(submitEvent) => {
            submitEvent.preventDefault();
            this.handleTodoUpdate();
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(changeEvent) => this.setState({
              title: changeEvent.target.value,
            })}
            onBlur={() => this.handleTodoUpdate()}
            ref={this.inputRef}
          />
        </form>
      </>
    );
  }
}
