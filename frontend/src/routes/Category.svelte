<script>
    import { theme } from '../stores/stores'
    export let img_src
    export let cat_name
    export let cid
    let imageHovered = false
    let img_id = -1
</script>

<a href={`/category/${cat_name}`} class="flex flex-col items-center" on:mouseenter={() => {imageHovered = true; img_id = cid}} on:mouseleave={() => {imageHovered = false; img_id = -1}} >
    <img 
        src={img_src}
        alt=""
        class="w-28 h-28 rounded-full min-w-112"
    />
    <div class={`font-semibold text-2xl mt-5 transition duration-500 ease-in-out ${$theme && imageHovered && img_id === cid ? 'text-black bg-white' : imageHovered && img_id === cid ? 'text-white bg-primaryColor' : $theme && 'text-white'}`}>
        {cat_name}
    </div>
</a>