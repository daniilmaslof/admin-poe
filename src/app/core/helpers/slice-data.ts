import { PaginationParams } from '../models/pagination-params';

/**
 * Slice the data according to page info.
 * @param sourceData Source data.
 * @param page Page information.
 */
export function sliceData<T>(sourceData: T[], page: PaginationParams): T[] {
  let offset = (page.page - 1) * page.pageSize;
  if (offset > sourceData.length) {
    offset = sourceData.length - page.pageSize;
    page.page = Math.round(sourceData.length / page.pageSize) - 1;
  }

  return sourceData.slice(offset, offset + page.pageSize);
}
