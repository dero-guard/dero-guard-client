<script>
    import select from '../assets/images/service_select.png';

    import { service, services } from '../lib/client';
    import flags from '../lib/flags';

    function onSelect(sv)
    {
        service.set(sv);
        window.dispatchEvent(new CustomEvent('dg-nav'));
    }
</script>

<div id="select">
    <h1 id="title">Select a service</h1>

    {#each services() as service}
        <div class="service clickable" on:click={() => onSelect(service)}>
            <div class="left">
                {#if flags[service.location]}
                    <img class="flag" src={flags[service.location]} alt="Service location" />
                {/if}
                <span class="name">{service.name}</span>
            </div>
            <div class="right">
                <span class="rate">1GB = {service.rate} $DERO</span>
                <img class="select" src={select} alt="Select service" />
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    @import '../styles/vars';

    #select {
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        overflow-y: auto;
    }

    .service {
        justify-content: space-between;

        width: 100%;

        padding: 4px 8px;

        background-color: $card-background;
        border-top: $card-border;

        &:last-child {
            border-bottom: $card-border;
        }

        .left, .right {
            align-items: center;
        }

        .flag {
            height: 15px;
        }

        .name {
            max-width: 200px;

            margin-left: 7px;

            font-size: 18px;

            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .rate {
            font-family: $font-lato;
        }

        .select {
            height: 13px;

            margin-left: 4px;
        }
    }
</style>