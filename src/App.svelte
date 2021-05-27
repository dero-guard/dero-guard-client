<script>
    import './app.scss';

    import { onMount } from 'svelte';

    import logo from './assets/images/logo.png';
    import settings from './assets/images/settings.png';
    import select from './assets/images/service_select.png';

    import Main from './views/Main.svelte';
    import Select from './views/Select.svelte';
    import Confirm from './views/Confirm.svelte';

    import { service, update, open, onServiceChange } from './lib/client';
    import flags from './lib/flags';

    let content = $service ? Main : Select;

    onMount(() => {
        const interval = setInterval(update, 1000);
        const unsubscribe = service.subscribe(onServiceChange);
        const listener = e => content = e.detail === 'confirm' ? Confirm : Main;

        window.addEventListener('dg-nav', listener);

        return () => {
            clearInterval(interval);
            unsubscribe();

            window.removeEventListener('dg-nav', listener)
        };
    })
</script>

<div id="title-bar">
    <img id="logo" src={logo} alt="DERO Guard logo" />
    <img id="settings" class="clickable" src={settings} alt="Settings" />
</div>

<div id="service" class="clickable" on:click={() => content = Select}>
    {#if $service}
        <img id="flag" src={flags[$service.location]} alt="Service flag" />
        {$service.name}
    {:else}
        No service
    {/if}
    <img id="select" src={select} alt="Select service" />
</div>

<svelte:component this={content} />

<div id="footer">
    <div>
        <a on:click={() => open('https://github.com/dero-guard')}>Sources</a>&nbsp;-&nbsp;Donate
    </div>
    <div>
        by&nbsp;<a on:click={() => open('https://github.com/Slixe')}>Slixe</a>&nbsp;and&nbsp;<a on:click={() => open('https://github.com/Litarvan')}>Litarvan</a>
    </div>
</div>

<style lang="scss">
    @import './styles/vars';

    #title-bar {
        justify-content: space-between;
        align-items: center;

        #logo {
            height: 41px;
        }

        #settings {
            height: 31px;

            margin-right: 3px;
        }
    }

    #service {
        $border: solid 1px #979797;

        justify-content: center;
        align-items: center;

        margin-top: -4px;
        padding: 5px 0;

        background-color: rgba(188, 188, 188, .15);
        color: white;

        font-size: 16px;

        border-top: $border;
        border-bottom: $border;

        cursor: pointer;

        #flag {
            height: 15px;
            margin-right: 8px;

            border-radius: 2px;

            box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
        }

        #select {
            height: 13px;

            margin-left: 6px;
            margin-bottom: -4px;
        }
    }

    #footer {
        justify-content: space-between;
        align-items: center;

        padding: 3px 8px;

        background-color: $card-background;
        border-top: $card-border;

        font-size: 14px;
    }
</style>