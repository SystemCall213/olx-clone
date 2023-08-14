<script>
    import { user } from '../stores/stores'
    import { theme } from '../stores/stores'
    import "../app.css"
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import FaSolidUserCircle from "svelte-icons-pack/fa/FaSolidUserCircle"
    import BsCaretDown from "svelte-icons-pack/bs/BsCaretDown";
    let currentTheme

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
</style>

<div class={`w-full h-screen overflow-auto flex flex-col items-center transition duration-500 ease-in-out ${currentTheme && 'bg-darkTheme_dark_blue'}`}>
    <div class='sticky top-0 w-full bg-primaryColor p-2 flex justify-center z-10'>
        <div class={`flex flex-row w-sm md:w-md lg:w-lg xl:w-xlg 2xl:w-2xl items-center justify-between`}>
            <h1 class='text-3xl p-1 text-white font-bold'>OLX</h1>
            <div class={`flex flex-row items-center`}>
                <div class={`rounded-full flex w-20 h-8 bg-darkTheme_dark_blue mr-10 p-1 transition-color duration-500 ease-in ${!currentTheme && 'bg-white'}`}>
                    <button type='button' on:click={changeTheme} class={`bg-primaryColor w-6 h-6 rounded-full flex justify-center items-center relative transition-all duration-500 ease-in ${currentTheme && 'translate-x-8 md:translate-x-12'}`}>
                        <div class={`absolute flex justify-end bg-custom_yellow w-3 h-3 rounded-full transition-all duration-500 ease-in ${currentTheme && 'bg-moon_color'}`}>
                            <div class={`w-2 h-2 bg-primaryColor rounded-full ${currentTheme ? 'animate-opacity' : 'animate-opacity-reverse opacity-0'}`}></div>
                        </div>
                    </button>
                </div>
                <button
                    type='button'
                    class='rounded-lg p-1 flex flex-row items-center gap-3'
                    on:click={!$user.username && handleLogIn}
                >
                    <Icon src={FaSolidUserCircle} color="white" size="32" />
                    {#if $user.username}
                        <div class='text-2xl text-white ml-3'>{$user.username}</div>
                        <Icon src={BsCaretDown} color="white" size="26" />
                    {:else}
                        <div class='text-2xl text-white ml-3'>Your Profile</div>
                    {/if}
                </button>
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
