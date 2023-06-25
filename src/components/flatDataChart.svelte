<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';

	export let filteredDataForDisplay:HDB_Resale_Flat_Record[] = [];
    export let flatType: string;
	let myChart;
    let chartId:string;

    function refreshComponentData(){
        if (!chartId) chartId = `chart-${(Math.random() * 100000).toFixed(0)}`;
        // console.log(chartId)
        if (filteredDataForDisplay.length > 0){
            // console.log("herrrrdd",chartId)
            drawChart();
        }
    }

    function drawChart() {
		if (myChart) {
            myChart.destroy();
            console.warn("destroyed")
            // myChart.update();
            // return;
        }
        // console.log(filteredDataForDisplay)
		const ctx = document.getElementById(chartId);
		let chartObj = {
			type: 'line',
			data: {
				labels: getLabels(filteredDataForDisplay),
				datasets: generateDatasetFilteredByFlatType()
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: false
					}
				}
			}
		};
		myChart = new Chart(ctx, chartObj);
	}

    function getLabels(list:HDB_Resale_Flat_Record[]) {
		return [...new Set(list.map((item) => item.month))];
	}
    function getFlatType(list:HDB_Resale_Flat_Record[]) {
		return [...new Set(list.map((item) => item.flat_type))];
	}

    function sortDataByMonth(a, b) {
		return getDateObj(a.month).getTime() - getDateObj(b.month).getTime();
		function getDateObj(monthYearString: string) {
			const [year, month] = monthYearString.split('-');
			return new Date(`${year}-${month}-01`);
		}
	}

    function generateDatasetFilteredByFlatType() {
		let chartLabels = getLabels(filteredDataForDisplay);
		// get distinct flat types
		// let flatTypes = [...new Set(data.map((item) => item.flat_type))];
        let flatTypes = getFlatType(filteredDataForDisplay);
		// if (flatType !== 'All') flatTypes = [flatType];
		// filter data by each flat type
		const ds = flatTypes.map((flatType) => {
			const filteredData = filteredDataForDisplay
				.filter((item) => item.flat_type === flatType)
				.sort(sortDataByMonth);
			return {
				flatType: flatType,
				data: filteredData.map((item) => item.resale_price),
				temp: filteredData.map((item) => item.month)
			};
		});
        // console.log(ds);
		let dses = {};
		for (let ds_ of ds) {
			// combine data and temp into a map
			let map = new Map();
			for (let i = 0; i < ds_.data.length; i++) {
				if (map.has(ds_.temp[i])) {
					let val = map.get(ds_.temp[i]).val;
					let count = map.get(ds_.temp[i]).count;
					map.set(ds_.temp[i], {
						count: count + 1,
						val: parseFloat(val) + parseFloat(ds_.data[i])
					});
				} else map.set(ds_.temp[i], { count: 1, val: parseFloat(ds_.data[i]) });
			}
			dses[ds_.flatType] = { map: map };
		}
		// console.log(dses);
		for (let flatType of flatTypes) {
			let arr = [];
			for (let label of chartLabels) {
				let temp_val = dses[flatType].map.get(label) ?? null;
				if (temp_val != null) {
					arr.push(temp_val.val / temp_val.count);
				} else {
					arr.push(null);
				}
			}
			dses[flatType].data = arr;
		}

		const datasets = flatTypes.map((flatType) => {
			const filteredData = filteredDataForDisplay
				.filter((item) => item.flat_type === flatType)
				.sort(sortDataByMonth);
			return {
				label: flatType,
				data: dses[flatType].data,
				spanGaps: true,
				borderWidth: 1
			};
		});
        // console.log(datasets)
		return datasets;
	}

    onMount(refreshComponentData);
	afterUpdate(refreshComponentData);

</script>

<canvas id="{chartId}" />