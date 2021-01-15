
const { Workbook } = require('exceljs');

const path = require("path")
 
///////////////////////////////
const wb = new Workbook();
const ws = wb.addWorksheet('tb');
const dict2 = wb.addWorksheet('dict2');
const test = wb.addWorksheet('test');

async function exportExcel() {
  const test_data = [{
    post_name: '方案',
    department_name: '菊花'
  }, {
    post_name: '设计',
    department_name: '产品'
  }, {
    post_name: 'js开发',
    department_name: '产品'
  }, {
    post_name: '部门主管',
    department_name: '产品'
  }];
  const departments = Array.from(test_data.reduce((p, c) => {
    p.add(c.department_name);
    return p;
  }, new Set()));
  console.log(departments)
  dict2.addRows([departments]);
   
  ws.columns = [
    { header: '员工编号', key: 'staff_no', width: 20 },	// A1
    { header: '员工姓名', key: 'staff_name', width: 20 },	// B2
    { header: '性别', key: 'sex', width: 20 },	// C3
    { header: '部门名称', key: 'department_name', width: 20 },	// D4
    { header: '岗位名称', key: 'post_name', width: 20 },	// E5
    { header: '身份证号', key: 'id_no', width: 20 },	// 6
    { header: '出生日期', key: 'birthday', width: 20 },	// 7
    { header: '年龄', key: 'age', width: 20 },	// 8
    { header: '联系电话', key: 'contact_number', width: 20 },	// 9
    { header: '入职时间', key: 'staff_hiredate', width: 20 },	// 10
    { header: '员工状态', key: 'staff_state', width: 20 }	// 11
  ];
  ///////////////////////////
  new Array(5000).fill(0).forEach((_, idx) => {
    const row = idx + 2;
    // 渲染部门下拉框
    ws.getCell(row, 4).dataValidation = {
      type: 'list',
      formulae: [`=dict2!$A$1:$C${1}`]
    };
    // 使用indirect函数添加引用, 渲染岗位
    ws.getCell(row, 5).dataValidation = {
      type: 'list',
      formulae: [`=INDIRECT(D${row})`]
    };
  });
   
  // 添加名称管理器
  const _data = test_data.reduce((p, c) => {
    if (!p.has(c.department_name)) {
      p.set(c.department_name, [c.post_name]);
    } else {
      const arr = p.get(c.department_name);
      arr.push(c.post_name);
    }
    return p;
  }, new Map());

  console.log(_data)
   
  const department_names = Array.from(_data.keys());
  const post_names = Array.from(_data.values());
  console.log(post_names)
  test.addRows(post_names);
   
  test.eachRow(function (row, i) {
    const department_name = department_names[i - 1];
    console.log(department_name, i);
    row.eachCell(function (cell, colNumber) {
      cell.addName(department_name);
    });
  });
   
  await wb.xlsx.writeFile(path.resolve(__dirname, "../../dist/模板列表.xlsx"));
}

exportExcel()
