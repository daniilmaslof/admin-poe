import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * All the names of the icons.
 */
const ICONS_NAME = [
  'eye',
  'create',
  'delete',
  'plus',
  'close-eye',
  'activate',
  'add'
];

/**
 * The path to the icons.
 */
const PATH = 'assets/icons';

/**
 * Registers additional application icons.
 */
@Injectable({
  providedIn: 'root',
})
export class IconsService {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
  }

  /**
   * Register all icons.
   */
  public registerMaterialIcons(): void {
    for (const iconName of ICONS_NAME) {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(`${PATH}/${iconName}.svg`);
      this.iconRegistry.addSvgIcon(iconName, url);
    }
  }

}
