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
        dataYreal: {
            type: Array,
        },
        dataYideal: {
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
        console.log('this.dataY',this.dataYreal)
        console.log('this.dataY',this.dataYideal)
        this.chartData = {
            labels: this.dataX,
            datasets: [
                {
                    label: 'Puntos de historia actual',
                    backgroundColor: 'green',
                    data: this.dataYreal,
                    borderColor: 'green',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15
                },
                {
                    label: 'Puntos de historia ideal',
                    backgroundColor: 'blue',
                    data: this.dataYideal,
                    borderColor: 'blue',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15
                }
            ]
        }
    }
    
}
</script>
  