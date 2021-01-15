const {
  Workbook
} = require('exceljs');
const {
  resolveAxios
} = require('../utils/_')
const path = require("path")
const {
  data: regionData
} = require("../../public/data.json")

const wb = new Workbook();
const ws = wb.addWorksheet('tb');
const province = wb.addWorksheet('province');
const city = wb.addWorksheet('city');
const district = wb.addWorksheet('district');

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

  const nameManageHashMap = {}

  function addProvince() {
    const provinces = Array.from(regionData.reduce((p, c) => {
      p.add(c.province);
      return p;
    }, new Set()));
    province.addRows([provinces]);
  }

  ws.columns = [{
      header: '单位名称',
      key: 'unit_name',
      width: 20,
      style: {
        alignment: { horizontal: "center" },
        border: {

        }
      }
    }, // A1
    {
      header: '省',
      key: 'province',
      width: 20,
      style: {
        alignment: { horizontal: "center" }
      }
    }, // B2
    {
      header: '市',
      key: 'city',
      width: 20,
      style: {
        alignment: { horizontal: "center" }
      }
    }, // C3
    {
      header: '区县/镇街',
      key: 'district',
      width: 20,
      style: {
        alignment: { horizontal: "center" }
      }
    }
  ];
  ws.getCell('A1').border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
  ws.getCell('B1').border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
  ws.getCell('C1').border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
  ws.getCell('D1').border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  };
  ///////////////////////////

  addProvince()

  new Array(5000).fill(0).forEach((_, idx) => {
    const row = idx + 2;
    // 渲染部门下拉框
    ws.getCell(row, 2).dataValidation = {
      type: 'list',
      formulae: [`=province!$A$1:$${resolveAxios(regionData.length)}$1`]
    };
    // 使用indirect函数添加引用, 渲染岗位
    ws.getCell(row, 3).dataValidation = {
      type: 'list',
      formulae: [`=INDIRECT($B$${row})`]
    };
    ws.getCell(row, 4).dataValidation = {
      type: 'list',
      formulae: [`=INDIRECT($C$${row})`]
    };
  });

  // 添加名称管理器
  const _data = regionData.reduce((p, c) => {
    const key = c.province
    let child = []
    if (c.children && Array.isArray(c.children)) {
      child = c.children.reduce((childP, childC) => {
        childP.set(childC.city, childC.children.map(district => district.name))
        return childP
      }, new Map())
    }
    p.set(key, child);
    return p;
  }, new Map());

  const provinces = Array.from(_data.keys());
  const citys = Array.from(_data.values()).map(item => Array.from(item.keys()));
  const districts = Array.from(_data.values()).map(item => Array.from(item.values())).flat()
  city.addRows(citys);
  district.addRows(districts)

  city.eachRow(function (row, i) {
    let province = provinces[i - 1];
    console.log(province, i)
    row.eachCell(function (cell, colNumber) {
      cell.addName(province);
    });
  });

  const citysArr = citys.flat()
  district.eachRow(function (row, i) {
    const city = citysArr[i - 1];
    row.eachCell(function (cell, colNumber) {
      if (city !== "其他") {
        cell.addName(city);
      }
    });
  });

  await wb.xlsx.writeFile(path.resolve(__dirname, "../../dist/模板列表.xlsx"));
}

exportExcel()