import Vue from 'vue'
import Vuex from 'vuex'
import http from "@/api/http"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //여기에 내가 사용할 데이터들을 쓰는거인듯?
    homeInfos: [],
    results: [],
    homeInfo: {},
    dongLatLng: [],
  },
  getters: {
    homeInfos(state) {
      return state.homeInfos;
    },
    homeInfo(state) {
      return state.homeInfo;
    },
    results(state) {
      return state.results;
    },
    dongLatLng(state) {
      return state.dongLatLng;
    }
  },
  mutations: {
    setHomeInfos(state, payload) {
      console.log('[mutation].............homeInfos : ', payload);
      state.homeInfos = payload;
    },
    setHomeInfo(state, payload) {
      console.log('[mutation].............homeInfo : ', payload);
      state.homeInfo = payload;
    },
    setResults(state, payload) {
      console.log('[mutation].............results : ', payload);
      state.results = payload;
    },
    setDongLatLng(state, payload) {
      console.log('[mutation].............dongLatLng : ', payload);
      state.dongLatLng = payload;
    }
  },
  actions: {
    getHomeInfos({ commit }) { 
      console.log('[actions] getHomeInfos 호출');
      http.get("home/1111018300") //이게 제일 많이 나오는 동코드임ㅋㅋ
        .then(({ data }) => {
          console.log('[actions]................................homeInfos:', data)
          commit("setHomeInfos", data);
        })
        .catch(({ response }) => {
          alert(response.data);
        });
    },
    getResults({ commit }, payload) { 
      console.log('[actions]................................getResults 조회 조건:', payload);
      http.get(`home/${payload}`)
        .then(({ data }) => {
          console.log('[actions]................................getResults:', data);
          
          var arr2 = new Array(); //2차원 배열 선언
          var element = null; //2차원 배열 한칸마다 넣을 1차원 배열

          for (var i = 0; i < data.length; i++){
            // console.log(data[i].lat);
            // console.log(data[i].lng);
            element = new Array(); //배열선언
            element.push(data[i].lat);
            element.push(data[i].lng);
            arr2.push(element); //2차원 배열에 넣기
          }
          // console.log(arr2);

          commit("setDongLatLng", arr2);
        })
        .catch(({ response }) => {
          alert(response.data);
        });
    },
  },
  modules: {
  }
})
