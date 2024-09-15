import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  latitude!: number;
  longitude!: number;

  constructor() {}

  public async ngOnInit() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      // this.longitude = 106.8271528;
      // this.latitude = -6.1753924;

      const map = new Map({
        // basemap: "topo-vector"
        basemap: "satellite"
      });

      const view = new MapView({
        container: "container",
        map: map,
        zoom: 15,
        center: [this.longitude, this.latitude]
      });

      // Membuat geometri point untuk marker
      const point = new Point({
        longitude: this.longitude,
        latitude: this.latitude
      });

      // Membuat simple simbol marker
      const markerSymbol = new SimpleMarkerSymbol({
        color: "red",  // Warna marker
        size: "12px",  // Ukuran marker
        outline: {
          color: "white", // Outline marker
          width: 2
        }
      });

      // // Membuat simbol pin sebagai marker
      // const markerSymbol = new PictureMarkerSymbol({
      //   url: "https://cdn-icons-png.flaticon.com/512/1942/1942554.png",
      //   width: "50px",
      //   height: "50px"
      // });

      const marker = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      view.graphics.add(marker);

    } catch (error) {
      console.error("Error obtaining location", error);
    }
  }
}
