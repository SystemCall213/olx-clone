<script>
    import { user, theme } from '../../stores/stores'
    let login = true
    let username = ''
    let password = ''
    let confirmPassword = ''

    function handleLogin() {
        login = !login
        username = ''
        password = ''
        confirmPassword = ''
    }

    async function signUp() {
        if (password === confirmPassword) {
            try {
                const body = { username, password }
                const response = await fetch("https://olx-clone-backend-two.vercel.app/olx", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                console.log(response)
                console.log(username, password, confirmPassword)
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    async function logIn() {
        try {
            const response = await fetch(`https://olx-clone-backend-two.vercel.app/olx/${username}/${password}`)
            const jsonData = await response.json()
            console.log(jsonData.liked_posts)
            user.set({
                uid: jsonData.uid,
                username: jsonData.username,
                password: jsonData.password,
                liked_posts: jsonData.liked_posts ? jsonData.liked_posts : []
            });
            window.location.href = 'https://olx-clone-backend-two.vercel.app'
        } catch (error) {
            console.log(error.message)
        }
    }
</script>

<div class="w-full h-full flex justify-center">
    <div class="flex flex-col rounded-lg border-2 border-primaryColor p-4 w-48 md:w-96 mt-40">
        <div class="flex flex-row mb-5">
            <button type='button' on:click={handleLogin} class={`border-b text-2xl w-1/2 pb-2 ${login && 'font-bold border-b-2'} transition duration-300 ease-in ${$theme ? 'text-white border-white' : 'bg-white border-primaryColor'}`}>
                Log in
            </button>
            <button type='button' on:click={handleLogin} class={`border-b text-2xl w-1/2 pb-2 ${!login && 'font-bold border-b-2'} transition duration-300 ease-in ${$theme ? 'text-white border-white' : 'bg-white border-primaryColor'}`}>
                Sign up
            </button>
        </div>
        {#if login}
            <div class={`ml-1 mb-1 ${$theme ? 'text-white' : 'text-gray-500'}`}>Username</div>
            <input 
                type="text" 
                class={`outline-none border p-1 rounded-md ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100'}`}
                placeholder="Enter username"
                value={username}
                on:input={(e) => username = e.target.value}
            />
            <div class={`ml-1 mb-1 mt-5 ${$theme ? 'text-white' : 'text-gray-500'}`}>Password</div>
            <input 
                type="password" 
                class={`outline-none border p-1 rounded-md ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100'}`}
                placeholder="Enter password"
                value={password}
                on:input={(e) => password = e.target.value}
            />
            <div class="flex flex-row justify-between mt-4">
                <div></div>
                <button type="button" on:click={logIn} class={`font-semibold px-2 border-2 p-1 rounded-lg ${$theme ? 'border-white text-white' : 'text-primaryColor border-primaryColor'}`}>
                    Log In
                </button>
            </div>
        {:else} 
            <div class={`ml-1 mb-1 ${$theme ? 'text-white' : 'text-gray-500'}`}>Username</div>
            <input 
                type="text" 
                class={`outline-none border p-1 rounded-md ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100'}`}
                placeholder="Enter username"
                value={username}
                on:input={(e) => username = e.target.value}
            />
            <div class={`ml-1 mb-1 mt-5 ${$theme ? 'text-white' : 'text-gray-500'}`}>Password</div>
            <input 
                type="password" 
                class={`outline-none border p-1 rounded-md ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100'}`}
                placeholder="Enter password"
                value={password}
                on:input={(e) => password = e.target.value}
            />
            <div class={`ml-1 mb-1 mt-5 ${$theme ? 'text-white' : 'text-gray-500'}`}>Confirm password</div>
            <input 
                type="password" 
                class={`outline-none border p-1 rounded-md ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-100'}`}
                placeholder="Confirm password"
                value={confirmPassword}
                on:input={(e) => confirmPassword = e.target.value}
            />
            <div class="flex flex-row justify-between mt-4">
                <div></div>
                <button type="button" on:click={signUp} class={`font-semibold px-2 border-2 p-1 rounded-lg ${$theme ? 'border-white text-white' : 'text-primaryColor border-primaryColor'}`}>
                    Sign Up
                </button>
            </div>
        {/if}
    </div>
</div>