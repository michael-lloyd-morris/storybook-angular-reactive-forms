import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { InputFieldComponent } from './input.component';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Injectable } from '@angular/core';

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

const meta:Meta<InputFieldComponent> = {
  title: 'Example/Input',
  component: InputFieldComponent,
  tags: ['autodocs'],
  args: {},

  decorators: [
    moduleMetadata({
      providers: [{
        provide: ControlContainer,
        useClass: MockContainer
      }] 
    }),
  ]
}

export default meta

type Story = StoryObj<InputFieldComponent>

export const Basic: Story = {
  args: {
    id: 'basic-field',
    label: 'Text Field',
    formControlName: 'basic'
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const control = container.get('basic')
    const input = canvas.getByLabelText('Text Field') as HTMLInputElement

    // Initial State
    expect(input.value).toBe('Hello World')
    expect(control!.value).toBe('Hello World')  
    expect(input.classList.contains('ng-invalid')).toBe(false)
    expect(input.classList.contains('ng-valid')).toBe(true)
    expect(input.classList.contains('ng-pristine')).toBe(true)
    expect(input.classList.contains('ng-dirty')).toBe(false)
    expect(control!.valid).toBe(true)

    // Clear value works
    await userEvent.clear(input)
    await waitFor(() => expect(input.value).toBe(''))
    expect(control!.value).toBe('')  
    expect(input.classList.contains('ng-invalid')).toBe(false)
    expect(input.classList.contains('ng-valid')).toBe(true)
    expect(input.classList.contains('ng-pristine')).toBe(false)
    expect(input.classList.contains('ng-dirty')).toBe(true)

    // Update value works
    await userEvent.type(input, 'Goodbye')
    await waitFor(() => expect(input.value).toBe('Goodbye'))
    expect(control!.value).toBe('Goodbye')

  }
}

