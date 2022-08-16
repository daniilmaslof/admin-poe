import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationMessagesComponent {

  /**
   * Form with control which name  equal control name.
   */
  @Input()
  public form: FormGroup;

  /**
   * Control which errors are displayed.
   */
  @Input()
  public control: AbstractControl;

  /**
   * Control which errors are displayed.
   */
  public isInvalidControl$: Observable<boolean>;

  /**
   * @inheritDoc
   */
  // tslint:disable-next-line:use-lifecycle-interface
  public ngOnInit(): void {
    if (this.control) {
      this.isInvalidControl$ = this.control.statusChanges.pipe(
        startWith(this.control.status),
        map(status => status === 'INVALID'),
      );
    } else {
      throw new Error('No provide control');
    }
  }

}
