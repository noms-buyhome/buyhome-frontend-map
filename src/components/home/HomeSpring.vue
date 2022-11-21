<template>
  <div>
    테스트로 스프링에서 데이터를 불러올거다 이거야
    
    <!-- <b-table hover striped   :items="homeInfos "    :fields="fields"></b-table> -->

    <div v-if="homeInfos.length > 0">
      <b-table hover striped   :items="homeInfos "    :fields="fields"></b-table>
    </div>
    <div v-else>등록된 책 목록이 없습니다.</div>

    
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"; //mapActions,

export default {
  data() {
    return { 
      word:"",
      keys:[
        {value:"all", text:'--선택하세요--'},
        {value:"isbn", text:'책번호'},
        {value:"title",text:"제목"},
        {value:"author",text:"저자"},
        ],          //select option에 표시할 데이타  
      fields:[
        {key:"aptCode" ,label:"아파트코드"},
        {key:"aptName",label:"아파트명"},
        {key:"buildYear",label:"준공년도"},
        {key:"dongCode",label:"동코드"},
        {key:"dongName",label:"동이름"},
        {key:"img",label:"이미지"},
        {key:"jibun",label:"지번"},
        {key:"lat",label:"위도"},
        {key:"lng",label:"경도"},
      ],            //table의 header에 표시되는 데이타 mapping
      key:"all",
    };
  },
  computed:{
    ...mapGetters(["homeInfos"])
  },
  created() {
    this.getHomeInfos();
  },
  methods:{
    ...mapActions(["getHomeInfos"]),
  }
}
</script>

<style></style>