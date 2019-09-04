<template>
    <HeaderMenu>
        <div class="map-container">
        <div id="map" @click="closeWindow"></div>
        <div class="type-cells">
            <CellGroup @on-click="select">
                <Cell :name="key" :title="group.name" :key="key" :selected="group.selected" v-for="(group, key) in types"/>
            </CellGroup>
        </div>

        <div class="statistics">
            <p><span>全部电梯：</span><span>{{allCount}}</span><span>台</span></p>
            <br>
            <p><span>在线电梯：</span><span>{{onlineCount}}</span><span>台</span></p>
            <p><span>离线电梯：</span><span>{{offlineCount}}</span><span>台</span></p>
            <br>
            <br>
            <p style="color:#3ecb9f;"><span>正常电梯：</span><span>{{normalCount}}</span><span>台</span></p>
            <p style="color:#fe936b;"><span>异常电梯：</span><span>{{incidentCount}}</span><span>台</span></p>
            <p style="color:#ff4c4c;"><span>故障电梯：</span><span>{{badCount}}</span><span>台</span></p>
        </div>

        <div class="operation" v-show="!searchBarOpened">
            <Tooltip content="搜索">
                <Icon type="ios-search" class="btn" @click="searchBarOpened=true"></Icon>
            </Tooltip>
        
            <Tooltip content="全屏" v-show="!isFullScreen">
                <Icon type="md-expand" class="btn" @click="fullScreen"></Icon>
            </Tooltip>

            <Tooltip content="退出全屏" v-show="isFullScreen">
                <Icon type="md-power" class="btn" @click="shrink"></Icon>
            </Tooltip>
            
        </div>

        <Form ref="formInline" label-position="right" :class="{'search-opened': searchBarOpened}"
         :model="search" inline :label-width="70" class="search-bar ">
            <FormItem label="设备SN码" :label-width="80" prop="snCode">
                <Input type="text" v-model="search.snCode"></Input>
            </FormItem>
            <FormItem label="安装地址" prop="address">
                <Input type="text" v-model="search.address"></Input>
            </FormItem>
            <FormItem label="电梯注册码" :label-width="80" prop="registerCode">
                <Input type="text" v-model="search.registerCode"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="isSearching" @click="handleSearch()">查询</Button>
                <Button ghost @click="handleReset">重置</Button>
            </FormItem>

            <div class="btn">
                <Icon class="icon" type="ios-close" size="30" @click="searchBarOpened=false"></Icon>
            </div>
        </Form>
        </div>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    import { mapMutations } from 'vuex'

    const mutations = mapMutations(['fullScreen', 'shrink']);

    const statusMap = ['', '一般', '异常', '故障'];
    export default {
        data () {
            return {
                allCount: 0,
                onlineCount: 0,
                offlineCount: 0,
                elevatorData: {},

                normalCount: 0,
                incidentCount: 0,
                badCount: 0,
                current: 'all',
                map: null,
                infoWindow: null,
                layer: null,
                cluster: null,
                count: 0,
                search: {
                    snCode: '',
                    installer: '',
                    address: '',
                    registerCode: ''
                },
                isSearching: false,
                searchBarOpened: false,
                types: {
                    all: {
                        key: 'all',
                        name: '全部电梯',
                        selected: true,
                    }, 
                    online: {
                        key: 'online',
                        name: '在线电梯',
                        selected: false,
                    }, 
                    offline: {
                        key: 'offline',
                        name: '离线电梯',
                        selected: false,
                    },
                    accident: {
                        key: 'accident',
                        name: '故障电梯',
                        selected: false,
                    },
                },
            };
        },
        mounted () {
            this.initMap();
            this.getData();
            setInterval(() => {
                if (this.newData) {
                    this.newData = false;
                    this.rerenderMap(); 
                } 
            }, 800);
        },
        methods: {
            fullScreen: mutations.fullScreen,
            shrink: mutations.shrink,
            initMap () {
                const self = this;
                var amap = new AMap.Map('map',{
                    resizeEnable: true,
                    zoom: 10,  //设置地图显示的缩放级别
                    //center: [116.397428, 39.90923],//设置地图中心点坐标
                    mapStyle: 'amap://styles/grey',  //设置地图的显示样式
                    viewMode: '2D',  //设置地图模式
                    lang:'zh_cn',  //设置地图语言类型
                });

                const infoWindow = this.infoWindow = new AMap.InfoWindow();

                var opts = {
                    extensions: 'all',
                    subdistrict: 1,   //返回下一级行政区
                    showbiz:false  //最后一级返回街道信息
                };
                const district = new AMap.DistrictSearch(opts);
                const province = this.$store.state.user.province;
                const city = this.$store.state.user.city;
                const area = this.$store.state.user.area;

                let searchs = [], zoom = 4;
                if (area) {
                    searchs = [area, city, province];
                } else if (city) {
                    searchs = [city, province];
                } else if (province) {
                    searchs = [province];
                } else {
                    searchs = ['全国']
                }

                search(searchs.pop());

                function search(address) {
                    district.setExtensions('all');
                    district.search(address, function(status, result) {
                        if(status === 'complete'){

                            if (searchs.length > 0) {
                                const s = searchs.pop();
                                const one = ((result.districtList[0] || []).districtList || []).find(d => d.name == s);
                                if (one) {
                                    search(one.adcode);
                                } else {
                                    setLayer((result.districtList[0] || []));
                                }
                            } else {
                                setLayer((result.districtList[0] || []));                     
                            }
                        }
                    });
                }

                function setLayer(zone) {
                    amap.setCenter(zone.center);

                    var bounds = zone.boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            var polygon = new AMap.Polygon({
                                map: amap,
                                strokeWeight: 1,
                                strokeColor: '#0091ea',
                                fillColor: '#eee',
                                fillOpacity: 0.1,
                                path: bounds[i]
                            });
                            
                        }
                        amap.setFitView();//地图自适应
                    }

                    const map = Loca.create(amap);

                    const layer = self.layer = Loca.visualLayer({
                        eventSupport: true,
                        container: map,
                        // 指定数据类型
                        type: 'point',
                        // 展示形状
                        shape: 'circle'
                    });

                    // layer.setData([{
                    //     name: '北京市',
                    //     center: '114.088616,22.551412'
                    // }], {
                    //     lnglat: 'center'
                    // }); 
                    layer.setData([], {
                        lnglat: 'center'
                    });

                    layer.setOptions({
                        style: {
                            radius: 6,
                            //fill: '#4fc2ff',
                            fill: function(res) {
                                const eventLevel = res.value.eventLevel;
                                const onlineState = res.value.onlineState;

                                if (eventLevel == 3) {
                                    return 'red';
                                }
                                if (onlineState == 0) {
                                    return 'gray';
                                }
                                return '#3ecb9f';
                            },
                            lineWidth: 1,
                            stroke3: '#eeeeee',
                            opacity: 0.8
                        },
                        // 样式改变条件为 mouseenter 及 mouseleave，没有设置的属性会继承 style 中的配置
                        selectStyle: {
                            radius: 12,
                            fill: '#ffe30a',
                            lineWidth: 2,
                            stroke: '#ffffff',
                            opacity: 0.9,
                        }
                    });

                    layer.on('mouseenter', (e) => {
                        const rawData = e.rawData;
                        let state = '在线';
                        if (rawData.eventLevel == 3) {
                            state = '故障';
                        } else if (rawData.onlineState == 0) {
                            state = '离线';
                        }
                        infoWindow.setContent([
                            '<b>电梯注册码：</b>' + rawData.registerCode,
                            '<b>安装地址：</b>' + rawData.address,
                            '<b>状态：</b>' + state,
                            ].join('<br>'));
                        infoWindow.open(amap, rawData.center.split(','));
                        
                    });


                    layer.on('click', function(ev) {
                        var rawData = ev.rawData;
                        self.viewDetail(rawData);
                    });

                    layer.render();

                    self.initWs();
                }
            },
            closeWindow() {
                this.infoWindow && this.infoWindow.close();
            },
            getData () {
                this.$http.post(this.$url.ONLINE_NUM, {
                    userId: this.$store.state.user.id,
                }).then((response) => {
                    const data = response.data.data || [];
                    this.allCount = data.total || 0;
                    this.offlineCount = data.offlineElvNum || 0;
                    this.onlineCount = data.onlineElvNum || 0;
                });

                this.$http.post(this.$url.STATUS_NUM, {
                    userId: this.$store.state.user.id,
                }).then((response) => {
                    const data = response.data.data || [];
                    this.normalCount = data.common_event || 0;
                    this.incidentCount = data.unusual_event || 0;
                    this.badCount = data.breakdown_event || 0;
                });
            },
            viewDetail (point) {
                const id = point.registerCode || '';
                if (!id){
                    return;
                }
                this.$router.push({
                    path: `/elevators/${id}`
                });
            },
            select (name) {
                this.$set(this.types[this.current], 'selected', false);
                this.$set(this.types[name], 'selected', true);
                this.current = name;

                //get data by type
                this.handleSearch();
            }, 
            openSearchBar () {
                this.searchBarOpened = true;
            },
            initWs() {
                const self = this;
                //websocket更新
                const ws = this.ws = new WebSocket(this.$url.ws_base + this.$url.ws_elevator_map + '?userId=' + this.$store.state.user.id);
                ws.onopen = function () {
                // 使用 send() 方法发送数据
                };
                
                // 接收服务端数据时触发事件
                ws.onmessage = function (evt) {
                    let msg;
                    try {
                        msg = JSON.parse(evt.data);
                    } catch(e) {
                        console.error('parse data to json obj error');
                    }
                    if (msg) {
                        self.newData = true;
                        self.updateList(msg.data);
                    }
                };
                
                // 断开 web socket 连接成功触发事件
                ws.onclose = function () {
                };
            },
            updateList(data) {
                (data || []).forEach(d => {
                    const existMarker = (this.elevatorData[d.registerCode] || {}).marker;
                    const m = new AMap.Marker({
                        position: new AMap.LngLat((+d.longitude).toFixed(6), (+d.latitude).toFixed(6)),
                        content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                        offset: new AMap.Pixel(-15, -15)
                    });
                    this.elevatorData[d.registerCode] = {
                        center: `${(+d.longitude).toFixed(6)},${(+d.latitude).toFixed(6)}`,
                        longitude: (+d.longitude).toFixed(6),
                        latitude: (+d.latitude).toFixed(6),
                        registerCode: d.registerCode,
                        eventLevel: d.eventLevel,
                        address: d.address,
                        onlineState: d.onlineState,
                        sn: d.sn,
                    };

                    if (!this.layer) {
                        return;
                    }
                });
            },
            rerenderMap () {console.log('rendermap');
                this.layer.setData(this.filterData(), {
                    lnglat: 'center'
                });
                this.layer.render();
            },
            handleReset() {
                this.$refs.formInline.resetFields();
                this.handleSearch();
            },
            handleSearch() {
                if (!this.layer) {
                    return;
                }
                this.rerenderMap();
            },
            filterData() {
                const snCode = this.search.snCode;
                const installer = this.search.installer;
                const address = this.search.address;
                const registerCode = this.search.registerCode;
                const currentState = this.current;

                const d = Object.values(this.elevatorData).filter(d => {
                    let flag = true;
                    if (snCode && !(d.snCode || '').includes(snCode)) {
                        flag = false;
                    }
                    else if (address && !(d.address || '').includes(address)) {
                        flag = false;
                    }
                    else if (registerCode && !(d.registerCode || '').includes(registerCode)) {
                        flag = false;
                    }
                    else if (currentState == 'accident' && d.eventLevel != 3) {
                        flag = false;
                    }
                    else if ((currentState == 'online') && d.onlineState != 1) {
                        flag = false;
                    }
                    else if ((currentState == 'offline') && d.onlineState != 0) {
                        flag = false;
                    }
                    return flag;
                }); 
                return d;
            }

        },
        computed: {
            isFullScreen () {
                return this.$store.state.isFullScreen;
            }
        },
        watch: {
        },
        components: {
            HeaderMenu,
        }
    }
