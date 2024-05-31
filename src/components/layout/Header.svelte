<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { HomeSolid, UserSolid } from 'flowbite-svelte-icons';
</script>

<style>
  .header {
    @apply flex justify-between items-center p-4 bg-gray-800 text-white;
  }

  .nav-buttons {
    @apply flex space-x-4;
  }
</style>

<div class="header">
  <div class="flex items-center space-x-2">
    <HomeSolid class="h-6 w-6 text-white" />
    <p>By using this website you agree with Google Analytics cookie usage</p>
  </div>
  <div class="nav-buttons">
    <Button on:click={() => goto('/')}>
      <HomeSolid class="mr-2 h-5 w-5" />
      Home
    </Button>
    {#if $currentUser}
      <div class="flex items-center space-x-2">
        <UserSolid class="h-6 w-6 text-white" />
        <p>Welcome, {$currentUser.username}</p>
        <Button on:click={() => goto('/dashboard')}>
          Dashboard
        </Button>
        <Button on:click={() => goto('/logout')}>
          Logout
        </Button>
      </div>
    {:else}
      <Button on:click={() => goto('/login')}>
        Login
      </Button>
    {/if}
  </div>
</div>
