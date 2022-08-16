import { Directive, HostBinding, Input } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

@Directive({
  selector: '[appHighlightableItem]'
})
export class HighlightableItemDirective<T> implements Highlightable {

  private isActive = false;

  /**
   * Item highlight row.
   */
  @Input()
  public item: T;

  /**
   * Adds selectable class(styles).
   */
  @HostBinding('class.selectable')
  public selectable = true;

  /**
   * Is active row.
   */
  @HostBinding('class.selected')
  public get isActiveItem(): boolean {
    return this.isActive;
  }

  /**
   * Set active styles.
   */
  public setActiveStyles(): void {
    this.isActive = true;
  }

  /**
   * Set inactive styles.
   */
  public setInactiveStyles(): void {
    this.isActive = false;
  }

}
