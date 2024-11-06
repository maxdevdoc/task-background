import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-test-checkbox',
  standalone: true,
  templateUrl: './test-checkbox.component.html',
  styleUrls: ['./test-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestCheckboxComponent),
      multi: true
    }
  ]
})
export class TestCheckboxComponent implements ControlValueAccessor {
  @Input() field: any;
  value: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onCheckboxChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.checked;
    this.onChange(this.value);
  }
}
