import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  map: Map | any;

  constructor() { }

  async ngOnInit() {
    this.map = new Map({
      basemap: 'topo-vector'
    });

    this.mapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 8,
    });

    const weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    this.map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);

    this.addMarkers();
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    const latLng = await this.getLocationService();
    const geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: 'red',
          size: 10,
          outline: {
            color: 'black',
            width: 1,
          },
        }),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addMarkers() {
    const locations = [
      { latitude: 53.311899, longitude:  -126.121395 },
      { latitude: 41.811157, longitude: -90.094569 },
      { latitude: 57.349506, longitude: -156.707690 },
    ];

    locations.forEach((loc) => {
      const markerGraphic = new Graphic({
        geometry: new Point({
          latitude: loc.latitude,
          longitude: loc.longitude,
        }),
        symbol: new PictureMarkerSymbol({
          url: "https://cdn-icons-png.flaticon.com/512/1942/1942554.png",
          width: "30px",
          height: "30px"
        }),
      });
      this.mapView.graphics.add(markerGraphic);
    });
  }

  // Method to handle basemap change
  changeBasemap(event: any) {
    const selectedBasemap = event.target.value;
    this.map.basemap = selectedBasemap;
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

// latitude!: number;
// longitude!: number;

// constructor() {}

//   public async ngOnInit() {
//     try {
//       // const position = await Geolocation.getCurrentPosition({
//       //   enableHighAccuracy: true
//       // });
//       // this.latitude = position.coords.latitude;
//       // this.longitude = position.coords.longitude;

//       this.longitude = 106.8271528;
//       this.latitude = -6.1753924;

//       const map = new Map({
//         // basemap: "topo-vector"
//         // basemap: "satellite"
//         basemap: "osm"
//       });

//       const view = new MapView({
//         container: "container",
//         map: map,
//         zoom: 15,
//         center: [this.longitude, this.latitude]
//       });

//       // Membuat geometri point untuk marker
//       const point = new Point({
//         longitude: this.longitude,
//         latitude: this.latitude
//       });

//       // // Membuat simple simbol marker
//       // const markerSymbol = new SimpleMarkerSymbol({
//       //   color: "red",  // Warna marker
//       //   size: "12px",  // Ukuran marker
//       //   outline: {
//       //     color: "white", // Outline marker
//       //     width: 2
//       //   }
//       // });

//       // Membuat simbol pin sebagai marker
//       const markerSymbol = new PictureMarkerSymbol({
//         url: "https://cdn-icons-png.flaticon.com/512/1942/1942554.png",
//         width: "50px",
//         height: "50px"
//       });

//       const marker = new Graphic({
//         geometry: point,
//         symbol: markerSymbol
//       });

//       view.graphics.add(marker);

//     } catch (error) {
//       console.error("Error obtaining location", error);
//     }
//   }
