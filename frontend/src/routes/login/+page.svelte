<script>
    import { user } from '../../stores/stores'
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
                const response = await fetch("http://localhost:5000/olx", {
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
            const response = await fetch(`http://localhost:5000/olx/${username}/${password}`)
            const jsonData = await response.json()
            console.log(jsonData)
            user.set({
                uid: jsonData.uid,
                username: jsonData.username,
                password: jsonData.password
            });
            window.location.href = 'http://localhost:5173'
        } catch (error) {
            console.log(error.message)
        }
    }
</script>

<div class="w-full h-full flex justify-center">
    <div class="flex flex-col rounded-lg border-2 border-primaryColor p-4 w-48 md:w-96 mt-40">
        <div class="flex flex-row mb-5">
            <button type='button' on:click={handleLogin} class={`border-b border-primaryColor text-2xl w-1/2 pb-2 ${login && 'font-bold border-b-2'}`}>
                Log in
            </button>
            <button type='button' on:click={handleLogin} class={`border-b border-primaryColor text-2xl w-1/2 pb-2 ${!login && 'font-bold border-b-2'}`}>
                Sign up
            </button>
        </div>
        {#if login}
            <div class="text-gray-500 ml-1 mb-1">Username</div>
            <input 
                type="text" 
                class="outline-none border border-gray-300 p-1 rounded-md bg-gray-100"
                placeholder="Enter username"
                value={username}
                on:input={(e) => username = e.target.value}
            />
            <div class="text-gray-500 ml-1 mb-1 mt-5 ">Password</div>
            <input 
                type="password" 
                class="outline-none border border-gray-300 p-1 rounded-md bg-gray-100"
                placeholder="Enter password"
                value={password}
                on:input={(e) => password = e.target.value}
            />
            <div class="flex flex-row justify-between mt-4">
                <div></div>
                <button type="button" on:click={logIn} class="text-primaryColor font-semibold px-2 border-2 border-primaryColor p-1 rounded-lg">
                    Log In
                </button>
            </div>
        {:else} 
            <div class="text-gray-500 ml-1 mb-1">Username</div>
            <input 
                type="text" 
                class="outline-none border border-gray-300 p-1 rounded-md bg-gray-100"
                placeholder="Enter username"
                value={username}
                on:input={(e) => username = e.target.value}
            />
            <div class="text-gray-500 ml-1 mb-1 mt-5 ">Password</div>
            <input 
                type="password" 
                class="outline-none border border-gray-300 p-1 rounded-md bg-gray-100"
                placeholder="Enter password"
                value={password}
                on:input={(e) => password = e.target.value}
            />
            <div class="text-gray-500 ml-1 mb-1 mt-5 ">Confirm password</div>
            <input 
                type="password" 
                class="outline-none border border-gray-300 p-1 rounded-md bg-gray-100"
                placeholder="Confirm password"
                value={confirmPassword}
                on:input={(e) => confirmPassword = e.target.value}
            />
            <div class="flex flex-row justify-between mt-4">
                <div></div>
                <button type="button" on:click={signUp} class="text-primaryColor font-semibold px-2 border-2 border-primaryColor p-1 rounded-lg">
                    Sign Up
                </button>
            </div>
        {/if}
    </div>
</div>