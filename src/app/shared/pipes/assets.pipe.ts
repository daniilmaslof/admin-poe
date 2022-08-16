import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assets'
})
export class AssetsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return `assets/${value}.png`;
  }

}
