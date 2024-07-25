# Chapter Two: Event Testing

Angular is heavily dependent on the passage of events between components to relay information. The original way this was done was with the Event Emitter and that's where this tutorial will begin.

Storybook will have created a folder in your default angular project at the path `<project-root>/src/app/stories`. In there you will find a `button.component.ts` and `button.stories.ts` file.

## The Component
The button doesn't do that much. It is reliant on another component to give it a click event to call when it is clicked. A more common pattern is for a component to do something when an event happens and then it will need to report the result of that operation.  So we're going to modify the Storybook example button to keep a running count of how many times it has been clicked. Whatever component hosts this new button will then receive this value when the button is clicked.

The first thing we'll need to do is remove the bind for onClick from the template. Near the top of the file you'll see this code:

```typescript
@Component({
  selector: 'storybook-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    type="button"
    (click)="onClick.emit($event)"
    [ngClass]="classes"
```

Change the line to `(click)="onClick()"` because we want to do an operation and then emit a different eventEmitter from the internal onClick event.

Now find the Component's Class declaration and add a count variable

```typescript
export class ButtonComponent {
  #count:number = 0
```

We use the JavaScript privacy operator instead of TypeScript's because JavaScript will enforce its privacy operator once the code is transpiled.

Now find the existing click handler, which is bound to an output.

```typescript
  /**
   * Optional click handler
   */
  @Output()
  onClick = new EventEmitter<Event>();
```

Replace it with this one.

```typescript
  /**
   * Click count event
   */
  @Output() 
  clickCount:EventEmitter<number> = new EventEmitter<number>()
```

Now we add a click event that isn't output to increment the count and dispatch the event with the count information.

```typescript
  onClick() {
    this.#count++
    this.clickCount.emit(this.#count)
  }
```

## The Story
Now we'll add the test to the story. First we need to change the binding point of the spy.  Find this code.

```typescript
const meta: Meta<ButtonComponent> = {
  title: 'Example/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};
```

Change the args line to `args: { clickCount: fn() },`.

Now we'll add a play test to the Primary story like so:

```typescript
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
  play: async ({canvasElement,args}) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement

    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(1)
    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(2)
    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(3)
  }
};
```

Save this and you'll see the results of this test in the Interaction tab.

We can transmit more than numbers. Whole complex objects and form instances can also be emitted. These events can occur on any interaction, not just click.

In the next chapter we'll begin the real journey, creating Reactive Form components.