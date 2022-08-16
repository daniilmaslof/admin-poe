import { Pipe, PipeTransform } from '@angular/core';

const FILE_SIZE_UNITS = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
const FILE_SIZE_UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Pettabytes', 'Exabytes', 'Zettabytes', 'Yottabytes'];

/**
 * Transform file size to standard record.
 */
@Pipe({
  name: 'appFormatFileSize',
})
export class FormatFileSizePipe implements PipeTransform {

  /**
   * Transform bytes to short record.
   */
  public transform(sizeInBytes: number, longForm: boolean = false): string {
    const units = longForm
      ? FILE_SIZE_UNITS_LONG
      : FILE_SIZE_UNITS;

    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size = sizeInBytes / Math.pow(1024, power);
    const formattedSize = Math.round(size * 100) / 100;
    const unit = units[power];

    return `${formattedSize} ${unit}`;
  }

}
