<script lang="ts">
  export const prerender = true;

	import { onMount } from 'svelte';
	import type { HDB_Resale_Flat_Record } from '../models/record';
	import FlatDataComponent from '../components/flatDataComponent.svelte';
  import FlatDataBreakdownComponent from '../components/flatDataBreakdownComponent.svelte';

  const maxApiCalls = 20;
  let isLoading:boolean = false;
	let data: HDB_Resale_Flat_Record[] = []; // Variable to store the retrieved data
	let activeTab = 'All'; // Variable to store the active tab
  let baseApi = `https://data.gov.sg`;
  let query:string = 'SELEGIE RD';
  let distinctFlatTypes = [];

   async function refreshComponent(){
    await fetchData();
    await setActiveTab('All');
    distinctFlatTypes = getDistinctFlatTypes();
  }

  function submitForm(){
    refreshComponent();
  }

	async function fetchData() {
    isLoading = true;
    console.log(query);
		try {
			const response = await fetch(
				`${baseApi}/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=${query}`
			);
			const result = await response.json();
      let apiCallCount = 1;
      let data_temp = result.result.records as HDB_Resale_Flat_Record[];
      
      // console.log(result.result.total)
      if (result.result._links.next && data_temp.length < result.result.total) {
        let result2 = result;
        while(result2.result._links.next && data_temp.length < result2.result.total && apiCallCount < maxApiCalls){
          const response2 = await fetch(`${baseApi}/${result2.result._links.next}`);
          result2 = await response2.json();
          apiCallCount++;
          data_temp = data_temp.concat(result2.result.records as HDB_Resale_Flat_Record[]);
        }
      }
      data = data_temp.filter((item) => item.street_name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
      console.log("LOAD DONE",data)
      console.log("LOAD DONE",data.length)
      isLoading = false;
		} catch (error) {
			console.error('Error fetching data:', error);
      isLoading = false;
		}
	}

	function getDistinctFlatTypes() {
		return [...new Set(data.map((item) => item.flat_type))].sort((a, b) => a.localeCompare(b));
	}
	function setActiveTab(tab) {
		activeTab = tab;
	}
	// Call the fetchData function when the component is mounted
	onMount(refreshComponent);
</script>
<form on:submit|preventDefault={submitForm}>
<input type="text" bind:value={query}/><button type="submit">Search</button>
</form>

<h1>Results for: {query}</h1>
<ul class="nav">
	{#if data.length > 0}
    <li class="nav-item">
      <a class="nav-link {'All' === activeTab ? 'active' : ''}" aria-current="page" href="#"	on:click={() => setActiveTab('All')}>All</a>
    </li>
		{#each distinctFlatTypes as flatType}
			<li class="nav-item">
				<a class="nav-link {flatType === activeTab ? 'active' : ''}" aria-current="page" href="#"	on:click={() => setActiveTab(flatType)}>{flatType}</a>
			</li>
		{/each}
	{/if}
</ul>

<div class="container-fluid">
  <div class="row">
    <main class="col-md-6 col-lg-6 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Dashboard</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle ">
            This week
          </button> -->
        </div>
      </div>
  {#if data.length > 0}
    <FlatDataComponent flatType={activeTab} data={data} />
  {:else}
    <p>Nothing Found</p>
  {/if}
</main>
<div class="col-md-6 col-lg-6 px-md-4">
  {#if data.length > 0}
  <FlatDataBreakdownComponent flatType={activeTab} {data} />
{:else}
	<p>Nothing Found</p>
{/if}
</div>
</div>
</div>
