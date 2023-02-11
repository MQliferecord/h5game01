let _mian = {
    LV: 1,
    MAXLV: 3,
    scene: null,
    blockList: null,
    ball: null,
    paddle: null,
    score: null,
    ball_x: 491,
    ball_y: 432,
    paddle_x: 449,
    paddle_y: 450,
    score_x: 10,
    score_y: 30,
    fps: 60,
    game: null,
    start: function () {
        let self = this
        /**
         * 场景
         */
        self.scene = new Scene(self.LV)
        /**
         * 砖块
         */
        self.blockList = self.scene.initBlockList()
        /**
         * 小球
         */
        self.ball = new Ball(self)
        /**
         * 挡板
         */
        self.paddle = new Paddle(self)
        /**
         * 计分
         */
        self.score = new Score(self)
        /**
         * 游戏逻辑
         */
        self.game = new Game(self)
        /**
         * 开启入口
         */
        self.game.init(self)
    }
}
_mian.start()
