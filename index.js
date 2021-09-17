let burger_hash = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
let burger_address = 'NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos';
let neo_hash = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
let gas_hash = '0xd2a4cff31913016155e38e474a2c06d08be276cf';

function refresh_with_param(key, value) {
  var url = window.location.href;
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = url.indexOf('?') !== -1 ? "&" : "?";
  if (url.match(re)) {
    window.location.href = url.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    window.location.href = url + separator + key + "=" + value;
  }
}

function check_scripthash(scripthash){
    if(scripthash.startsWith('0x') && scripthash.length == 42){return true;}else{return false;}
}

var account_input = document.getElementById("account");
account_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        if(check_scripthash(account_input.value)){
            refresh_with_param("address", account_input.value);
        }else{
            alert("Please input the ScriptHash of your wallet, starting with '0x'!")
        }
    }
});

let user_address_valid = false;
var url = window.location.href;
var index_of_sharp = url.indexOf("#");
// remove '#{something}' at the end of the url
if(index_of_sharp > 0){url = url.substring(0, index_of_sharp)}
const get_address = (match_iterator) => {
  var get_next = false;
  for (x of match_iterator) {
    if (get_next){
        return x;
    }
    if (x === "address"){
        get_next = true;
    }
  }
  return false;
}
var param_regex = /(\?|\&)([^=]+)\=([^&]+)/g;
var matches = [...url.matchAll(param_regex)];

let used_wallet_hash;
let user_address;
if(matches){
    for(match of matches){
        user_address = get_address(match.values());
        if(user_address){
            if(user_address && check_scripthash(user_address)){
                user_address_valid = true;
                used_wallet_hash = user_address;  // wallet hash used for querying System Information
            }
        }
    }
}
if(!user_address_valid){
    used_wallet_hash = "0xb1983fa2479a0c8e2beae032d2df564b5451b7a5";  // Hecate2's wallet address on testnet
}

function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result;
}

function base64ToScriptHash(str) {
    var little_end_scripthash = base64ToHex(str);
    var parts = little_end_scripthash.match(/[\s\S]{1,2}/g) || [];
    return '0x'+parts.reverse().join('');
}

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
        url: 'http://seed1.neo.org:20332',  // https://neofura.ngd.network:1927 for main net
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

function build_node(filled_element, content){
    var value = document.createElement('code');
    value.innerText = content;
    var title = document.getElementById(filled_element);
    title.parentElement.insertBefore(value, title.nextSibling);
}

function fetch_system_info(contract_hash, function_name, function_params, filled_element, parser){
    httpRequest(build_invokefunction_opts(contract_hash, function_name, function_params)).then(v => {
        build_node(filled_element, parser(v));
    });
}

function parse_single_result(string_result){
    return JSON.parse(string_result).result.stack[0].value;
}

// System Information
// bNEO script hash
build_node('bneo-script-hash', burger_hash);
// bNEO contract address
build_node('bneo-contract-address', burger_address);
// bNEO total supply
fetch_system_info(burger_hash, "totalSupply", [], "bneo-total-supply", parse_single_result);
// total unclaimed GAS
fetch_system_info(gas_hash, "balanceOf", [{"type":"Hash160", "value":burger_hash}], "total-unclaimed-gas", parse_single_result);
// reward per NEO since system start
fetch_system_info(burger_hash, "rPS", [], "reward-per-neo-since-system-start", parse_single_result);

