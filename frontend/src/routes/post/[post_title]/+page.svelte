<script>
    import { page } from '$app/stores';
    import { theme, formatDate, user } from '../../../stores/stores'
    import Button from '../../adding/Button.svelte';
    import { onMount } from 'svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import AiOutlineHeart from "svelte-icons-pack/ai/AiOutlineHeart"
    import BsTelephone from "svelte-icons-pack/bs/BsTelephone";
    import BsCaretLeft from "svelte-icons-pack/bs/BsCaretLeft";
    import BsCaretRight from "svelte-icons-pack/bs/BsCaretRight";
    const post_id = $page.params.post_title
    let post = {}
    let image_counter = 0
    let image_pointers = []
    let translateX;
    $: left_icon_opacity = image_counter === 0 ? 30 : 90
    $: right_icon_opacity = image_counter === image_pointers.length - 1 ? 30 : 90
    let send_message = false
    let message = ''
    let chat
    $: chatAlreadyExists = chat !== undefined && chat.length !== 0 ? true : false

    async function getPost() {
        try {
            const response = await fetch(`http://localhost:5000/post/${post_id}`);
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    onMount(async () => {
        post = await getPost();
        for (let i = 0; i < post.imageUrls.length; i++) {
            image_pointers.push(i)
        }
        translateX = image_pointers.length * 4;
    });

    async function getChat() {
        try {
            const response = await fetch(`http://localhost:5000/chat/${$user.uid}/${post.contact_person_id}`)
            chat = await response.json()
            console.log(chat)
        } catch (error) {
            console.error(error.message)
        }
    }

    async function sendMessage(event) {
        if (event.key === 'Enter') {
            if (message && chatAlreadyExists) {
                try {
                    console.log('1 scene')
                    const history = chat.history
                    history.push('0' + message)
                    const body = { history }
                    console.log(chat.chat_id)
                    const response = await fetch(`http://localhost:5000/update_history/${chat.chat_id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(body)
                    })
                    console.log(response)
                    await getChat()
                    scrollToBottom()
                } catch (error) {
                    console.error(error.message)
                }
            } else if (message) {
                try {
                    console.log('2 scene')
                    message = '0' + message
                    const contact_person_id = post.contact_person_id
                    const uid = $user.uid
                    const body = { message, contact_person_id, uid }
                    const response = await fetch("http://localhost:5000/create_chat", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(body)
                    })
                    console.log(response)
                    await getChat()
                    scrollToBottom()
                } catch (error) {
                    console.error(error.message)
                }
            }
        } else {
            console.log('something went wrong')
        }
    }

    function scrollToBottom() {
        if (document.getElementById("post-chat")) {
            const post_chat = document.getElementById("post-chat");
            post_chat.scrollTop = post_chat.scrollHeight
        }
    }
</script>

<style>
    .hide-scrollbar::-webkit-scrollbar {
        background: transparent;
        width: 1px;
    }
</style>

{#if post.post_id}
    <div class={`relative flex flex-col gap-8 p-2 w-full ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100 '}`}>
        <div class={`relative rounded-md p-4 w-full xl:w-1/2 ${$theme ? 'bg-darkTheme_light_gray' : 'bg-gray-300 '}`}>
            <img 
                src={`http://localhost:5000/image/${encodeURIComponent(post.imageUrls[image_counter])}`} 
                alt=""
                class='w-full h-96'
            >
            <button on:click={() => image_counter !== 0 && image_counter--} class={`absolute bg-white top-1/2 translate-x-1/4 rounded-md w-10 h-10 -translate-y-1/2 flex justify-center items-center opacity-${left_icon_opacity}`} style="opacity: {left_icon_opacity}%;">
                <Icon src={BsCaretLeft} size="24" />
            </button>
            <button on:click={() => image_counter !== image_pointers.length - 1 && image_counter++}  class={`absolute bg-white top-1/2 right-1 rounded-md w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center opacity-${right_icon_opacity}`} style="opacity: {right_icon_opacity}%;">
                <Icon src={BsCaretRight} size="24" />
            </button>
            <div class={`absolute left-1/2 top-full flex flex-row gap-3 -translate-y-20`}>
                {#each image_pointers as index}
                    <div class={`w-8 h-8 rounded-full bg-white border-4 border-gray-400 -translate-x-${translateX}`} style="opacity: {index === image_counter ? 50 : 20}%"></div>
                {/each}
            </div>
        </div>
        <div class={`rounded-md p-4 w-full ${$theme ? 'bg-darkTheme_light_gray' : 'bg-gray-300 '}`}>
            <div class='flex flex-row justify-between'>
                <div class='text-xs text-gray-700'>
                    Added {formatDate(post.created_at)}
                </div>
                <div>
                    <Icon src={AiOutlineHeart} size=24 />
                </div>
            </div>
            <div class='mt-4 text-2xl'>
                {post.post_title}
            </div>
            <div class='mt-4 text-3xl font-bold'>
                {post.price} $
            </div>
            <div class='mt-4 text-2xl font-semibold'>
                Description
            </div>
            <div class='mt-4 text-lg'>
                {post.post_description}
            </div>
        </div>
        <div class={`rounded-md p-4 w-full flex flex-row justify-between ${$theme ? 'bg-darkTheme_light_gray' : 'bg-gray-300 '}`}>
            <div class='flex flex-col'>
                <div class='text-2xl font-semibold'>
                    Make contact
                </div>
                <div class='mt-4 text-xl'>
                    {post.contact_person}
                </div>
            </div>
            <div class='flex flex-col gap-3 items-center'>
                <Button Function={() => {send_message = true; getChat()}} text="Send a message" />
                <div class='flex flex-row items-center gap-4'>
                    <div class='w-10 h-10 rounded-full bg-cyan-600 flex justify-center items-center'>
                        <Icon src={BsTelephone} size=24 />
                    </div>
                    <div>{post.phone_number}</div>
                </div>
            </div>
        </div>

    </div>
{/if}

{#if send_message && chat}
    <div class="absolute bottom-4 right-4 w-72 h-96 bg-white flex flex-col justify-between p-2 shadow-md">
        <div on:load={scrollToBottom()}>
            {#if chat !== undefined && chat.length !== 0}
                <div id='post-chat' class="flex flex-col gap-3 overflow-y-auto hide-scrollbar" on:load={scrollToBottom()}>
                    {#each chat.history as message}
                        {#if message.startsWith('0')}
                            <div class='text-white flex justify-end'>
                                <p class="py-1 px-2 break-words overflow-clip bg-cyan-400 rounded-lg">
                                    {message.slice(1)}
                                </p>
                            </div>
                        {:else}
                            <div class='text-white flex justify-start'>
                                <p class="py-1 px-2 break-words overflow-clip bg-blue-400 rounded-lg">
                                    {message.slice(1)}
                                </p>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
        <input 
            type="text"
            bind:value={message}
            on:keypress={sendMessage}
            placeholder="send message"
            class="border border-cyan-300 outline-none p-1 rounded-md"
        >
    </div>
{/if}