import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from 'src/app/generated/models';
import { Observable, Subscription } from 'rxjs';
import { LocationProviderService } from 'src/app/core/services/location-provider.service';
import { SearchService } from 'src/app/core/services/search.service';
import { ListType } from '../../core/models/location-card.interface';
import { LocationCardService } from '../../core/services/location-card.service';

@Component({
  selector: 'app-location-panel',
  templateUrl: './location-panel.component.html',
  styleUrls: ['./location-panel.component.scss']
})
export class LocationPanelComponent implements OnInit, OnDestroy {

  hideSearchResults = true;
  locations$: Observable<Location[]>;
  favoriteType = ListType.FAVORITES;
  searchType = ListType.SEARCH;
  nearByType = ListType.NEAR_BY;
  blur: boolean;
  subscriptions = new Subscription();

  minimized = false;
  @Output() minimizedForParent = new EventEmitter<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private locationService: LocationProviderService,
    private searchService: SearchService,
    private locationCardService: LocationCardService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      console.log('queryParams updated', queryParams);
      this.hideSearchResults = !queryParams.has('searchTerm');
    });

    this.locations$ = this.locationService.fetchLocations();

    this.subscriptions.add(
      this.locationCardService.getSelectedLocationCard().subscribe(
        locationCard => {
          this.blur = locationCard !== null;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  minimize() {
    if (this.minimized) {
      this.minimized = !this.minimized;
      window.setTimeout(() => {
        this.minimizedForParent.emit(this.minimized);
      }, 150);
    } else {
      this.minimizedForParent.emit(!this.minimized);
      window.setTimeout(() => {
        this.minimized = !this.minimized;
      }, 150);
    }
  }
}
