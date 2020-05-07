import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable } from 'rxjs';
import {Location} from '../../generated/models/location';
import {LocationProviderService} from '../../core/services/location-provider.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl();
  locations$: Observable<Location[]>;
  @Output() expand = new EventEmitter<boolean>();

  constructor(
    private locationsService: LocationProviderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
    ) {
    }

  ngOnInit(): void {
    this.locations$ = this.locationsService.fetchLocations();

    if (this.activatedRoute.snapshot.queryParamMap.has('searchTerm')) {
      this.searchControl.setValue(this.activatedRoute.snapshot.queryParamMap.get('searchTerm'));
      this.triggerSearch();
    }

    this.searchService.getResetSearch().subscribe(shouldReset => {
      if (shouldReset) {
        this.searchControl.setValue(null);
        this.router.navigate([], {
          queryParams: {
            searchTerm: null
          }
        });
      }
    });
  }

  triggerSearch(): void {
    this.expand.emit(true);
    this.router.navigate([], {
      queryParams: {
        searchTerm: this.searchControl.value || null
      }
    });
    if (this.searchControl.value) {
      this.searchService.triggerSearch(this.searchControl.value);
    }
  }
}
