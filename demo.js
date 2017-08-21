/*!
 * Copyright (c) 2017 kt corp. All rights reserved.
 * 
   This is a proprietary software of kt corp, and you may not use this software* 
 * except in compliance with license agreement with kt corp. Any redistribution
 * or use of this software, with or without modification shall be strictly
 * prohibited without prior written approval of kt corp, and the copyright
 * notice above does not evidence any actual or intended publication of such
 * software.
 */

/**
 * 사용예) http://host/demo.html?lat=37&lng=127
 */

var parameters = location.search.substring(1).split("&");
var args = {};

for (var i = 0; i < parameters.length; i++){
    var temp = parameters[i].split("=");
    args[temp[0]] = temp[1];
}

// 없을 경우 기본 값을 설정
if (typeof args['lat'] === 'undefined') args['lat'] = '37.4713571';
if (typeof args['lng'] === 'undefined' ) args['lng']='127.0271621';

var latlng = new olleh.maps.LatLng(Number(args['lat']), Number(args['lng']));
var state = 'fetching';

function getAreaName(marker) {
    var tmp = olleh.maps.LatLng.valueOf(marker.getPosition());
    var pos = {lat:tmp.y, lng:tmp.x};

    let init = { method: 'GET'
                    , mode: 'cors'
                    , headers: { 'Content-Type': 'application/json'
                                , 'charset':'UTF-8'
                                , Authorization:'Bearer 5315ab36a0600563910cf47f62919d8b7a2a864551b46fe658c8f41dcce81fa081b32887' 
                    } 
                };
    let request = new Request(`https://gis.kt.com/search/v1.0/utilities/geocode?point.lat=${pos.lat}&point.lng=${pos.lng}`, init);
    fetch(request).then((res) => {
        if (res.ok)
            return res.json();
        else 
            throw new Error('Error returned');
    }).then((res)=>{
        var add = res.residentialAddress[0].parcelAddress[0];
        marker.fireEvent('updatecap', `${add.siDo} ${add.siGunGu} ${add.eupMyeonDong} (${pos.lat}, ${pos.lng})`)
    }).catch((err)=>{
        console.log(err)
    });
}

function onLoad(){
    /**
     * 새 지도를 선언
     */
    let map = new olleh.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true,
        hd: false
    });
    
    /**
     * 마커 선언
     */
    var marker = new olleh.maps.overlay.Marker({
        position: latlng,
        map: map,
        title: "여기",
        caption: 'querying',
        animation: olleh.maps.overlay.Marker.BOUNCE
    });

    marker.onEvent('updatecap', function(event, payload){marker.setCaption(payload)});
    getAreaName(marker);
    /**
     * 마커에 클릭 했을 경우 발생하는 이벤트 
     */
    marker.onEvent('click', function (event, payload){
        map.panTo(marker.getPosition());
        event.stopPropagation();
    });
    
    /**
     * 맵에 Longpress시 발생하는 이벤트
     * @param {*} event 
     * @param {*} payload 
     */
    function onMapClick(event, payload) {
        if (marker) {
            marker.setPosition(event.getCoord());
            marker.setCaption('querying');
            getAreaName(marker);
        } else {
            marker = new olleh.maps.overlay.Marker({
                position: event.getCoord(),
                caption: olleh.maps.LatLng.valueOf(event.getCoord()).toString(),
                draggable: false,
                map: map
            });
        }
    }
    
    //map.onEvent('click', onMapClick);
    map.onEvent('longpress', onMapClick);
}
