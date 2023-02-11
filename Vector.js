class Vector{
    constructor(...components){
        this.components = components
    }
    //加法
    add({components}){
        return new Vector(
            ...components.map((component,index)=>this.components[index]+component)
            )
    }
    //减法
    subtract({components}){
        return new Vector(
            ...components.map((component,index)=>this.components[index]-component)
        )
    }
    //缩放
    scaleBy(number){
        return new Vector(
            ...this.components.map(component=>component*number)
        )
    }
    //长度
    length(){
        return Math.hypot(...this.components)
    }
    //点积
    dotProduct({components}){
        return components.reduce((acc,component,index)=>acc+component*this.components[index],0)
    }
}
