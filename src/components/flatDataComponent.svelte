<script lang="ts">
	import { onMount } from 'svelte';
    import { HDB_Resale_Flat_Record } from '../models/record';
	export let flatType:string;
	export let data: HDB_Resale_Flat_Record[];

    function formatDate(monthYearString:string) {
        const [year, month] = monthYearString.split('-');
        // change 01 to Jan, 02 to Feb, etc.
        const monthString = new Date(`${year}-${month}-01`).toLocaleString('en-us', { month: 'short', year: 'numeric' });
        return monthString;
    }

    function drawChart(){
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.filter((item) => item.flat_type === flatType).map((item) => formatDate(item.month)),
                datasets: [{
                    label: 'Resale Price',
                    data: data.filter((item) => item.flat_type === flatType).map((item) => item.resale_price),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    onMount(drawChart)
</script>

    <div style="max-height:200px">
        <canvas id="myChart"></canvas>
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
                {#each data.filter((item) => item.flat_type === flatType) as item}
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


