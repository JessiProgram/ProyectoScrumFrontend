<template>
    <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
        :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width"
        :height="height" />
</template>
  
<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
)

export default {
    name: 'LineChart',
    components: {
        LineChartGenerator
    },
    props: {
        dataX: {
            type: Array,
        },
        dataY: {
            type: Array,
        },
        chartId: {
            type: String,
            default: 'line-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => { }
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            chartData: {},
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
        
    },
    mounted(){
        console.log('this.dataX',this.dataX)
        console.log('this.dataY',this.dataY)
        this.chartData = {
            labels: this.dataX,
            datasets: [
                {
                    label: 'Puntos de historia',
                    backgroundColor: 'green',
                    data: this.dataY,
                    borderColor: 'green',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15
                }
            ]
        }
    }
    
}
</script>
  