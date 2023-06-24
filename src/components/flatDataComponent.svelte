<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';
	export let flatType: string;
	export let data: HDB_Resale_Flat_Record[];

	let myChart;
	let tableData = [];

    // console.log = function() {}

	function refreshComponentData() {
		tableData = loadData();
		drawChart();
	}

	function formatDate(monthYearString: string) {
		const [year, month] = monthYearString.split('-');
		// change 01 to Jan, 02 to Feb, etc.
		const monthString = new Date(`${year}-${month}-01`).toLocaleString('en-us', {
			month: 'short',
			year: 'numeric'
		});
		return monthString;
	}

	function getLabels() {
		return [...new Set(tableData.map((item) => item.month))];
	}

	function generateDatasetFilteredByFlatType() {
		let chartLabels = getLabels();
		// get distinct flat types
		let flatTypes = [...new Set(data.map((item) => item.flat_type))];
		if (flatType !== 'All') flatTypes = [flatType];
		// filter data by each flat type
		const ds = flatTypes.map((flatType) => {
			const filteredData = tableData
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
			// console.log(ds_);
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
				// arr.push(dses[flatType].map.get(label) ?? null);
			}
			// console.log(arr);
			dses[flatType].data = arr;
		}
		// console.log(dses);

		const datasets = flatTypes.map((flatType) => {
			// console.log(dses[flatType].data);
			const filteredData = tableData
				.filter((item) => item.flat_type === flatType)
				.sort(sortDataByMonth);
			return {
				label: flatType,
				data: dses[flatType].data,
				spanGaps: true,
				// temp: filteredData.map((item) => item.month),

				// backgroundColor: ['rgba(255, 99, 132, 0.2)'],
				// borderColor: ['rgba(255, 99, 132, 1)'],
				borderWidth: 1
			};
		});
		// console.log(datasets);
		return datasets;
	}

	function filterData(flatType, filteredData) {
		return filteredData.map((item) => {
			// console.log(flatType, item);
			return item.resale_price;
		});
	}

	function drawChart() {
		if (myChart) myChart.destroy();
		const ctx = document.getElementById('myChart');
		let chartObj = {
			type: 'line',
			data: {
				labels: getLabels(),
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

	function loadData() {
		if (flatType !== 'All')
			return data.filter((item) => item.flat_type === flatType).sort(sortDataByMonth);
		else return data.sort(sortDataByMonth);
	}

	function sortDataByMonth(a, b) {
		return getDateObj(a.month).getTime() - getDateObj(b.month).getTime();
		function getDateObj(monthYearString: string) {
			const [year, month] = monthYearString.split('-');
			return new Date(`${year}-${month}-01`);
		}
	}
	onMount(drawChart);
	afterUpdate(refreshComponentData);
</script>

<div style="height:300px">
	<canvas id="myChart" />
</div>
<h2>{flatType} Table</h2>
<div class="table-responsive small">
	<table class="table table-striped table-sm">
		<thead>
			<tr>
				<th scope="col">Block</th>
				<th scope="col">Flat Model</th>
				<th scope="col">Flat Type</th>
				<th scope="col">Floor Area (sqm)</th>
				<th scope="col">Lease Commence Date</th>
				<th scope="col">Month</th>
				<th scope="col">Remaining Lease</th>
				<th scope="col">Resale Price</th>
				<th scope="col">Storey Range</th>
				<th scope="col">Street Name</th>
				<th scope="col">Town</th>
			</tr>
		</thead>
		<tbody>
			{#each tableData as item}
				<tr>
					<td>{item.block}</td>
					<td>{item.flat_model}</td>
					<td>{item.flat_type}</td>
					<td>{item.floor_area_sqm}</td>
					<td>{item.lease_commence_date}</td>
					<td>{formatDate(item.month)}</td>
					<td>{item.remaining_lease}</td>
					<td>{item.resale_price}</td>
					<td>{item.storey_range}</td>
					<td>{item.street_name}</td>
					<td>{item.town}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
