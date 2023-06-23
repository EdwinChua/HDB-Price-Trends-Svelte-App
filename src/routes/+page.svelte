<script>
  import { onMount } from 'svelte';
  import { HDB_Resale_Flat_Record } from '../models/record'

  let data = []; // Variable to store the retrieved data

  async function fetchData() {
    try {
      const response = await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=f1765b54-a209-4718-8d38-a39237f502b3&q=FARRER%20PK%20RD');
      const result = await response.json();
      console.log(result.result.records)
      data = result.result.records // as HDB_Resale_Flat_Record[];
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Call the fetchData function when the component is mounted
  onMount(fetchData);
</script>

<h1>Data Table</h1>

{#if data.length > 0}
<table>
    <thead>
      <tr>
        <th>Block</th>
        <th>Flat Model</th>
        <th>Flat Type</th>
        <th>Floor Area (sqm)</th>
        <th>Lease Commence Date</th>
        <th>Month</th>
        <th>Rank</th>
        <th>Remaining Lease</th>
        <th>Resale Price</th>
        <th>Storey Range</th>
        <th>Street Name</th>
        <th>Town</th>
      </tr>
    </thead>
    <tbody>
      {#each data as item}
        <tr>
          <td>{item.block}</td>
          <td>{item.flat_model}</td>
          <td>{item.flat_type}</td>
          <td>{item.floor_area_sqm}</td>
          <td>{item.lease_commence_date}</td>
          <td>{item.month}</td>
          <td>{item.rank}</td>
          <td>{item.remaining_lease}</td>
          <td>{item.resale_price}</td>
          <td>{item.storey_range}</td>
          <td>{item.street_name}</td>
          <td>{item.town}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Loading data...</p>
{/if}