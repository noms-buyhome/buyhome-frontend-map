<template>
  <div>
    <h2>왜 안나오냐 이거야
    </h2>
    <div>
      동코드 입력 : 
      <input type="text" id="dongCode" ref="dongCode" v-model.lazy="dongCode" />
      <button @click="getResults(dongCode)">동코드로 검색</button>
      <br>
      <p>{{address}}</p>
      <!-- <input type="text" id="address" ref="address" v-model.lazy="address" /> -->
    </div>
    <div>
      <input type="text" id="lat" ref="lat" v-model.lazy="lat" />
      <input type="text" id="lng" ref="lng" v-model.lazy="lng" />
      <button @click="updateLatLng()">중앙좌표 출력, 동코드 반환</button>
    </div>
    <div class="button-group">
      <button @click="displayMarker(markerPositions1)">marker set 1</button>
      <button @click="displayMarker(markerPositions2)">marker set 2</button>
      <button @click="displayMarker(markerPositions3)">marker set 2</button>
      <button @click="displayMarker([])">marker set 3 (empty)</button>
      <button @click="getResults(1111018300)">동코드 배열 콘솔 출력하기</button>
      <button @click="displayMarker(dongLatLng)">드뎌.. 맵에 찍기!</button>
      <button @click="displayInfoWindow">infowindow</button>
      <button @click="currentLocationSearch()">현재위치 검색</button>
    </div>
    <div id="map" @mouseup="updateLatLng()"  ></div> <!-- @mouseover="hello()" -->
    <!-- {{console.log('이거슨 그냥 띄워보는거시다')}} -->
  </div>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "HomePin",
  data() {
    return {
      markerPositions1: [
        [33.452278, 126.567803],
        [33.452671, 126.574792],
        [33.451744, 126.572441],
      ],
      markerPositions2: [
        [37.499590490909185, 127.0263723554437],
        [37.499427948430814, 127.02794423197847],
        [37.498553760499505, 127.02882598822454],
        [37.497625593121384, 127.02935713582038],
        [37.49629291770947, 127.02587362608637],
        [37.49754540521486, 127.02546694890695],
        [37.49646391248451, 127.02675574250912],
      ],
      markerPositions3: [],
      markerPositions4: [], //여기에 동코드로 검색한 주택정보 불러오자
      markers: [],
      infowindow: null,
      lat:"",
      lng:"",
      dongCode: "",
      address: "",
      
    };
  },
  computed:{
    ...mapGetters(["homeResults","dongLatLng"])
  },
  created() {
    //this.getHomeInfos();
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=4e149a5f3b100aefb775c92b7dfaa1cc";
      console.log(script);
      document.head.appendChild(script);
    }
  },
  methods: {
    ...mapActions(["getResults"]),


    hello() { //마커에 마우스 올렸을 때 인포윈도우 출력
      // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
      var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = { 
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 3 // 지도의 확대 레벨
      };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      // 마커를 표시할 위치입니다 
      var position =  new kakao.maps.LatLng(33.450701, 126.570667);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: position
      });

      // 마커를 지도에 표시합니다.
      marker.setMap(map);

      // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
      var iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

      // 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
          content : iwContent
      });

      // 마커에 마우스오버 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'mouseover', function() {
        // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          infowindow.open(map, marker);
          console.log('마우스 올라갔다');
      });

      // 마커에 마우스아웃 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'mouseout', function() {
          // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          infowindow.close();
          console.log('마우스 내렸다');
      });
      console.log('얼마나 출력됨?');
    },




    async currentLocationSearch() {
      // console.log('!검색한 현재 주소 : ',this.address);
      // console.log('!검색한 동코드 : ',this.dongCode);
      // console.log('!현재 좌표들 : ',this.dongLatLng);
      this.getResults(this.dongCode);
      this.displayMarker(this.dongLatLng);
      // console.log('!검색후 좌표들 : ',this.dongLatLng);
    },




    //현재 위,경도를 갱신하고, 현재 위치의 동코드, 주소를 갱신
    updateLatLng() {
      var latlng = this.map.getCenter(); 
      this.lat = latlng.getLat();
      this.lng = latlng.getLng();
      
      //좌표를 이용해서 법정동을 반환받는 요청
      axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${this.lng}&y=${this.lat}`,
          { headers: { Authorization: `KakaoAK c46f27eaebc3444220e50470b5d06e52` } }
      ).then((result) => {
        //동코드 갱신
        // console.log(result);
        // console.log(result.data);
        // console.log(result.data.documents[0].code);
        this.dongCode = result.data.documents[0].code;

        //화면에 출력할 주소 갱신
        this.address =result.data.documents[0].address_name;
        console.log('1ㄴ현재 주소 : ',this.address);
        console.log('1ㄴ동코드 : ',this.dongCode);

      }).catch(({ response }) => {
          alert(response.data);
          console.log('오류 떴다잉..');
          console.log(response);
      });


      console.log('현재 주소 : ',this.address);
      console.log('동코드 : ',this.dongCode);
    },




    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.50123567372594, 127.03949437304006),
        level: 5,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
    },




    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },




    displayMarker(markerPositions) {
      console.log('displayMarker() 호출');
      // console.log('위경도 출력하면 어떻게 나올까? ',markerPositions);
      //console.log('이거 출력 되는거임?? ',this.dongLatLng[0]);
      // this.markers=[];
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.markers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = 'C:/SSAFY/ProjectFinal-buyhome/buyhome-frontend-map/src/assets/logo.png', // 마커이미지의 주소입니다    
          imageSize = new kakao.maps.Size(40, 44), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    

        for(var i=0; i<positions.length; i++){
          var marker = new kakao.maps.Marker({
                              map: this.map,
                              position : positions[i],
                              image: markerImage // 마커이미지 설정 
                            });
          this.markers.push(marker);
          
          //윈도우 만들어주기
          // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
          var iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

          // 인포윈도우를 생성합니다
          var infowindow = new kakao.maps.InfoWindow({
              content : iwContent
          });

          // 마커에 마우스오버 이벤트를 등록합니다
          kakao.maps.event.addListener(this.markers[i], 'mouseover', function() {
            // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
              infowindow.open(this.map, this.markers[i]);
              console.log('마우스 올라갔다', this.markers[i].getPosition());
          });

          // 마커에 마우스아웃 이벤트를 등록합니다
          kakao.maps.event.addListener(this.markers[i], 'mouseout', function() {
              // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
              infowindow.close();
              console.log('마우스 내렸다', this.markers[i].getPosition());
          });

          // console.log('선언할때이다', marker);
          console.log('마커두개 같은거 나오냐? > 1',marker.getPosition());
          console.log('마커두개 같은거 나오냐? > 2',this.markers[i].getPosition());
          console.log(marker.getPosition() === this.markers[i].getPosition());
        }
        // this.markers = positions.map(
        //   (position) =>
        //     new kakao.maps.Marker({
        //       map: this.map,
        //       position,
        //     })
        // );
        // positions.map(
        //   (position) =>
        //     console.log(position)
        // );
        
        console.log('마커 출력해보기2 : ',this.markers);

        // const bounds = positions.reduce(
        //   (bounds, latlng) => bounds.extend(latlng),
        //   new kakao.maps.LatLngBounds()
        // );

        // this.map.setBounds(bounds);


        // // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
        // var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        // mapOption = { 
        //     center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        //     level: 3 // 지도의 확대 레벨
        // };

        // var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        // //마커를 표시할 위치입니다 
        // var position =  new kakao.maps.LatLng(33.450701, 126.570667);

        // // 마커를 생성합니다
        // var marker = new kakao.maps.Marker({
        //   position: position
        // });

        // // 마커를 지도에 표시합니다.
        // marker.setMap(this.map);

        // // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
        // var iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        // // 인포윈도우를 생성합니다
        // var infowindow = new kakao.maps.InfoWindow({
        //     content : iwContent
        // });

        // // 마커에 마우스오버 이벤트를 등록합니다
        // kakao.maps.event.addListener(marker, 'mouseover', function() {
        //   // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
        //     infowindow.open(this.map, marker);
        //     console.log('마우스 올라갔다');
        // });

        // // 마커에 마우스아웃 이벤트를 등록합니다
        // kakao.maps.event.addListener(marker, 'mouseout', function() {
        //     // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
        //     infowindow.close();
        //     console.log('마우스 내렸다');
        // });
      }
    },




    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },



    
  },
};


// // 마커를 표시할 위치입니다 
// var position =  new kakao.maps.LatLng(33.450701, 126.570667);

// // 마커를 생성합니다
// var marker = new kakao.maps.Marker({
//   position: position,
//   clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
// });
// this.kakao.maps.event.addListener(marker, 'click', function() {
//   console.log('hello~~~');
// });

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 600px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
