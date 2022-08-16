import { PaginationParams } from '../../../../core/models/pagination-params';
import { Floor } from '../../../../core/enums/floor';
import { LocationFilter } from './location-filter';
import { Area } from '../../../../core/models/area';

export interface LocationSearch extends PaginationParams {
  /**
   * Name of location.
   */
  name?: string | null;

  categories?: string[];
  aries?: string[];
  floor?: Floor;
  locationFilter: LocationFilter;
}
