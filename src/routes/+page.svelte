<script lang="ts">
	import { onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';
	import Table from '../components/flatDataComponent.svelte';

	let data: HDB_Resale_Flat_Record[] = []; // Variable to store the retrieved data
	let activeTab = ''; // Variable to store the active tab

  let query:string = 'FARRER PK RD';
	async function fetchData() {
		try {
			const response = await fetch(
				`https://data.gov.sg/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=${query}`
			);
			const result = await response.json();
			console.log(result.result.records);
			data = result.result.records as HDB_Resale_Flat_Record[];
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function getDistinctFlatTypes() {
		return [...new Set(data.map((item) => item.flat_type))];
	}
	function setActiveTab(tab) {
		activeTab = tab;
	}
	// Call the fetchData function when the component is mounted
	onMount(fetchData);
</script>

<h1>Results for: {query}</h1>
<ul class="nav">
	{#if data.length > 0}
		{#each getDistinctFlatTypes() as flatType}
			<li class="nav-item">
				<a
					class="nav-link {flatType === activeTab ? 'active' : ''}"
					aria-current="page"
					href="#"
					on:click={() => setActiveTab(flatType)}>{flatType}</a
				>
			</li>
		{/each}
	{/if}
</ul>

<div class="container-fluid">
  <div class="row">
    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <div class="offcanvas-lg offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
          <button type="button" class="btn btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="#">
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Orders
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Customers
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Reports
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Integrations
              </a>
            </li>
          </ul>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>Saved reports</span>
            <a class="link-secondary" href="#" aria-label="Add a new report">
            </a>
          </h6>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Current month
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Last quarter
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Social engagement
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Year-end sale
              </a>
            </li>
          </ul>

          <hr class="my-3">

          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Settings
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Dashboard</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle ">
            
            This week
          </button>
        </div>
      </div>
{#if data.length > 0}
	{#each getDistinctFlatTypes() as flatType}
		{#if flatType === activeTab}
			<Table {flatType} {data} />
		{/if}
	{/each}
{:else}
	<p>Loading data...</p>
{/if}
</main>
</div>
</div>