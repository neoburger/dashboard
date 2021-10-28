const ENDPOINT = 'https://neofura.ngd.network:1927';
const NEO = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
const BNEO = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
const BASE58CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ADDRESS = new URLSearchParams(location.search).get('address');
const SCRIPTHASH = `0x${[...[...ADDRESS].map(c => BASE58CHARS.indexOf(c)).reduce((acc, i) => acc.map(j => {const x = j * 58 + i; i = x >> 8; return x;}), new Uint8Array(25))].map(c => c.toString(16).padStart(2,'0')).join('').slice(8,48)}`;
const FETCHFUNC = (ctr, method, args) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [ctr, method, args, [{ account: BNEO, scopes: 'CalledByEntry', 'allowedcontracts': [], 'allowedgroups': [] }]], method: 'invokefunction', jsonrpc: '2.0', id: 1 }) }).then(v => v.json()).then(v => v.result);
const DISPLAY = (id, value) => [document.getElementById(id), document.createElement('code')].LAZY(([x, y]) => { y.innerText = value }).LAZY(([x, y]) => { x.parentElement.insertBefore(y, x.nextSibling) })

new Promise(resolve => resolve(ADDRESS)).then(v => DISPLAY('account-address', v));
FETCHFUNC(BNEO, 'balanceOf', [{type: "Hash160", value: SCRIPTHASH}]).then(v => DISPLAY('bneo-balance', v.stack[0].value));
FETCHFUNC(BNEO, 'reward', [{type: "Hash160", value: SCRIPTHASH}]).then(v => DISPLAY('gas-unclaimed-multiplied-by-108', v.stack[0].value));
FETCHFUNC(NEO, 'balanceOf', [{type: "Hash160", value: SCRIPTHASH}]).then(v => DISPLAY('neo-balance', v.stack[0].value));
FETCHFUNC(GAS, 'balanceOf', [{type: "Hash160", value: SCRIPTHASH}]).then(v => DISPLAY('gas-balance-multiplied-by-108', v.stack[0].value));

