<template>
    <div>
        <Table stripe :columns="columns" :data="signalList"></Table>
    </div>
</template>

<script>
export default {
    data () {
        return {
             columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left',
                        renderHeader (h) {
                            return h('div', {
                                style: {
                                    height: '84px',
                                }
                            }, '编号');
                        }
                    },
                    //signal begin
                    {
                        title: '上平层',
                        key: 'eventLevel',
                        width: 50,
                        render (h, params) {
                            const l = params.row.upperLeve;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下平层',
                        key: 'eventLevel',
                        width: 50,
                        render (h, params) {
                            const l = params.row.lowerLevel;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '安全回路',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.securityControl;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '厅门锁',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lockDoor;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '运行信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.runningSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '抱闸信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lockSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '消防信息',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.fireSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上限位',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.upperLimitP;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下限位',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lowerLimitP;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上行减速',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.uplinkDeceleration;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下行减速',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.downlinkDeceleration;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '轿门锁',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lockSedandoor;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上极限',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.upperLimit;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下极限',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lowerLimit;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '机房检修',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.mInspection;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '光幕信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.lightSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '开门信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.openSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '关门信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.closedSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '开门到位',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.openPlace;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '关门到位',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.closedPlace;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '满载信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.fullySignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '超载信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.overloadSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '报警信号',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.warningSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '轿顶检修',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.elvOverhaul;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '司机运行',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.driverOperation;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '电梯电源',
                        key: 'eventLevel',
						width: 50,
                        render (h, params) {
                            const l = params.row.elvPower;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },

                ],
        }
    },
    props: {
        signalList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
}
</script>
