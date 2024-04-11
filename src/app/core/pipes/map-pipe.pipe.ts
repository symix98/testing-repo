import { Pipe, PipeTransform } from '@angular/core';
import { ListViewPipesTypes } from '../models/listview.model';

@Pipe({
  name: 'mapPipe'
})
export class MapPipePipe implements PipeTransform {

  transform(referenceMap: any[], mapFilter: any, mapToKey, mappedValueToShow, item): string {
    return this.testFunction(referenceMap, mapFilter, mapToKey, mappedValueToShow, item);
  }
  testFunction(referenceMap: any[], mapFilter: any, mapToKey, mappedValueToShow, item): string {
      const findMapped = referenceMap.findIndex(x => x[mapFilter] === item[mapToKey]);
      if(findMapped!==-1){
        return referenceMap[findMapped][mappedValueToShow];
      }
      else{
        return '';
      }
  }

}
