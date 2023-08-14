<script>
    import { theme } from '../../stores/stores'
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import BiCamera from "svelte-icons-pack/bi/BiCamera"
    import BiSolidCamera from "svelte-icons-pack/bi/BiSolidCamera"
    import BiTrash from "svelte-icons-pack/bi/BiTrash";
    import BiSolidTrash from "svelte-icons-pack/bi/BiSolidTrash";
    export let id
    export let id_match
    export let image_asset
    export let updateAssets
    export let deleteAsset
    let imageAreaEntered = false
    let addPhotoUnderlineAnimation = false
    function handleFileSelect(event) {
        const photo = event.target.files[0];

        if (photo.type === 'image/png' 
        || photo.type === 'image/svg' 
        || photo.type === 'image/jpeg' 
        || photo.type === 'image/gif' 
        || photo.type === 'image/tiff') {

            updateAssets(id, photo)
            id_match++
            
        } else {
        }
    }


</script>

<style>
    .underline {
        transition: width 0.2s ease-in;
    }
</style>

{#if image_asset}
    <div role="button" tabindex="0" class="relative" 
        on:mouseenter={() => imageAreaEntered = true}
        on:mouseleave={() => imageAreaEntered = false}
    >
        <img 
        src={URL.createObjectURL(image_asset)} 
        alt={`photo-${id}`}
        class="rounded-md h-32 w-40 lg:h-40 lg:w-48"
    >
        {#if imageAreaEntered}
            <div class="absolute top-0 left-0 w-full h-full rounded-md flex justify-end items-end p-3">
                <div class="absolute top-0 left-0 w-full h-full bg-black rounded-md opacity-25 flex justify-center items-center"></div>
                <button on:click={() => {deleteAsset(id); id_match--}} class="w-10 h-10 rounded-full bg-white opacity-70 flex justify-center items-center">
                    {#if $theme}
                        <Icon src={BiSolidTrash} size="24" /> 
                    {:else}
                        <Icon src={BiTrash} size="24" />
                    {/if}   
                </button>
            </div>
        {/if}
    </div>
{:else}
    {#if id === id_match}
        <label for='upload-image' class={`rounded-md h-28 w-36 lg:h-40 lg:w-48 flex flex-col justify-center items-center hover:cursor-pointer ${$theme ? 'bg-darkTheme_dark_blue' : 'bg-beige'}`} on:mouseenter={() => addPhotoUnderlineAnimation = true} on:mouseleave={() => addPhotoUnderlineAnimation = false}>
            <div class={`font-bold text-xl ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
                Add photo
            </div>
            <div class={`border border-primaryColor rounded-full underline ${addPhotoUnderlineAnimation ? 'w-16' : 'w-28'}`}></div>
            <input id='upload-image' type="file" class="w-0 h-0" on:change={handleFileSelect} />
        </label>
    {:else}
        <label for='upload-image' class={`rounded-md h-28 w-36 lg:h-40 lg:w-48 flex flex-col justify-center items-center hover:cursor-pointer bg-gray-300`} on:mouseenter={() => addPhotoUnderlineAnimation = true} on:mouseleave={() => addPhotoUnderlineAnimation = false}>
            {#if $theme}
                <Icon src={BiSolidCamera} size="28" />
            {:else}
                <Icon src={BiCamera} size="28" />
            {/if}
            <input id='upload-image' type="file" class="w-0 h-0" on:change={handleFileSelect} />
        </label>
    {/if}
{/if}