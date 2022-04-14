const ENDPOINT = 'https://neofura.ngd.network';
const NEO = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
const BNEO = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
const COMMITTEEINFO = '0xb776afb6ad0c11565e70f8ee1dd898da43e51be1';
const BNEOADDR = 'NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos';
const SCRIPTAGENT = 'AAARwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAERwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAIRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAMRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAQRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAURwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAYRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAcRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAgRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAkRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAoRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAsRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAwRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA0RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA4RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA8RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABARwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABERwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABIRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABMRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABQRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtS'
const FETCHFUNC = (ctr, method, args) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [ctr, method, args, [{ account: BNEO, scopes: 'CalledByEntry', 'allowedcontracts': [], 'allowedgroups': [] }]], method: 'invokefunction', jsonrpc: '2.0', id: 1 }) }).then(v => v.json()).then(v => v.result)
const FETCHSCRIPT = (script) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [script, [{ account: BNEO, scopes: 'CalledByEntry', 'allowedcontracts': [], 'allowedgroups': [] }]], method: 'invokescript', jsonrpc: '2.0', id: 1 }) }).then(v => v.json()).then(v => v.result)
const DISPLAY = (id, value) => { const element = document.createElement('code'); element.innerText = value; const title = document.getElementById(id); title.parentElement.insertBefore(element, title.nextSibling); }

new Promise(resolve => resolve(BNEO)).then(v => DISPLAY('bneo-script-hash', v));
new Promise(resolve => resolve(BNEOADDR)).then(v => DISPLAY('bneo-contract-address', v))
FETCHFUNC(BNEO, 'totalSupply', []).then(v => DISPLAY('bneo-total-supply-multiplied-by-108', v.stack[0].value))
FETCHFUNC(GAS, 'balanceOf', [{ type: 'Hash160', value: BNEO }]).then(v => DISPLAY('total-unclaimed-gas-multiplied-by-108', v.stack[0].value))
FETCHFUNC(BNEO, 'rPS', []).then(v => DISPLAY('gas-reward-per-neo-since-system-start-multiplied-by-108', v.stack[0].value))
FETCHSCRIPT(SCRIPTAGENT).then(v => {
    const title = document.getElementById('agent-info');
    const p = document.createElement('p'); title.parentElement.insertBefore(p, title.nextSibling);
    p.innerText = `* represents 'multiplied by 10^8'`
    const ul = document.createElement('ul'); title.parentElement.insertBefore(ul, title.nextSibling);
    v.stack.forEach(vv => {
        if (!vv.value) return;
        const li = document.createElement('li'); ul.appendChild(li);
        const table = document.createElement('table'); li.appendChild(table);
        const scripthash = `0x${[...atob(vv.value)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).reverse().join('')}`;
        const data = [
            ['script hash', new Promise(resolve => resolve(scripthash))],
            ['neo balance', FETCHFUNC(NEO, 'balanceOf', [{ type: 'Hash160', value: scripthash }]).then(vvv => vvv.stack[0].value)],
            ['gas balance*', FETCHFUNC(GAS, 'balanceOf', [{ type: 'Hash160', value: scripthash }]).then(vvv => vvv.stack[0].value)],
            ['undistributed gas*', FETCHFUNC('0xda65b600f7124ce6c79950c1772a36403104f2be', 'currentIndex', []).then(vvv => FETCHFUNC(NEO, 'unclaimedGas', [{ type: 'Hash160', value: scripthash }, { type: 'Integer', value: vvv.stack[0].value }])).then(vvv => vvv.stack[0].value)],
            ['vote target', FETCHFUNC(NEO, 'getAccountState', [{ type: 'Hash160', value: scripthash }]).then(vvv => `${[...atob(vvv.stack[0].value[2].value)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).join('')}`)],
            ['target name', FETCHFUNC(NEO, 'getAccountState', [{ type: 'Hash160', value: scripthash }]).then(vvv => FETCHSCRIPT(btoa(['\x0c', '\x21'].concat([...atob(vvv.stack[0].value[2].value)]).concat(['\x41','\xcf','\x99','\x87','\x02']).join('')))).then(vvvv => `0x${[...atob(vvvv.stack[0].value)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).reverse().join('')}`).then(vvvvv => FETCHFUNC(COMMITTEEINFO, 'getInfo', [{ type: 'Hash160', value: vvvvv }])).then(vvvvvv => `${decodeURIComponent(atob(vvvvvv.stack[0].value[1].value).split('').map(function(c) {return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);}).join(''))}`) ],
            ['target logo', FETCHFUNC(NEO, 'getAccountState', [{ type: 'Hash160', value: scripthash }]).then(vvv => FETCHSCRIPT(btoa(['\x0c', '\x21'].concat([...atob(vvv.stack[0].value[2].value)]).concat(['\x41','\xcf','\x99','\x87','\x02']).join('')))).then(vvvv => `0x${[...atob(vvvv.stack[0].value)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).reverse().join('')}`).then(vvvvv => FETCHFUNC(COMMITTEEINFO, 'getInfo', [{ type: 'Hash160', value: vvvvv }])).then(vvvvvv => `https://filesend.ngd.network/gate/get/CeeroywT8ppGE4HGjhpzocJkdb2yu3wD5qCGFTjkw1Cc/${atob(vvvvvv.stack[0].value[9].value)}`) ],
        ];
        data.forEach(([k, f]) => {
            const tr = document.createElement('tr'); table.appendChild(tr);
            const th = document.createElement('th'); tr.appendChild(th);
            const td = document.createElement('td'); tr.appendChild(td);
            th.innerText = k;
            f.then(vvv => {
                if (vvv.startsWith("http")) {
                    const img = document.createElement('img');
                    img.src = vvv;
                    img.style.maxHeight = "24px";
                    td.appendChild(img);
                } else {
                    const code = document.createElement('code');
                    code.innerText = vvv;
                    td.appendChild(code);
                }
            });
        })
    });
})
FETCHFUNC(NEO, 'getCandidates', []).then(v => {
    const title = document.getElementById('whitelisted-candidates');
    const ul = document.createElement('ul'); title.parentElement.insertBefore(ul, title.nextSibling);
    v.stack[0].value.forEach(vv => {
        const pk = [...atob(vv.value[0].value)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).join('');
        FETCHFUNC(BNEO, 'candidate', [{ type: 'PublicKey', value: pk }]).then(vvv => {
            if (!vvv.stack[0].value) return;
            const li = document.createElement('li'); ul.appendChild(li);
            const code = document.createElement('code'); li.appendChild(code);
            code.innerText = pk
        })
    })
})
