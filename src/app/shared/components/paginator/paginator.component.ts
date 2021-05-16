import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
/**
 * Pagination page.
 */
export class Page {

  /**
   * Index.
   */
  public index: number;

  /**
   * Selected.
   */
  public selected: boolean;

  constructor(index: number, selected: boolean) {
    this.index = index;
    this.selected = selected;
  }
}

/**
 * Pagination metadata.
 */
export interface PaginationMetadata {

  /**
   * Page.
   */
  page: number;

  /**
   * Total pages.
   */
  totalPages: number;

  /**
   * Total count of data that API sends.
   */
  totalCount: number;

  /**
   * Page size.
   */
  pageSize: number;

  /**
   * Is first page.
   */
  isFirstPage: boolean;

  /**
   * Is last page.
   */
  isLastPage: boolean;

}

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export interface PageEvent {

  /**
   * The current page index.
   */
  pageIndex: number;

  /**
   * Index of the page that was selected previously.
   */
  previousPageIndex: number | null;

  /**
   * The current total number of items being paged.
   */
  length: number;
}


@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {
  private maxPagesCount = 10;
  private currentPageIndex: number;
  private firstPageIndex = 1;
  private lastPageIndex: number;
  private isFirstPage: boolean;
  private isLastPage: boolean;
  private itemsTotalCount: number;

  /**
   * Pages.
   */
  public readonly pages$ = new BehaviorSubject<Page[]>([]);

  /**
   * Meta data.
   */
  @Input()
  public metadata$: Observable<PaginationMetadata>;

  /**
   * Emits clicked page index.
   */
  @Output()
  public pageChange = new EventEmitter<PageEvent>();

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    if (typeof this.metadata$ === 'undefined') {
      throw new Error('Metadata is not provided');
    }
    this.listenMetadataChanging();
  }

  private listenMetadataChanging(): void {
    this.metadata$
      .pipe(
        tap((value: any) => {
          this.isFirstPage = value.isFirstPage;
          this.isLastPage = value.isLastPage;
          this.currentPageIndex = value.page;
          this.lastPageIndex = value.totalPages;
          this.itemsTotalCount = value.totalCount;
          const allPages = this.generateAllPages(value as any) as any;
          this.pages$.next(this.generatePages(allPages as any, (value as any).page as any));
        }),
      )
      .subscribe();
  }

  private generateAllPages(metadata: PaginationMetadata): Page[] {
    const pages: Page[] = [];
    for (let i = 1; i <= metadata.totalPages; i++) {
      pages.push(new Page(i, i === metadata.page));
    }
    return pages;
  }

  private generatePages(allPages: Page[], currentPageIndex: number): Page[] {
    const offset = Math.round(this.maxPagesCount / 2);
    const leftPages = this.getLeftPages(allPages, currentPageIndex, offset);
    const rightPages = this.getRightPages(allPages, currentPageIndex, offset);
    const result = [...leftPages, ...rightPages];
    return this.fillEmptySpaces(result, allPages);
  }

  private getLeftPages(allPages: Page[], index: number, offset: number): Page[] {
    const pages: Page[] = [];
    for (let i = index - 1, j = 0; j < offset; i--, j++) {
      if (!allPages[i]) {
        break;
      }
      pages.unshift(allPages[i]);
    }
    return pages;
  }

  private getRightPages(allPages: Page[], index: number, offset: number): Page[] {
    const pages: Page[] = [];
    for (let i = index, j = 0; j < offset && i < allPages.length; i++, j++) {
      if (!allPages[i]) {
        break;
      }
      pages.push(allPages[i]);
    }
    return pages;
  }

  /**
   * When `leftPages` is equal to `[1, 2, 3, 4, 5]` but `rightPages` is empty or vice versa
   * Need to fill array with pages while its length less than `maxPagesCount`.
   * @param pages Pages.
   * @param allPages All pages.
   */
  private fillEmptySpaces(pages: Page[], allPages: Page[]): Page[] {
    if (pages.length > 0) {
      if (pages[0].index === 1) {
        /* If pages is equal to [1, 2, 3, 4, 5] */
        for (let i = pages.length; i < this.maxPagesCount && i < this.lastPageIndex; i++) {
          pages.push(allPages[i]);
        }
      } else {
        /* If pages is equal to [46, 47, 48, 49, 50] (for example). */
        const firstPages = allPages.filter(item => item.index < pages[0].index);
        pages = [...firstPages.slice(0, this.maxPagesCount - pages.length), ...pages];
      }
    }
    return pages;
  }

  /**
   * Go to page.
   * @param pageIndex Page index.
   */
  public goTo(pageIndex: number): void {
    const previousPageIndex = this.currentPageIndex;
    this.currentPageIndex = pageIndex;
    this.emitPageEvent(previousPageIndex);
  }

  /**
   * Go to previous page.
   */
  public prev(): void {
    const previousPageIndex = this.currentPageIndex;
    this.currentPageIndex--;
    this.emitPageEvent(previousPageIndex);
  }

  /**
   * Go to next page.
   */
  public next(): void {
    const previousPageIndex = this.currentPageIndex;
    this.currentPageIndex++;
    this.emitPageEvent(previousPageIndex);
  }

  /**
   * Go to first page.
   */
  public first(): void {
    const previousPageIndex = this.currentPageIndex;
    this.currentPageIndex = this.firstPageIndex;
    this.emitPageEvent(previousPageIndex);
  }

  /**
   * Go to last page.
   */
  public last(): void {
    const previousPageIndex = this.currentPageIndex;
    this.currentPageIndex = this.lastPageIndex;
    this.emitPageEvent(previousPageIndex);
  }

  private emitPageEvent(previousPageIndex: number): void {
    if (previousPageIndex !== this.currentPageIndex) {
      this.pageChange.emit({
        pageIndex: this.currentPageIndex,
        previousPageIndex,
        length: this.itemsTotalCount,
      });
    }
  }

  /**
   * Next page disabled.
   */
  public get nextPageDisabled(): boolean {
    return this.isLastPage || this.currentPageIndex === this.lastPageIndex;
  }

  /**
   * First page disabled.
   */
  public get prevPageDisabled(): boolean {
    return this.isFirstPage || this.currentPageIndex === this.firstPageIndex;
  }

}
