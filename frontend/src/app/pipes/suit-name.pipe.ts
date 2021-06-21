import { Pipe, PipeTransform } from '@angular/core';
import {WelcomeToSuit} from '../../../../common/cards';

@Pipe({
  name: 'suitName'
})
export class SuitNamePipe implements PipeTransform {
  public static readonly SUIT_NAMES: Record<WelcomeToSuit, string> = {
    pool: 'Pool Manufacturer',
    fence: 'Surveyor (fence)',
    bis: 'Bis',
    temp: 'Temp Agency',
    'real-estate': 'Real Estate Agent',
    landscape: 'Landscaper',
  };

  public transform(value: WelcomeToSuit) {
    return SuitNamePipe.SUIT_NAMES[value];
  }
}
