<script>
    import { page } from '$app/stores';
    import { formatDate, theme, user, categories } from '../../../stores/stores'
    import { onMount } from 'svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import AiOutlineHeart from "svelte-icons-pack/ai/AiOutlineHeart"
    import AiFillHeart from "svelte-icons-pack/ai/AiFillHeart"
    import BsCaretDown from "svelte-icons-pack/bs/BsCaretDown"
    import BiSearchAlt from "svelte-icons-pack/bi/BiSearchAlt"
    import AiFillCaretLeft from "svelte-icons-pack/ai/AiFillCaretLeft"
    import AiFillCaretRight from "svelte-icons-pack/ai/AiFillCaretRight"
    const category = $page.params.cat_name

    let posts = []
    let totalPosts = 0
    let filter_category = false
    let min_price = undefined
    let max_price = undefined
    let searchTerm = ''
    let currentPage = 1
    let client = {}

    async function getPosts() {
        try {
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/posts/${category}/${$user.uid}?page=${currentPage}&min_price=${(min_price !== undefined) ? min_price : 0}&max_price=${(max_price !== undefined) ? max_price : 1000000}`)
            return await response.json()
        } catch (error) {
            console.error(error.message)
            return []
        }
    }

    async function getSearchedPosts() {
        try {
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/search/${searchTerm}?page=${currentPage}&min_price=${(min_price !== undefined) ? min_price : 0}&max_price=${(max_price !== undefined) ? max_price : 1000000}`)
            return await response.json()
        } catch (error) {
            console.error(error.message)
            return []
        }
    }

    export function generateUrl(post_title) {
        const stringWithHyphens = post_title.toLowerCase().replace(/\s+/g, '-')
        const cleanedString = stringWithHyphens.replace(/[^a-z0-9-]/g, '')
        return cleanedString
    }

    async function fetchClient() {
        try {
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/olx/${$user.username}/${$user.password}`)
            client = await response.json()
        } catch (error) {
            console.log(error.message)
        }
    }

    onMount(async () => {
        fetchClient()
        const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getPosts();
        posts = fetchedPosts;
        totalPosts = fetchedTotalCount;
        console.log(posts)
    })

    async function Search() {
        if (searchTerm) {
            const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getSearchedPosts();
            posts = fetchedPosts;
            totalPosts = fetchedTotalCount;
        }
        else { 
            const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getPosts();
            posts = fetchedPosts;
            totalPosts = fetchedTotalCount;
        }
    }

    async function LikePost(post_id) {
        try {
            const uid = $user.uid
            const body = { uid }
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/add_liked/${post_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            fetchClient()
            Search()
        } catch (error) {
            console.log(error.message)
        }
    }

    async function UnlikePost(post_id) {
        try {
            const uid = $user.uid
            const body = { uid }
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/remove_liked/${post_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            fetchClient()
            Search()
        } catch (error) {
            console.log(error.message)
        }
    }
</script>

<style>
    .dark_input input::placeholder {
        color: white; 
    }
</style>

<div class={`w-full overflow-auto p-2 ${$theme ? 'bg-darkTheme_blue dark_input' : 'bg-gray-100'}`}>
    <div class='w-full flex flex-row gap-2'>
        <input 
            type="text"
            placeholder="Search for posts"
            bind:value={searchTerm}
            class={`p-3 w-full outline-none ${$theme ? 'bg-darkTheme_light_gray text-white' : 'bg-white text-black'}`}
        >
        <button type='button' on:click={Search} class="border-4 border-primaryColor py-2 px-4 font-bold text-white bg-primaryColor hover:text-primaryColor hover:bg-white flex flex-row gap-2">
            Find
            <Icon src={BiSearchAlt} size="20" color="gray" />
        </button>
    </div>
    <div class='text-3xl my-4'>Filters</div>
    <div class='relative flex flex-row gap-4'>
        <div class='flex flex-col w-1/5'>
            <div>Category</div>
            <button
                type='button'
                class={`flex flex-row justify-between p-2 mt-2 ${$theme ? 'bg-darkTheme_light_gray text-white' : 'bg-white'}`}
                on:click={() => filter_category = !filter_category}
            >
                <div>{category}</div>
                <Icon src={BsCaretDown} size="24" />
            </button>
        </div>
        {#if filter_category}
            <div class='absolute mt-16 flex flex-col w-[150px] mr-3'>
                {#each categories as category}
                    <a href={`/category/${category.title}`} class={`p-2 ${$theme ? 'bg-darkTheme_light_gray text-white' : 'bg-white'}`} on:click={(event) => {
                        event.preventDefault();
                        window.location.href = event.currentTarget.getAttribute('href');
                    }}>
                        {category.title}
                    </a>
                {/each}
            </div>
        {/if}
        <div class='flex flex-col w-1/5'>
            <div>Price</div>
            <div class="flex flex-row gap-3">
                <input 
                    type="text" 
                    bind:value={min_price} 
                    placeholder="Min" 
                    on:blur={() => {
                        if (min_price !== undefined) {
                            Search()
                        } else if (!min_price) min_price = undefined
                    }} 
                    class={`p-2 mt-2 w-14 outline-none ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'}`}>
                <input 
                    type="text" 
                    bind:value={max_price} 
                    placeholder="Max" 
                    on:blur={() => {
                        if (max_price !== undefined) {
                            Search()
                        } else if (!max_price) max_price = undefined
                    }} 
                    class={`p-2 mt-2 w-14 outline-none ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'}`}>
            </div>
        </div>
    </div>
    <div class='text-3xl font-bold my-4 mx-2'>We found {totalPosts} posts</div>
    {#each posts as post}
        <a href={`/post/${post.post_id}?${generateUrl(post.post_title)}`} class={`w-full flex flex-row justify-between ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'}`}>
            <div class='p-2 w-full flex flex-row'>
                <img 
                    src={`http://localhost:5000/image/${encodeURIComponent(post.imageUrls[0])}`} 
                    alt='post-img'
                    class='h-40 w-56'
                >
                <div class='flex flex-col justify-between ml-3'>
                    <div>
                        {post.post_title}
                    </div>
                    <div>
                        {post.location} - added {formatDate(post.created_at)}
                    </div>
                </div>
            </div>
            <div class='flex flex-col justify-between items-end p-2'>
                <div>{post.price}$</div>
                {#if client.liked_posts.includes(post.post_id)}
                    <button on:click={(e) => {e.stopPropagation(); e.preventDefault(); UnlikePost(post.post_id, true)}}>
                        <Icon src={AiFillHeart} size=24 color="red" />
                    </button>
                {:else}
                    <button on:click={(e) => {e.stopPropagation(); e.preventDefault(); LikePost(post.post_id, true)}}>
                        <Icon src={AiOutlineHeart} size=24 />
                    </button>
                {/if}
            </div>
        </a>
    {/each}
    <div class={`flex flex-row gap-2 mt-3 w-full justify-center ${$theme && 'text-white'}`}>
        <button type='button' on:click={async () => {
            if (currentPage > 1) {
                currentPage--
                if (searchTerm) {
                    const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getSearchedPosts();
                    posts = fetchedPosts;
                    totalPosts = fetchedTotalCount;
                } else { 
                    const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getPosts();
                    posts = fetchedPosts;
                    totalPosts = fetchedTotalCount;
                }
            }
        }}>
            <Icon src={AiFillCaretLeft} size="24" color={`${$theme ? 'white' : 'black'}`} />        
        </button>
        <div class="text-lg">{currentPage}</div>
        <button type='button' on:click={async () => {if (posts.length / (currentPage * 10) >= 1) {
            currentPage++
            if (searchTerm) {
                    const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getSearchedPosts();
                    posts = fetchedPosts;
                    totalPosts = fetchedTotalCount;
                } else { 
                    const { posts: fetchedPosts, totalCount: fetchedTotalCount } = await getPosts();
                    posts = fetchedPosts;
                    totalPosts = fetchedTotalCount;
                }
        }}}>
            <Icon src={AiFillCaretRight} size="24" color={`${$theme ? 'white' : 'black'}`} />        
        </button>
    </div>
</div>