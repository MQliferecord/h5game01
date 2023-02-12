class Paddle {
    constructor(_main) {
        let p = {
            x: _main.paddle_x,//x轴坐标
            y: _main.paddle_y,//y轴坐标
            w: 102,//图片宽度
            h: 22,//图片高度
            speed: 10,//x轴移动速度
            ballSpeedMax: 8,//小球反弹速度最大值
            image: imageFromPath(allImg.paddle),//引入图片对象
            isLeftMove: true,//能否左移
            isRightMove: true,//能否右移
        }
        Object.assign(this, p)
    }
    //左移
    moveLeft() {
        this.x -= this.speed
    }
    //右移
    moveRight() {
        this.x -= this.speed
    }
    //小球，挡板碰撞检测
    collide(ball) {
        let b = ball
        let p = this
        //获取挡板中心
        let p_vec = new Vector(p.x + p.w / 2, p.y + p.h / 2)
        //获取球圆心
        let b_vec = new Vector(b.x + b.w / 2, b.y + b.h / 2)
        //获得球半径的向量
        let b_r = b_vec - new Vector(b.x, b.y + b.h / 2)
        //获得两中心指向的向量
        let v = p_vec - b_vec
        if (b.x + b.w / 2 > p.x + p.w / 2) {
            //如果球在挡板的右上方
            let h = new Vector(p.x + p.w, p.y)
            //获得球和挡板的最小距离的向量
            let u = v - h
            //如果小于等于半径则发生碰撞
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                return true
            }
            return false
        } else {
            //如果球在挡板的左上方
            let h = new Vector(p.x, p.y)
            let u = v - h
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                return true
            }
            return false
        }
    }
    //计算小球，挡板碰撞后x轴速度值
    collideRange(ball) {
        let b = ball
        let p = this
        return ((p.x + p.w / 2) - (b.x + b.w / 2)) / (p.w / 2 + b.w / 2) * p.ballSpeedMax
    }
}

class Ball {
    constructor(_main) {
        let b = {
            x: _main.ball_x,
            y: _main.ball_y,
            w: 18,
            h: 18,
            speedX: 1,
            speedY: 5,
            image: imageFromPath(allImg.ball),
            fired: false,//是否运动，默认静止不动
        }
        Object.assign(this, b)
    }
    //控制小球运动轨迹
    move(game) {
        if (this.fired) {
            //获取视图窗口宽度
            let winW = window.innerWidth
            //碰撞边际检测
            //碰撞到左右边界
            if (this.x < 0 || this.x > winW - this.w) {
                this.speedX *= -1
            }
            let winH = window.innerHeight
            //碰撞到上边界
            if (this.y < 0) {
                this.speed *= -1
            }
            //碰撞到下边界没有和挡板碰撞的情况下，游戏失败
            if (this.y > winH - this.h) {
                game.state = game.state_GAMEOVER
            }
            //移动
            this.x -= this.speedX
            this.y -= this.speedY
        }
    }
}

class Block {
    constructor(x, y, life = 1) {
        let bk = {
            x: x,
            y: y,
            w: 50,
            h: 20,
            image: life == 1 ? imageFromPath(allImg.block1) : imageFromPath(allImg.block2),
            life: life,//砖块血量
            alive: true,
        }
        Object.assign(this, bk)
    }
    //消除砖块
    kill() {
        this.life--
        if (this.life == 0) {
            this.alive = false
        } else if (this.life == 1) {
            this.image = imageFromPath(allImg.block1)
        }
    }
    //小球砖块碰撞检测
    collide(ball) {
        let b = ball
        //获取砖块中心
        let vec = new Vector(this.x + this.w / 2, this.y + this.h / 2)
        //获取球圆心
        let b_vec = new Vector(b.x + b.w / 2, b.y + b.h / 2)
        //获得球半径的向量
        let b_r = b_vec - new Vector(b.x, b.y + b.h / 2)
        //获得两中心指向的向量
        let v = vec - b_vec
        if (b.x + b.w / 2 > this.x + this.w / 2 && b.y + b.h / 2 < this.y + this.h / 2) {
            //如果球在挡板的右上方
            let h = new Vector(p.x + p.w, p.y)
            //获得球和挡板的最小距离的向量
            let u = v - h
            //如果小于等于半径则发生碰撞
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                this.kill()
                return true
            }
            return false
        } else if (b.x + b.w / 2 <= this.x + this.w / 2 && b.y + b.h / 2 < this.y + this.h / 2) {
            //如果球在挡板的左上方
            let h = new Vector(p.x, p.y)
            let u = v - h
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                this.kill()
                return true
            }
            return false
        } else if (b.x + b.w / 2 > this.x + this.w / 2 && b.y + b.h / 2 >= this.y + this.h / 2) {
            //如果球在挡板的右下方
            let h = new Vector(p.x + p.w, p.y + p.h)
            let u = v - h
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                this.kill()
                return true
            }
            return false
        } else {
            //如果球在挡板的左下方
            let h = new Vector(p.x, p.y + p.h)
            let u = v - h
            if (u.dotProduct(u) <= b_r.dotProduct(b_r)) {
                this.kill()
                return true
            }
            return false
        }

    }
    //计算小球，砖块碰撞后x轴速度方向
    collideBlockHorn(ball){
        let b = ball//小球
        let bk = this//砖块
        //获得砖块的圆心
        let vec = new Vector(bk.x + bk.w / 2, bk.y + bk.h / 2)
        //获取球圆心
        let b_vec = new Vector(b.x + b.w / 2, b.y + b.h / 2)
        //获得两中心指向的向量
        let v = vec - b_vec
        //x轴模为1的正向量
        let x_v = new Vector(1,0)
        //中心向量在x轴的投影
        let v_x = v.projectOn(x_v)
        //中心向量x方向的长度
        let v_x_len = Math.sqrt(v_x.dotProduct(v_x))
        if(v_x_len>bk.w / 2&&v_x.dotProduct(x_v)>0){
            //球和砖块左边以及四角的左边两个，x轴速度方向取反
            return false
        }else if(v_x_len>bk.w / 2&&v_x.dotProduct(x_v)<0){
            //球和砖块右边以及四角的右边两个，x轴速度方向取反
            return false
        }
        return true       
    }
}

