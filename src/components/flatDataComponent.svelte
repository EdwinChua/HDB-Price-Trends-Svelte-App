<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';
	import FlatDataChart from './flatDataChart.svelte';

	export let flatType: string;
	export let data: HDB_Resale_Flat_Record[];

	let filteredDataForDisplay = [];
	let filteredDataForDisplayReverse = [];
	let blockInput: string = '';

	function refreshComponentData() {
		filteredDataForDisplay = loadData().map(item => item).sort(sortDataByMonth);
		console.log(filteredDataForDisplay)
		filteredDataForDisplayReverse = loadData().map(item => item).sort(sortDataByMonthReverse);
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

	function loadData() {
		let res;
		if (flatType !== 'All')
			res = data.filter((item) => item.flat_type === flatType).sort(sortDataByMonth);
		else res = data.sort(sortDataByMonth);
		// console.log("LLL",res);
		return res;
	}

	function sortDataByMonth(a, b) {
		return getDateObj(a.month).getTime() - getDateObj(b.month).getTime();
	}
	function sortDataByMonthReverse(a, b) {
		return getDateObj(b.month).getTime() - getDateObj(a.month).getTime();
	}
	function getDateObj(monthYearString: string) {
		const [year, month] = monthYearString.split('-');
		return new Date(`${year}-${month}-01`);
	}

	onMount(refreshComponentData);
	afterUpdate(refreshComponentData);
</script>

<div>
	<input type="text" bind:value={blockInput} />
</div>
<div style="height:300px">
	<!-- <canvas id="myChart" /> -->
	<FlatDataChart
		filteredDataForDisplay={(filteredDataForDisplay.filter( (item) => item.block.includes(blockInput) ))}
	/>
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
			{#each (filteredDataForDisplayReverse.filter( (item) => item.block.includes(blockInput) )) as item}
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
	<!-- TODO: Enable this block for correct sorting on chart -->
	<!-- <table class="table table-striped table-sm">
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
			{#each (blockInput == '' && filteredDataForDisplay.length > 0 ? filteredDataForDisplay : filteredDataForDisplay.filter( (item) => item.block.includes(blockInput) )).sort( sortDataByMonth) as item}
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
	</table> -->
</div>
