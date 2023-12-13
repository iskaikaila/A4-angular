import { Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() reports: any[] = [];
  private map!: L.Map;

  ngOnInit() {
    this.initMap();
    this.putLabels()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('MapComponent: ngOnChanges', changes);
    if (changes['reports'] && this.map) {
      this.addMarkers(); // 确保地图已初始化
    }
  }

  private initMap(): void {
    // 设置 Marker 的默认图标和阴影
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map').setView([39.9042,126.9780], 5); // 设置初始中心点和缩放级别
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    console.log('MapComponent: addMarkers', this.reports);
  if (!this.map) return; // 检查地图是否已初始化

    

    // 清除之前的标记
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });


        // 对报告按位置分组
  const reportsByLocation = new Map();
  this.reports.forEach(report => {
    const latitude = parseFloat(report.latitude);
    const longitude = parseFloat(report.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      const locationKey = `${latitude},${longitude}`;
      if (!reportsByLocation.has(locationKey)) {
        reportsByLocation.set(locationKey, { count: 0, locationName: report.location });
      }
      reportsByLocation.get(locationKey).count++;
    } else {
      console.error(`Invalid LatLng object for report: `, report);
    }
  });

    
  // 为每个聚合的位置添加标记
  reportsByLocation.forEach((data, key) => {
    const [latitude, longitude] = key.split(',').map(Number);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(`Location: ${data.locationName}<br>Reports: ${data.count}`);
    } else {
      console.error(`Invalid LatLng object: (${latitude}, ${longitude})`);
    }
  });
    
  }

  putLabels() {
      L.marker([49.2276, -123.0076]).addTo(this.map)
    		.bindPopup("<b>Metortown</b><br />2 nuisance reports")
      L.marker([49.300054, -123.148155]).addTo(this.map)
      	.bindPopup("<b>Stanley Park</b><br />5 nuisance reports")
      L.marker([49.2781, -122.9199]).addTo(this.map)
      	.bindPopup("<b>SFU Burnaby</b><br />2 nuisance reports")
  
    }
  
}
