const path = require('path');
const fs = require("fs");
const jp = require("jsonpath");
const credentials = require('./credentials');

export function BucketsTreeView(Values){
  
  const path_file = credentials.TREEVIEW_PATH;
  const fileJson = fs.readFileSync(path_file);
    let json_tree = JSON.parse(fileJson);
  const actual_values = jp.query(json_tree, '$.*.id').map(function(x){ return x.slice(0, -1) });
  const new_values = jp.query(Values,'$..Name');

  const Remove_Values = actual_values.filter(n => !new_values.includes(n));
  const Add_Values = new_values.filter(n => !actual_values.includes(n));

  //console.log(Add_Values);
  for (const Value of Add_Values) {
    json_tree.push({id:`${Value}/`,name:Value,Bucket:Value ,Prefix:'' ,children:[]})
  }
  const node_value = jp.nodes(json_tree,'$.*.id');
  let new_json = [];
  for (const new_actual of new_values) {
    const new_node = jp.query(node_value,`$[?(@.value=="${new_actual}/")]`);
    const new_id = new_node[0].path[1];
    new_json.push(json_tree[new_id]);
  }
  fs.writeFile(path_file,JSON.stringify(new_json), (err) => {
                             if (err) throw err;
                             console.log('Data written to file');
                             });
  

}