<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { HDB_Resale_Flat_Record } from '../models/record';
	export let flatType: string;
	export let data: any[];



    function refreshComponentData() {
        console.log(data)
        if (data.length > 0) {

            // clean data;
            const data2 = data.filter((item) => item.data.length > 0).sort((a,b) => a.storeyRange.localeCompare(b.storeyRange))
            console.log(data2)
            // console.log()
        }
        // console.log()
        
    }

	onMount(refreshComponentData);
	afterUpdate(refreshComponentData);
</script>