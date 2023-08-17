<script>
    import { user } from '../stores/stores'
    import { theme } from '../stores/stores'
    import "../app.css"
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import FaSolidUserCircle from "svelte-icons-pack/fa/FaSolidUserCircle"
    import BsCaretDown from "svelte-icons-pack/bs/BsCaretDown"
    let currentTheme
    let caretDown = false
    let userMenuHovered = false
    let lastScrollTop = 0
    let hideToolbar = false

    const handleLogIn = () => {
        window.location.href = 'http://localhost:5173/login';
    }

    theme.subscribe((value) => {
        currentTheme = value
    })

    function changeTheme() {
        theme.update((theme) => theme = !theme)
    }
</script>

<style>
    .animate-opacity {
        animation: fadeOpacity 0.5s ease-in-out;
    }

    @keyframes fadeOpacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .animate-opacity-reverse {
        animation: fadeOpacityReverse 0.5s ease-in-out;
    }

        
    @keyframes fadeOpacityReverse {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .toolbar-hidden {
        top: -72px;
    }
</style>

<div id='main' on:scroll={() => {

    const scrollTopPosition = document.getElementById('main').scrollTop
    if (scrollTopPosition > lastScrollTop) {
        hideToolbar = true
    } else if (scrollTopPosition < lastScrollTop) {
        hideToolbar = false
    }
    lastScrollTop = scrollTopPosition <= 0 ? 0 : scrollTopPosition;
}
} class={`w-full h-screen overflow-auto flex flex-col items-center transition duration-500 ease-in-out ${currentTheme && 'bg-darkTheme_dark_blue'}`}>
    <div class={`fixed top-0 w-full bg-primaryColor p-2 flex justify-center transition-all duration-500 ease-in-out z-1000 ${hideToolbar && 'toolbar-hidden'}`}>
        <div class={`relative flex flex-row w-sm md:w-md lg:w-lg xl:w-xlg 2xl:w-2xl items-center justify-between z-100`}>
            <a href='/' class='text-3xl p-1 text-white font-bold'>OLX</a>
            <div class={`flex flex-row items-center`}>
                <div class={`rounded-full flex w-20 h-8 bg-darkTheme_dark_blue mr-10 p-1 transition-color duration-500 ease-in ${!currentTheme && 'bg-white'}`}>
                    <button type='button' on:click={changeTheme} class={`bg-primaryColor w-6 h-6 rounded-full flex justify-center items-center relative transition-all duration-500 ease-in ${currentTheme && 'translate-x-8 md:translate-x-12'}`}>
                        <div class={`absolute flex justify-end bg-custom_yellow w-3 h-3 rounded-full transition-all duration-500 ease-in ${currentTheme && 'bg-moon_color'}`}>
                            <div class={`w-2 h-2 bg-primaryColor rounded-full ${currentTheme ? 'animate-opacity' : 'animate-opacity-reverse opacity-0'}`}></div>
                        </div>
                    </button>
                </div>
                <div class='relative'>
                    <button
                        type='button'
                        class='rounded-lg p-1 flex flex-row items-center gap-3'
                        on:click={!$user.username && handleLogIn}
                    >
                        <Icon src={FaSolidUserCircle} color="white" size="32" />
                        {#if $user.username}
                            <div class='text-2xl text-white ml-3'>{$user.username}</div>
                            <div role="button" tabindex="0" on:mouseenter={() => caretDown = true} on:mouseleave={() => {
                                setTimeout(() => {
                                    if (!userMenuHovered) caretDown = false
                                }, 1000)
                                }}>
                                <Icon src={BsCaretDown} color="white" size="26" />
                            </div>
                        {:else}
                            <div class='text-2xl text-white ml-3'>Your Profile</div>
                        {/if}
                    </button>
                    {#if caretDown}
                        <div role="button" tabindex="0" class={`absolute flex flex-col rounded-lg w-full ${$theme ? 'bg-darkTheme_blue text-white' : 'bg-white'}`}
                            on:mouseenter={() => userMenuHovered = true} on:mouseleave={() => {userMenuHovered = false; caretDown = false}}
                        >
                            <a href={`/your-chats`}
                                class={`p-2 text-lg w-full flex items-start`}
                            >
                                Your chats
                            </a>
                            <button
                                type="button"
                                on:click={() => {
                                    user.set({})
                                    window.location.href = 'http://localhost:5173'
                                }}
                                class={`p-2 text-lg w-full flex items-start`}
                            >
                                Log out
                            </button>
                        </div>
                    {/if}
                </div>
                <div class={`rounded-lg px-2 py-1 ml-3 flex items-center justify-center transition duration-500 ease-out ${currentTheme ? 'bg-primaryColor hover:bg-white' : 'bg-white'}`}>
                    <a href="/adding/" class={`text-2xl p-1 text-primaryColor ${currentTheme && 'text-white bg-primaryColor'} transition duration-500 ease-out ${currentTheme ? 'hover:bg-white hover:text-primaryColor' : 'hover:bg-primaryColor hover:text-white'}`}>Add Post</a>
                </div>
            </div>
        </div>
    </div>
    <div class="w-full md:w-md lg:w-lg xl:w-xlg 2xl:w-2xl flex justify-center">
        <slot></slot> 
    </div> 
</div>
