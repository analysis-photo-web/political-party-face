const app = new Vue({
    el: '#app',
    data: {
        page_name: 'predict',
        party_num: 1,
        move_stop: false,
        predicted: false
    },
    methods: {
        party_moving() {
            let moveId = setInterval(() => {
                if (this.move_stop) {
                    clearInterval(moveId);
                } else {
                    this.party_num = this.party_num == 7 ? 1 : this.party_num+1;
                }
            }, 250);
        },
        page_move_handler(page) {
            this.page_name = page;
        },
        predict_handler(partyNum) {
            this.move_stop = true;
            this.predicted = true;
            this.party_num = partyNum;
        },
        reload_handler() {
            this.move_stop = false;
            this.predicted = false;
            this.party_moving();
        }
    },
    mounted() {
        this.party_moving();
    }
})