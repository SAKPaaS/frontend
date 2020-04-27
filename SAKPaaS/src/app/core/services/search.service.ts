import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { LocationsService } from 'src/app/generated/services';
import { SnackBarService } from './snack-bar.service';
import { SnackBarTypes } from '../models/snack-bar.interface';
import { catchError, switchMap, filter, tap, map } from 'rxjs/operators';
import { Location } from 'src/app/generated/models';
import { IsLoadingService } from '@service-work/is-loading';
import { PositionCoordinates } from 'src/app/core/models/position-coordinates.model';
import { MapService } from 'src/app/core/services/map.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private isInSearch$ = new BehaviorSubject<boolean>(false);
  private searchResult$: Observable<Location[]>;
  private searchTerm$ = new BehaviorSubject<string>(null);

  constructor(
    private locationApiService: LocationsService,
    private snackBarService: SnackBarService,
    private isLoadingService: IsLoadingService,
    private mapService: MapService
  ) {
    this.searchResult$ = this.searchTerm$.pipe(
      filter(searchTerm => !!searchTerm),
      tap(_ => this.isLoadingService.add({ key: 'searchLocations' })),
      switchMap(query => {
        return this.locationApiService.locationsSearchQueryGet({query}).pipe(
          catchError(error => {
            this.isLoadingService.remove({ key: 'searchLocations' });
            if (error.status === 404) {
              this.snackBarService.sendNotification({
                messageKey: 'snack-bar.search.not-found',
                type: SnackBarTypes.INFO
              });
            } else {
              this.snackBarService.sendNotification({
                messageKey: 'snack-bar.search.error',
                type: SnackBarTypes.ERROR
              });
            }
            return EMPTY;
          }));
        }
      ),
      tap(_ => {
        this.isLoadingService.remove({ key: 'searchLocations' });
      }),
      tap(locationSearchResult => {
        if (locationSearchResult.locations && locationSearchResult.locations.length) {
          const coords = new PositionCoordinates(
            locationSearchResult.coordinates.longitude,
            locationSearchResult.coordinates.latitude);
          this.mapService.setMapCenter(coords);
        }
      }),
      map(locationSearchResult => locationSearchResult.locations)
    );
  }

  public getLocations(): Observable<Location[]> {
    return this.searchResult$;
  }

  public getIsInSearch(): boolean {
    return this.isInSearch$.value;
  }
  public setIsInSearch(newValue: boolean): void {
    this.isInSearch$.next(newValue);
  }

  public triggerSearch(query: string): void {
    this.searchTerm$.next(query);
  }

}
