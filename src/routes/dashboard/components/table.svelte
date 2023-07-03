<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import type { HDB_Resale_Flat_Record } from 'src/models/record';
    import Utils  from '../../../common/utils';

    export let data:HDB_Resale_Flat_Record[];
    let filteredData:HDB_Resale_Flat_Record[] = [];
	let filteredDataTop100:HDB_Resale_Flat_Record[] = [];

    export let block:any = "";
    export let flatType:any = "";
	export let leaseCommenceDate_After:any = "";
	export let leaseCommenceDate_Before:string = '';
	export let showAfterYear:string = '';

	export let town:string = '';

    function refreshComponentData(){
        filteredData = Utils.filterResaleFlatData(data,block,flatType,leaseCommenceDate_After,leaseCommenceDate_Before,showAfterYear,town)
		filteredData.sort(Utils.sortDataByMonth_Reverse);
        // get top 100
		filteredDataTop100 = filteredData.slice(0,100);
    }

	function formatCurrency(value:string){
		return parseInt(value).toLocaleString('en-US');
	}

    onMount(refreshComponentData);
	afterUpdate(refreshComponentData);
</script>
<h3>Transaction Count: {filteredData.length}</h3>
<!-- <h2>{flatType} Table</h2> -->
<div class="table-responsive small">
	<table class="table table-striped table-sm">
		<thead>
			<tr>
				<th scope="col">Town</th>
				<th scope="col">Block</th>
				<th scope="col">Street Name</th>
				<th scope="col">Flat Model</th>
				<th scope="col">Flat Type</th>
				<th scope="col">Floor Area (sqm)</th>
				<th scope="col">TOP</th>
				<th scope="col">Month</th>
				<th scope="col">Remaining Lease</th>
				<th scope="col">Resale Price</th>
				<th scope="col">Storey Range</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredDataTop100 as item}
				<tr>
					<td>{item.town}</td>
					<td>{item.block}</td>
					<td>{item.street_name}</td>
					<td>{item.flat_model}</td>
					<td>{item.flat_type}</td>
					<td>{item.floor_area_sqm}</td>
					<td>{item.lease_commence_date}</td>
					<td>{Utils.formatDate(item.month)}</td>
					<td>{item.remaining_lease}</td>
					<td>${formatCurrency(item.resale_price)}</td>
					<td>{item.storey_range}</td>
				</tr>
			{/each}
		</tbody>
	</table>
    </div>