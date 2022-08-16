import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProgress]'
})
export class ProgressDirective implements OnInit {

  private inProgressValue = false;

  /**
   * Indicates if component is currently in "busy" state.
   */
  public get inProgress(): boolean {
    return this.inProgressValue;
  }

  // tslint:disable-next-line:no-input-rename
  @Input('appProgress')
  public set inProgress(value: boolean) {
    this.inProgressValue = value;
    this.updateDisabledState();
  }

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('class.is-in-progress')
  public get addInProgressClass(): boolean {
    return this.inProgress;
  }

  /** The original 'disabled' state of the control. */
  private outerDisabled: boolean;

  /**
   * Indicates if current element is disabled.
   */
  @Input('disabled')
  public set disabled(value: any) {
    this.outerDisabled = !!value;
    this.updateDisabledState();
  }

  private updateDisabledState(): void {
    const disabled = this.inProgress || this.outerDisabled;
    if (disabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  /** @inheritdoc */
  public ngOnInit(): void {
    const loaderOverlay = this.renderer.createElement('div') as HTMLDivElement;
    const spinner =  this.renderer.createElement('span');

    this.renderer.addClass(loaderOverlay, 'in-progress-overlay');
    this.renderer.addClass(spinner, 'in-progress-spinner');
    this.renderer.addClass(spinner, 'spinner-border');
    this.renderer.setAttribute(spinner, 'aria-label', 'Working...');
    this.renderer.appendChild(this.el.nativeElement, loaderOverlay);
    this.renderer.appendChild(loaderOverlay, spinner);
  }
}
