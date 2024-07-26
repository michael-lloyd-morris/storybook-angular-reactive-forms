# Chapter Three: Reactive Form Components

Creating a Reactive form component is not as straight-forward as creating a template and binding a component. The Reactive forms module talks to the various HTML input elements through the NG_VALUE_ACCESSOR interface, so let's start by creating an abstract component that implements that implements this interface. We'll then build an input implementation and a select implementation.

## Abstract Component
Open file `/src/stories/abstract.field.component` and take a look around. The five inputs will be used repeatedly by our input components, so we go ahead and define them here so they'll be inherited by those components. 

If you are following along you may get some typescript errors on the inputs and the control element - to get rid of this you must add `"strictPropertyInitialization": false,` to the compilerOptions directive of the tsconfig.json file.

The general flow that our components will take is that they will take a formControlName argument the same as the native reactive components do. In order to make use of this they have to receive the ControlContainer service, and we'll have to mock this service in our storybook tests.

> **Note:** Observant readers of the code will spot that it has the @Directive decorator, not a @Component. This might seem odd but the reason is there is no template, indeed no decoration at all for this object on its own. For it to be handled by the Angular system we need some decoration. Components are just Directives with a template, so marking this as a Directive is appropriate.

## Input Component
Now let's build the Input component at `input.component.ts` Most of our work will be in the @Component declaration.

```typescript
@Component({
  selector: 'storybook-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputFieldComponent),
    multi: true,
  }],
  styleUrl: './input.component.css',
  template: `
  <label [for]="id + '-input'">{{label}}</label>
  <input 
    [id]="id + '-input'" 
    type={{type}}
    placeholder={{placeholder}}
    [formControl]="control"
    [attr.required] = "required ? 'required':null" 
  >
  `
})
```

We're going to use a standalone module format as those are easier to manage than traditional components and it makes for a simpler tutorial. We import the ReactiveFormsModule and then we declare our NG_VALUE_ACCESSOR that will allow the Reactive Forms to talk this component.

```typescript
export class InputFieldComponent extends AbstractField {
  /**
   * Placeholder that goes in the text field until populated.
   */
  @Input() placeholder:string
  /**
   * Field Type. Supported values are "text", "date", "email"
   */
  @Input() type:string = "text"
}
```

Very little is happening here - the abstract is doing the majority of the lifting. If following along in your own branch copy the css and html over now. The template html branches between Reactive Form and the older two-way binding technique.


## The Story
For those following along rather than activating the code in this branch let's stand up a minimum story to see if everything has been entered correctly so far. That file in full is this.

```typescript
import { Meta, StoryObj, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { InputFieldComponent } from './input.component';

const meta:Meta<InputFieldComponent> = {
  title: 'Example/Input',
  component: InputFieldComponent,
  tags: ['autodocs'],
  args: {},
}

export default meta

type Story = StoryObj<InputFieldComponent>

export const Basic: Story = {
  args: {
    id: 'basic-field',
    label: 'Text Field',
    formControlName: 'basic'
  }
}
```

Fire this story up and you'll be greeted with the following.

> R3InjectorError(Standalone[StorybookWrapperComponent])[ControlContainer -> ControlContainer -> ControlContainer]:
> The component failed to render properly, likely due to a configuration issue in Storybook. Here are some common causes and how you can address them:

We can temporarily be rid of this with the Optional() notation. Open the Abstract Field and find the constructor:

```typescript
  constructor(private controlContainer: ControlContainer) {}
```

Change it to this

```typescript
  constructor(@Optional() private controlContainer: ControlContainer) {}
```

Of course, this technique doesn't really solve anything - it just puts the component in an untestable state.  Still, we can check to make sure the component is standing up and if it is, we're ready to a mock the provider.

So after removing the @Optional() notation, open the stories file and after the imports add this code:

```typescript
let container:FormGroup

@Injectable()
class MockContainer {

  public control:FormGroup

  constructor(private fb:FormBuilder) {
    this.control = this.fb.group({
      basic: ['Hello World'],
    })
    container = this.control
  }
}
```

What we are doing is setting up a container variable that the tests can reference later to check. Meanwhile, in the constructor we create a Reactive Form in the same manner we would create it in the component that would hosts the input UI component we are building.

Next, in the meta section add the decorators:

```typescript
  decorators: [
    moduleMetadata({
      providers: [{
        provide: ControlContainer,
        useClass: MockContainer
      }] 
    }),
  ]
```

At this point the component should stand up and load the value off the Reactive Form.  Now we add our first test.

```typescript
  play: async ({canvasElement}) => {
    /*
     * Set up a canvas accessor that can fetch the input
     * by its label to test accessibility.
     */
    const canvas = within(canvasElement)
    /*
     * Now get a reference to the Reactive Form. The values
     * in our input component should match this.
     */
    const control = container.get('basic')
    /*
     * Now get the input
     */
    const input = canvas.getByLabelText('Text Field') as HTMLInputElement

    // These should match
    expect(input.value).toBe('Hello World')
    expect(control!.value).toBe('Hello World')  

    // These CSS classes should be set by Angular so we can style
    // the element according to its current state.
    expect(input.classList.contains('ng-invalid')).toBe(false)
    expect(input.classList.contains('ng-valid')).toBe(true)
    expect(input.classList.contains('ng-pristine')).toBe(true)
    expect(input.classList.contains('ng-dirty')).toBe(false)

    // And the control should be valid.
    expect(control!.valid).toBe(true)

    // Check if all the changes associated with a clear event
    // actually take effect.
    await userEvent.clear(input)
    await waitFor(() => expect(input.value).toBe(''))
    expect(control!.value).toBe('')  
    expect(input.classList.contains('ng-invalid')).toBe(false)
    expect(input.classList.contains('ng-valid')).toBe(true)
    expect(input.classList.contains('ng-pristine')).toBe(false)
    expect(input.classList.contains('ng-dirty')).toBe(true)

    // Now type in a new value and see if it updates as expected.
    await userEvent.type(input, 'Goodbye')
    await waitFor(() => expect(input.value).toBe('Goodbye'))
    expect(control!.value).toBe('Goodbye')
  }
```

In the next chapter we will expand on this by creating an error component to manage the validation error messages of this and other fields.