import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const mymap = L.map('map').setView([48.366512, 10.894446], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: `Map data &copy; 
    <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
    contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZm1pZiIsImEiOiJja3VtcGZlbHowbGxrMnV0aDVxMnBrbHhpIn0.ZhhmintQRBce86zTtoPFdQ'
}).addTo(mymap);
  }

}
