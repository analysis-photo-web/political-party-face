const STATIC_PATH = 'static'

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
        <div class="prdict-view">
            <section>
                <div class="cnt-r rot-container">
                    <!-- 1 더불어민주당 --> <div class="rot-box" data-party="1" :style="party_num==1 ? {background: '${partyColor[1]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 2 국민의힘 --> <div class="rot-box" data-party="2" :style="party_num==2 ? {background: '${partyColor[2]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 3 정의당--> <div class="rot-box" data-party="3" :style="party_num==3 ? {background: '${partyColor[3]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 4 국민의당 --> <div class="rot-box" data-party="4" :style="party_num==4 ? {background: '${partyColor[4]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 5 열린민주당 --> <div class="rot-box" data-party="5" :style="party_num==5 ? {background: '${partyColor[5]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 6 기본소득당 --> <div class="rot-box" data-party="6" :style="party_num==6 ? {background: '${partyColor[6]}'} : {background: '#a52a2a00'}"></div>
                    <!-- 7 시대전한 --> <div class="rot-box" data-party="7" :style="party_num==7 ? {background: '${partyColor[7]}'} : {background: '#a52a2a00'}"></div>
                </div>
                <div class="cnt-r party-container">
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
    props: ['party_num', 'predicted'],
    methods: {
        async loadPictureAndPredict(event) {

            document.getElementById('upload-text').innerText = '분석 중';
            document.getElementById('upload-img').src = `${STATIC_PATH}/img/analysis-loading.svg`;
            
            // Load Picture
            var file = event.target.files;
            let url = URL.createObjectURL(file[0]);
            var img = document.getElementById('uploaded');
            img.src = url;
            
            // let mo = await getModel();
            let wait = 0;
            while (!model) {
                // model loading isn't finished
                window.setTimeout(() => {
                    console.log('Wait for loading model...');
                }, 1000);
                wait ++;
                if(wait == 8) break;
            }
            if(wait == 8){
                alert('모델을 로딩하는데 실패하였습니다.');
                this.$emit('reload');
                document.getElementById('upload-text').innerText = '사진 업로드';
                document.getElementById('upload-img').src = `${STATIC_PATH}/img/upload.svg`;
                document.querySelector('.upload-container').style.display = 'block';
                document.querySelector('.result-container').style.display = 'none';
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
            document.getElementById('upload-text').innerText = '사진 업로드';
            document.getElementById('upload-img').src = `${STATIC_PATH}/img/upload.svg`;
            document.querySelector('.upload-container').style.display = 'block';
            document.querySelector('.result-container').style.display = 'none';
        },
        async shareLink() {
            const shareData = {
                title: 'AI 얼굴 인식 정당 추천',
                text: '내 얼굴로 확인해보는 운명의 정당 찾기!',
                url: 'https://analysis-photo.com/',
            }

            const btn = document.getElementById('share-btn');
            try{
                await navigator.share(shareData);
            }catch(err) {
                const tempElem = document.createElement('textarea');
                tempElem.value = "www.analysis-photo.com"
                document.body.appendChild(tempElem);
            
                tempElem.select();
                document.execCommand("copy");
                document.body.removeChild(tempElem);
                alert('링크가 복사되었습니다!');
            }
            
            // btn.addEventListener('click', async () => {
            //     try{
            //         console.log('a');
            //         await navigator.userAgentData.share(shareData);
            //     }catch(err) {
            //         // var pasteEvent = new ClipboardEvent('paste');
            //         // pasteEvent.clipboardData.items.add('https://analysis-photo.com/', 'text/plain');
            //         // document.dispatchEvent(pasteEvent);
            //         // console.log("fail")
            //         const tempElem = document.createElement('textarea');
            //         tempElem.value = "www.analysis-photo.com"
            //         document.body.appendChild(tempElem);
                  
            //         tempElem.select();
            //         document.execCommand("copy");
            //         document.body.removeChild(tempElem);
            //         alert('링크가 복사되었습니다!');
            //     }
            // }) 

        }
    },
});