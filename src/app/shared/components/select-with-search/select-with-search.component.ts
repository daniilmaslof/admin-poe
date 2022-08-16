import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  forwardRef,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { listenControlChanges } from '../../../core/helpers/listen-control-changes';


/**
 * Select with search.
 */
@Component({
  selector: 'app-select-with-search',
  templateUrl: './select-with-search.component.html',
  styleUrls: ['./select-with-search.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectWithSearchComponent),
      multi: true,
    },
  ],
})
export class SelectWithSearchComponent extends DestroyableBase implements OnInit, OnChanges, ControlValueAccessor {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  /**
   * Enable / Disable Form Fields
   */
  @Input() set disable(condition: boolean) {
    if (condition) {
      this.selectFormControl.disable();
    } else {
      this.selectFormControl.enable();
    }
  }

  /**
   * Allows the the component to be required by parent
   */
  @Input() set required(condition: boolean) {
    if (condition) {
      this.selectFormControl.setValidators([Validators.required]);
    } else {
      this.selectFormControl.setValidators([]);
    }
  }

  /**
   * Touched edit sub modifiers control.
   */
  @Input()
  public set showAllErrors(value: boolean) {
    if (value) {
      this.selectFormControl.markAllAsTouched();
      this.selectFormControl.updateValueAndValidity();
    }
  }

  /**
   * All option.
   */
  public allOption$ = new ReplaySubject<any[]>(1);

  /**
   * Filtered options by option name term.
   */
  public filteredOptions$: Observable<any[]>;

  /**
   * Option template.
   */
  @ContentChild('optionTemplate', { static: false })
  public optionTemplateRef: TemplateRef<any>;

  /**
   * Search control.
   */
  public searchControl = new FormControl('');

  /**
   * Select form control.
   */
  public selectFormControl = new FormControl('');

  /**
   * All options.
   */
  @Input()
  public options: any[];

  /**
   * Placeholder.
   */
  @Input()
  public placeholder: string;
  /**
   * Function to compare values in selections.CompareWith in mat-select.
   */
  @Input()
  public compareOption: (o1: any, o2: any) => boolean = (optionFirst: any, optionSecond: any) => optionFirst === optionSecond

  /**
   * Function to compare option and search term.
   */
  @Input()
  public compareOptionWithSearchTerm: (o: any, term: string) => boolean = (option: any, term: string) => option.toString().includes(term)

  private createFilteredOptionStream(): Observable<any[]> {
    return combineLatest([this.allOption$, listenControlChanges<string>(this.searchControl)]).pipe(
      map(([allOptions, searchTerm]) => allOptions.filter(option => this.compareOptionWithSearchTerm(option, searchTerm))),
    );
  }

  /**
   * Register on change.Return value in HH:mm format.
   */
  public registerOnChange(onChange: (value: any) => void): void {
    this.selectFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => onChange(value));
  }

  /**
   * Register on touched.
   */
  public registerOnTouched(fn: () => {}): void {
  }

  /**
   * @inheritDoc
   */
  public writeValue(value: any): void {
    this.selectFormControl.setValue(value, {emitEvent: false});
    this.changeDetectorRef.markForCheck();


  }

  /**
   *  @inheritDoc
   */
  public ngOnInit(): void {
    this.filteredOptions$ = this.createFilteredOptionStream();
  }

  /**
   * @inheritDoc
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes && changes.options.currentValue) {
      this.allOption$.next(this.options);
    }
  }
}
