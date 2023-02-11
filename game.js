class Game{
    constructor(main){
        let g = {
            main:main,
            actions:{},//记录按键工作
            keydowns:{},//记录按键状态
            state:1,//游戏状态值，初始为1
            state_START:1,//开始游戏
            state_RUNNING:2,//游戏开始运行
            state_STOP:3,//暂停游戏
            state_GAMEOVER:4,//游戏结束
            state_UPDATE:5,//游戏过关
            canvas:document.getElementById("canvas"),//canvas元素
            context:document.getElementById("canvas").getContext("2d"),//canvas画布
            timer:null,//轮询定时器
            fps:main.fps,//动画帧数，默认60
        }
        Object.assign(this,g)
    }
    draw(paddle,ball,blockList,score){
        let g = this
        //清除画布
        g.context.clearRect(0,0,g.canvas.width,g.canvas.height)
        //绘制背景板
        g.drawBg()
        //绘制挡板
        g.drawImage(paddle)
        //绘制小球
        g.drawImage(ball)
        //绘制砖块
        g.drawBlocks(blockList)
        //绘制分数
        g.drawText(score)
    }
    drawBg(){
        let bg = imageFromPath(allImg.background)
        this.context.drawImage(bg,0,0)
    }
    //二次封装drawImage
    drawImage(obj){
        this.context.drawImage(obj.image,obj.x,obj.y)
    }
    drawBlocks(list){
        for(let item of list){
            this.drawImage(item)
        }
    }
    drawText(obj){
        this.context.font = '24px Microsoft Yahei'
        this.context.fillStyle = '#fff'
        //绘制分数
        this.context.fillText(obj.text +obj.allScore,obj.x,obj.y)
        //绘制关卡
        this.context.fillText(obj.textLv + obj.lv,this.canvas.width-100,obj.y)
    }
    gameOver(){
        //清楚定时器
        clearInterval(this.timer)
        //清除背景
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        //绘制画布
        this.drawBg()
        //绘制提示文字
        this.context.font = '48px Microsoft Yahei'
        this.context.fillStyle = '#fff'
        this.context.fillText('游戏结束',404,226)
    }
    goodGame(){
        clearInterval(this.timer)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawBg()
        //绘制提示文字
        this.context.font = '48px Microsoft Yahei'
        this.context.fillStyle = '#fff'
        this.context.fillText('恭喜晋级下一关',308,226)
    }
    finalGame(){
        clearInterval(this.timer)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.drawBg()
        //绘制提示文字
        this.context.font = '48px Microsoft Yahei'
        this.context.fillStyle = '#fff'
        this.context.fillText('恭喜通关',308,226)
    }
    //注册事件
    registerAction(key,callback){
        this.action[key] = callback
    }
    //小球碰撞检测
    checkBallBlock(){
        let p = paddle,b = ball
        //小球挡板是否碰撞
        if(p.collide(b)){
            //发生碰撞，如果小球速度依然趋向挡板中心，则取反
            if(Math.abs(b.y+b.h/2-p.y+p.h/2)>Math.abs(b.y+b.h-p.y+p.h/2+b.speedY)){
                b.speedY *= -1
            }
            b.speedX = p.collideRange(b)
        }
        //小球砖块是否碰撞
        blockList.forEach(function(item,i,arr){
            if(item.collide(b)){
                //砖块血量为零，进行移除
                if(!item.alive){
                    arr.splice(i,1)
                }
                if((b.y<item.y&&b.speedY<0)||(b.y>item.y&&b.speedY>0)){
                    //小球非水平撞击砖块，只改变y速度方向
                    if(!item.collideBlockHorn(b)){
                        b.speedY *= -1
                    }
                }
                //小球水平撞击砖块，只改变x速度方向
                if(item.collideBlockHorn(b)){
                    b.speedX *= -1
                }
                score.computeScore()
            }
        })
        //挡板移动时候边界检测
        if(p.x<=0){
            //到达左边界
            p.isLeftMove = false
        }else{
            p.isLeftMove = true
        }
        //获得视图宽度
        let widthWin = window.innerWidth
        if(p.x >= widthWin - p.w){
            //达到右边界
            p.isRightMove = false
        }else{
            p.isRightMove = true
        }
        //移动小球
        b.move(g)
    }
    //设置逐帧动画
    setTimer(paddle,ball,blockList,score){
        let g = this
        let main = g.main
        g.timer = setInterval(function(){
            //按键集合
            let actions = Object.keys(g.actions)
            for(let i = 0;i<actions.length;i++){
                let key = actions[i]
                if(g.keydowns[key]){
                    //如果按键被按下，则调用注册的action
                    g.actions[key]()
                }
            }
            //如果砖块数量为0 挑战成功
            if(blockList.length == 0){
                if(main.LV === main.MAXLV){
                    //最后一关通关
                    //升级通关
                    g.state = g.state_UPDATE
                    //挑战成功，渲染通关场景
                    g.finalGame()
                }else{
                    g.state = g.state_UPDATE
                    //挑战成功，渲染通关场景
                    g.finalGame()
                }
            }
            //判断游戏是否结束
            if(g.state === g.state_GAMEOVER){
                g.gameOver()
            }
            //判断游戏是否启动
            if(g.state === g.state_RUNNING){
                g.checkBallBlock(g,paddle,ball,blockList,score)
                g.draw(paddle,ball,blockList,score)
            }else if(g.state === g.state_START){
                g.draw(paddle,ball,blockList,score)
            }
        },1000/g.fps)
    }
    init(){
        let g = this,
            paddle = g.main.paddle,
            ball = g.main.ball,
            blockList = g.main.blockList,
            score = g.main.score
        //设置键盘按下和松开的注册函数
        window.addEventListener('keydown',function(event){
            g.keydowns[event] = true
        })
        window.addEventListener('keyup',function(event){
            g.keydowns[event] = false
        })
        g.registerAction = (key,callback)=>{
            g.actions[key] = callback
        }
        //注册左方向键移动事件
        g.registerAction('37',function(){
            if(g.state === g.state_RUNNING&&paddle.isLeftMove){
                paddle.moveLeft()
            }
        })
        //注册右方向键移动事件
        g.registerAction('39',function(){
            if(g.state === g.state_RUNNING&&paddle.isRightMove){
                paddle.moveRight()
            }
        })
        window.addEventListener('keydown',function(event){
            switch(event){
                //注册空格键发送事件
                case 32:
                    //游戏刚结束上一关
                    if(g.state === g.state_GAMEOVER){
                        g.state = g.state_START
                        g.main.start()
                    }else{
                        //游戏正在运行
                        ball.fired = true
                        g.state = g.state_RUNNING
                    }
                    break
                //点击N键进入下一关卡
                case 78:
                    //游戏还未通关
                    if(g.state === g.state_UPDATE&&g.main.LV!==g.main.MAXLV){
                        g.state = g.state_START
                        g.main.start(++g.main.LV)
                    }
                    break
                //点击P暂停游戏事件
                case 80:
                    g.state = g.state_STOP
                    break
            }
        })
        //设置轮询定时器
        g.setTimer(paddle,ball,blockList,score)
    }
}