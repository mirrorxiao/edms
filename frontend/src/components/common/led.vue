<template>
    <div class="led">
        <span class="d1"></span>
        <span class="d2"></span>
        <span class="d3"></span>
        <span class="d4"></span>
        <span class="d5"></span>
        <span class="d6"></span>
        <span class="d7"></span>
    </div>
</template>
<script>
export default {
    
}
</script>

<style scoped>
    .led{
        text-align:left;
        position:relative;
        width: 8px;
        height:16px;
        display:inline-block;
        margin:0 1px;
    }
    .led span{
        background-color: red;
        border-color: red;
        opacity: 0;
        position: absolute;
        transition: 0.25s;
    }
    .led span::before, .led span::after{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 2px solid transparent;
    }
    .led .d1{			height:2px;width:4px;top:0;left:2px;}
    .led .d1:before{	border-width:0 2px 2px 0;border-right-color:inherit;left:-2px;}
    .led .d1:after{	border-width:0 0 2px 2px;border-left-color:inherit;right:-2px;}

    .led .d2{			height:2px;width:3px;top:6.5px;left:3px;}
    .led .d2:before{	border-width:1px 2px 1px;border-right-color:inherit;left:-4px;}
    .led .d2:after{	border-width:1px 2px 1px;border-left-color:inherit;right:-3px;}

    .led .d3{			height:2px;width:4px;top:14px;left:2px;}
    .led .d3:before{	border-width:2px 2px 0 0;border-right-color:inherit;left:-2px;}
    .led .d3:after{	border-width:2px 0 0 2px;border-left-color:inherit;right:-2px;}

    .led .d4{			width:2px;height:3px;top:3px;left:0;}
    .led .d4:before{	border-width:0 2px 2px 0;border-bottom-color:inherit;top:-2px;}
    .led .d4:after{	border-width:0 0 2px 2px;border-left-color:inherit;bottom:-2px;}

    .led .d5{			width:2px;height:3px;top:3px;right:0;}
    .led .d5:before{	border-width:0 0 2px 2px;border-bottom-color:inherit;top:-2px;}
    .led .d5:after{	border-width:2px 0 0 2px;border-top-color:inherit;bottom:-2px;}

    .led .d6{			width:2px;height:3px;top:10px;left:0;}
    .led .d6:before{	border-width:0 2px 2px 0;border-bottom-color:inherit;top:-2px;}
    .led .d6:after{	border-width:0 0 2px 2px;border-left-color:inherit;bottom:-2px;}

    .led .d7{			width:2px;height:3px;top:10px;right:0;}
    .led .d7:before{	border-width:0 0 2px 2px;border-bottom-color:inherit;top:-2px;}
    .led .d7:after{	border-width:2px 0 0 2px;border-top-color:inherit;bottom:-2px;}

    /* 1 */

.led.one .d5,
.led.one .d7{
	opacity:1;
}

/* 2 */

.led.two .d1,
.led.two .d5,
.led.two .d2,
.led.two .d6,
.led.two .d3{
	opacity:1;
}

/* 3 */

.led.three .d1,
.led.three .d5,
.led.three .d2,
.led.three .d7,
.led.three .d3{
	opacity:1;
}

/* 4 */

.led.four .d5,
.led.four .d2,
.led.four .d4,
.led.four .d7{
	opacity:1;
}

/* 5 */

.led.five .d1,
.led.five .d2,
.led.five .d4,
.led.five .d3,
.led.five .d7{
	opacity:1;
}

/* 6 */

.led.six .d1,
.led.six .d2,
.led.six .d4,
.led.six .d3,
.led.six .d6,
.led.six .d7{
	opacity:1;
}


/* 7 */

.led.seven .d1,
.led.seven .d5,
.led.seven .d7{
	opacity:1;
}

/* 8 */

.led.eight .d1,
.led.eight .d2,
.led.eight .d3,
.led.eight .d4,
.led.eight .d5,
.led.eight .d6,
.led.eight .d7{
	opacity:1;
}

/* 9 */

.led.nine .d1,
.led.nine .d2,
.led.nine .d3,
.led.nine .d4,
.led.nine .d5,
.led.nine .d7{
	opacity:1;
}

/* 0 */

.led.zero .d1,
.led.zero .d3,
.led.zero .d4,
.led.zero .d5,
.led.zero .d6,
.led.zero .d7{
	opacity:1;
}
</style>


