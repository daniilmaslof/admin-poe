/**
 * LocationFilter
 */
export enum LocationFilter {
  /** InProgress */
  POI = 'POI',

  /** Published */
  Loc = 'Loc',

  /** Valid */
  All = 'All',
}

/** Add some methods to enum */
export namespace LocationFilter {
  const TO_TITLE_MAP: Record<LocationFilter, string> = {
    [LocationFilter.POI]: 'POI',
    [LocationFilter.Loc]: 'Loc',
    [LocationFilter.All]: 'All',
  };

  /**
   * Convert a certain work status value to readable title.
   */
  // tslint:disable-next-line: completed-docs
  export function getCollection(): Map<LocationFilter, string> {
    const ret = new Map<LocationFilter, string>();
    ret.set(LocationFilter.POI, 'POI');
    ret.set(LocationFilter.Loc, 'Loc');
    ret.set(LocationFilter.All, 'All');
    return ret;
  }

  /**
   * Convert a certain work status value to readable title.
   * @param value work status value
   */
  // tslint:disable-next-line: completed-docs
  export function toReadable(value: LocationFilter): string {
    if (value in TO_TITLE_MAP) {
      return TO_TITLE_MAP[value];
    }
    return value + ' (No readable option)';
  }
}
