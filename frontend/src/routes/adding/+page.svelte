<script>
    import { theme, categories } from '../../stores/stores'
    import Button from './Button.svelte'
    import InputPhoto from './input_photo.svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte'
    import AiFillCaretDown from "svelte-icons-pack/ai/AiFillCaretDown";
    import { onMount } from 'svelte';

    let post_title_input_blurred = false
    let location_blurred = false
    let contact_person_blurred = false
    let pickingCategory = false
    let price_valid = true
    let id_match = 0
    let price_buttons = [
        {
            id: 0,
            title: 'Price'
        },
        {
            id: 1,
            title: 'Free'
        },
        {
            id: 2,
            title: 'Exchange'
        },
    ]
    let price_id_match = 0

    let post_title = ''
    let categoryPicked = {
        src: '',
        title: '',
        bg_color: '',
    }
    let image_assets = ['', '', '', '', '', '', '', '']
    let post_description = ''
    let price = 0
    let location = ''
    let contact_person = ''
    let email = ''
    let phone_number = ''

    let windowWidth = 0

    onMount(() => {
        const updateWindowWidth = () => {
            windowWidth = window.innerWidth
        };
        windowWidth = window.innerWidth

        window.addEventListener('resize', updateWindowWidth)
        window.addEventListener('change', updateWindowWidth)

        return () => {
            window.removeEventListener('resize', updateWindowWidth)
            window.removeEventListener('change', updateWindowWidth)
        }
    })

    function updateAssets(id, asset) {
        image_assets = [...image_assets.slice(0, id), asset, ...image_assets.slice(id + 1)]
    }

    function deleteAsset(id) {
        image_assets = [...image_assets.slice(0, id), ...image_assets.slice(id + 1), null]
    }

    function validatePrice() {
        if (!isNaN(price) && /^\d+(\.\d{1,2})?$/.test(price)) {
            price_valid = true
        } else {
            price_valid = false
        }
    }

    async function addPost() {
        if (post_title && categoryPicked.src !== '' && image_assets[0] !== null && post_description.length > 40 && location && contact_person && price_valid) {
            try {
                const formData = new FormData();
                formData.append('post_title', post_title);
                formData.append('category', categoryPicked.title);
                formData.append('post_description', post_description);
                formData.append('price', price);
                formData.append('location', location);
                formData.append('contact_person', contact_person);
                formData.append('email', email);
                formData.append('phone_number', phone_number);

                // Append image files to the FormData
                for (const image of image_assets) {
                    formData.append('images', image);
                }

                const response = await fetch("http://localhost:5000/add_post", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Post created successfully:', data)
                } else {
                    console.error('Post creation failed:', response.status);
                }
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.log('Missing or invalid data for creating a post');
        }
    }


</script>

<style>
    div {
        transition: color 0.5s;
        transition-timing-function: ease-out;
    }
</style>

<div class={`w-full overflow-auto p-3 ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-300'}`}>
    <div class={`text-4xl font-bold p-1 py-8 ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'} `}>
        Add post
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6`}>
        <div class={`font-bold text-xl ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            The more details the better!
        </div>
        <div class={`mt-2 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
            Post title
        </div>
        <textarea
            rows="1" 
            type="text"
            placeholder="np. Iphone 11 under warranty "
            class={`p-2 rounded-md w-3/5 mt-2 h-auto overflow-y-hidden break-words resize-none outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'} ${post_title_input_blurred && (post_title.length === 0 || post_title.length < 16) && 'border-b-2 border-red-500'}`} 
            bind:value={post_title}
            maxlength="255"
            on:input={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
            }}
            on:blur={() => {post_title_input_blurred = true}}
        />
        <div class="text-red-400 text-sm hover:text-base mt-1">
            {post_title.length === 0 && post_title_input_blurred ? 
            'Title is the most important part, don\'t forget about it' 
            : post_title.length < 16 && post_title_input_blurred ? ' Title cannot be shorter than 16 symbols' : ''}
        </div>
        <div class={`mt-2 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
            Category
        </div>
        {#if categoryPicked.src !== ''}
                <div class={`relative w-full sm:w-3/5 lg:w-1/3 rounded-md mt-2 p-2 flex flex-row justify-between items-center gap-4`}>
                    <div class="absolute rounded-md top-0 left-0 w-full h-full" style={`background-color: ${categoryPicked.bg_color}; opacity: 0.5;`}></div>
                    <div class={`flex flex-row justify-between items-center gap-4`}>
                        <img src={categoryPicked.src} alt={categoryPicked.title} class="w-12 h-12 rounded-full z-10" >
                        <div class="z-10">
                            {categoryPicked.title}
                        </div>
                    </div>
                    <button on:click={() => pickingCategory = true} class="z-10 underline hover:font-semibold">Change</button>
                </div>
        {:else}
            <button type="button" on:click={() => pickingCategory = true} class={`p-2 w-3/12 flex flex-row justify-between rounded-md mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'}`}>
                <div class="text-gray-400">
                    Pick category
                </div>
                <Icon src={AiFillCaretDown} size="24" />
            </button>
        {/if}
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
        <div class={`font-bold text-xl ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            Photos
        </div>
        <div class={`mt-3 text-sm ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            First photo will be the main one
        </div>
        <div class="flex flex-row flex-wrap w-9/12 gap-5 mt-2">
            {#each [0,1,2,3,4,5,6,7] as photo}
                <InputPhoto id={photo} bind:id_match bind:image_asset={image_assets[photo]} updateAssets={updateAssets} deleteAsset={deleteAsset} />
            {/each}
        </div>
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
        <div class={`mt-2 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
            Description
        </div>
        <textarea 
            name="" 
            id="" 
            cols={windowWidth < 1000 ? (windowWidth < 768 ? 40 : 60) : 82}
            rows="10"
            bind:value={post_description}
            placeholder="Enter the information that would be important to you when viewing such an advertisement"
            maxlength={9000}
            class={`bg-gray ${$theme ? 'bg-darkTheme_blue text-white' : 'bg-gray-300'} rounded-md outline-none p-2 mt-2 resize-none`}
        ></textarea>
        <div class={`flex flex-row justify-between w-xs md:w-sm lg:w-md ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            <div>
                {#if post_description.length < 40}
                    <div>
                        Please enter at least {40 - post_description.length} more character{40 - post_description.length === 1 ? '' : 's'}
                    </div>
                {/if}
            </div>
            <div>{post_description.length} / 9000</div>
        </div>
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
            <div class="relative rounded-md flex flex-row">
                {#each price_buttons as price_button}
                    <button on:click={() => {price_id_match = price_button.id}} class={`py-2 px-6 ${$theme ? 'bg-darkTheme_blue' : 'bg-gray-300'} ${price_button.id === price_id_match && 'bg-primaryColor text-white'} ${price_button.id === 1 ? '' :( price_button.id === 0 ? 'rounded-l-md' : 'rounded-r-md')}`}>
                        {price_button.title}
                    </button>
                {/each}
            </div>
            {#if price_id_match === 0}
                <div class={`mt-4 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
                    Price (usd)
                </div>
                <input 
                    type="text"
                    pattern="\d+(\.\d{2})?" 
                    class={`p-2 rounded-md w-8/12 sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'}`} 
                    bind:value={price}
                    on:change={validatePrice}
                    placeholder="Enter price (e.g., 10.00)"
                />
            {/if}
            {#if !price_valid}
                {#if price.length > 1}
                    <div class="text-red-500">Price should be in format: 1234567.50</div>
                {:else}
                    <div class="text-red-500">Price is obligatory</div>
                {/if}
            {/if}
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
        <div class={`mt-2 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
            Location
        </div>
        <input 
            type="text"
            placeholder="city or zip code"
            class={`p-2 rounded-md w-8/12 sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'} ${location_blurred && !location && 'border-b-2 border-red-500'}`} 
            bind:value={location}
            on:blur={() => location_blurred = true}
        />
        {#if location_blurred && !location}
            <div class="text-red-500">Location is obligatory</div>
        {/if}
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
        <div class={`font-bold text-xl ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            Contact details
        </div>
        <div class="mt-4">
            <div class={`mt-2 after:content-['*'] after:ml-0.5 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
                Contact person
            </div>
            <input 
                type="text"
                class={`p-2 rounded-md w-8/12 sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'} ${contact_person_blurred && !contact_person && 'border-b-2 border-red-500'}`} 
                bind:value={contact_person}
                on:blur={() => contact_person_blurred = true}
            />
            {#if contact_person_blurred && !contact_person}
                <div class="text-red-500">Contact person is obligatory</div>
            {/if}
        </div>
        <div class="mt-4">
            <div class={`mt-2 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
                E-mail address
            </div>
            <input 
                type="text"
                class={`p-2 rounded-md w-8/12 sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'}`} 
                bind:value={email}
            />
        </div>
        <div class="mt-4">
            <div class={`mt-2 ${$theme ? 'after:text-darkTheme_dark_blue text-white' : 'after:text-red-500 text-darkTheme_dark_blue'}`}>
                Phone number
            </div>
            <input 
                type="text"
                class={`p-2 rounded-md w-8/12 sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 outline-none ${$theme ? 'bg-darkTheme_light' : 'bg-gray-100'}`} 
                bind:value={phone_number}
            />
        </div>
    </div>
    <div class={`rounded-md ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-6 mt-6`}>
        <div class="flex flex-row justify-between">
            <div></div>
            <Button Function={addPost} text="Add post" />
        </div>
    </div>
</div>

{#if pickingCategory}
    <div class={`absolute fixed rounded-md w-6/12 top-32 ${$theme ? 'bg-darkTheme_light_gray' : 'bg-white'} p-4 z-10`}>
        <div class={`mt-4 font-bold text-3xl ${$theme ? 'text-white' : 'text-darkTheme_dark_blue'}`}>
            Pick category
        </div>
        <div class="flex flex-col lg:flex-row gap-4 mt-4">
            {#each categories as category}
                <button on:click={() => {
                        categoryPicked.src = category.src,
                        categoryPicked.title = category.title,
                        categoryPicked.bg_color = category.bg_color
                        pickingCategory = false
                        console.log('hlo')
                    }} 
                    class={`relative w-full sm:w-3/5 lg:w-1/3 rounded-md p-2 flex flex-row items-center gap-4`}
                >
                    <div class="absolute rounded-md top-0 left-0 w-full h-full" style={`background-color: ${category.bg_color}; opacity: 0.5;`}></div>
                    <img src={category.src} alt={category.title} class="w-20 h-20 rounded-full z-10" >
                    <div class="z-10">
                        {category.title}
                    </div>
                </button>
            {/each}
        </div>
    </div>
{/if}
