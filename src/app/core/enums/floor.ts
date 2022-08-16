export enum Floor {
  First = 0,
  Second,
  Third,
  Fourth,
  Fifth,
  Sixth,
  Seventh,
  Eighth,
  Ninth,
  All,
}

/**
 * FloorModel
 */
export namespace Floor {

  /**
   * List of modifier types.
   */
  export const all: readonly Floor[] = [
    Floor.First,
    Floor.Second,
    Floor.Third,
    Floor.Fourth,
    Floor.Fifth,
    Floor.Sixth,
    Floor.Seventh,
    Floor.Eighth,
    Floor.Ninth,
    Floor.All,
  ];
  const readableFloor: Record<Floor, string> = {
    [Floor.First]: 'G',
    [Floor.Second]: '1',
    [Floor.Third]: '2',
    [Floor.Fourth]: '3',
    [Floor.Fifth]: '4',
    [Floor.Sixth]: '5',
    [Floor.Seventh]: '6',
    [Floor.Eighth]: '7',
    [Floor.Ninth]: '8',
    [Floor.All]: 'All',
  };

  const fullReadableFloor: Record<Floor, string> = {
    [Floor.First]: 'Ground floor',
    [Floor.Second]: '1th floor',
    [Floor.Third]: '2th floor',
    [Floor.Fourth]: '3th floor',
    [Floor.Fifth]: '4th floor',
    [Floor.Sixth]: '5th floor',
    [Floor.Seventh]: '6th floor',
    [Floor.Eighth]: '7th floor',
    [Floor.All]: 'All',
    [Floor.Ninth]: '8th floor',
  };
  /**
   * Get user-friendly representation of a content type.
   * @param value The content type.
   */
  // tslint:disable-next-line: completed-docs - for some reason tslint does not detect comment above
  export function toReadable(value: Floor): string {
    return readableFloor[value];
  }
  export function toFullReadable(value: Floor): string {
    return fullReadableFloor[value];
  }

}
