<template>
  <h1>뉴스기사를 띄워볼거에요.</h1>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      articles: [],
    }
  },
  created() {
    console.log('아래 뉴스기사 부를거야~~~?');
    //CORS오류 뜬다..ㅠㅠ
    axios.get(
          `https://openapi.naver.com/v1/search/news.json?query=%EC%A3%BC%EC%8B%9D&display=10&start=1&sort=sim`, //x=37.501055511276206&y=127.03937835966009&radius=2000&
          { headers:{ 'X-Naver-Client-Id':'JodwiVXhYmXk3rD8cc5O',
                      'X-Naver-Client-Secret': 'aoJ7ssMour'
                    }
          }
      ).then((result) => {
        console.log('뉴스 결과 출력');
        console.log(result);
        this.articles = result;
      }).catch(({ response }) => {
          alert(response);
          console.log('오류 떴다잉..');
          console.log(response);
      });
      console.log('아마 이 위에 떴을 텐데..');
  },
}
</script>

<style>

</style>