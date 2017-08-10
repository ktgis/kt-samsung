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

function onLoad(){
    /**
     * 새 지도를 선언
     */
    let map = new olleh.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true
    });
    
    /**
     * 마커 선언
     */
    var marker = new olleh.maps.overlay.Marker({
        position: latlng,
        map: map,
        title: "여기",
        caption: latlng.toString(),
        animation: olleh.maps.overlay.Marker.BOUNCE
    });
    
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
            marker.setCaption(olleh.maps.LatLng.valueOf(marker.getPosition()).toString());
        } else {
            marker = new olleh.maps.overlay.Marker({
                position: event.getCoord(),
                caption: olleh.maps.LatLng.valueOf(event.getCoord()).toString(),
                draggable: false,
                map: map
            });
        }
    }
    map.onEvent('longpress', onMapClick);
}
