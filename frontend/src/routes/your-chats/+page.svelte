<script>
    import { theme, user } from '../../stores/stores'
    import { onMount } from 'svelte';
    let chats
    let chat_id
    let message = ''
    let chat
    let userIds = []
    let userNames = []
    $: {
        if (chat !== undefined && chat.length !== 0) {
            scrollToBottom()
        }
    }

    async function fetchChats() {
        try {
            const response = await fetch(`http://localhost:5000/chats/${$user.uid}`)
            chats = await response.json()
            chat_id = chat_id === chats.length ? 0 : chats.length - 1
            chat = chats[chat_id]
            for (const currentChat of chats) {
                if ($user.uid === currentChat.user_id) {
                    userIds.push(currentChat.contact_person_id)
                } else userIds.push(currentChat.user_id)
            }
            scrollToBottom()
        } catch (error) {
            console.error(error.message)
        }
    }

    async function fetchUsernames() {
        try {
            const response = await fetch(`http://localhost:5000/users?userIds=${userIds.join(',')}`)
            userNames = await response.json()
        } catch (error) {
            console.log(error.message)
        }
    }

    onMount(async () => {
        await fetchChats()
        await fetchUsernames()
    })

    async function Answer() {
        if (message) {
            try {
                const history = chats[chat_id].history
                if ($user.uid === chats[chat_id].user_id) {
                    history.push('0' + message)
                } else {
                    history.push('1' + message)
                }
                message = ''
                const body = { history }
                const response = await fetch(`http://localhost:5000/update_history/${chats[chat_id].chat_id}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                fetchChats()
            } catch (error) {
                console.error(error.message)
            }
        }
    }

    
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            Answer();
        }
    }

    function scrollToBottom() {
        if (document.getElementById("user-chat")) {
            const user_chat = document.getElementById("user-chat");
            user_chat.scrollTop = user_chat.scrollHeight
        }
    }
</script>

<style>
    .hide-scrollbar::-webkit-scrollbar {
        background: transparent;
        width: 1px;
    }
</style>

<div class={`${$theme ? 'bg-darkTheme_blue' : 'bg-gray-300'} flex flex-row gap-2 p-3 w-full mt-16 h-656`}>
    <div class={`flex flex-col rounded-lg p-2 ${$theme ? 'bg-darkTheme_light_gray' : 'bg-gray-200'} w-2/5 gap-3`}>
        <div class={`${$theme ? 'bg-darkTheme_light' : 'bg-white'} p-1 rounded-lg flex justify-center text-xl`}>
            Your chats
        </div>
        <div class='flex flex-col-reverse gap-2'>
            {#if userNames.length > 0}
                {#each chats as ch, i}
                    <button on:click={() => {chat_id = i; message = ''; scrollToBottom(); chat = chats[chat_id]}} class={`flex flex-row justify-between items-center p-1 rounded-md gap-2 ${$theme ? 'bg-darkTheme_light' : 'bg-white'}`}>
                        <div>{userNames[userNames.length-1-i].username}</div>
                        <div class={`truncate p-1 rounded-lg flex justify-end`}>
                            {ch.history[ch.history.length-1].slice(1)}
                        </div>
                    </button>
                {/each}
            {/if}
        </div>
    </div>
    <div class={`w-3/5 rounded-lg ${$theme ? 'bg-darkTheme_light_gray' : 'bg-gray-200'} flex flex-col justify-between p-2`}>
            {#if chats}
                <div id='user-chat' class="flex flex-col overflow-y-auto gap-2 hide-scrollbar">
                    {#each chat.history as message}
                        {#if message.startsWith('0')}
                            <div class="flex justify-end" on:load={scrollToBottom()}> 
                                <p class={`break-words overflow-clip p-1 ${$theme ? 'text-white bg-darkTheme_blue' : 'text-black bg-white'} rounded-lg`}>
                                    {message.slice(1)}
                                </p>
                            </div>
                        {:else}
                            <div class="flex justify-start" on:load={scrollToBottom()}>
                                <p class={`break-words overflow-clip p-1 ${$theme ? 'text-white bg-darkTheme_dark_blue' : 'text-black bg-white'} rounded-lg`}>
                                    {message.slice(1)}
                                </p>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        <input 
            type="text"
            bind:value={message}
            on:keypress={handleKeyPress}
            placeholder="Respond"
            class="p-1 rounded-lg outline-none mt-2"
        >
    </div>
</div>