</script>
<style scoped>
    .map-container{
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    #map{
        margin-top: -5%;
        height: 150%;
    }
    .type-cells{
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: #fff;
    }
    .statistics{
        position: absolute;
        padding: 20px 20px;
        bottom: 0;
        left: 0;
        width: 220px;
        color: #fff;
        background: #333;
        background-color: rgba(51, 51, 51, 0.9);
        text-align: center;
    }

    .statistics p span{
        line-height: 24px;
        font-size: 16px;
        font-weight: bold;
    }
    .operation {
        width: 80px;
        position: absolute;
        right: 20px;
        top: 20px;
        color: #fff;
        background-color: rgba(51, 51, 51, 0.9);
        text-align: center;
    }

    .operation .btn{
        margin: 5px 5px;
        cursor: pointer;
        font-size: 24px;
    }

    .operation .btn:hover{
        color: #54a1f3;
    }

    .search-bar {
        position: absolute;
        padding: 20px;
        width: 100%;
        left: 0;
        top:0;
        display: none;
        color: #fff;
        background: #333;
        background-color: rgba(51, 51, 51, 0.9);
        z-index: 1020;
    }
    .search-opened {
        display: block;
    }
    .search-bar .btn{
        position: relative;
    }
    .search-bar .btn .icon{
        position: absolute;
        cursor: pointer;
        right: -15px;
        top: -75px;
    }
    .search-bar .btn .icon:hover{
        color: #54a1f3;
    }
</style>
