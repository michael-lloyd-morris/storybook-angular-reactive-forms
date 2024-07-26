import { Component, forwardRef, Input } from '@angular/core';
import { AbstractField } from './abstract.field.component';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

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
export class InputFieldComponent extends AbstractField {
  /**
   * Placeholder that goes in the text field until populated.
   */
  @Input() placeholder:string
  /**
   * Field Type.
   */
  @Input() type:string = "text"
}
