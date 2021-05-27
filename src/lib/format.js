const units = ['', 'k', 'm', 'g', 't', 'p'];

export default function(value, bytes, small)
{
    if (!bytes) {
        value *= 8;
    }
    
    let unit = 0;
    while (value >= (small ? 100 : 1024)) {
        value /= 1024;
        unit++;
    }
    
    unit = units[unit] + 'b';
    if (bytes) {
        unit = unit.toUpperCase();
    }
    
    return value.toFixed(1) + unit;
}