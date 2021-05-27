<script>
    import { service, refill } from '../lib/client';

    function onConfirm(yes)
    {
        if (yes) {
            refill();
        }

        window.dispatchEvent(new CustomEvent('dg-nav'));
    }
</script>

<div id="confirm">
    <h1 id="title">Refill <span class="value">1GB</span> ?</h1>
    <p id="cost">This will cost you <span class="value">{$service.rate} $DERO</span></p>

    <div id="buttons">
        <button id="no" class="button" on:click={() => onConfirm(false)}>Cancel</button>
        <button id="yes" class="button" on:click={() => onConfirm(true)}>Confirm</button>
    </div>
</div>

<style lang="scss">
    @import '../styles/vars';

    #confirm {
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .value {
        font-family: $font-lato;
        font-weight: bold;
    }

    #title {
        margin-bottom: 5px;
    }

    #cost {
        margin-top: 0;
    }

    .button {
        margin: 15px;
    }
</style>