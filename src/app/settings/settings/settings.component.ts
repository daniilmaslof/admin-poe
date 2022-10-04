import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  public loading$ = new BehaviorSubject(true);
  public form = this.formBuilder.group({
    greetingText: '',
    sosMessage: '',
    unloginTimeInSeconds: '',
    idleTimeInSeconds: '',
    dataUpdateTimeInSeconds: '',
    showQuickSearch: '',
  });

  public monitoring$ = this.settingsService.getMonitoring();
  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
  ) {
  }

  ngOnInit(): void {
    this.settingsService.getSettings().pipe(
      tap(() => this.loading$.next(false))
    ).subscribe(settings => this.form.setValue({
      greetingText: settings.greetingText,
      sosMessage: settings.sosMessage,
      unloginTimeInSeconds: settings.unloginTimeInSeconds,
      dataUpdateTimeInSeconds: settings.dataUpdateTimeInSeconds,
      showQuickSearch: settings.showQuickSearch,
      idleTimeInSeconds: settings.idleTimeInSeconds,
    }))
  }


  public submit() {
    if(!this.loading$.value) {
      this.loading$.next(true);
      this.settingsService.updateSettings(this.form.value).subscribe(
        () => this.loading$.next(false)
      )
    }
  }

}
