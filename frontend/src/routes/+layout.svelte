<script>
    import Home from './+page.svelte'
    import About from './about/+page.svelte'
</script>

<h1>Welcome to SvelteKit</h1>
<nav>
    <a href="/" >Home</a>
    <a href="/about" >About</a>
</nav>

<slot></slot>