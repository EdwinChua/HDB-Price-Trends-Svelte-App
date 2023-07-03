<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import type { HDB_Resale_Flat_Record } from 'src/models/record';
	import Utils from '../../../common/utils';

	export let data: HDB_Resale_Flat_Record[] = [];
	export let filteredData: HDB_Resale_Flat_Record[] = [];
	export let flatType: string = '';
	export let block: string = '';
	export let leaseCommenceDate_After: string = '';
	export let leaseCommenceDate_Before:string = '';

	export let showAfterYear:string = '';
	export let town:string = '';
	let myChart;
	let chartId: string;

	function refreshComponentData() {
		filteredData = Utils.filterResaleFlatData(data,block,flatType,leaseCommenceDate_After,leaseCommenceDate_Before,showAfterYear,town).sort(
			Utils.sortDataByMonth
		);
		setTimeout(() => {
			if (!chartId) chartId = `chart-${(Math.random() * 100000).toFixed(0)}`;
			if (filteredData.length > 0) {
				drawChart();
			} else {
				if (myChart) {
					myChart.destroy();
				}
			}
		}, 100);
	}

	function drawChart() {
		if (myChart) {
			myChart.destroy();
		}
		const ctx = document.getElementById(chartId);
		let chartObj = {
			type: 'line',
			data: {
				labels: getLabels(filteredData),
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

		myChart = new Chart(chartId, chartObj);
	}

	function getLabels_Original(list: HDB_Resale_Flat_Record[]) {
		let labels = [...new Set(list.map((item) => item.month))];
		return labels;
	}

	function getLabels(list: HDB_Resale_Flat_Record[]) {
		let labels = [...new Set(list.map((item) => item.month))];
		// fill in missing months until current month
		// get current month and year
		let currentMonth = new Date().getMonth() + 1;
		let currentYear = new Date().getFullYear();

		if (labels.length === 0) return labels;
		const [startYear, startMonth] = labels[0].split('-');
		// const [endYear, endMonth] = labels[labels.length - 1].split('-');
		const [endYear, endMonth] = [currentYear, currentMonth];
		let newLabels = [];
		for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
			let endMonth_ = year === parseInt(endYear) ? parseInt(endMonth) : 12;
			let startMonth_ = year === parseInt(startYear) ? parseInt(startMonth) : 1;
			for (let month = startMonth_; month <= endMonth_; month++) {
				newLabels.push(`${year}-${month.toString().padStart(2, '0')}`);
			}
		}
		return newLabels;
	}
	function getFlatType(list: HDB_Resale_Flat_Record[]) {
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
		let chartLabels = getLabels(filteredData);
		// get distinct flat types
		// let flatTypes = [...new Set(data.map((item) => item.flat_type))];
		let flatTypes = getFlatType(filteredData);
		// if (flatType !== 'All') flatTypes = [flatType];
		// filter data by each flat type
		const ds = flatTypes.map((flatType) => {
			const filteredData2 = filteredData
				.filter((item) => item.flat_type === flatType)
				.sort(sortDataByMonth);
			return {
				flatType: flatType,
				data: filteredData2.map((item) => item.resale_price),
				temp: filteredData2.map((item) => item.month)
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
			const filteredData2 = filteredData
				.filter((item) => item.flat_type === flatType)
				.sort(sortDataByMonth);
			return {
				label: flatType,
				data: dses[flatType].data,
				spanGaps: true,
				borderWidth: 1,

				trendlineLinear: dses[flatType].data.filter(item => item != null).length > 1 && {
					colorMin: 'red',
					colorMax: 'green',
					lineStyle: 'dotted',
					width: 2,
					// projection: true
				}
			};
		});
		// console.log(datasets)
		return datasets;
	}

	onMount(refreshComponentData);
	afterUpdate(refreshComponentData);
</script>

<canvas id={chartId} />
