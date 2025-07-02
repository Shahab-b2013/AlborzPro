// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.2.0.0

var base32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // (geohash-specific) Base32 map

geohash_decode = function (geohash) {
    var bounds = geohash_bounds(geohash); // <-- the hard work
    // now just determine the centre of the cell...
    var latMin = bounds.sw.lat, lonMin = bounds.sw.lon;
    var latMax = bounds.ne.lat, lonMax = bounds.ne.lon;
    // cell centre
    let lat = (latMin + latMax) / 2;
    let lon = (lonMin + lonMax) / 2;
    // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
    lat = lat.toFixed(Math.floor(2 - Math.log(latMax - latMin) / Math.LN10));
    lon = lon.toFixed(Math.floor(2 - Math.log(lonMax - lonMin) / Math.LN10));
    return { lat: Number(lat), lon: Number(lon) };
}

geohash_bounds = function (geohash) {
    if (geohash.length == 0) throw new Error('Invalid geohash');
    geohash = geohash.toLowerCase();
    let evenBit = true;
    let latMin = -90, latMax = 90;
    let lonMin = -180, lonMax = 180;
    for (let i = 0; i < geohash.length; i++) {
        var chr = geohash.charAt(i);
        var idx = base32.indexOf(chr);
        if (idx == -1) throw new Error('Invalid geohash');
        for (let n = 4; n >= 0; n--) {
            var bitN = idx >> n & 1;
            if (evenBit) {
                // longitude
                var lonMid = (lonMin + lonMax) / 2;
                if (bitN == 1) {
                    lonMin = lonMid;
                } else {
                    lonMax = lonMid;
                }
            } else {
                // latitude
                var latMid = (latMin + latMax) / 2;
                if (bitN == 1) {
                    latMin = latMid;
                } else {
                    latMax = latMid;
                }
            }
            evenBit = !evenBit;
        }
    }
    var bounds = {
        sw: { lat: latMin, lon: lonMin },
        ne: { lat: latMax, lon: lonMax },
    };
    return bounds;
}