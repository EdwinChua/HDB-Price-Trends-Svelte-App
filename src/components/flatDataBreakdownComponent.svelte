<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';

    import FlatDataChart from './flatDataChart.svelte';
	export let flatType: string;
	export let data: HDB_Resale_Flat_Record[];

    let distinctFlatTypes = [];
    let distinctFlatData = [];
    

    function refreshComponentData() {
        distinctFlatTypes = [...new Set(data.map((item) => item.flat_type))];
        distinctFlatData = distinctFlatTypes.map((flatType) => {
            let filteredData = data.filter((item) => item.flat_type === flatType);
            //further group into distinct storey_range
            const distinctStoryRanges = [...new Set(filteredData.map((item) => item.storey_range))];
            const distinctStoryRangesData = distinctStoryRanges.map((storyRange) => {
                filteredData = filteredData.filter((item) => item.storey_range === storyRange);
                return {
                    flatType: flatType,
                    storeyRange: storyRange,
                    data: filteredData
                };
            });
            return {
                flatType: flatType,
                data: distinctStoryRangesData
            };
        });

        if (flatType !== 'All') distinctFlatData = distinctFlatData.filter((item) => item.flatType === flatType);

        console.log(distinctFlatData, "aas")
    }

	onMount(refreshComponentData);
	afterUpdate(refreshComponentData);
</script>

<!-- <p>It works!</p> -->

{#if distinctFlatData && distinctFlatData.length > 0}
    {#each distinctFlatData as flatData}
        <!-- <FlatDataBreakdownComponent_Individual flatType={flatData.flatType} data={flatData.data}/> -->
    {/each}
{:else}
    <p>There is data</p>
{/if}
