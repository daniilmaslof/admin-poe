import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Page info.
 */
export class PageInfo {
  /**
   * Title to display.
   */
  public title: string;

  /**
   * Route to go.
   */
  public url: string;

  /**
   * Url to icon.
   */
  public icon?: string;

  public constructor(data: Partial<PageInfo>) {
    this.title = data.title;
    this.url = data.url;
    this.icon = data.icon;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /**
   * List of navigation links for main screen.
   */
  public mainScreenNavLinks = [
    new PageInfo({
      title: 'POI and Location',
      url: 'locations',
    }),
    new PageInfo({
      title: 'Floor',
      url: 'floors',
    }),
    new PageInfo({
      title: 'Area',
      url: 'area',
    }),
    new PageInfo({
      title: 'Department',
      url: 'departments',
    }),
    new PageInfo({
      title: 'Category',
      url: 'category',
    }),
    new PageInfo({
      title: 'Settings',
      url: 'settings',
    }),
  ];

}
