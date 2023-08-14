<script>
	import { theme } from "../../stores/stores";
    export let Function
    export let text
</script>

<button on:click={Function} class={`rounded-lg px-2 py-1 ml-3 flex items-center justify-center transition duration-500 ease-out ${$theme ? 'bg-white hover:bg-primaryColor' : 'bg-primaryColor'}`}>
    <div class={`text-2xl p-1 ${$theme ? 'text-primaryColor bg-white' : 'text-white'} transition duration-500 ease-out ${$theme ? 'hover:bg-primaryColor hover:text-white' : 'hover:bg-white hover:text-primaryColor'}`}>{text}</div>
</button>