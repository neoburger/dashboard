let burger_hash = '0x48c40d4666f93408be1bef038b6722404d9a4c2a'
let burger_address = 'NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos'
let gas_hash = '0xd2a4cff31913016155e38e474a2c06d08be276cf'

let used_wallet_hash = "0xb1983fa2479a0c8e2beae032d2df564b5451b7a5"

new Promise(resolve => resolve(burger_hash)).then(v => {
  const value = document.createElement('code');
  value.innerText = v;
  const title = document.getElementById('bneo-script-hash');
  title.parentElement.insertBefore(value, title.nextSibling)
})

new Promise(resolve => resolve(burger_address)).then(v => {
  const value = document.createElement('code');
  value.innerText = v;
  const title = document.getElementById('bneo-contract-address');
  title.parentElement.insertBefore(value, title.nextSibling)
})

function httpRequest (opts) {
// opts = {
//     url: '/',
//     method: 'GET',
//     headers: {'Access-Control-Allow-Origin': '*'},
//     params: {'request-body-for':'post-method'}
// }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        xhr.setRequestHeader(key, opts.headers[key]);
      });
    }
    var params = opts.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }
    xhr.send(params);
  });
}

function build_invokefunction_opts(contract_hash, function_name, function_params) {
    return {
        url: 'http://seed1.neo.org:20332',
        method: 'POST',
        params: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "invokefunction",
            "params": [
                contract_hash,
                function_name,
                function_params,
                [
                    {
                        "account": used_wallet_hash,
                        "scopes": "CalledByEntry",
                        "allowedcontracts": [],
                        "allowedgroups": []
                    }
                ]
            ]
        })
    };
}

function fetch_system_info(contract_hash, function_name, function_params, fill_element, parser){
    httpRequest(build_invokefunction_opts(contract_hash, function_name, function_params)).then(v => {
        const value = document.createElement('code');
        value.innerText = parser(v);
        const title = document.getElementById(fill_element);
        title.parentElement.insertBefore(value, title.nextSibling)
    });
}

function parse_integer(string_result){
    return JSON.parse(string_result).result.stack[0].value;
}

fetch_system_info(burger_hash, "totalSupply", [], "bneo-total-supply", parse_integer);
fetch_system_info(gas_hash, "balanceOf", [{"type":"Hash160", "value":burger_hash}], "total-unclaimed-gas", parse_integer);
fetch_system_info(burger_hash, "rPS", [], "reward-per-neo-since-system-start", parse_integer);

