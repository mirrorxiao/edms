<template>
    <HeaderMenu>
    <div class="main-content">
        <Breadcrumb>
            <BreadcrumbItem to="/">电梯总览</BreadcrumbItem>
            <BreadcrumbItem>{{elvAddress}}</BreadcrumbItem>
        </Breadcrumb>
       <EleTabs></EleTabs>

       <div>
           <Row class="event-header">
               <Col span="3">
               电梯注册码
               </Col>
                <Col span="3">
               最近事件
               </Col>
                <Col span="3">
               事件级别
               </Col>
                <Col span="3">
               是否故障
               </Col>
                <Col span="3">
               发生时间
               </Col>
                <Col span="3">
               当前楼层
               </Col>
                <Col span="6">
               运行状态
               </Col>
           </Row>
            <Row class="event-info">
               <Col span="3" class="col">
               {{registerCode}}
               </Col>
                <Col span="3" class="col">
               {{eventName}}
               </Col>
                <Col span="3" class="col">
               {{
                   formatEventLevel(eventLevel)
               }}
               </Col>
                <Col span="3" class="col">
               {{
                   eventLevel==3?'是':'否'
               }}
               </Col>
                <Col span="3" class="col">
               {{eventTime}}
               </Col>
                <Col span="3" class="col">
               {{this.runningState.curFloor}}
               </Col>
                <Col span="6" class="col">
                    <Tooltip :content="runningTips">
                        <span class="icon" :class="runningCls"></span>
                    </Tooltip>
                    <Tooltip :content="doorTips">
                        <span class="icon" :class="doorCls"></span>
                    </Tooltip>
                    <Tooltip :content="onlineTips">
                        <span class="icon" :class="onlineCls"></span>
                    </Tooltip>
                    <Tooltip :content="alarmTips">
                        <span class="icon" :class="alarmCls"></span>
                    </Tooltip>
                    <Tooltip :content="overloadTips">
                        <span class="icon" :class="overloadCls"></span>
                    </Tooltip>
               </Col>
           </Row>

           <Row class="elevator-info">
                <Col span="12">
                <h3>电梯基本信息</h3>
                    <dl class="info-line">
                        <dt>电梯品牌</dt>
                        <dd>{{elvBrand || '--'}}</dd>
                        <dt>电梯类型</dt>
                        <dd>{{elvType || '--'}}</dd>
                        <dt>电梯型号</dt>
                        <dd>{{ppxh || '--'}}</dd>
                        <dt>层数</dt>
                        <dd>{{elvFloor || '--'}}</dd>
                        <dt>站数</dt>
                        <dd>{{elvStation || '--'}}</dd>
                        <dt>载重量</dt>
                        <dd>{{elvRatedload || '--'}}</dd>
                        <dt>载定速度</dt>
                        <dd>{{elvRatedspeed || '--'}}</dd>
                        <dt>安装地址</dt>
                        <dd>{{elvAddress || '--'}}</dd>
                        <dt>安装日期</dt>
                        <dd>{{ '' || '--'}}</dd>
                    </dl>

                    <h3>使用单位</h3>

                    <dl class="info-line">
                        <dt>使用单位</dt>
                        <dd>{{elvPropertyCompany|| '--'}}</dd>
                        <dt>管理负责人</dt>
                        <dd>{{elvPsecurity|| '--'}}</dd>
                        <dt>负责人电话</dt>
                        <dd>{{elvPsecurityTel|| '--'}}</dd>
                        <dt>安全管理员</dt>
                        <dd>--</dd>
                        <dt>安全管理员电话</dt>
                        <dd>--</dd>
                    </dl>

                </Col>
                <Col span="12">
                    <h3>维保单位</h3>
                    <dl class="info-line">
                        <dt>维保单位</dt>
                        <dd>{{elvMaintenanCompany || '--'}}</dd>
                        <dt>责任人</dt>
                        <dd>--</dd> 
                        <dt>责任人电话</dt>
                        <dd>--</dd>
                        <dt>维保人员</dt>
                        <dd>{{elvMpersonnel|| '--'}}</dd>
                    </dl>
                </Col>
            </Row>

            <div class="map" id="detailmap"></div>
       </div>
       </div>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu';
    import EleTabs from '../components/elevator/tabs.vue';
    export default {
        components: {
            EleTabs,
            HeaderMenu,
        },
        data () {
            return {
                ws: null,
                columns: [],
                baseInfo: [],

                registerCode: '',
                elvAddress: '',
                elvBrand: '',
                elvType: '',
                ppxh: '',
                elvFloor: '',
                elvStation: '',
                elvRatedload: '',
                elvRatedspeed: '',
                elvPropertyCompany: '',
                elvPsecurity: '',
                elvPsecurityTel: '',
                elvMcompanyTel: '',
                elvMaintenanCompany: '',
                elvMcompanyTel: '',
                elvMpersonnel: '',
                elvMpersonnelTel: '',
                longitude: '',
                latitude: '',
                runningState: {},

                eventId: "",
                eventName: "",
                eventLevel: 1,
                eventTime: "",
                eventStatus: "",
                deviceSnCode: "",
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            runningCls() {
                const clses = ['stop', 'up', 'down'];
                return { [clses[this.runningState.running]]: true};
            },
            doorCls() {
                const clses = ['close', 'open'];
                return { [clses[this.runningState.door]]: true};
            },
            onlineCls() {
                const clses = ['offline', 'online'];
                return { [clses[this.runningState.online]]: true};
            },
            alarmCls() {
                const clses = ['non-alarm', 'alarm'];
                return { [clses[this.runningState.alarm]]: true};
            },
            overloadCls() {
                const clses = ['non-overload', 'overload', 'en-overload'];
                return { [clses[this.runningState.overload]]: true};
            },

            runningTips() {
                const clses = ['停止', '上行', '下行'];
                return clses[this.runningState.running];
            },
            doorTips() {
                const clses = ['关门', '开门'];
                return clses[this.runningState.door];
            },
            onlineTips() {
                const clses = ['离线', '在线'];
                return clses[this.runningState.online];
            },
            alarmTips() {
                const clses = ['无警告', '警告'];
                return clses[this.runningState.alarm];
            },
            overloadTips() {
                const clses = ['负载正常', '满载', '超载'];
                return clses[this.runningState.overload];
            },
        },
        destroyed() {
            this.ws && this.ws.close();
        },
        methods: {
            formatEventLevel(level) {
                const maps = ['', '一般', '异常', '故障'];
                return maps[+level] || '';
            },
            init() {
                this.$http.post(this.$url.ELEVATOR_DETAIL, {
                    registerCode: this.$route.params.id
                }).then((response) => {
                    const data = (response.data.data || []).eleInfo;
                    this.registerCode = data.registerCode;
                    this.elvAddress = data.elvAddress;
                    this.elvBrand=data.elvBrand ;
                    this.elvType=data.elvType ;
                    this.ppxh= data.ppxh;
                    this.elvFloor= data.elvFloor;
                    this.elvStation= data.elvStation;
                    this.elvRatedload= data.elvRatedload;
                    this.elvRatedspeed= data.elvRatedspeed;
                    this.elvPropertyCompany= data.elvPropertyCompany;
                    this.elvPsecurity= data.elvPsecurity;
                    this.elvPsecurityTel= data.elvPsecurityTel;
                    this.elvMcompanyTel= data.elvMcompanyTel;
                    this.elvMaintenanCompany= data.elvMaintenanCompany;
                    this.elvMcompanyTel= data.elvMcompanyTel;
                    this.elvMpersonnel=  data.elvMpersonnel;
                    this.elvMpersonnelTel= data.elvMpersonnelTel;
                    this.longitude= data.longitude;
                    this.latitude= data.latitude;
                    this.runningState = (response.data.data || []).runningState || {};

                    const eventInfo = (response.data.data || []).eventinfo || {};
                    this.eventId = eventInfo.eventId;
                    this.eventName = eventInfo.eventName;
                    this.eventLevel = eventInfo.eventLevel;
                    this.eventTime = eventInfo.eventTime;
                    this.eventStatus = eventInfo.eventStatus;
                    this.deviceSnCode = eventInfo.deviceSnCode;

                    this.createMap([this.longitude, this.latitude]);

                    if (!this.ws) {
                        this.fetch();
                    }
                });
            },
            createMap(location) {
                var amap = new AMap.Map('detailmap',{
                    zoom: 20,  //设置地图显示的缩放级别
                    center: location,//设置地图中心点坐标
                    mapStyle: 'amap://styles/grey',  //设置地图的显示样式
                    viewMode: '2D',  //设置地图模式
                    lang:'zh_cn',  //设置地图语言类型
                });

                var marker = new AMap.Marker({
                    position: new AMap.LngLat(location[0], location[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    //title: '北京'
                });
                amap.add(marker);
            },
            fetch() {
                const self = this;
                //websocket更新
                const ws = this.ws = new WebSocket(this.$url.ws_base + this.$url.ws_elevator_detail);
                ws.onopen = function () {
                    // 使用 send() 方法发送数据
                    ws.send(JSON.stringify({
                        type: 'init',
                        version: 1,
                        data: [self.runningState.deviceSnCode],
                    }));
                };
                
                // 接收服务端数据时触发事件
                ws.onmessage = function (evt) {
                    let msg;
                    try {
                        msg = JSON.parse(evt.data);
                    } catch(e) {
                        console.log('parse data to json obj error');
                    }
                    console.log(evt);
                    if (msg) {
                        self.updateStatus(msg.data);
                    }
                };
                
                // 断开 web socket 连接成功触发事件
                ws.onclose = function () {
                };
            },
            updateStatus(data) {console.log(data);
                this.runningState = data;
            }
        }
        
    }
</script>
<style scoped>
.main-content{
    padding: 30px;
}
h3{
    font-size: 16px;
    margin-bottom: 20px;
}
.icon{
    font-family: 'icomoon' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    margin: 6px;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
}

.up::before{
    content: "\e90b";
    color: #36ccad;
}
.down::before{
    content: "\e902";
    color: #36ccad;
}
.stop::before{
    content: "\e90a";
    color: #777;
}
.overload::before{
    content: "\e909";
    color: #f96;
}
.non-overload::before{    
    content: "\e905";
    color: #36ccad;
}
.en-overload::before{
    content: "\e903";
    color: #ff4c4c;
}
.open::before{
    content: "\e908";
    color: #3dcca6;
}
.close::before{
    content: "\e901";
    color: #777;
}
.non-alarm::before{
    content: "\e904";
  color: #777;
}
.alarm::before{
content: "\e900";
  color: #ff4c4c;
}
.offline::before{
content: "\e906";  
color: #777;
}
.online::before{
content: "\e907";
  color: #3dcca6;
}


.elevator-info{
    float: left;
    width: 750px;
    padding: 20px 20px 0;
    border: 1px solid #eee;
    box-shadow: 0 0 1px 1px #eee;
}
.map{
    min-width: 430px;
    margin-left: 770px;
    height: 590px;
    background: #eee;
    border: 1px solid #eee;
    box-shadow: 0 0 1px 1px #eee;
}

.event-header div{
    padding: 10px 0;
    background: #eee;
    border: 1px solid #fff;
    text-align: center;
}
.event-info {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}
.event-info .col{
    padding: 10px 0;
    border: 1px solid #fff;
    text-align: center;
}

</style>
