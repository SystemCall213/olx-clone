import { writable } from 'svelte/store'
import { browser } from "$app/environment"
import dog from '../assets/dog.jfif'
import coat from '../assets/coat.webp'

export const user = writable(browser && localStorage.user ? JSON.parse(localStorage.getItem("user")) : {})
user.subscribe(val => {
    if (browser) localStorage.setItem("user",JSON.stringify(val))
});

export const theme = writable(browser && localStorage.getItem("theme") === "true" || false)
theme.subscribe((val) => {
    if (browser) {
        localStorage.setItem("theme", val)
    }
})

export const categories = [
    {
        src: dog,
        title: 'Animals',
        bg_color: '#f3bd2f',
        id: 0
    },
    {
        src: coat,
        title: 'Fashion',
        bg_color: '#e7e7e5',
        id: 1
    },
]

export function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return formattedDate
}
