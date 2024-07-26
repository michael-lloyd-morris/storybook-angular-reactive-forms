import { Directive, EventEmitter, Input, OnInit, Optional, Output } from "@angular/core"
import { ControlContainer, FormControl, Validators } from "@angular/forms"

@Directive()
export abstract class AbstractField implements OnInit {
  #value:any

  /**
   * Name of the control.
   */
  @Input() formControlName:string
  /**
   * Component Id.
   */
  @Input({required:true}) id:string
  /**
   * The displayed label of the field.
   */
  @Input() label:string  
  /**
   * The Read Only Property of the field
   */
  @Input() readOnly:boolean = false

  protected control: FormControl
  public required:boolean = false
  public valid:boolean = true
  public errors:string[] = []
  public onChange:Function = () => {}
  public onTouch:Function = () => {}

  constructor(private controlContainer: ControlContainer) {}

  set value(value:any) {
    this.#value = value
    this.onChange(value)
    this.onTouch(value)
  }

  get value() { 
    return this.#value 
  }

  ngOnInit(): void {    

    this.control = this.controlContainer.control?.get(this.formControlName) as FormControl
    this.control.valueChanges.subscribe(() => {
      this.valid = !(this.control.invalid && this.control.dirty)
    })

    this.required = this.control.hasValidator(Validators.required)
  }

  writeValue(value:any) {
    this.value = value
  }

  registerOnChange(fn:Function) {
    this.onChange = fn
  }

  registerOnTouched(fn:Function) {
    this.onTouch = fn
  }
}