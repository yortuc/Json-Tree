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

const funcObj = {
  description: "Api methods",
  getSongs: function(artistId, albumId) {
    // return promise
    return fetch("api/artist/"+artistId+"/album"+albumId+"/songs");
  },
  getCover: function(albumId){
    // return promise
    return fetch("api/album/"+albumId); 
  }
};

const jsonString = `
{
  "login": "yortuc",
  "id": 1906982,
  "avatar_url": "https://avatars.githubusercontent.com/u/1906982?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/yortuc",
  "html_url": "https://github.com/yortuc",
  "followers_url": "https://api.github.com/users/yortuc/followers",
  "following_url": "https://api.github.com/users/yortuc/following{/other_user}",
  "gists_url": "https://api.github.com/users/yortuc/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/yortuc/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/yortuc/subscriptions",
  "organizations_url": "https://api.github.com/users/yortuc/orgs",
  "repos_url": "https://api.github.com/users/yortuc/repos",
  "events_url": "https://api.github.com/users/yortuc/events{/privacy}",
  "received_events_url": "https://api.github.com/users/yortuc/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Evren Yortuçboylu",
  "company": null,
  "blog": "http://yortuc.com",
  "location": "Türkiye",
  "email": "yortucboylu@gmail.com",
  "hireable": null,
  "bio": null,
  "public_repos": 24,
  "public_gists": 7,
  "followers": 12,
  "following": 59,
  "created_at": "2012-06-29T18:32:09Z",
  "updated_at": "2016-11-15T12:53:24Z"
}`;

class App extends Component {
  render() {
    return (
      <div className="App"> 
        <JsonTree data={json} title={"Basic usage with no configuration"}/>
        <hr />

        <JsonTree data={jsonString} title={"JSON string render"} />
        <hr />

        <JsonTree data={photoAlbum} rules={photoRules} title={"Custom value renderer (render image links in urls)"} />
        <hr />
        
        <JsonTree data={funcObj} title={"Func Support"} />
        <hr />
        
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);