<script>
    import { page } from '$app/stores';
    import { formatDate, theme, user } from '../../../stores/stores'
    import { onMount } from 'svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import AiOutlineHeart from "svelte-icons-pack/ai/AiOutlineHeart"
    import AiFillHeart from "svelte-icons-pack/ai/AiFillHeart";
    const category = $page.params.cat_name;

    let posts = []

    async function getPosts() {
        try {
            const response = await fetch(`http://localhost:5000/posts/${category}/${$user.uid}`);
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    export function generateUrl(post_title) {
        const stringWithHyphens = post_title.toLowerCase().replace(/\s+/g, '-');
        const cleanedString = stringWithHyphens.replace(/[^a-z0-9-]/g, '');
        return cleanedString
    }

    onMount(async () => {
        posts = await getPosts();
    });
</script>

<div class='w-full overflow-auto bg-gray-100 p-2'>
    <div class='text-3xl font-bold my-4 mx-2'>We found {posts.length} posts</div>
    {#each posts as post}
        <a href={`/post/${post.post_id}?${generateUrl(post.post_title)}`} class='w-full flex flex-row justify-between bg-white'>
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
                <div>
                    <Icon src={AiOutlineHeart} size=24 />
                </div>
            </div>
        </a>
    {/each}
</div>