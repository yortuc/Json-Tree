import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import JsonTree from 'iso-json-tree';

var json = {
  isim: 'Evren',
  yas: 32, 
  dogum_tarihi: '1984-04-28',
  evli: true,
  cocuklar: [
    { isim: 'Ceren', hayali: true },
    { 
      isim: 'Haldun', 
      hayali: true, 
      yas: 3, 
      oyuncaklar: ["topaç", "bilye", {isim: "uçak"}] 
    }
  ],
  adres: 'Efeler/Aydın',
  web: 'http://yortuc.com'
}; 

var photoAlbum = {
  album_adi: "Davutlar tatili",
  tarih: "2011-07-23",
  images: [
    "http://4.bp.blogspot.com/-iGaS62JllxM/Tpb19oQYv4I/AAAAAAAAA8s/b_4pGv6ly4A/s1600/davutlar1%25281%2529.jpg",
    "http://www.oteldenal.com.tr/media/sub_domain/buyuk/spot_davutlar_08180033_ar1.jpg",
    "http://r3.emlak.net:8080/2010/07/14/535b7d36f1cb261299b822e4011e537c.jpg"
  ]
};

const photoRules = [
	(name,value)=> typeof value === "string" && (new RegExp("(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)").test(value)) ? 
					<div className="JsonTree-Node-Item">
		              <div className="JsonTree-Node-Key">{name} : </div>
		              <div className="JsonTree-Node-Value">
		              	<a href={value} target="_blank"><img src={value} style={{width: 100}} /></a>
		              </div>
		            </div> : null
];

class App extends Component {
  render() {
    return (
      <div className="App">     
      	<h3>Basic usage with no configuration </h3> 
       	<JsonTree json={json} />

        <h3>Custom value renderer (render image links in urls)</h3> 
        <JsonTree json={photoAlbum} rules={photoRules} />

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);