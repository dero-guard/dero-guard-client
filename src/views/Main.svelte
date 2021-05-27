<script>
    import { derived } from 'svelte/store';

    import on from '../assets/images/power_on.png';
    import middle from '../assets/images/power_middle.png';
    import off from '../assets/images/power_off.png';
    import bandwidth from '../assets/images/bandwidth.png';
    import down from '../assets/imageS/arrow_down.png';
    import up from '../assets/images/arrow_up.png';

    import {
        STATE_DISCONNECTED, STATE_CONNECTED, STATE_CONNECTING,
        service, state, address, download, upload, balance,
        enable, disable
    } from '../lib/client';

    import format from '../lib/format';

    $: power = $state === STATE_DISCONNECTED ? off :
        $state === STATE_CONNECTING ? middle :
            $state === STATE_CONNECTED ? on : null;
    $: action = $state === STATE_DISCONNECTED ? enable : disable;

    let balanceFormatted = derived(balance, val => {
        let formatted = format(val, true, true);
        let sep = formatted.length - formatted.match(/[a-z]?b/gi)[0].length;

        return [formatted.substring(0, sep), formatted.substring(sep)];
    });
</script>

<div id="status">
    <img id="power-button" class="clickable" src={power} alt="Connect" on:click={action} />
    <div id="ip-label">I.P. address</div>
    <div id="ip-address" class="selectable">{$address}</div>
</div>

<div id="bandwidth" class="card">
    <div class="title">Bandwidth usage</div>
    <div class="content">
        <img id="graph" src={bandwidth} alt="Bandwidth" />
        <div id="usage">
            <div id="download">{format($download)}/s <img class="arrow" src={down} alt="Download" /></div>
            <div id="upload">{format($upload)}/s <img class="arrow" src={up} alt="Upload" /></div>
        </div>
    </div>
</div>

<div id="balance" class="card">
    <div class="title">Balance</div>
    <div class="content">
        <div id="info">
            <div id="rate" class="selectable">1GB = {$service.rate} $DERO</div>
            <button class="button" on:click={() => $state === STATE_CONNECTED && window.dispatchEvent(new CustomEvent('dg-nav', { detail: 'confirm' }))}>
                Refill 1GB
            </button>
        </div>
        <div id="value">
            <span id="numeric" class="selectable">{$balanceFormatted[0]}</span>
            <span id="unit">{$balanceFormatted[1]}</span>
        </div>
    </div>
</div>

<style lang="scss">
    @import '../styles/vars';

    #status {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;

        #power-button {
            height: 115px;

            margin-bottom: 5px;
        }

        #ip-label {
            font-size: 18px;
        }

        #ip-address {
            margin-top: -5px;

            font-family: $font-lato;
            font-size: 36px;
            font-weight: bold;
        }
    }

    #bandwidth, #balance {
        & .content {
            justify-content: space-between;

            font-family: $font-lato;
        }
    }

    #bandwidth {
        #graph {
            height: 82px;
            margin-top: 15px;
        }

        #usage {
            flex-direction: column;
            align-items: flex-end;

            font-weight: bold;
            font-size: 30px;

            .arrow {
                height: 47px;

                margin-left: -5px;
                transform: translateY(1px);
            }

            #download, #upload {
                align-items: center;
            }

            #download {
                transform: translateY(-16px);
            }

            #upload {
                transform: translateY(-4px);
            }
        }
    }

    #balance {
        #info {
            flex-direction: column;
            justify-content: space-between;

            padding-top: 20px;
        }

        #value {
            align-items: center;

            margin-right: 8px;

            font-weight: bold;

            #numeric {
                font-size: 80px;
                transform: translateY(-12px)
            }

            #unit {
                font-size: 28px;
                transform: translateY(7px);
            }
        }
    }
</style>