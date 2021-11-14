const STATIC_PATH = 'static'

Vue.component('main-view', {
    template: `
        <div class="main-view-container">
            <img src="${STATIC_PATH}/img/congress.png">
            <div class="logo">
                <p>
                    내 얼굴로 확인해보는
                </p>
                <p>
                    운명의 <span style="color: #c39335;">정당</span> 찾기!
                </p>
            </div>
            <button class="start-btn" v-on:click='startApp()'>
                시작하기
            </button>
        </div>
    `,
    methods: {
        startApp(){
            this.$emit('page_move', 'predict');
        }
    }
});

const partyColor = {
    1: '#004EA2',
    2: '#E61E2B',
    3: '#FFCC00',
    4: '#EA5504',
    5: '#003E9B',
    6: '#82C8B4',
    7: '#661b85'
}

Vue.component('predict-view', {
    template: `
        <div class="predict-view-container">
            <section class="wait-view">
                <div class="party-btn">
                    <!-- 1 더불어민주당 --> <div style="border: 1px solid #004EA2" :style="party_num==1 ? {background: '${partyColor[1]}'} : {backgroud: '#fff'}"></div>
                    <!-- 2 국민의힘 --> <div style="border: 1px solid #E61E2B" :style="party_num==2 ? {background: '${partyColor[2]}'} : {backgroud: '#fff'}"></div>
                    <!-- 3 정의당--> <div style="border: 1px solid #FFCC00" :style="party_num==3 ? {background: '${partyColor[3]}'} : {backgroud: '#fff'}"></div>
                    <!-- 4 국민의당 --> <div style="border: 1px solid #EA5504" :style="party_num==4 ? {background: '${partyColor[4]}'} : {backgroud: '#fff'}"></div>
                    <!-- 5 열린민주당 --> <div style="border: 1px solid #003E9B" :style="party_num==5 ? {background: '${partyColor[5]}'} : {backgroud: '#fff'}"></div>
                    <!-- 6 기본소득당 --> <div style="border: 1px solid #82C8B4" :style="party_num==6 ? {background: '${partyColor[6]}'} : {backgroud: '#fff'}"></div>
                    <!-- 7 시대전한 --> <div style="border: 1px solid #661b85" :style="party_num==7 ? {background: '${partyColor[7]}'} : {backgroud: '#fff'}"></div>
                </div>
                <div class="party-img">
                    <!-- 1 더불어민주당 --> <img v-show="party_num==1 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-1-face.jpeg">
                    <!-- 1 더불어민주당 --> <img v-show="party_num==1" class="party-logo" src="${STATIC_PATH}/img/party-1-logo.png">
                    <!-- 2 국민의힘 --> <img v-show="party_num==2 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-2-face.jpeg">
                    <!-- 2 국민의힘 --> <img v-show="party_num==2" class="party-logo" src="${STATIC_PATH}/img/party-2-logo.png">
                    <!-- 3 정의당--> <img v-show="party_num==3 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-3-face.jpg">
                    <!-- 3 정의당--> <img v-show="party_num==3" class="party-logo" src="${STATIC_PATH}/img/party-3-logo.png">
                    <!-- 4 국민의당 --> <img v-show="party_num==4 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-4-face.jpeg">
                    <!-- 4 국민의당 --> <img v-show="party_num==4" class="party-logo" src="${STATIC_PATH}/img/party-4-logo.png">
                    <!-- 5 열린민주당 --> <img v-show="party_num==5 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-5-face.jpg">
                    <!-- 5 열린민주당 --> <img v-show="party_num==5" class="party-logo" src="${STATIC_PATH}/img/party-5-logo.png">
                    <!-- 6 기본소득당 --> <img v-show="party_num==6 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-6-face.jpg">
                    <!-- 6 기본소득당 --> <img v-show="party_num==6" class="party-logo" src="${STATIC_PATH}/img/party-6-logo.png">
                    <!-- 7 시대전한 --> <img v-show="party_num==7 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-7-face.jpg">
                    <!-- 7 시대전한 --> <img v-show="party_num==7" class="party-logo" src="${STATIC_PATH}/img/party-7-logo.png">
                </div>
            </section>
            <section class="upload-container">
                <label for="upload-input">
                    <div>
                        <p><img src="${STATIC_PATH}/img/upload.svg"></p>
                        <p>사진 업로드</p>
                    </div>
                </label>
                <input type="file" id="upload-input" name="upload-input" multiple accept="image/*" v-show=false v-on:change="loadPictureAndPredict">
            </section>
            <section class="result-container" style="display: none;">
                <div>
                    <button v-on:click="reload"><img src="${STATIC_PATH}/img/reload.svg"></button>
                    <img id="uploaded">
                </div>
                <p id="predict-prop"></p>
                <img src="${STATIC_PATH}/img/gold_badge.svg"/>
            </section>
        </div>
    `,
    props: ['party_num', 'predicted'],
    methods: {
        async loadPictureAndPredict(event) {
            
            // Load Picture
            var file = event.target.files;
            let url = URL.createObjectURL(file[0]);
            var img = document.getElementById('uploaded');
            img.src = url;
            
            let mo = await getModel();
            let prediction = await mo.predict(img);
            
            // 가장 높은 정확도를 가진 정당 찾기.!
            var result = {
                className: prediction[0]['className'],
                probability: prediction[0]['probability']
            };
            for ( var i = 1; i < prediction.length ; i++){
                if(prediction[i].probability > result['probability']){
                    result['className'] = prediction[i]['className'];
                    result['probability'] = prediction[i]['probability'];
                }
            }

            var partyNum;
            if(result['className'] == '더불어민주당') {
                partyNum = 1;
            }else if(result['className'] == '국민의힘') {
                partyNum = 2;
            }else if(result['className'] == '정의당') {
                partyNum = 3;
            }else if(result['className'] == '국민의당') {
                partyNum = 4;
            }else if(result['className'] == '열린민주당') {
                partyNum = 5;
            }else if(result['className'] == '기본소득당') {
                partyNum = 6;
            }else if(result['className'] == '시대전환') {
                partyNum = 7;
            }

            var props = `${Math.ceil(result['probability'] * 1000)/10}%`;
            document.getElementById('predict-prop').innerText = props + ' 일치';
            document.getElementById('predict-prop').style.color = partyColor[partyNum];

            this.$emit('predict', partyNum);

            document.querySelector('.upload-container').style.display = 'none';
            document.querySelector('.result-container').style.display = 'block';

        },
        reload() {
            this.$emit('reload');
            document.querySelector('.upload-container').style.display = 'block';
            document.querySelector('.result-container').style.display = 'none';
        }
    },
});