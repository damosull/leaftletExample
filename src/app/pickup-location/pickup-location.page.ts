import { Component } from '@angular/core';

import { Router, NavigationExtras } from "@angular/router";

import { Map, tileLayer, marker } from 'leaflet';

import { NativeGeocoder, NativeGeocoderOptions } from "@ionic-native/native-geocoder/ngx";


@Component({
  selector: 'app-pickup-location',
  templateUrl: './pickup-location.page.html',
  styleUrls: ['./pickup-location.page.scss'],
})
export class PickupLocationPage {

  map: Map;
  newMarker: any;
  address: string[];

  constructor(private geocoder: NativeGeocoder, private router: Router) { }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map("mapId").setView([17.3850, 78.4867], 13);
    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map Data <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup("You are located here!").openPopup();
      this.getAddress(e.latitude, e.longitude); // This line is added

      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);// This line is added

      });
    });
  }

  //The function below is added
  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
      this.address = Object.values(results[0]).reverse();

    });
  }
  // The function below is added
  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["home"], navigationextras);
  }
  goBack() {
    this.router.navigate(["home"]);
  }
}