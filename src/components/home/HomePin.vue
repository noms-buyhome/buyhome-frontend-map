<template>
  <div>
    <h2>왜 안나오냐 이거야
    </h2>
    <img alt="Vue logo" src="@/assets/icon-home.png">
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
      <button @click="displayMarker([])">마커 지우기</button>
      <button @click="getResults(1111018300)">동코드 배열 콘솔 출력하기</button>
      <button @click="displayMarker(dongLatLng)">드뎌.. 맵에 찍기!</button>
      <button @click="displayInfoWindow">infowindow</button>
      <button @click="currentLocationSearch()">현재위치 검색</button>


      <button @click="getHomePositions()" >집</button>
      <button @click="eduToggle()" :class="{switchOn:!eduSwitch}">학군</button>
      <button @click="transportToggle()" :class="{switchOn:!transportSwitch}">교통</button>
      <button @click="mediToggle()" :class="{switchOn:!mediSwitch}">병원</button>
      <button @click="foodToggle()" :class="{switchOn:!foodSwitch}">식당</button>
      
    </div>
    <div id="map" @mouseup="updateLatLng()"  ></div> <!-- @mouseover="hello()" -->
    <!-- {{console.log('이거슨 그냥 띄워보는거시다')}} -->
  </div>
</template>

<script>
import axios from "axios";
import http from "@/api/http"
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
      homePositions: [], //여기에 동코드로 검색한 주택정보 불러오자
      transportPositions: [], //주차장, 주유소, 지하철역
      eduPositions: [], //유치원, 학교, 학원
      mediPositions: [], //병원, 약국
      foodPositions: [], //음식점, 카페
      markers: [],
      transportMarkers: [],
      eduMarkers: [],
      mediMarkers: [],
      foodMarkers: [],
      transportSwitch: true,
      eduSwitch: true,
      mediSwitch: true,
      foodSwitch: true,
      infowindow: null,
      lat:37.501055511276206,
      lng:127.03937835966009,
      dongCode: 1168010100,
      address: "서울특별시 강남구 역삼동",
      
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




    //학군 버튼 눌렀을 때마다 마커 표시하고 끄는 기능
    foodToggle() {
      this.foodSwitch = !this.foodSwitch;
      console.log(this.foodSwitch);
      if(this.foodSwitch){
        this.displayFoodMarker([]);
      }else {
        this.getFoodPositions();
      }
    },




    //동코드 기준으로 [학군] 리스트 불러오기
    getFoodPositions() {
      //37.501055511276206, 127.03937835966009
      axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json?x=${this.lng}&y=${this.lat}&radius=1000&category_group_code=FD6`, //x=37.501055511276206&y=127.03937835966009&radius=2000&
          { headers: { Authorization: `KakaoAK c46f27eaebc3444220e50470b5d06e52` } }
      ).then((result) => {
        console.log('교통 정보 출력');
        console.log(result);
        console.log(result.data);
        console.log(result.data.documents);
        console.log(result.data.documents[1]);
        console.log(result.data.documents[1].x);
        console.log(result.data.documents[1].y);

        var list = [];
        for(var i=0; i<result.data.documents.length; i++){
          list.push([result.data.documents[i].y,result.data.documents[i].x]);
        // console.log(result.data.documents[i].x);
        // console.log(result.data.documents[i].y);
        }
        console.log(list);
        this.displayFoodMarker(list);
      }).catch(({ response }) => {
          alert(response.data);
          console.log('오류 떴다잉..');
          console.log(response);
      });
    },





    displayFoodMarker(markerPositions) {
      console.log('displayFoodMarker() 호출');
      console.log(markerPositions);
      if (this.foodMarkers.length > 0) {
        this.foodMarkers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      console.log('.......positions ');
      console.log(positions); ///////////////////////////////////////////////////////////////////////////////////////////////
      if(markerPositions.length > 0){
        console.log(markerPositions[0]);
        console.log(markerPositions[0][0]);
        console.log('positions의 길이 : ',positions.length)
      }

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.foodMarkers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = require("@/assets/icon-food.png"); // 마커이미지의 주소입니다

        var imageSize = new kakao.maps.Size(33, 37), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(0,0)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        //마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        for(var i=0; i<positions.length; i++){
          var marker = new kakao.maps.Marker({
                              map: this.map,
                              position : positions[i],
                              image: markerImage // 마커이미지 설정 
                            });
          this.foodMarkers.push(marker);
        }
      }
    },




    //학군 버튼 눌렀을 때마다 마커 표시하고 끄는 기능
    mediToggle() {
      this.mediSwitch = !this.mediSwitch;
      console.log(this.mediSwitch);
      if(this.mediSwitch){
        this.displayMediMarker([]);
      }else {
        this.getMediPositions();
      }
    },




    //동코드 기준으로 [학군] 리스트 불러오기
    getMediPositions() {
      //37.501055511276206, 127.03937835966009
      axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json?x=${this.lng}&y=${this.lat}&radius=1000&category_group_code=HP8`, //x=37.501055511276206&y=127.03937835966009&radius=2000&
          { headers: { Authorization: `KakaoAK c46f27eaebc3444220e50470b5d06e52` } }
      ).then((result) => {
        console.log('교통 정보 출력');
        console.log(result);
        console.log(result.data);
        console.log(result.data.documents);
        console.log(result.data.documents[1]);
        console.log(result.data.documents[1].x);
        console.log(result.data.documents[1].y);

        var list = [];
        for(var i=0; i<result.data.documents.length; i++){
          list.push([result.data.documents[i].y,result.data.documents[i].x]);
        // console.log(result.data.documents[i].x);
        // console.log(result.data.documents[i].y);
        }
        console.log(list);
        this.displayMediMarker(list);
      }).catch(({ response }) => {
          alert(response.data);
          console.log('오류 떴다잉..');
          console.log(response);
      });
    },





    displayMediMarker(markerPositions) {
      console.log('displayMediMarker() 호출');
      console.log(markerPositions);
      if (this.mediMarkers.length > 0) {
        this.mediMarkers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      console.log('.......positions ');
      console.log(positions); ///////////////////////////////////////////////////////////////////////////////////////////////
      if(markerPositions.length > 0){
        console.log(markerPositions[0]);
        console.log(markerPositions[0][0]);
        console.log('positions의 길이 : ',positions.length)
      }

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.mediMarkers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = require("@/assets/icon-medi.png"); // 마커이미지의 주소입니다

        var imageSize = new kakao.maps.Size(33, 37), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(0,0)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        //마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        for(var i=0; i<positions.length; i++){
          var marker = new kakao.maps.Marker({
                              map: this.map,
                              position : positions[i],
                              image: markerImage // 마커이미지 설정 
                            });
          this.mediMarkers.push(marker);
        }
      }
    },




    //학군 버튼 눌렀을 때마다 마커 표시하고 끄는 기능
    transportToggle() {
      this.transportSwitch = !this.transportSwitch;
      console.log(this.transportSwitch);
      if(this.transportSwitch){
        this.displayTransportMarker([]);
      }else {
        this.getTransportPositions();
      }
    },




    //동코드 기준으로 [학군] 리스트 불러오기
    getTransportPositions() {
      //37.501055511276206, 127.03937835966009
      axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json?x=${this.lng}&y=${this.lat}&radius=1000&category_group_code=SW8`, //x=37.501055511276206&y=127.03937835966009&radius=2000&
          { headers: { Authorization: `KakaoAK c46f27eaebc3444220e50470b5d06e52` } }
      ).then((result) => {
        console.log('교통 정보 출력');
        console.log(result);
        console.log(result.data);
        console.log(result.data.documents);
        console.log(result.data.documents[1]);
        console.log(result.data.documents[1].x);
        console.log(result.data.documents[1].y);

        var list = [];
        for(var i=0; i<result.data.documents.length; i++){
          list.push([result.data.documents[i].y,result.data.documents[i].x]);
        // console.log(result.data.documents[i].x);
        // console.log(result.data.documents[i].y);
        }
        console.log(list);
        this.displayTransportMarker(list);
      }).catch(({ response }) => {
          alert(response.data);
          console.log('오류 떴다잉..');
          console.log(response);
      });
    },





    displayTransportMarker(markerPositions) {
      console.log('displayTransportMarker() 호출');
      console.log(markerPositions);
      if (this.transportMarkers.length > 0) {
        this.transportMarkers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      console.log('.......positions ');
      console.log(positions); ///////////////////////////////////////////////////////////////////////////////////////////////
      if(markerPositions.length > 0){
        console.log(markerPositions[0]);
        console.log(markerPositions[0][0]);
        console.log('positions의 길이 : ',positions.length)
      }

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.transportMarkers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = require("@/assets/icon-transport.png"); // 마커이미지의 주소입니다

        var imageSize = new kakao.maps.Size(40, 37), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(0,0)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        //마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        for(var i=0; i<positions.length; i++){
          var marker = new kakao.maps.Marker({
                              map: this.map,
                              position : positions[i],
                              image: markerImage // 마커이미지 설정 
                            });
          this.transportMarkers.push(marker);
        }
      }
    },




    //학군 버튼 눌렀을 때마다 마커 표시하고 끄는 기능
    eduToggle() {
      this.eduSwitch = !this.eduSwitch;
      console.log(this.eduSwitch);
      if(this.eduSwitch){
        this.displayEduMarker([]);
      }else {
        this.getEduPositions();
      }
    },




    //동코드 기준으로 [학군] 리스트 불러오기
    getEduPositions() {
      //37.501055511276206, 127.03937835966009
      axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json?x=${this.lng}&y=${this.lat}&radius=1000&category_group_code=SC4`, //x=37.501055511276206&y=127.03937835966009&radius=2000&
          { headers: { Authorization: `KakaoAK c46f27eaebc3444220e50470b5d06e52` } }
      ).then((result) => {
        console.log('학군 정보 출력');
        console.log(result);
        console.log(result.data);
        console.log(result.data.documents);
        console.log(result.data.documents[1]);
        console.log(result.data.documents[1].x);
        console.log(result.data.documents[1].y);

        var list = [];
        for(var i=0; i<result.data.documents.length; i++){
          list.push([result.data.documents[i].y,result.data.documents[i].x]);
        // console.log(result.data.documents[i].x);
        // console.log(result.data.documents[i].y);
        }
        console.log(list);
        this.displayEduMarker(list);
      }).catch(({ response }) => {
          alert(response.data);
          console.log('오류 떴다잉..');
          console.log(response);
      });
    },





    displayEduMarker(markerPositions) {
      console.log('displayEduMarker() 호출');
      console.log(markerPositions);
      if (this.eduMarkers.length > 0) {
        this.eduMarkers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      console.log('.......positions ');
      console.log(positions); ///////////////////////////////////////////////////////////////////////////////////////////////
      if(markerPositions.length > 0){
        console.log(markerPositions[0]);
        console.log(markerPositions[0][0]);
        console.log('positions의 길이 : ',positions.length)
      }

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.eduMarkers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = require("@/assets/icon-edu.png"); // 마커이미지의 주소입니다

        var imageSize = new kakao.maps.Size(33, 37), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(0,0)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        //마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        for(var i=0; i<positions.length; i++){
          var marker = new kakao.maps.Marker({
                              map: this.map,
                              position : positions[i],
                              image: markerImage // 마커이미지 설정 
                            });
          this.eduMarkers.push(marker);
        }
      }
    },




    //동코드 기준으로 [집] 리스트 불러오기
    getHomePositions() {
      console.log('getHomePositions() 호출');
      // console.log('[actions]................................getResults 조회 조건:', payload);
      http.get(`home/${this.dongCode}`)
        .then(({ data }) => {
          console.log('[actions]................................getHomePositions:', data);
          this.homePositions = data;
          if (data.length == 0) {
            alert('해당지역엔 매물이 없어유.. T^T;;');
          }
        })
        .catch(({ response }) => {
          alert(response.data);
        });
    },




    currentLocationSearch() {
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

      console.log(markerPositions);
      // console.log('위경도 출력하면 어떻게 나올까? ',markerPositions);
      //console.log('이거 출력 되는거임?? ',this.dongLatLng[0]);
      // this.markers=[];
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // console.log('map으로 출력하기');
      // markerPositions.map(
      //   (position) => console.log(position)
      // );

      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // console.log('뽀문으로 출력하기');
      // var positions = [];
      // for(let i=0; i<markerPositions.length; i++) {
      //   console.log(markerPositions[i]);
      //   var tmp = new kakao.maps.LatLng(markerPositions[i]);
      //   positions.push(tmp);
      // }
      // console.log('.......tmpPositions ');
      // console.log(tmpPositions);
      console.log('.......positions ');
      console.log(positions); ///////////////////////////////////////////////////////////////////////////////////////////////
      if(markerPositions.length > 0){
        console.log(markerPositions[0]);
        console.log(markerPositions[0][0]);
        console.log('positions의 길이 : ',positions.length)
      }

      if (positions.length > 0) {
        console.log('마커 출력해보기 : ',this.markers);
        console.log(positions);
        console.log(positions[0]);

        var imageSrc = require("@/assets/icon-home.png"), // 마커이미지의 주소입니다    
          imageSize = new kakao.maps.Size(30, 33), // 마커이미지의 크기입니다
          imageOption = {offset: new kakao.maps.Point(0,0)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
        //마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
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
          // var iwContent = '<div style="padding:5px;">Hello World!</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

          // // 인포윈도우를 생성합니다
          // var infowindow = new kakao.maps.InfoWindow({
          //     content : iwContent
          // });

          // // 마커에 마우스오버 이벤트를 등록합니다
          // kakao.maps.event.addListener(this.markers[i], 'mouseover', function() {
          //   // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          //     infowindow.open(this.map, this.markers[i]);
          //     // console.log('마우스 올라갔다', this.markers[i].getPosition());
          // });

          // // 마커에 마우스아웃 이벤트를 등록합니다
          // kakao.maps.event.addListener(this.markers[i], 'mouseout', function() {
          //     // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          //     infowindow.close();
          //     // console.log('마우스 내렸다', this.markers[i].getPosition());
          // });

          // console.log('선언할때이다', marker);
          // console.log('마커두개 같은거 나오냐? > 1',marker.getPosition());
          // console.log('마커두개 같은거 나오냐? > 2',this.markers[i].getPosition());
          // console.log(marker.getPosition() === this.markers[i].getPosition());
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

.switchOn {
  background: red;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
