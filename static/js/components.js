
Vue.component('main-view', {
    template: `
        <div class="cnt-c main-view">
            <img src="${STATIC_PATH}/img/congress.png">
            <p class="cnt-c slogan">
                <a>내 얼굴로 확인해보는</a>
                <a>운명의 <span class="pnt">정당</span> 찾기!</a>
            </p>
            <button class="btn" v-on:click='startApp()'>
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

Vue.component('predict-view', {
    template: `
        <div class="prdict-view">
            <section>
                <div class="cnt-r rot-container">
                    <!-- 1 더불어민주당 --> <div class="rot-box" data-party="1" :style="party_num==1 ? {background: '${PARTY_COLOR[1]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 2 국민의힘 --> <div class="rot-box" data-party="2" :style="party_num==2 ? {background: '${PARTY_COLOR[2]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 3 정의당--> <div class="rot-box" data-party="3" :style="party_num==3 ? {background: '${PARTY_COLOR[3]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 4 국민의당 --> <div class="rot-box" data-party="4" :style="party_num==4 ? {background: '${PARTY_COLOR[4]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 5 열린민주당 --> <div class="rot-box" data-party="5" :style="party_num==5 ? {background: '${PARTY_COLOR[5]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 6 기본소득당 --> <div class="rot-box" data-party="6" :style="party_num==6 ? {background: '${PARTY_COLOR[6]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 7 시대전한 --> <div class="rot-box" data-party="7" :style="party_num==7 ? {background: '${PARTY_COLOR[7]}'} : {background: '#a52a2a00'}"></div>
                </div>
                <div class="cnt-r party-container">
                    <!-- 1 더불어민주당 --> <img v-show="party_num==1 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-1-face.jpeg">
                    <!-- 1 더불어민주당 <img v-show="party_num==1" class="party-logo" src="${STATIC_PATH}/img/party-1-logo.png"> -->
                                        <div v-show="party_num==1" class="party-name" style="color:${PARTY_COLOR[1]};">더불어민주당</div>
                    <!-- 2 국민의힘 --> <img v-show="party_num==2 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-2-face.jpeg">
                    <!-- 2 국민의힘 <img v-show="party_num==2" class="party-logo" src="${STATIC_PATH}/img/party-2-logo.png"> --> 
                                        <div v-show="party_num==2" class="party-name" style="color:${PARTY_COLOR[2]};">국민의힘</div>   
                    <!-- 3 정의당--> <img v-show="party_num==3 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-3-face.jpg">
                    <!-- 3 정의당 <img v-show="party_num==3" class="party-logo" src="${STATIC_PATH}/img/party-3-logo.png"> -->
                                    <div v-show="party_num==3" class="party-name" style="color:${PARTY_COLOR[3]};">정의당</div>   
                    <!-- 4 국민의당 --> <img v-show="party_num==4 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-4-face.jpeg">
                    <!-- 4 국민의당 <img v-show="party_num==4" class="party-logo" src="${STATIC_PATH}/img/party-4-logo.png"> -->
                                      <div v-show="party_num==4" class="party-name" style="color:${PARTY_COLOR[4]};">국민의당</div>   
                    <!-- 5 열린민주당 --> <img v-show="party_num==5 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-5-face.jpg">
                    <!-- 5 열린민주당 <img v-show="party_num==5" class="party-logo" src="${STATIC_PATH}/img/party-5-logo.png"> -->
                                       <div v-show="party_num==5" class="party-name" style="color:${PARTY_COLOR[5]};">열린민주당</div>   
                    <!-- 6 기본소득당 --> <img v-show="party_num==6 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-6-face.jpg">
                    <!-- 6 기본소득당 <img v-show="party_num==6" class="party-logo" src="${STATIC_PATH}/img/party-6-logo.png"> -->
                                        <div v-show="party_num==6" class="party-name" style="color:${PARTY_COLOR[6]};">기본소득당</div>   
                    <!-- 7 시대전한 --> <img v-show="party_num==7 && !predicted" class="party-face" src="${STATIC_PATH}/img/party-7-face.jpg">
                    <!-- 7 시대전한 <img v-show="party_num==7" class="party-logo" src="${STATIC_PATH}/img/party-7-logo.png"> -->
                                     <div v-show="party_num==7" class="party-name" style="color:${PARTY_COLOR[7]};">시대전환</div>   
                </div>
            </section>
            <section class="upload-container">
                <label for="upload-input">
                    <div class="photo-box to-upload">
                        <p class="cnt-c"><img id="upload-img" src="${STATIC_PATH}/img/upload.svg"></p>
                        <p id="upload-text" class="cnt-c">사진 올리기</p>
                    </div>
                </label>
                <p class="ntc-photo">사진은 저장되지 않습니다.</p>
                <input type="file" id="upload-input" name="upload-input" multiple accept="image/*" v-show=false v-on:change="loadPictureAndPredict">
            </section>
            <section class="result-container" style="display: none;">
                <div class="cnt-r photo-box uploaded">
                    <button class="reload-btn" v-on:click="reload"><img src="${STATIC_PATH}/img/reload.svg"></button>
                    <img id="uploaded">
                </div>
                <p class="ntc-photo">사진은 저장되지 않습니다.</p>
                <p id="predict-prop"></p>
                <img src="${STATIC_PATH}/img/gold_badge.svg"/>
                <button id="share-btn" class="btn" v-on:click="shareLink">공유하기</button>
            </section>
        </div>
    `,
    mounted() {
        if(!this.canShare()){
            document.getElementById('share-btn').innerText = '링크복사';
        }
    },
    props: ['party_num', 'predicted'],
    methods: {
        canShare(){
            return navigator.share;
        },
        async loadPictureAndPredict(event) {

            document.getElementById('upload-text').innerText = '분석 중';
            document.getElementById('upload-img').src = `${STATIC_PATH}/img/analysis-loading.svg`;
            
            // Load Picture
            var file = event.target.files;
            let url = URL.createObjectURL(file[0]);
            var img = document.getElementById('uploaded');
            img.src = url;
            
            var model;
            try{
                model = await tmImage.load(MODEL_URL, METADATA_URL);
            } catch {
                alert('모델 로딩에 실패했습니다!\n죄송합니다!ㅠㅠ');
                this.reload();
                return;
            }

            let prediction = await model.predict(img);
            
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
            if(result['className'] == PARTY_NAME[1]) {
                partyNum = 1;
            }else if(result['className'] == PARTY_NAME[2]) {
                partyNum = 2;
            }else if(result['className'] == PARTY_NAME[3]) {
                partyNum = 3;
            }else if(result['className'] == PARTY_NAME[4]) {
                partyNum = 4;
            }else if(result['className'] == PARTY_NAME[5]) {
                partyNum = 5;
            }else if(result['className'] == PARTY_NAME[6]) {
                partyNum = 6;
            }else if(result['className'] == PARTY_NAME[7]) {
                partyNum = 7;
            }

            var props = `${Math.ceil(result['probability'] * 1000)/10}%`;
            document.getElementById('predict-prop').innerText = props + ' 일치';
            document.getElementById('predict-prop').style.color = PARTY_COLOR[partyNum];

            this.$emit('predict', partyNum);

            document.querySelector('.upload-container').style.display = 'none';
            document.querySelector('.result-container').style.display = 'block';

        },
        reload() {
            this.$emit('reload');
            document.getElementById('upload-text').innerText = '사진 업로드';
            document.getElementById('upload-img').src = `${STATIC_PATH}/img/upload.svg`;
            document.querySelector('.upload-container').style.display = 'block';
            document.querySelector('.result-container').style.display = 'none';
            document.getElementById('uploaded').src = '';
        },
        async shareLink() {
            const shareData = {
                title: 'AI 얼굴 인식 정당 추천',
                text: '내 얼굴로 확인해보는 운명의 정당 찾기!',
                url: `${APP_HOST}`,
            }
            if (!this.canShare()) {
                console.log('navigator share is undefined');
                this.pasteTo();
            }else {
                await navigator.share(shareData);
            }
        },
        pasteTo() {
            var tempT = document.createElement('textarea');
            tempT.value = `${APP_HOST}`;
            tempT.select();
            document.execCommand('copy');
            alert(`[링크가 복사되었습니다]\n${APP_HOST}`);
        }
    },
});