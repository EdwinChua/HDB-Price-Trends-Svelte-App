<script lang="ts">
	import { onMount } from 'svelte';
	import type { HDB_Resale_Flat_Record } from 'src/models/record';
	import Table from './components/table.svelte';
	import Chart from './components/flatDataChart.svelte';

	const maxApiCalls = 100;
	const maxResultsPerCall = 10000;
	const maxApiCallResults = maxApiCalls * maxResultsPerCall;
	let isLoading: boolean = false;
	let loadingResultCount: number = 0;
	let loadedCount: number = 0;
	let data: HDB_Resale_Flat_Record[] = []; // Variable to store the retrieved data
	let activeTab = 'All'; // Variable to store the active tab
	let baseApi = `https://data.gov.sg`;
	let query: string = 'SELEGIE RD';
	let distinctFlatTypes: string[] = [];
	let distinctBlocks: string[] = [];
	let distinctLeaseDates: string[] = [];

	let filter = {
		flatType: '',
		block: '',
		leaseCommenceDate: ''
	};

	async function refreshComponent() {
		await fetchData();
		await setActiveTab('All');
		distinctFlatTypes = getDistinctFlatTypes();
		distinctBlocks = getDistinctBlocks();
		distinctLeaseDates = getDistinctLeaseDates();

	}

	function submitForm() {
		refreshComponent();
	}

	async function fetchData() {
		isLoading = true;
		console.log(query);
		try {
			loadedCount = 0;
			const response = await fetch(
				`${baseApi}/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=${query}&limit=${maxResultsPerCall}`
			);
			const result = await response.json();
			let apiCallCount = 1;
			let data_temp = result.result.records as HDB_Resale_Flat_Record[];
			loadingResultCount = result.result.total;
			loadedCount = data_temp.length;
			// console.log(result.result.total)
			if (result.result._links.next && data_temp.length < result.result.total) {
				let result2 = result;
				while (
					result2.result._links.next &&
					data_temp.length < result2.result.total &&
					apiCallCount < maxApiCalls
				) {
					loadedCount = data_temp.length;

					const response2 = await fetch(`${baseApi}/${result2.result._links.next}`);
					result2 = await response2.json();
					apiCallCount++;
					data_temp = data_temp.concat(result2.result.records as HDB_Resale_Flat_Record[]);
				}
			}
			data = data_temp.filter((item) =>
				item.street_name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
			);
			console.log('LOAD DONE', data);
			console.log('LOAD DONE', data.length);
			isLoading = false;
		} catch (error) {
			console.error('Error fetching data:', error);
			isLoading = false;
		}
	}

	function getDistinctFlatTypes() {
		return [...new Set(data.map((item) => item.flat_type))].sort((a, b) => a.localeCompare(b));
	}

	function getDistinctBlocks() {
		return [...new Set(data.map((item) => item.block))].sort((a, b) => parseInt(a) - parseInt(b));
	}

	function getDistinctLeaseDates() {
		return [...new Set(data.map((item) => item.lease_commence_date))].sort(
			(a, b) => parseInt(a) - parseInt(b)
		);
	}
	function setActiveTab(tab) {
		activeTab = tab;
	}
	// Call the fetchData function when the component is mounted
	onMount(refreshComponent);
</script>

<form on:submit|preventDefault={submitForm}>
	<input type="text" bind:value={query} /><button type="submit">Search</button>
</form>
{#if isLoading}
	<div>Loading...</div>
	<div>
		{loadingResultCount} found. Loading {loadingResultCount > maxApiCalls * maxResultsPerCall
			? maxApiCalls * maxResultsPerCall
			: loadingResultCount} records
	</div>
	<!-- <div class="progress">
		<div
			class="progress-bar"
			role="progressbar"
			style="width:{(loadedCount / (loadingResultCount > 2000 ? 2000 : loadingResultCount)) * maxResultsPerCall}%"
			aria-valuenow={(loadedCount / (loadingResultCount > 2000 ? 2000 : loadingResultCount)) * maxResultsPerCall}
			aria-valuemin="0"
			aria-valuemax="100"
		/>
	</div> -->
{/if}

<div class="row g-3">
	<div class="col-sm-2">
		<select class="form-select" aria-label="Default select example" bind:value={filter.block}>
			<option selected value="">All Blocks</option>
			{#each distinctBlocks as block}
				<option value={block}>{block}</option>
			{/each}
		</select>
	</div>
	<div class="col-sm-2">
		<select class="form-select" aria-label="Default select example" bind:value={filter.flatType}>
			<option selected value="">All Flat Types</option>
			{#each distinctFlatTypes as flatType}
				<option value={flatType}>{flatType}</option>
			{/each}
		</select>
	</div>
	<div class="col-sm-2">
		<select
			class="form-select"
			aria-label="Default select example"
			bind:value={filter.leaseCommenceDate}
		>
			<option selected value="">All Lease Commencement Years</option>
			{#each distinctLeaseDates as leaseDate}
				<option value={leaseDate}>On or after {leaseDate}</option>
			{/each}
		</select>
	</div>
	<div class="col-sm">
		<!-- <input type="text" class="form-control" placeholder="Zip" aria-label="Zip" /> -->
	</div>
</div>

<div class="container-fluid">
	<div class="row">
		<div class="col-sm-12 col-md-6">
			<div style="height:300px">
				<Chart
					{data}
					flatType={filter.flatType}
					block={filter.block}
					leaseCommenceDate={filter.leaseCommenceDate}
				/>
			</div>
			<Table
				{data}
				block={filter.block}
				flatType={filter.flatType}
				leaseCommenceDate={filter.leaseCommenceDate}
			/>
		</div>
	</div>
</div>
