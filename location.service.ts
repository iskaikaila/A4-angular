import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations: string[] = ['Location 1', 'Location 2'];

  getLocations(): string[] {
    return this.locations;
  }

  addLocation(newLocation: string): void {
    if (newLocation && !this.locations.includes(newLocation)) {
      this.locations.push(newLocation);
    }
  }
}