class Score {
    constructor(_main) {
        let s = {
            x: _main.score_x,
            y: _main.score_y,
            text: '分数：',
            textLv: '关卡：',
            score: 200,//每个砖块对应的分数
            allScore: 0,//总分
            blockList: _main.blockList,//砖块对象集合
            blockListLen: _main.blockList.length,//砖块总数量
            lv: _main.LV//当前关卡
        }
        Object.assign(this, s)
    }
    //计算总分
    computeScore() {
        let num = 0
        let allNum = this.blockListLen
        num = allNum - this.blockList.length
        this.allScore = this.score * num
    }
}

class Scene {
    constructor(lv) {
        let s = {
            lv: lv,
            canvas: document.getElementById("canvas"),
            blockList: []
        }
        Object.assign(this, s)
    }
    //实例化所有的砖块对象
    initBlockList() {
        this.createBlockList()
        let arr = []
        console.log(this.blockList.length)
        for (let item of this.blockList) {
            for (let list of item) {
                if (list.type === 1) {
                    let obj = new Block(list.x, list.y)
                    arr.push(obj)
                } else if (list.type === 2) {
                    let obj = new Block(list.x, list.y, 2)
                    arr.push(obj)
                }
            }
        }
        console.log(arr)
        return arr
    }
    //创建砖块坐标二维数组，并生成不同的关卡
    createBlockList() {
        let lv = this.lv,//关卡个数
            c_w = this.canvas.width,
            c_h = this.canvas.height,
            xNum_max = c_w / 50,//x轴砖块的最大数量
            yNum_max = 12,//y轴砖块的最大数量
            x_start = 0,//x轴起始坐标
            y_start = 60//y轴起始坐标

        switch (lv) {
            case 1://第一关 砖块按照正三角形排列
                let xNum01 = 16, yNum01 = 9 //砖块层数
                //循环y轴
                for (let i = 0; i < yNum01; i++) {
                    let arr = []
                    if (i === 0) {
                        xNum01 = 1
                    } else if (i === 1) {
                        xNum01 = 2
                    } else {
                        xNum01 += 2
                    }
                    //每层砖块的起始位置
                    x_start = (xNum_max - xNum01) / 2 * 50
                    //修改x轴
                    for (let k = 0; k < xNum01; k++) {
                        if (i < 3) {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 2,
                            })
                        } else {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 1,
                            })
                        }
                    }
                    this.blockList.push(arr)
                }
                break
            case 2:
                //第二关 倒三角
                let xNum02 = 16, yNum02 = 9
                //循环y轴
                for (let i = 0; i < yNum02; i++) {
                    let arr = []
                    if (i === yNum02 - 1) {
                        xNum02 = 1
                    } else if (i === 0) {
                        xNum02 = xNum02
                    } else {
                        xNum02 -= 2
                    }
                    //每层砖块的起始位置
                    x_start = (xNum_max - xNum02) / 2 * 50
                    //修改x轴
                    for (let k = 0; k < xNum02; k++) {
                        if (i < 3) {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 2,
                            })
                        } else {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 1,
                            })
                        }
                    }
                    this.blockList.push(arr)
                }
                break
            case 3:
                //第三关 工字形
                //第二关 倒三角
                let xNum03 = 16, yNum03 = 9
                //循环y轴
                for (let i = 0; i < yNum03; i++) {
                    let arr = []
                    if (i === 0) {
                        xNum03 = xNum03
                    } else if (i > 4) {
                        xNum03 += 2
                    } else {
                        xNum03 -= 2
                    }
                    //每层砖块的起始位置
                    x_start = (xNum_max - xNum03) / 2 * 50
                    //修改x轴
                    for (let k = 0; k < xNum03; k++) {
                        if (i < 3) {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 2,
                            })
                        } else {
                            arr.push({
                                x: x_start + k * 50,
                                y: y_start + i * 20,
                                type: 1,
                            })
                        }
                    }
                    this.blockList.push(arr)
                }
                break
        }
    }
}


