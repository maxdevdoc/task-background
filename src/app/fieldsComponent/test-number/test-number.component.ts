import { Component, Input, forwardRef } from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-test-number',
  standalone: true,
  templateUrl: './test-number.component.html',
  styleUrls: ['./test-number.component.css'],
  imports: [
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestNumberComponent),
      multi: true
    }
  ]
})
export class TestNumberComponent implements ControlValueAccessor {
  @Input() field: any;
  @Input() control!: FormControl | null;
  value: number | null = null;

  onChange: any = () => {};
  // onTouched: any = () => {};

  writeValue(value: number): void {
    this.value = value || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onTouched() {
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.valueAsNumber;
    this.onChange(this.value);
  }
}
