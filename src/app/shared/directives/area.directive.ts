import { ChangeDetectorRef, Directive, HostBinding, Input, OnInit } from '@angular/core';
import { AreasService } from '../../core/services/areas.service';
import { DestroyableBase } from '../../core/helpers/destroyble';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appArea]'
})
export class AreaDirective extends DestroyableBase implements OnInit {

  @Input()
  public appArea: number;

  public disabled = false;

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('class.disabled-area')
  public get addDisabledClass(): boolean {
    return this.disabled;
  }

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('style.opacity')
  public get opacity(): string {
    return '0.3'
  }

  constructor(
    private readonly areasService: AreasService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.areasService.areas$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(areas => {
      const c = areas.find(area => area.id == this.appArea);
      console.log(c);
      if (c) {
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        this.disabled = !c.visible;
        console.log(this.disabled);
      }
    });
  }
}
