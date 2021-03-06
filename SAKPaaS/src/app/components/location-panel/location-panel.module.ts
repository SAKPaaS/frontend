import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationPanelComponent } from 'src/app/components/location-panel/location-panel.component';
import { LocationListModule } from 'src/app/components/location-list/location-list.module';
import { SearchBarModule } from 'src/app/components/search-bar/search-bar.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    LocationPanelComponent
  ],
  imports: [
    SharedModule,
    LocationListModule,
    SearchBarModule,
    MatIconModule
  ],
  exports: [
    LocationPanelComponent
  ]
})
export class LocationPanelModule { }
