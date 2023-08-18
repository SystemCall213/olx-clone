<script>
    import { theme, categories } from '../stores/stores'
    import Category from './Category.svelte';
</script>

<div class="w-full h-screen">
    <div class={`w-full text-primaryColor font-bold text-3xl flex p-3 my-20 justify-center transition duration-500 ease-in-out ${$theme && 'text-white'}`}>
        Main categories
    </div>
    <div class="w-full flex flex-row gap-2 sm:gap-5 md:gap-10 overflow-x-auto md:overflow-visible md:flex-wrap">
        {#each categories as category}
            <Category img_src={category.src} cat_name={category.title} cid={category.id} />
        {/each}
    </div>
</div>