import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToString'
})
export class ArrayToStringPipe implements PipeTransform {

  transform(value: [], ...args: unknown[]): unknown {
    return (value)?value.join(', '):'';
  }

}
