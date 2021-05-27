import { writable, get } from 'svelte/store';

export const STATE_DISCONNECTED = 0;
export const STATE_CONNECTING = 1;
export const STATE_CONNECTED = 2;

const ADDRESS_DISCONNECTED = 'Disconnected';
const ADDRESS_CONNECTING = '...';

export const state = writable(STATE_DISCONNECTED);
export const address = writable(ADDRESS_DISCONNECTED);
export const download = writable(0);
export const upload = writable(0);
export const balance = writable(0);

export const service = writable(load());

let refilling = false;
let key = null;
let last_download = 0;
let last_upload = 0;

function load()
{
    localStorage.clear();
    const stored = localStorage.service;
    if (stored) {
        return JSON.parse(stored);
    }
    
    return null;
}

export function services()
{
    console.log(__dg_providers());
    return __dg_providers();
}

export function enable()
{
    state.set(STATE_CONNECTING);
    address.set(ADDRESS_CONNECTING);
    
    const srv = get(service);
    const blc = get(balance);
    __dg_refill(srv.dero_address, blc === 0 ? srv.rate : 0.00001, remote => {
        state.set(STATE_CONNECTED);
        address.set(remote.address);
        
        if (blc === 0) {
            balance.set(1_000_000_000);
        }
        
        key = remote.public_key;
    });
}

export function disable()
{
    state.set(STATE_DISCONNECTED);
    address.set(ADDRESS_DISCONNECTED);
    
    if (key) {
        __dg_disconnect(key);
        key = null;
    }
}

export function refill()
{
    if (refilling) {
        return;
    }
    
    refilling = true;
    
    __dg_refill(key, get(service).rate);
    
    balance.update(v => v + 1_000_000_000);
    
    refilling = false;
}

export function update()
{
    if (!key) {
        return;
    }
    
    const bandwidth = __dg_bandwidth(key);
    
    const dl_diff = bandwidth.download - last_download;
    const up_diff = bandwidth.upload = last_upload;
    
    download.set(dl_diff);
    upload.set(up_diff);
    
    balance.update(v => Math.max(v - dl_diff - up_diff, 0));
    
    last_download = bandwidth.download;
    last_upload = bandwidth.upload;
}

export function onServiceChange(service)
{
    disable();
    balance.set(0);
    
    if (service) {
        localStorage.setItem('service', JSON.stringify(service));
    } else {
        localStorage.removeItem('service');
    }
}

export function open(link)
{
    __dg_open(link);
}