// TODO: agent info, a table of agents' ID, scripthash, NEO, GAS, unclaimed GAS
let table_area = document.getElementById("agent-info");
table_area.parentElement.insertBefore(document.createElement('a'), table_area.nextSibling);
table_area = table_area.nextSibling;
function populateTable(table, rows, cells, content) {
    var is_func = (typeof content === 'function');
    if (!table) {
        table = document.createElement('table');
        table.setAttribute("id", "agent-info-table");
        table.border= "1";  table.style.width="100%";
    }
    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < cells; ++j) {
            var td = document.createElement('td')
            td.setAttribute("align", "center");
            row.appendChild(td);
            var text = !is_func ? (content + '') : content(table, i, j);
            row.cells[j].appendChild(document.createTextNode(text));
        }
        table.appendChild(row);
    }
    return table;
}
function try_build_table_row(try_agent_id){
    httpRequest(build_invokefunction_opts(burger_hash, "agent", [{"type":"Integer", "value":try_agent_id}])).then(v => {
        var result = parse_single_result(v);
        if(result){
            if (try_agent_id == 0) {
                var table = document.createElement('table');
                table.setAttribute("id", "agent-info-table");
                table.border= "1";  table.style.width="100%";
                table_area.appendChild(populateTable(null, 1, 4, function(t,r,c){
                    return ["Agent ID", "Agent ScriptHash", "Agent balanceOf NEO", "Agent balanceOf GAS"][c];
                }));
                table_area = table_area.firstChild;
            }
            var result_hash160 = base64ToScriptHash(result); // TODO: change to Hash160
            var row = [try_agent_id, result_hash160, null, null];
            var neo_balance_promise = httpRequest(build_invokefunction_opts(
                neo_hash, "balanceOf", [{"type":"Hash160", "value":result_hash160}]))
            .then(r => {
                row[2] = JSON.parse(r).result.stack[0].value;
            });
            var gas_balance_promise = httpRequest(build_invokefunction_opts(
                gas_hash, "balanceOf", [{"type":"Hash160", "value":result_hash160}]))
            .then(r => {
                row[3] = JSON.parse(r).result.stack[0].value;
            });
            try_build_table_row(try_agent_id + 1);
            Promise.allSettled([neo_balance_promise, gas_balance_promise]).then(([result]) => {
                populateTable(table_area, 1, 4, function(t,r,c){return row[c]});
            });
        }else{
            if(try_agent_id == 0){build_node('agent-info', 'No agent available for now');}
        }
    });
}
try_build_table_row(0);

// whitelisted candidates
httpRequest(build_invokefunction_opts(neo_hash, "getCommittee", [])).then(v => {
    var committees = JSON.parse(v).result.stack[0].value.map(i => i.value);
    committees = committees.map(i => base64ToHex(i));
    function parse_candidate(string_result){
        if(JSON.parse(string_result).result.stack[0].value){return true;}else{return false;}
    }
    var has_candidate = false;
    var committees_promises = committees.map(function(item){
        return httpRequest(build_invokefunction_opts(burger_hash, "candidate", [{"type":"PublicKey","value":item}]))
        .then(v => {
            if(parse_candidate(v)){
                build_node("whitelisted-candidates", item);
            }
        });
    });
    Promise.allSettled(committees_promises).then(([result]) => {
        if(document.getElementById("whitelisted-candidates").nextSibling.nodeName === "CODE"){
            // there are some candidates. Do nothing.
        }else{
            build_node("whitelisted-candidates", "No candidate for now.");
        }
    });
})

// Account Information
if(user_address_valid){
    account_input.value = user_address;
    // account address
    build_node("account-address", user_address);
    // bNEO balance
    fetch_system_info(burger_hash, "balanceOf", [{"type":"Hash160", "value":user_address}], "bneo-balance", parse_single_result);
    fetch_system_info(burger_hash, "reward", [{"type":"Hash160", "value":user_address}], "unclaimed-gas-reward", parse_single_result);
    fetch_system_info(neo_hash, "balanceOf", [{"type":"Hash160", "value":user_address}], "neo-balance", parse_single_result);
    fetch_system_info(gas_hash, "balanceOf", [{"type":"Hash160", "value":user_address}], "gas-balance", parse_single_result);
}else{
    build_node("account-infomation", "Input your wallet ScriptHash at the bottom of this page and press Enter to watch your BurgerNEO account Information.")
}